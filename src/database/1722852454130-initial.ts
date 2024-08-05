import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1722852454130 implements MigrationInterface {
    name = 'Initial1722852454130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prompts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(500) NOT NULL, "description" text NOT NULL, "createdById" uuid NOT NULL, CONSTRAINT "PK_21f33798862975179e40b216a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_prompts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "promptId" uuid, CONSTRAINT "UQ_73168116de7693b845a0ded9927" UNIQUE ("userId", "promptId"), CONSTRAINT "PK_56ccdadbc64d09afc8ad4a4e63d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('Admin', 'User')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "password" character varying, "failedLoginAttempts" integer NOT NULL DEFAULT '0', "lockUntil" TIMESTAMP, "role" "public"."users_role_enum" NOT NULL DEFAULT 'User', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_04578ffa4aaf43e086eb6fc6c07" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_prompts" ADD CONSTRAINT "FK_84bf4fc2df64711ec4b79419f3e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_prompts" ADD CONSTRAINT "FK_07969c4a826b37150761f25f271" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_prompts" DROP CONSTRAINT "FK_07969c4a826b37150761f25f271"`);
        await queryRunner.query(`ALTER TABLE "favorite_prompts" DROP CONSTRAINT "FK_84bf4fc2df64711ec4b79419f3e"`);
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_04578ffa4aaf43e086eb6fc6c07"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "favorite_prompts"`);
        await queryRunner.query(`DROP TABLE "prompts"`);
    }

}
