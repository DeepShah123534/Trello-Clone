import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./entities/task.entity";


@Injectable()
export class TasksService {
    constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getUserStoryTasks(id: number) {
    return await this.tasksRepository.find({ where: { userStory: { id }} });
  }

  async createTask(name: string, userStoryId: number) {
    await this.tasksRepository.save({
      name,
      userStory: { id: userStoryId }, // ✅ Correct usage
    });

    return await this.getUserStoryTasks(userStoryId);
  }

  async updateTask(field: string, value: string, taskId: number) {
    const taskToUpdate = await this.tasksRepository.findOne({ where: { id: taskId } });
    if (!taskToUpdate) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    taskToUpdate[field] = value;
    const updatedTask = await this.tasksRepository.save(taskToUpdate);
    console.log('UPDATED TASK: ', updatedTask);
    
  }
} 