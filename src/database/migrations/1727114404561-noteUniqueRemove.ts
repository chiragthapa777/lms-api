import { MigrationInterface, QueryRunner } from "typeorm";

export class NoteUniqueRemove1727114404561 implements MigrationInterface {
    name = 'NoteUniqueRemove1727114404561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "UQ_c1872643429ea977256802b0974"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "UQ_c1872643429ea977256802b0974" UNIQUE ("title")`);
    }

}
