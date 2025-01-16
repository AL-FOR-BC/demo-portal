import { ODataEntity, ODataResponse } from "./base.types";

/**
 * @interface EmployeeRequest
 * Employee Request Type
 */
export interface EmployeeRequest {
  AccruedLeaveDays: number;
  Address: string;
  Allergiesifany: string;
  AnnualEntitlementBanalnce: number;
  AnnualLeaveBalance: number;
  AnnualLeaveDaysEntitlement: number;
  AnnualLeaveDaysUsed: number;
  Appraiser: string;
  BirthDate: string;
  BloodGroup: string;
  ChronicAilmentsifany: string;
  CompanyEMail: string;
  CompassionateDaysUsed: number;
  CompassionateLeaveBalance: number;
  CompationateLeaveEntitlement: number;
  CountryofOrigin: string;
  CountyofResidence: string;
  DistrictofOrigin: string;
  DistrictofResidence: string;
  DrivingLicenseClass: string;
  DrivingLicenseNo: string;
  DrivingPermitExpiryDate: string;
  EHubAdministrator: boolean;
  Email: string;
  EmploymentDate: string;
  Extension: string;
  FathersName: string;
  FathersStatus: string;
  FinanceManager: string;
  FirstName: string;
  Gender: string;
  GlobalDimension1Code: string;
  GlobalDimension2Code: string;
  HRManager: string;
  ICTManager: string;
  InactiveDate: string;
  JobTitle: string;
  LastName: string;
  MaternityDaysUsed: number;
  MaternityLeaveEntitilement: number;
  MiddleName: string;
  MobilePhoneNo: string;
  MothersName: string;
  MothersStatus: string;
  Nationality: string;
  No: string;
  Org_Unit: string;
  ParishofResidence: string;
  PaternityDaysUsed: number;
  PaternityLeaveEntitlement: number;
  PersonalDoctor: string;
  PhoneNo: string;
  Position: string;
  Religion: string;
  ResidentialArea: string;
  SickLeaveBalance: number;
  SickLeaveDaysused: number;
  SickLeaveEntitilement: number;
  SocialSecurityNo: string;
  Status: string;
  StudyLeaveBalance: number;
  StudyLeaveDaysUsed: number;
  StudyLeaveEntitlement: number;
  SubCountryofOrigin: string;
  SystemId: string;
  TerminationDate: string;
  VillageofOrigin: string;
  VillageofResidence: string;
  maternityLeaveBalance: number;
  paternityLeaveBalance: number;
}

export interface EmployeeRequestValue extends ODataEntity, EmployeeRequest {}

export type EmployeeRequestResponse = ODataResponse<EmployeeRequestValue>;
