import { Controller, Get, Req } from '@nestjs/common';
import { IRequest } from '../auth/interface/request.interface';
import { StockService } from './stock.service';

@Controller('/api/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/')
  async getAll(@Req() req: IRequest) {
    return await this.stockService.getAll(req);
  }
}
