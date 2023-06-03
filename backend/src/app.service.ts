import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Data,
  Token,
  Lead,
  Leads,
  Contact,
  Contacts,
  Pipeline,
  User,
  UserDb,
} from './types';

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private userModel: Model<UserDb>) {}

  async getData(query: string): Promise<Data> {
    const { access_token } = await this.getTokens();
    const leads = await this.getLeads(access_token, query);
    const contacts = await this.getContacts(access_token);
    const pipelines = await this.getPipelines(access_token);
    const users = await this.getUsers(access_token);

    const gluedLeads = leads.map((lead) => {
      const filterContacts = contacts.filter(
        (contact) => contact.responsible_user_id === lead.responsible_user_id,
      );

      return { ...lead, contacts: filterContacts };
    });

    return {
      leads: gluedLeads,
      pipelines,
      users,
    };
  }

  private async getLeads(token: string, query: string): Promise<Leads> {
    const response = await this.fetchGet(token, `leads?query=${query}`);

    if (response.status === 204) return [];

    const result: Lead = await response.json();

    return result._embedded.leads;
  }

  private async getContacts(token: string): Promise<Contacts> {
    const response = await this.fetchGet(token, 'contacts');

    const result: Contact = await response.json();

    return result._embedded.contacts;
  }

  private async getPipelines(token: string): Promise<object[]> {
    const response = await this.fetchGet(token, 'leads/pipelines');

    const result: Pipeline = await response.json();

    return result._embedded.pipelines;
  }

  private async getUsers(token: string): Promise<object[]> {
    const response = await this.fetchGet(token, 'users');

    const result: User = await response.json();

    return result._embedded.users;
  }

  private async updateRefreshToken(result: Token): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        domain: process.env.DOMAIN,
      },
      { refreshToken: result.refresh_token },
    );
  }

  private async createDocumentDB(result: Token): Promise<void> {
    const createDocument = new this.userModel({
      domain: process.env.DOMAIN,
      refreshToken: result.refresh_token,
    });
    createDocument.save();
  }

  private async getNewTokens(refreshToken: string): Promise<Token> {
    const response = await this.fetchPost({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return await response.json();
  }

  private async getTokens(): Promise<Token> {
    const response = await this.fetchPost({
      grant_type: 'authorization_code',
      code: process.env.CODE,
    });

    if (response.status === 400) {
      const findDomain = await this.userModel.find({
        domain: process.env.DOMAIN,
      });

      const result: Token = await this.getNewTokens(findDomain[0].refreshToken);

      this.updateRefreshToken(result);

      return result;
    }

    const result: Token = await response.json();

    const findDomain = await this.userModel.findOne({
      domain: process.env.DOMAIN,
    });

    findDomain
      ? this.updateRefreshToken(result)
      : this.createDocumentDB(result);

    return result;
  }

  private async fetchGet(token: string, urn: string): Promise<Response> {
    return await fetch(`${process.env.DOMAIN}/api/v4/${urn}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private async fetchPost(bodyParam: object): Promise<Response> {
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000',
    };

    return await fetch(`${process.env.DOMAIN}/oauth2/access_token`, {
      method: 'POST',
      body: JSON.stringify({ ...body, ...bodyParam }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
