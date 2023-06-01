import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

export interface IQueryKit {
  query: string;
}

@Controller('/api/leads')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTokens(@Query() queryKit: IQueryKit): Promise<{
    leads: object[];
    pipeline: object;
    users: object[];
  }> {
    const { query } = queryKit;

    return this.appService.getTokens(query);
  }
}
