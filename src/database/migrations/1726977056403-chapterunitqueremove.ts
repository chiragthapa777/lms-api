import { MigrationInterface, QueryRunner } from "typeorm";

export class Chapterunitqueremove1726977056403 implements MigrationInterface {
    name = 'Chapterunitqueremove1726977056403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapter" DROP CONSTRAINT "UQ_1540f666b7a73b75b2c13e5db2d"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapter" ADD CONSTRAINT "UQ_1540f666b7a73b75b2c13e5db2d" UNIQUE ("title")`);
    }

}
