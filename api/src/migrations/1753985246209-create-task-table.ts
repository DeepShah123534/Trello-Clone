import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskTable1753985246209 implements MigrationInterface {
    name = 'CreateTaskTable1753985246209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3c3e2be483b085692fb251413ee"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "featureId" TO "userStoryId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_b1500fa73277080dc0d730f2316" FOREIGN KEY ("userStoryId") REFERENCES "user_story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b1500fa73277080dc0d730f2316"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "userStoryId" TO "featureId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_3c3e2be483b085692fb251413ee" FOREIGN KEY ("featureId") REFERENCES "user_story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
