import { BaseApiService } from "./base/BaseApiService";

export interface TrainingRequestCourse {
  systemId: string;
  code: string;
  title: string;
  description: string;
  type: string;
  status: string;
  "@odata.etag": string;
}

class TrainingRequestCoursesService extends BaseApiService {
  protected endpoint = "trainingRequestsCourses";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches training request courses from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @returns {Promise<TrainingRequestCourse[]>} Array of training request courses
   */
  async getTrainingRequestCourses(companyId: string, filterQuery?: string) {
    return this.get<TrainingRequestCourse>({ companyId, filterQuery });
  }
}

export const trainingRequestCoursesService =
  new TrainingRequestCoursesService();
