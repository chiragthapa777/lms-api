import { MigrationInterface, QueryRunner } from "typeorm";

export class ChapterView1728959155066 implements MigrationInterface {
    name = 'ChapterView1728959155066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chapter-view" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "chapterId" bigint, "userId" bigint, "completed" boolean, CONSTRAINT "PK_0d211fca0fee6826bca0d18ce3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chapter-view" ADD CONSTRAINT "FK_372873b3cc63c60c93837a88642" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chapter-view" ADD CONSTRAINT "FK_ae4a3d1491fcb7dec7bc6a0258f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapter-view" DROP CONSTRAINT "FK_ae4a3d1491fcb7dec7bc6a0258f"`);
        await queryRunner.query(`ALTER TABLE "chapter-view" DROP CONSTRAINT "FK_372873b3cc63c60c93837a88642"`);
        await queryRunner.query(`DROP TABLE "chapter-view"`);
    }

}
