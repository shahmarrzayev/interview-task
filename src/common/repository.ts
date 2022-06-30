import { Logger } from '@nestjs/common';

export class GenericRepository {
  getSkip(page: number, perPage = 10): number {
    if (!page || page === 1) return 0;
    return page * perPage;
  }

  async runQuery(query: any): Promise<any> {
    let result: any;

    try {
      result = await query();
    } catch (error) {
      Logger.error(`genericRepository.runQuery -- ${error}`);
      return null;
    }

    return result;
  }
}
