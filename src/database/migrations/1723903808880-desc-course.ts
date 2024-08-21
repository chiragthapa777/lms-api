import { MigrationInterface, QueryRunner } from "typeorm";

export class DescCourse1723903808880 implements MigrationInterface {
    name = 'DescCourse1723903808880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "description" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "price" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "price" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "description"`);
    }

}
