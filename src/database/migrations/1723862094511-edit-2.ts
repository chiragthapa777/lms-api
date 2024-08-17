import { MigrationInterface, QueryRunner } from "typeorm";

export class Edit21723862094511 implements MigrationInterface {
    name = 'Edit21723862094511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_7dabb0332ddcf46da791fc60dcb"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "REL_7dabb0332ddcf46da791fc60dc"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "enrollmentId"`);
        await queryRunner.query(`ALTER TABLE "course_enrollment" ADD CONSTRAINT "UQ_8ef686128e807c01c154f9e7946" UNIQUE ("paymentId")`);
        await queryRunner.query(`ALTER TABLE "course_enrollment" ADD CONSTRAINT "FK_8ef686128e807c01c154f9e7946" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_enrollment" DROP CONSTRAINT "FK_8ef686128e807c01c154f9e7946"`);
        await queryRunner.query(`ALTER TABLE "course_enrollment" DROP CONSTRAINT "UQ_8ef686128e807c01c154f9e7946"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "enrollmentId" bigint`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "REL_7dabb0332ddcf46da791fc60dc" UNIQUE ("enrollmentId")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_7dabb0332ddcf46da791fc60dcb" FOREIGN KEY ("enrollmentId") REFERENCES "course_enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
