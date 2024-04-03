import {
  CreateOrUpdateValidator,
} from '#validators/project_roles_validator';
import { HttpContext } from "@adonisjs/core/http";
import ProjectRole from '#models/project_role';

export default class ProjectRolesController {
  async index({ params }: HttpContext) {
    return await ProjectRole.query().where({ projectId: params.projectId });
  }

  async store({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(CreateOrUpdateValidator);
    try {
      await ProjectRole.create({ ...payload, projectId: params.projectId });
      return response.status(201);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async update({ params, request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(CreateOrUpdateValidator);
    try {
      const project = await ProjectRole.findOrFail(params.id);
      project.merge(payload);
      project.save();

      return response.status(200).json(project);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const projectRole = await ProjectRole.findOrFail(params.id);
      await projectRole.delete();
      return response.status(204);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }
}
