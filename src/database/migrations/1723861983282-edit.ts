import { MigrationInterface, QueryRunner } from "typeorm";

export class Edit1723861983282 implements MigrationInterface {
    name = 'Edit1723861983282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "transactionId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "remark"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "remark" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "remark"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "remark" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "transactionId"`);
    }

}
