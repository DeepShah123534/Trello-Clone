import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFeatureTable1753128997684 implements MigrationInterface {
    name = 'CreateFeatureTable1753128997684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f"`);
        await queryRunner.query(`ALTER TABLE "feature" ALTER COLUMN "projectId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f"`);
        await queryRunner.query(`ALTER TABLE "feature" ALTER COLUMN "projectId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_f91cf97e77a2abd7df67ca1748f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature" ADD "userId" integer NOT NULL`);
    }

}
