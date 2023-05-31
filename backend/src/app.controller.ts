import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api/leads')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTokens(): Promise<{
    leads: object[];
    contacts: object[];
    pipeline: object;
    users: object[];
  }> {
    return this.appService.getTokens();
  }
}
