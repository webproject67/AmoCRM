import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface IResultTokens {
  access_token: string;
  refresh_token: string;
}

interface IResultLeads {
  _embedded: {
    leads: object[];
  };
}

interface IResultPipelines {
  _embedded: {
    pipelines: object[];
  };
}

interface IResultUsers {
  _embedded: {
    users: object[];
  };
}

interface IUser {
  domain: string;
  refreshToken: string;
}

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}
  async getTokens(): Promise<{
    leads: object[];
    pipeline: object;
    users: object[];
  }> {
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

    let result: IResultTokens;

    if (response.status === 400) {
      const findDomain = await this.userModel.find({
        domain: process.env.DOMAIN,
      });

      result = await this.getNewTokens(findDomain[0].refreshToken);

      this.updateRefreshToken(result);
    } else {
      result = await response.json();

      const findDomain = await this.userModel.findOne({
        domain: process.env.DOMAIN,
      });

      findDomain
        ? this.updateRefreshToken(result)
        : this.createDocumentDB(result);
    }

    const leads = await this.getLeads(result.access_token);
    const pipelines = await this.getPipelines(result.access_token);
    const users = await this.getUsers(result.access_token);

    return {
      leads,
      pipeline: pipelines[0],
      users,
    };
  }

  private async getLeads(token: string): Promise<object[]> {
    const response = await fetch(`${process.env.DOMAIN}/api/v4/leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: IResultLeads = await response.json();

    return result._embedded.leads;
  }

  private async getPipelines(token: string): Promise<object[]> {
    const response = await fetch(
      `${process.env.DOMAIN}/api/v4/leads/pipelines`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result: IResultPipelines = await response.json();

    return result._embedded.pipelines;
  }

  private async getUsers(token: string): Promise<object[]> {
    const response = await fetch(`${process.env.DOMAIN}/api/v4/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: IResultUsers = await response.json();

    return result._embedded.users;
  }

  private async updateRefreshToken(result: IResultTokens): Promise<void> {
    await this.userModel.findOneAndUpdate(
      {
        domain: process.env.DOMAIN,
      },
      { refreshToken: result.refresh_token },
    );
  }

  private async createDocumentDB(result: IResultTokens): Promise<void> {
    const createDocument = new this.userModel({
      domain: process.env.DOMAIN,
      refreshToken: result.refresh_token,
    });
    createDocument.save();
  }

  private async getNewTokens(refreshToken: string): Promise<IResultTokens> {
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
}
