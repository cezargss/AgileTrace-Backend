// import type { HttpContext } from '@adonisjs/core/http'

import ProjectReleaseStatus from "#models/project_release_status";

export default class ProjectReleaseStatusController {
  async index() {
    return await ProjectReleaseStatus.all();
  }
}
