import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1788787477399 implements MigrationInterface {
    name = 'Init1788787477399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying, "avatar" character varying, "socialLinks" jsonb NOT NULL DEFAULT '{}'::jsonb, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "venture_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, CONSTRAINT "PK_080ff1d61711c66ff3d0d0047a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."venture_status_enum" AS ENUM('draft', 'published', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "venture" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "pitch" character varying(255) NOT NULL, "description" text NOT NULL, "logo" character varying(255), "links" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" "public"."venture_status_enum" NOT NULL DEFAULT 'draft', "ownerId" uuid, CONSTRAINT "UQ_178c50144f7917026343db20a14" UNIQUE ("slug"), CONSTRAINT "PK_a0c1eb7cf68fcd445c8e95e54cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "portfolio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "description" text, "logo" character varying(255), CONSTRAINT "UQ_c41a516ed5176dd708f720622e1" UNIQUE ("slug"), CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "program" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "description" text, "logo" character varying(255), "portfolioId" uuid, CONSTRAINT "UQ_47cad5c026f06153b40724baffe" UNIQUE ("slug"), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."activity_participation_status_enum" AS ENUM('pending', 'approved', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "activity_participation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid NOT NULL, "responses" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" "public"."activity_participation_status_enum" NOT NULL DEFAULT 'pending', "submitDate" TIMESTAMP WITH TIME ZONE NOT NULL, "activityId" uuid, CONSTRAINT "UQ_6ee1ee84172e1a02de1957ff049" UNIQUE ("activityId", "userId"), CONSTRAINT "PK_0d7c596c9d6e7a4c6aba527e87d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "responses" jsonb NOT NULL DEFAULT '{}'::jsonb, "submitDate" TIMESTAMP WITH TIME ZONE NOT NULL, "activityId" uuid, "userId" uuid, CONSTRAINT "UQ_e1cc5af51112881e21c6a41420d" UNIQUE ("activityId", "userId"), CONSTRAINT "PK_4199fc30cd37394dbfdf916d963" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_71e01cca515ddd99750868b6e5d" UNIQUE ("name"), CONSTRAINT "PK_fc087d79002cef578e27dd9fdab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, CONSTRAINT "PK_5d3d888450207667a286922f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "description" text, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "participationForm" jsonb NOT NULL DEFAULT '{}'::jsonb, "reviewForm" jsonb NOT NULL DEFAULT '{}'::jsonb, "programId" uuid, "typeId" uuid, CONSTRAINT "UQ_cd3ee671fae680bfbb3ae0ef424" UNIQUE ("slug"), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_88481b0c4ed9ada47e9fdd67475" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "venture_categories" ("ventureId" uuid NOT NULL, "ventureCategoryId" uuid NOT NULL, CONSTRAINT "PK_f03dcd3dd251af4225472c6170a" PRIMARY KEY ("ventureId", "ventureCategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fc1499508d4d1dedccd48e9ed9" ON "venture_categories" ("ventureId") `);
        await queryRunner.query(`CREATE INDEX "IDX_55bb5ab5262befcc70fe266e94" ON "venture_categories" ("ventureCategoryId") `);
        await queryRunner.query(`CREATE TABLE "program_managers" ("programId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_9d26f7c569c036867bf005d9a8d" PRIMARY KEY ("programId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb6ff753cc54b03f905f8be573" ON "program_managers" ("programId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86664fcc693238dfbafe19f397" ON "program_managers" ("userId") `);
        await queryRunner.query(`CREATE TABLE "activity_categories" ("activityId" uuid NOT NULL, "activityCategoryId" uuid NOT NULL, CONSTRAINT "PK_a27eb861c061158d524d6f6b731" PRIMARY KEY ("activityId", "activityCategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d562f5de2d1ccde9d662e1dc6" ON "activity_categories" ("activityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4de3603fb395bf8081e4bc8c6f" ON "activity_categories" ("activityCategoryId") `);
        await queryRunner.query(`ALTER TABLE "venture" ADD CONSTRAINT "FK_6fbaf21ef151926c152487526d7" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "program" ADD CONSTRAINT "FK_994a0fee58790776ef52135a187" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_participation" ADD CONSTRAINT "FK_5a1cae25964cef71e2625e453be" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_participation" ADD CONSTRAINT "FK_e9874a3a9221772b858c4730e75" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_review" ADD CONSTRAINT "FK_2a7dbf43ad63aa27f13f4ae868e" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_review" ADD CONSTRAINT "FK_b2ae0f530591c02de70ceb3d662" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_4b6f54c9ff59d01665ecb4707ff" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_92b8d7ae60a9e36ae170a93b51b" FOREIGN KEY ("typeId") REFERENCES "activity_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "venture_categories" ADD CONSTRAINT "FK_fc1499508d4d1dedccd48e9ed9f" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "venture_categories" ADD CONSTRAINT "FK_55bb5ab5262befcc70fe266e943" FOREIGN KEY ("ventureCategoryId") REFERENCES "venture_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "program_managers" ADD CONSTRAINT "FK_cb6ff753cc54b03f905f8be5738" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "program_managers" ADD CONSTRAINT "FK_86664fcc693238dfbafe19f397e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_categories" ADD CONSTRAINT "FK_6d562f5de2d1ccde9d662e1dc66" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_categories" ADD CONSTRAINT "FK_4de3603fb395bf8081e4bc8c6f4" FOREIGN KEY ("activityCategoryId") REFERENCES "activity_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_categories" DROP CONSTRAINT "FK_4de3603fb395bf8081e4bc8c6f4"`);
        await queryRunner.query(`ALTER TABLE "activity_categories" DROP CONSTRAINT "FK_6d562f5de2d1ccde9d662e1dc66"`);
        await queryRunner.query(`ALTER TABLE "program_managers" DROP CONSTRAINT "FK_86664fcc693238dfbafe19f397e"`);
        await queryRunner.query(`ALTER TABLE "program_managers" DROP CONSTRAINT "FK_cb6ff753cc54b03f905f8be5738"`);
        await queryRunner.query(`ALTER TABLE "venture_categories" DROP CONSTRAINT "FK_55bb5ab5262befcc70fe266e943"`);
        await queryRunner.query(`ALTER TABLE "venture_categories" DROP CONSTRAINT "FK_fc1499508d4d1dedccd48e9ed9f"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_92b8d7ae60a9e36ae170a93b51b"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_4b6f54c9ff59d01665ecb4707ff"`);
        await queryRunner.query(`ALTER TABLE "activity_review" DROP CONSTRAINT "FK_b2ae0f530591c02de70ceb3d662"`);
        await queryRunner.query(`ALTER TABLE "activity_review" DROP CONSTRAINT "FK_2a7dbf43ad63aa27f13f4ae868e"`);
        await queryRunner.query(`ALTER TABLE "activity_participation" DROP CONSTRAINT "FK_e9874a3a9221772b858c4730e75"`);
        await queryRunner.query(`ALTER TABLE "activity_participation" DROP CONSTRAINT "FK_5a1cae25964cef71e2625e453be"`);
        await queryRunner.query(`ALTER TABLE "program" DROP CONSTRAINT "FK_994a0fee58790776ef52135a187"`);
        await queryRunner.query(`ALTER TABLE "venture" DROP CONSTRAINT "FK_6fbaf21ef151926c152487526d7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4de3603fb395bf8081e4bc8c6f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d562f5de2d1ccde9d662e1dc6"`);
        await queryRunner.query(`DROP TABLE "activity_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86664fcc693238dfbafe19f397"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb6ff753cc54b03f905f8be573"`);
        await queryRunner.query(`DROP TABLE "program_managers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_55bb5ab5262befcc70fe266e94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc1499508d4d1dedccd48e9ed9"`);
        await queryRunner.query(`DROP TABLE "venture_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86033897c009fcca8b6505d6be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_472b25323af01488f1f66a06b6"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "activity_category"`);
        await queryRunner.query(`DROP TABLE "activity_type"`);
        await queryRunner.query(`DROP TABLE "activity_review"`);
        await queryRunner.query(`DROP TABLE "activity_participation"`);
        await queryRunner.query(`DROP TYPE "public"."activity_participation_status_enum"`);
        await queryRunner.query(`DROP TABLE "program"`);
        await queryRunner.query(`DROP TABLE "portfolio"`);
        await queryRunner.query(`DROP TABLE "venture"`);
        await queryRunner.query(`DROP TYPE "public"."venture_status_enum"`);
        await queryRunner.query(`DROP TABLE "venture_category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
