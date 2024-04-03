import {
  CreateOrUpdateValidator,
} from '#validators/project_activities_validator';
import type { HttpContext } from '@adonisjs/core/http';
import ProjectActivity from '../models/project_activity.js';
import { DateTime } from 'luxon';
import { Database } from '@adonisjs/lucid/database';
import User from '#models/user';
import mail from '@adonisjs/mail/services/main';

enum ProjectActivityStatus {
  Backlog = 1,
  Development = 2,
  Testing = 3,
  Finished = 4
}

export default class ProjectActivitiesController {
  async index({ params }: HttpContext) {
    return await ProjectActivity.query()
      .where({ projectId: params.projectId })
      .preload('responsible')
      .preload("cardStatus")
      .preload("cardType");
  }

  async show({ params, response }: HttpContext): Promise<void> {
    try {
      const project = await ProjectActivity.findOrFail(params.id);
      return response.status(200).json(project);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async store({ params, request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(CreateOrUpdateValidator);
    try {
      const project = await ProjectActivity.create({ ...payload, projectId: params.projectId });

      await this.sendResponsibleEmail(project, payload);

      return response.status(200).json(project);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async update({ params, request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(CreateOrUpdateValidator);
    try {
      const project = await ProjectActivity.findOrFail(params.id);

      const responsibleChanged = project.responsibleId != payload.responsibleId;
      if (project.statusId != payload.statusId) {
        if (payload.statusId == ProjectActivityStatus.Development) {
          project.merge({ developmentDate: DateTime.now().toJSDate() });
        }
        if (payload.statusId == ProjectActivityStatus.Testing) {
          project.merge({ testingDate: DateTime.now().toJSDate() });
        }
        if (payload.statusId == ProjectActivityStatus.Finished) {
          project.merge({ closedDate: DateTime.now().toJSDate() });
        }
      }
      project.merge(payload);
      project.save();

      if (responsibleChanged) {
        await this.sendResponsibleEmail(project, payload);
      }

      return response.status(200).json(project);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async destroy({ params, response }: HttpContext): Promise<void> {
    try {
      const project = await ProjectActivity.findOrFail(params.id);
      project.delete();
      return response.status(204).json({ ok: true });
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async sendResponsibleEmail(project: ProjectActivity, payload: any) {
    const user = await User.findOrFail(payload.responsibleId);

    const siteUrl = `http://localhost:8080/project/${project.projectId}/`;

    await mail.send((message) => {
      message
        .to(user.email)
        .from('', 'Plataforma Agile Trace')
        .subject(`Nova atividade atribuida`);

      message.html(`
          <div style="color:#212121;font-family:'Google Sans','Open Sans',Helvetica,Arial,sans-serif;font-weight:400;font-size:22px;line-height:28px;padding:27px 17px 0 0">
           Olá ${user.name}.
          </div>
          <br />
          <div style="color:#212121;font-family:'Google Sans','HelveticaNeue-Light','Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;line-height:28px;text-align:left;">
            <p>Uma nova atividade foi atribuida a você!</p>
            <p style="margin:0;font-family:'Google Sans',arial,sans;font-size:19px;line-height:19px;font-weight:bold;color:#3c3f44">
              ${payload.title}: ${payload.description}
            </p>
            <p>Clique <a href="${siteUrl}">aqui</a> para visualizar o board do projeto.</p>
          </div>
        `);
    });
  }
}


