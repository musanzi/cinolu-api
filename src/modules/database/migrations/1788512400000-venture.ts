import { MigrationInterface, QueryRunner } from 'typeorm';

export class Venture1788512400000 implements MigrationInterface {
  name = 'Venture1788512400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."venture_status_enum" AS ENUM('draft', 'published', 'rejected')`);
    await queryRunner.query(
      `CREATE TABLE "venture" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "ownerId" uuid NOT NULL, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "shortDescription" character varying(255) NOT NULL, "description" text NOT NULL, "logo" character varying(255), "links" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" "public"."venture_status_enum" NOT NULL DEFAULT 'draft', CONSTRAINT "UQ_venture_slug" UNIQUE ("slug"), CONSTRAINT "PK_venture_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_venture_owner" ON "venture" ("ownerId")`);
    await queryRunner.query(`CREATE INDEX "IDX_venture_status" ON "venture" ("status")`);
    await queryRunner.query(
      `ALTER TABLE "venture" ADD CONSTRAINT "FK_venture_owner" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "venture" DROP CONSTRAINT "FK_venture_owner"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_venture_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_venture_owner"`);
    await queryRunner.query(`DROP TABLE "venture"`);
    await queryRunner.query(`DROP TYPE "public"."venture_status_enum"`);
  }
}
