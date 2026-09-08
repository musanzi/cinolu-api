import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1788879582557 implements MigrationInterface {
    name = 'Init1788879582557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sector" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_23e1125a0a0e6b06d3e825ba990" UNIQUE ("name"), CONSTRAINT "PK_668b2ea8a2f534425407732f3ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."venture_stage_enum" AS ENUM('idea', 'mvp', 'early_stage', 'growth', 'mature')`);
        await queryRunner.query(`CREATE TYPE "public"."venture_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "venture" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "logo" character varying(255), "cover" character varying(255), "description" text NOT NULL, "socials" jsonb NOT NULL DEFAULT '{}'::jsonb, "stage" "public"."venture_stage_enum" NOT NULL, "status" "public"."venture_status_enum" NOT NULL DEFAULT 'pending', "ownerId" uuid NOT NULL, CONSTRAINT "UQ_178c50144f7917026343db20a14" UNIQUE ("slug"), CONSTRAINT "PK_a0c1eb7cf68fcd445c8e95e54cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying, "password" character varying, "biography" text NOT NULL, "socialLinks" jsonb NOT NULL DEFAULT '{}'::jsonb, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, CONSTRAINT "PK_5d3d888450207667a286922f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "description" text, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "participationForm" jsonb NOT NULL DEFAULT '{}'::jsonb, "isPublished" boolean NOT NULL DEFAULT false, "reviewForm" jsonb NOT NULL DEFAULT '{}'::jsonb, "cover" character varying(255), CONSTRAINT "UQ_cd3ee671fae680bfbb3ae0ef424" UNIQUE ("slug"), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_71e01cca515ddd99750868b6e5d" UNIQUE ("name"), CONSTRAINT "PK_fc087d79002cef578e27dd9fdab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "portfolio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "description" text, "logo" character varying(255), CONSTRAINT "UQ_c41a516ed5176dd708f720622e1" UNIQUE ("slug"), CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "program" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "description" text, "logo" character varying(255), "portfolioId" uuid NOT NULL, CONSTRAINT "UQ_47cad5c026f06153b40724baffe" UNIQUE ("slug"), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "venture_sectors" ("ventureId" uuid NOT NULL, "sectorId" uuid NOT NULL, CONSTRAINT "PK_826e1b5975ef4b334f8c8c7bc45" PRIMARY KEY ("ventureId", "sectorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e60ca7a9ce9aa98c1ae8a49ee9" ON "venture_sectors" ("ventureId") `);
        await queryRunner.query(`CREATE INDEX "IDX_31c8446f7c4b38eb6a78eca46a" ON "venture_sectors" ("sectorId") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_88481b0c4ed9ada47e9fdd67475" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "activity_mentors" ("activityId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_615f00207922e69f5be9027ae2f" PRIMARY KEY ("activityId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_872279897196bd2da61c5c3d7d" ON "activity_mentors" ("activityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3bd78afb14d237f95d86049ca2" ON "activity_mentors" ("userId") `);
        await queryRunner.query(`CREATE TABLE "activity_activity_types" ("activityId" uuid NOT NULL, "activityTypeId" uuid NOT NULL, CONSTRAINT "PK_a25197c5dcc018f45a24e69df09" PRIMARY KEY ("activityId", "activityTypeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_68225b88bdfb916085e5d14cb0" ON "activity_activity_types" ("activityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2fc91a6e1651832d5eb316d652" ON "activity_activity_types" ("activityTypeId") `);
        await queryRunner.query(`CREATE TABLE "activity_categories" ("activityId" uuid NOT NULL, "activityCategoryId" uuid NOT NULL, CONSTRAINT "PK_a27eb861c061158d524d6f6b731" PRIMARY KEY ("activityId", "activityCategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d562f5de2d1ccde9d662e1dc6" ON "activity_categories" ("activityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4de3603fb395bf8081e4bc8c6f" ON "activity_categories" ("activityCategoryId") `);
        await queryRunner.query(`CREATE TABLE "program_managers" ("programId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_9d26f7c569c036867bf005d9a8d" PRIMARY KEY ("programId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb6ff753cc54b03f905f8be573" ON "program_managers" ("programId") `);
        await queryRunner.query(`CREATE INDEX "IDX_86664fcc693238dfbafe19f397" ON "program_managers" ("userId") `);
        await queryRunner.query(`ALTER TABLE "venture" ADD CONSTRAINT "FK_6fbaf21ef151926c152487526d7" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "program" ADD CONSTRAINT "FK_994a0fee58790776ef52135a187" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venture_sectors" ADD CONSTRAINT "FK_e60ca7a9ce9aa98c1ae8a49ee90" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "venture_sectors" ADD CONSTRAINT "FK_31c8446f7c4b38eb6a78eca46a7" FOREIGN KEY ("sectorId") REFERENCES "sector"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_mentors" ADD CONSTRAINT "FK_872279897196bd2da61c5c3d7d7" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_mentors" ADD CONSTRAINT "FK_3bd78afb14d237f95d86049ca29" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_activity_types" ADD CONSTRAINT "FK_68225b88bdfb916085e5d14cb07" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_activity_types" ADD CONSTRAINT "FK_2fc91a6e1651832d5eb316d6526" FOREIGN KEY ("activityTypeId") REFERENCES "activity_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_categories" ADD CONSTRAINT "FK_6d562f5de2d1ccde9d662e1dc66" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_categories" ADD CONSTRAINT "FK_4de3603fb395bf8081e4bc8c6f4" FOREIGN KEY ("activityCategoryId") REFERENCES "activity_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "program_managers" ADD CONSTRAINT "FK_cb6ff753cc54b03f905f8be5738" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "program_managers" ADD CONSTRAINT "FK_86664fcc693238dfbafe19f397e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "program_managers" DROP CONSTRAINT "FK_86664fcc693238dfbafe19f397e"`);
        await queryRunner.query(`ALTER TABLE "program_managers" DROP CONSTRAINT "FK_cb6ff753cc54b03f905f8be5738"`);
        await queryRunner.query(`ALTER TABLE "activity_categories" DROP CONSTRAINT "FK_4de3603fb395bf8081e4bc8c6f4"`);
        await queryRunner.query(`ALTER TABLE "activity_categories" DROP CONSTRAINT "FK_6d562f5de2d1ccde9d662e1dc66"`);
        await queryRunner.query(`ALTER TABLE "activity_activity_types" DROP CONSTRAINT "FK_2fc91a6e1651832d5eb316d6526"`);
        await queryRunner.query(`ALTER TABLE "activity_activity_types" DROP CONSTRAINT "FK_68225b88bdfb916085e5d14cb07"`);
        await queryRunner.query(`ALTER TABLE "activity_mentors" DROP CONSTRAINT "FK_3bd78afb14d237f95d86049ca29"`);
        await queryRunner.query(`ALTER TABLE "activity_mentors" DROP CONSTRAINT "FK_872279897196bd2da61c5c3d7d7"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "venture_sectors" DROP CONSTRAINT "FK_31c8446f7c4b38eb6a78eca46a7"`);
        await queryRunner.query(`ALTER TABLE "venture_sectors" DROP CONSTRAINT "FK_e60ca7a9ce9aa98c1ae8a49ee90"`);
        await queryRunner.query(`ALTER TABLE "program" DROP CONSTRAINT "FK_994a0fee58790776ef52135a187"`);
        await queryRunner.query(`ALTER TABLE "venture" DROP CONSTRAINT "FK_6fbaf21ef151926c152487526d7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86664fcc693238dfbafe19f397"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb6ff753cc54b03f905f8be573"`);
        await queryRunner.query(`DROP TABLE "program_managers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4de3603fb395bf8081e4bc8c6f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d562f5de2d1ccde9d662e1dc6"`);
        await queryRunner.query(`DROP TABLE "activity_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fc91a6e1651832d5eb316d652"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68225b88bdfb916085e5d14cb0"`);
        await queryRunner.query(`DROP TABLE "activity_activity_types"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3bd78afb14d237f95d86049ca2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_872279897196bd2da61c5c3d7d"`);
        await queryRunner.query(`DROP TABLE "activity_mentors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86033897c009fcca8b6505d6be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_472b25323af01488f1f66a06b6"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31c8446f7c4b38eb6a78eca46a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e60ca7a9ce9aa98c1ae8a49ee9"`);
        await queryRunner.query(`DROP TABLE "venture_sectors"`);
        await queryRunner.query(`DROP TABLE "program"`);
        await queryRunner.query(`DROP TABLE "portfolio"`);
        await queryRunner.query(`DROP TABLE "activity_type"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "activity_category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "venture"`);
        await queryRunner.query(`DROP TYPE "public"."venture_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."venture_stage_enum"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "sector"`);
    }

}
