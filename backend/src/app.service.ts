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

  private pipelineId: number;

  async getData(query: string): Promise<Data> {
    const { access_token } = await this.getTokens();
    const leads = await this.getLeads(access_token, query);
    const contacts = await this.getContacts(access_token);
    const pipeline = await this.getPipelines(access_token);
    const users = await this.getUsers(access_token);

    const gluedLeads = leads.map((lead) => {
      const filterContacts = contacts.filter(
        (contact) => contact.responsible_user_id === lead.responsible_user_id,
      );

      return { ...lead, contacts: filterContacts };
    });

    return {
      leads: gluedLeads,
      pipeline,
      users,
    };
  }

  private async getLeads(token: string, query: string): Promise<Leads> {
    const response = await fetch(
      `${process.env.DOMAIN}/api/v4/leads?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 204) return [];

    const {
      _embedded: { leads },
    }: Lead = await response.json();

    this.pipelineId = leads[0].pipeline_id;

    return leads;
  }

  private async getContacts(token: string): Promise<Contacts> {
    const response = await fetch(`${process.env.DOMAIN}/api/v4/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: Contact = await response.json();

    return result._embedded.contacts;
  }

  private async getPipelines(token: string): Promise<object> {
    const response = await fetch(
      `${process.env.DOMAIN}/api/v4/leads/pipelines/${this.pipelineId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result: Pipeline = await response.json();

    return result;
  }

  private async getUsers(token: string): Promise<object[]> {
    const response = await fetch(`${process.env.DOMAIN}/api/v4/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const response = await fetch(`${process.env.DOMAIN}/oauth2/access_token`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: 'http://localhost:3000',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  }

  private async getTokens(): Promise<Token> {
    const response = await fetch(`${process.env.DOMAIN}/oauth2/access_token`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: process.env.CODE,
        redirect_uri: 'http://localhost:3000',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
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
}
