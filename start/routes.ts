/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';

const AuthController = () => import("#controllers/auth_controller");
const CardTypeController = () => import("#controllers/card_types_controller");
const ProjectReleaseStatusController = () => import("#controllers/project_release_status_controller");
const ProjectsController = () => import("#controllers/projects_controller");
const ProjectUsersController = () => import("#controllers/project_users_controller");
const ProjectRolesController = () => import("#controllers/project_roles_controller");
const ProjectReportsController = () => import("#controllers/project_reports_controller");
const ProjectActivitiesController = () => import("#controllers/project_activities_controller");
const ProjectReleasesController = () => import("#controllers/project_releases_controller");

router.group(() => {
  router.get('/', async () => ({ hello: 'world', }));

  router.group(() => {
    router.post('sign-in', [AuthController, 'signIn']);
    router.post('sign-up', [AuthController, 'signUp']);
    router.post('reset-password', [AuthController, 'resetPassword']);
    router.post('validate-token', [AuthController, 'validateToken']);
    router.put('redefine-password/:userId', [AuthController, 'redefinePassword']);

  }).prefix('auth');

  router.group(() => {
    router.resource('projects', ProjectsController);
    router.resource('card-types', CardTypeController);
    router.resource('release-status', ProjectReleaseStatusController);
    router.resource('projects/:projectId/users', ProjectUsersController).where('id', {
      match: /^[0-9]+$/,
    });
    router.resource('projects/:projectId/roles', ProjectRolesController).where('id', {
      match: /^[0-9]+$/,
    });
    router.resource('projects/:projectId/activities', ProjectActivitiesController).where('id', {
      match: /^[0-9]+$/,
    });
    router.resource('projects/:projectId/releases', ProjectReleasesController).where('id', {
      match: /^[0-9]+$/,
    });

    router.post('projects/:projectId/users/invite', [ProjectUsersController, 'inviteUser']);
    router.get('projects/:projectId/overview', [ProjectReportsController, 'getOverviewReport']);
    router.get('projects/:projectId/reports', [ProjectReportsController, 'getReport']);

  }).use(middleware.auth());
}).prefix('api/v1');

router.get('/', async () => ({ hello: 'world', }));

