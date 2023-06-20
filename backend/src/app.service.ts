import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IData,
  IToken,
  IUserDb,
  IBodyParam,
  IResponsePieceData,
} from './types';

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private userModel: Model<IUserDb>) {}

  async getData(query: string): Promise<IData> {
    const { access_token } = await this.getTokens();

    const {
      _embedded: { leads },
    } = await this.getPieceData(
      access_token,
      `leads?with=contacts&query=${query}`,
    );

    const {
      _embedded: { contacts },
    } = await this.getPieceData(access_token, 'contacts');

    const {
      _embedded: { pipelines },
    } = await this.getPieceData(access_token, 'leads/pipelines');

    const {
      _embedded: { users },
    } = await this.getPieceData(access_token, 'users');

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

  private async updateRefreshToken(result: IToken): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        domain: process.env.DOMAIN,
      },
      { refreshToken: result.refresh_token },
    );
  }

  private createDocumentDB(result: IToken): void {
    const createDocument = new this.userModel({
      domain: process.env.DOMAIN,
      refreshToken: result.refresh_token,
    });
    createDocument.save();
  }

  private async getNewTokens(refreshToken: string): Promise<IToken> {
    const response = await this.loadToken({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    if (response.ok) return await response.json();

    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private async getTokens(): Promise<IToken> {
    const response = await this.loadToken({
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

    if (response.ok) {
      const result: IToken = await response.json();

      const findDomain = await this.userModel.findOne({
        domain: process.env.DOMAIN,
      });

      findDomain
        ? this.updateRefreshToken(result)
        : this.createDocumentDB(result);

      return result;
    }

    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private async getPieceData(
    token: string,
    urn: string,
  ): Promise<IResponsePieceData> {
    const response = await fetch(`${process.env.DOMAIN}/api/v4/${urn}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) return { _embedded: { leads: [] } };
    if (response.ok) return await response.json();

    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private async loadToken(bodyParam: IBodyParam): Promise<Response> {
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
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
