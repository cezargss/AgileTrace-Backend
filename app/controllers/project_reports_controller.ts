import Project from "#models/project";
import ProjectActivity from "#models/project_activity";
import ProjectRelease from "#models/project_release";
import { HttpContext } from "@adonisjs/core/http";


type Reports = {
  storiesByStatus: { labels: string[], data: number[]; };
  storiesByType: { labels: string[], data: number[]; };
  storiesByResponsible: { labels: string[], data: number[]; };
  storiesDelay: { labels: string[], data: number[]; };
  delivery: { labels: string[], data: number[]; };
  burnDown: { labels: string[], data: number[]; };
};

enum ProjectActivityStatus {
  Backlog = 1,
  Development = 2,
  Testing = 3,
  Finished = 4
}

export default class ProjectReportsController {
  async getReport({ params, response }: HttpContext) {
    try {
      const project = await Project.find(params.projectId);

      const activities = await ProjectActivity.query()
        .where({ projectId: params.projectId })
        .preload('responsible')
        .preload("cardType")
        .preload("cardStatus");

      const reports: Reports = {
        storiesByStatus: { labels: [], data: [] },
        storiesByType: { labels: [], data: [] },
        storiesByResponsible: { labels: [], data: [] },
        storiesDelay: { labels: [], data: [] },
        delivery: { labels: [], data: [] },
        burnDown: { labels: [], data: [] }
      };

      const statusCount: Record<number, number> = {};
      const typeCount: Record<number, number> = {};
      const responsibleCount: Record<number, number> = {};
      const delayCount: Record<string, number> = {};


      activities.forEach(story => {
        // Update stories by status
        const statusLabel = story.cardStatus?.name;
        statusCount[statusLabel as keyof object] = (statusCount[statusLabel as keyof object] || 0) + 1;

        // Update stories by type
        const typeLabel = story.cardType.name;
        typeCount[typeLabel as keyof object] = (typeCount[typeLabel as keyof object] || 0) + 1;

        // Update stories by responsible
        const responsibleLabel = story.responsible?.name;
        responsibleCount[responsibleLabel as keyof object] = (responsibleCount[responsibleLabel as keyof object] || 0) + 1;

        // Update stories delay
        if (story.estimatedDate && story.developmentDate) {
          const estimated = new Date(story.estimatedDate);
          const development = new Date(story.developmentDate);
          const differenceInMilliseconds = development.getTime() - estimated.getTime();
          const delayInDays = Math.max(0, Math.floor(differenceInMilliseconds / (1000 * 3600 * 24)));
          if (delayInDays > 0) {
            delayCount[story.title] = (delayCount[story.title] || 0) + delayInDays;
          }
        }

        // Update delivery
        if (story.closedDate) {
          const deliveryDate = new Date(story.closedDate);
          reports.delivery.labels.push(story.title);
          reports.delivery.data.push(deliveryDate.getTime());
        }
      });

      // Populate reports
      reports.storiesByStatus.labels = Object.keys(statusCount);
      reports.storiesByStatus.data = Object.values(statusCount);

      reports.storiesByType.labels = Object.keys(typeCount);
      reports.storiesByType.data = Object.values(typeCount);

      reports.storiesByResponsible.labels = Object.keys(responsibleCount);
      reports.storiesByResponsible.data = Object.values(responsibleCount);

      reports.storiesDelay.labels = Object.keys(delayCount);
      reports.storiesDelay.data = Object.values(delayCount);

      reports.burnDown = this.calculateBurnDownData(project!, activities);

      return response.status(200).json(reports);
    } catch (error: any) {
      return response.status(500).json(error);
    }
  }

  calculateBurnDownData(project: Project, activities: ProjectActivity[]) {
    const monthlyTotals: { [key: string]: number; } = {};
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);

    activities.forEach(activity => {
      const taskDate = new Date(activity.estimatedDate);
      const yearMonth = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

      if (!monthlyTotals[yearMonth]) {
        monthlyTotals[yearMonth] = 0;
      }

      monthlyTotals[yearMonth] += activity.points;
    });

    const dates: string[] = [];
    const values: number[] = [];

    let currentDate = new Date(startDate);
    let cumulativeTotal = 0;

    while (currentDate <= endDate) {
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();

      cumulativeTotal += monthlyTotals[`${year}-${month}`] || 0;
      dates.push(`${month}/${year}`);
      values.push(cumulativeTotal);

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return { labels: dates, data: values };
  };

  async getOverviewReport({ params, response }: HttpContext) {
    try {
      const activities = await ProjectActivity.query()
        .where('projectId', params.projectId)
        .orderBy('statusId')
        .orderBy('closedDate', 'desc')
        .select('*')
        .preload("cardStatus")
        .preload("cardType")
        .preload("responsible");

      const release = await ProjectRelease.query()
        .where('projectId', params.projectId)
        .orderBy('updated_at', 'desc')
        .preload("projectReleaseStatus")
        .first();

      const pending = activities.filter(pa => pa.statusId != ProjectActivityStatus.Finished);
      const completed = activities.filter(pa => pa.statusId == ProjectActivityStatus.Finished);

      return response.status(200).json({
        completed: completed.length,
        pending: pending.length,
        progress: Math.round(completed.length / activities.length * 100),
        lastActivities: activities.filter(a => a.statusId == ProjectActivityStatus.Finished).slice(0, 3),
        lastRelease: release
      });
    } catch (error: any) {
      console.log(error);
      return response.status(500).json(error);
    }
  }

}

