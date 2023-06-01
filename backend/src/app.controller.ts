import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Data, QueryKit } from './types';

@Controller('/api/leads')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Query() queryKit: QueryKit): Promise<Data> {
    const { query } = queryKit;

    return this.appService.getData(query);
  }
}
