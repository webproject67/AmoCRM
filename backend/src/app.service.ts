import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IData,
  IToken,
  ILead,
  IContact,
  IPipeline,
  IUser,
  IUserDb,
  IBodyParam,
  IResponseLead,
  IResponsePipeline,
  IResponseUser,
  IResponseContact,
} from './types';

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private userModel: Model<IUserDb>) {}

  async getData(query: string): Promise<IData> {
    const { access_token } = await this.getTokens();
    const leads = await this.getLeads(access_token, query);
    const contacts = await this.getContacts(access_token);
    const pipelines = await this.getPipelines(access_token);
    const users = await this.getUsers(access_token);

    const leadsWithContacts = leads.map((lead) => {
      const contactsLead = lead._embedded.contacts.map(
        (leadEmbeddedContact) => {
          const findContact = contacts.find(
            (contact) => contact.id === leadEmbeddedContact.id,
          );

          return findContact;
        },
      );

      return { ...lead, contacts: contactsLead };
    });

    return {
      leads: leadsWithContacts,
      pipelines,
      users,
    };
  }

  private async getLeads(token: string, query: string): Promise<ILead[]> {
    const response = await this.fetchGet(
      token,
      `leads?with=contacts&query=${query}`,
    );

    if (response.status === 204) return [];

    const result: IResponseLead = await response.json();

    return result._embedded.leads;
  }

  private async getContacts(token: string): Promise<IContact[]> {
    const response = await this.fetchGet(token, 'contacts');

    const result: IResponseContact = await response.json();

    return result._embedded.contacts;
  }

  private async getPipelines(token: string): Promise<IPipeline[]> {
    const response = await this.fetchGet(token, 'leads/pipelines');

    const result: IResponsePipeline = await response.json();

    return result._embedded.pipelines;
  }

  private async getUsers(token: string): Promise<IUser[]> {
    const response = await this.fetchGet(token, 'users');

    const result: IResponseUser = await response.json();

    return result._embedded.users;
  }

  private async updateRefreshToken(result: IToken): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        domain: process.env.DOMAIN,
      },
      { refreshToken: result.refresh_token },
    );
  }

  private async createDocumentDB(result: IToken): Promise<void> {
    const createDocument = new this.userModel({
      domain: process.env.DOMAIN,
      refreshToken: result.refresh_token,
    });
    createDocument.save();
  }

  private async getNewTokens(refreshToken: string): Promise<IToken> {
    const response = await this.fetchPost({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return await response.json();
  }

  private async getTokens(): Promise<IToken> {
    const response = await this.fetchPost({
      grant_type: 'authorization_code',
      code: process.env.CODE,
    });

    if (response.status === 400) {
      const findDomain = await this.userModel.find({
        domain: process.env.DOMAIN,
      });

      if (!findDomain.length)
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

      const result: IToken = await this.getNewTokens(
        findDomain[0].refreshToken,
      );

      this.updateRefreshToken(result);

      return result;
    }

    const result: IToken = await response.json();

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

  private async fetchPost(bodyParam: IBodyParam): Promise<Response> {
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
