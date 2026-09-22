import { MigrationInterface, QueryRunner } from "typeorm";

export class Cohorts1790067079406 implements MigrationInterface {
    name = 'Cohorts1790067079406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cohort" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "programId" uuid NOT NULL, CONSTRAINT "PK_4fb3cca38dc4b461110344e5f9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "resources" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "cohortId" uuid`);
        await queryRunner.query(`ALTER TABLE "venture" ALTER COLUMN "socials" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "participationForm" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "reviewForm" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "data" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "socialLinks" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "cohort" ADD CONSTRAINT "FK_1621b85c84d959b073f4d8f27a8" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_3a7b558c7c4ec2bab8a17280daf" FOREIGN KEY ("cohortId") REFERENCES "cohort"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_3a7b558c7c4ec2bab8a17280daf"`);
        await queryRunner.query(`ALTER TABLE "cohort" DROP CONSTRAINT "FK_1621b85c84d959b073f4d8f27a8"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "socialLinks" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "participation" ALTER COLUMN "data" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "reviewForm" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "participationForm" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "venture" ALTER COLUMN "socials" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "cohortId"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "resources"`);
        await queryRunner.query(`DROP TABLE "cohort"`);
    }

}
