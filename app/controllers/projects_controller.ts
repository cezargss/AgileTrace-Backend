import {
  CreateValidator,
} from '#validators/projects_validator';
import type { HttpContext } from '@adonisjs/core/http';
import Project from '../models/project.js';
import ProjectUser from '#models/project_user';

export default class ProjectsController {
  async index({ auth, response }: HttpContext): Promise<void> {
    const currentUser = auth.getUserOrFail();
    try {
      const projects = await Project.query()
        .where({ ownerId: currentUser.id })
        .orWhereHas('project_users', (projectUsersQuery) => {
          projectUsersQuery.where('user_id', currentUser.id);
        }).preload('project_users');

      return response.status(200).json(projects);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async show({ params, response }: HttpContext): Promise<void> {
    try {
      const project = await Project.query().where({ id: params.id }).preload('project_users').first();
      return response.status(200).json(project);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async store({ auth, request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(CreateValidator);
    const currentUser = auth.getUserOrFail();
    try {
      const project = await Project.create({ ...payload, ownerId: currentUser.id });
      await ProjectUser.create({ userId: currentUser.id, projectId: project.id });
      return response.status(200).json(project);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async destroy({ params, response }: HttpContext): Promise<void> {
    try {
      const project = await Project.findOrFail(params.id);
      project.delete();
      return response.status(204).json({ ok: true });
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }
}
