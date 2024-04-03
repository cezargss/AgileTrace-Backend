import {
  CreateValidator,
  InviteUserValidator,
  UpdateValidator
} from '#validators/project_users_validator';
import { HttpContext } from "@adonisjs/core/http";
import ProjectUser from "../models/project_user.js";
import User from '#models/user';
import string from '@adonisjs/core/helpers/string';
import mail from '@adonisjs/mail/services/main';
import Project from '#models/project';

export default class ProjectUsersController {
  async index({ params }: HttpContext) {
    return await ProjectUser.query()
      .where({ projectId: params.projectId })
      .preload('user')
      .preload('projectRole');
  }

  async store({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(CreateValidator);
    try {
      const foundUser = await ProjectUser.findBy({ projectId: params.projectId, userId: payload.userId });
      if (foundUser) {
        return response.status(400);
      }

      await ProjectUser.create({ ...payload, projectId: params.projectId });
      return response.status(201);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async inviteUser({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(InviteUserValidator);
    try {
      let user = await User.query().where({ email: payload.email }).first();
      if (!user) {
        user = await User.create({ email: payload.email, name: payload.name, password: string.random(32) });
      }

      const projectUser = await ProjectUser.query().where({ userId: user.id, projectId: params.projectId }).first();
      if (!projectUser) {
        await ProjectUser.create({ userId: user.id, projectId: params.projectId, projectRoleId: payload.projectRoleId });
      }

      const project = await Project.findOrFail(params.projectId);
      await this.inviteEmail(user, project);
      return response.status(201);
    } catch (error: any) {
      console.log(error);
      return response.status(500).json(error);
    }
  }

  async update({ params, request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(UpdateValidator);
    try {
      const projectUser = await ProjectUser.findByOrFail({ userId: params.id, projectId: params.projectId });
      projectUser.merge(payload);
      projectUser.save();

      return response.status(200).json(projectUser);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const projectUser = await ProjectUser.findByOrFail({ userId: params.id, projectId: params.projectId });
      await projectUser.delete();
      return response.status(204);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async inviteEmail(user: User, project: Project) {
    const siteUrl = `http://localhost:8080/reset-password?token=${user.password}`;

    await mail.send((message) => {
      message
        .to(user.email)
        .from('', 'Plataforma Agile Trace')
        .subject(`Convite ${project.name}`);

      message.html(`
          <div style="color:#212121;font-family:'Google Sans','Open Sans',Helvetica,Arial,sans-serif;font-weight:400;font-size:22px;line-height:28px;padding:27px 17px 0 0">
           Olá ${user.name}.
          </div>
          <br />
          <div style="color:#212121;font-family:'ClanPro-Book','HelveticaNeue-Light','Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;line-height:28px;text-align:left;">
            <p>Você recebeu um convite para colaborar com o projeto ${project.name}!</p>
            <h7>Clique <a href="${siteUrl}">aqui</a> para aceitar o convite.</h7>
          </div>
        `);
    });
  }
}
