import { MigrationInterface, QueryRunner } from "typeorm";

export class RatingDecimal1727710952243 implements MigrationInterface {
    name = 'RatingDecimal1727710952243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "rating" numeric DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "course" ADD "rating" integer DEFAULT '0'`);
    }

}
