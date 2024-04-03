import type { HttpContext } from '@adonisjs/core/http';
import {
  AuthSignInValidator,
  AuthSignUpValidator,
  RedefinePasswordValidator,
  SendRedefineValidator,
  ValidateTokenValidator
} from '#validators/auth_validator';
import User from '../models/user.js';
import mail from '@adonisjs/mail/services/main';
import hash from '@adonisjs/core/services/hash';

export default class AuthController {

  public async signIn({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(AuthSignInValidator);

    try {
      const user = await User.verifyCredentials(payload.email, payload.password);
      if (!user) {
        return response.status(403).json({ error: 'Invalid credentials' });
      }

      const token = await auth.use('api').authenticateAsClient(user);
      return response.json({ token: token.headers?.authorization, user: user });
    } catch (error: any) {
      return response.status(403).json(error);
    }
  }

  public async signUp({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(AuthSignUpValidator);

    try {
      const user = await User.create(payload);
      const token = await auth.use('api').authenticateAsClient(user);
      return response.json(token);
    } catch (error: any) {
      return response.status(403).json(error);
    }
  }

  async resetPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(SendRedefineValidator);
    try {
      const user = await User.findByOrFail({ email: payload.email });
      await this.sendRedefinePasswordEmail(user);
      return response.status(204);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async sendRedefinePasswordEmail(user: User) {
    const siteUrl = `http://localhost:8080/reset-password?token=${user.password}`;

    await mail.send((message) => {
      message
        .to(user.email)
        .from('', 'Plataforma Agile Trace')
        .subject(`Redefinição de senha`);

      message.html(`
          <div style="color:#212121;font-family:'Google Sans','Open Sans',Helvetica,Arial,sans-serif;font-weight:400;font-size:22px;line-height:28px;padding:27px 17px 0 0">
           Olá ${user.name}.
          </div>
          <br />
          <div style="color:#212121;font-family:'ClanPro-Book','HelveticaNeue-Light','Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;line-height:28px;text-align:left;">
            <p>Recebemos sua solicitação para redefinir sua senha na plataforma AgileTrace!</p>
            <h7>Clique <a href="${siteUrl}">aqui</a> para redefinir sua senha.</h7>
          </div>
        `);
    });
  }

  async validateToken({ request, response }: HttpContext) {
    const payload = await request.validateUsing(ValidateTokenValidator);
    try {
      return await User.findByOrFail({ password: payload.token.replaceAll(" ", "+") });
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  async redefinePassword({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(RedefinePasswordValidator);
    try {
      const user = await User.findOrFail(params.userId);
      user.password = payload.password;
      user.save();

      return response.status(200);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }
}
