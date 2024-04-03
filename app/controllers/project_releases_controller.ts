import ProjectRelease from "#models/project_release";
import { CreateOrUpdateValidator } from "#validators/project_releases_validator";
import { HttpContext } from "@adonisjs/core/http";

export default class ProjectReleasesController {
  async index({ params }: HttpContext) {
    return await ProjectRelease.query().where({ projectId: params.projectId }).preload("projectReleaseStatus");

  }

  async store({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(CreateOrUpdateValidator);
    try {
      await ProjectRelease.create({ ...payload, projectId: params.projectId });
      return response.status(201);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async update({ params, request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(CreateOrUpdateValidator);
    try {
      const project = await ProjectRelease.findOrFail(params.id);
      project.merge(payload);
      project.save();

      return response.status(200).json(project);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const projectRelease = await ProjectRelease.findOrFail(params.id);
      await projectRelease.delete();
      return response.status(204);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }
}
