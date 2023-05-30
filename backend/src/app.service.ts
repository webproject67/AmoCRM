import { Injectable } from '@nestjs/common';

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

@Injectable()
export class AppService {
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

    const result: IResultTokens = await response.json();
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
    const response = await fetch(`${process.env.DOMAIN}/api/v4/leads}`, {
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
}
