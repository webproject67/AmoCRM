import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { IData, IQueryKit } from './types';

@Controller('/api/leads')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Query() queryKit: IQueryKit): Promise<IData> {
    const { query } = queryKit;

    return this.appService.getData(query);
  }
}
