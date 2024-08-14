import { MigrationInterface, QueryRunner } from "typeorm";

export class Init11723655890455 implements MigrationInterface {
    name = 'Init11723655890455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapter" DROP CONSTRAINT "FK_b56f1474e3c40c58be083a7bdfd"`);
        await queryRunner.query(`ALTER TABLE "chapter" ADD CONSTRAINT "FK_b56f1474e3c40c58be083a7bdfd" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapter" DROP CONSTRAINT "FK_b56f1474e3c40c58be083a7bdfd"`);
        await queryRunner.query(`ALTER TABLE "chapter" ADD CONSTRAINT "FK_b56f1474e3c40c58be083a7bdfd" FOREIGN KEY ("courseId") REFERENCES "chapter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
