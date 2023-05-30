import { Injectable } from '@nestjs/common';

interface IResult {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AppService {
  async getTokens(): Promise<any> {
    const response = await fetch(
      `https://${process.env.DOMAIN}.amocrm.ru/oauth2/access_token`,
      {
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
      },
    );

    const result: IResult = await response.json();
  }
}
