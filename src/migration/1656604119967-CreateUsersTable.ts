import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1656604119967 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "users" (
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            username VARCHAR(512) UNIQUE NOT NULL,
            email VARCHAR(512) UNIQUE NOT NULL,
            password VARCHAR(512) NOT NULL,
            cash_balance INT NOT NULL DEFAULT 0,
            activate_url VARCHAR(512),
            is_active BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
