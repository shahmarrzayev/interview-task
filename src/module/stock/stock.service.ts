import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StockService {
  private readonly log = new Logger(StockService.name);

  async getAll() {}

  async getBySymbol() {}
}
