import { MigrationInterface, QueryRunner } from "typeorm";

export class Edit31723863702389 implements MigrationInterface {
    name = 'Edit31723863702389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "rating" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "rating"`);
    }

}
