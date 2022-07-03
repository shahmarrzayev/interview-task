import { Injectable, Logger, Req } from '@nestjs/common';
import { IRequest } from '../auth/interface/request.interface';
import { StockHelper } from './stock.helper';

@Injectable()
export class StockService {
  constructor(private stockHelper: StockHelper) {}

  private readonly log = new Logger(StockService.name);

  async getAll(req: IRequest) {}
}
