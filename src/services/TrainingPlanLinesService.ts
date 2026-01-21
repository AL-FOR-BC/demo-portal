import { BaseApiService } from "./base/BaseApiService";
import {
  TrainingPlanLine,
  ProfessionalCertificate,
  Coaching,
  Conference,
  Course,
  OrganisationUnit,
  Venue,
  Employee,
  Vendor,
} from "../@types/trainingPlanLines.dto";
import { apiVendors } from "./CommonServices";

export class TrainingPlanLinesService extends BaseApiService {
  protected endpoint = "trainingPlanLines";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  // Training Plan Lines CRUD operations
  async getTrainingPlanLines(
    companyId: string,
    trainingPlanNo: string
  ): Promise<TrainingPlanLine[]> {
    return this.get<TrainingPlanLine>({
      companyId,
      filterQuery: `$filter=planNo eq '${trainingPlanNo}'`,
    });
  }

  async createTrainingPlanLine(
    companyId: string,
    lineData: Partial<TrainingPlanLine>
  ): Promise<TrainingPlanLine> {
    const response = await this.create<TrainingPlanLine>({
      companyId,
      data: lineData,
    });
    return response.data;
  }

  async updateTrainingPlanLine(
    companyId: string,
    systemId: string,
    lineData: Partial<TrainingPlanLine>,
    etag: string
  ): Promise<TrainingPlanLine> {
    const response = await this.update<TrainingPlanLine>({
      companyId,
      systemId,
      data: lineData,
      etag,
    });
    return response.data;
  }

  async deleteTrainingPlanLine(
    companyId: string,
    systemId: string,
    etag: string
  ): Promise<void> {
    await this.delete({
      companyId,
      systemId,
      etag,
    });
  }

  // Professional Certificates API
  async getProfessionalCertificates(
    companyId: string
  ): Promise<ProfessionalCertificate[]> {
    return this.get<ProfessionalCertificate>({
      companyId,
      customEndpoint: "professionalCertificates",
    });
  }

  // Coaching API
  async getCoaching(companyId: string): Promise<Coaching[]> {
    return this.get<Coaching>({
      companyId,
      customEndpoint: "coaching",
    });
  }

  // Conferences API
  async getConferences(companyId: string): Promise<Conference[]> {
    return this.get<Conference>({
      companyId,
      customEndpoint: "conferences",
    });
  }

  // Courses API
  async getCourses(companyId: string): Promise<Course[]> {
    return this.get<Course>({
      companyId,
      customEndpoint: "courses",
    });
  }

  // Organisation Units API
  async getOrganisationUnits(companyId: string): Promise<OrganisationUnit[]> {
    return this.get<OrganisationUnit>({
      companyId,
      customEndpoint: "organisationunits",
    });
  }

  // Venues API
  async getVenues(companyId: string): Promise<Venue[]> {
    console.log(
      "TrainingPlanLinesService.getVenues called with companyId:",
      companyId
    );
    const result = await this.get<Venue>({
      companyId,
      customEndpoint: "venues",
    });
    console.log("TrainingPlanLinesService.getVenues result:", result);
    return result;
  }

  // Employees API
  async getEmployees(companyId: string): Promise<Employee[]> {
    try {
      const response = await this.get<any>({
        companyId,
        customEndpoint: "employees",
      });
      return response.map((employee: any) => ({
        systemId: employee.SystemId,
        employeeId: employee.No,
        fullName: `${employee.FirstName || ""} ${
          employee.LastName || ""
        }`.trim(),
        email: employee.Email || undefined,
        department: employee.Department || undefined,
      }));
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  }

  // Vendors API
  async getVendors(companyId: string): Promise<Vendor[]> {
    try {
      // Temporarily removing filter to test basic API call
      // const filterQuery = "$filter=StaffTrainingProvider eq true";
      const response = await apiVendors(companyId);
      return response.data.value.map((vendor) => ({
        systemId: vendor.id,
        vendorCode: vendor.no,
        name: vendor.name,
        contactPerson: undefined, // Not available in the API response
        email: undefined, // Not available in the API response
        phone: undefined, // Not available in the API response
      }));
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return [];
    }
  }
}

export const trainingPlanLinesService = new TrainingPlanLinesService();
