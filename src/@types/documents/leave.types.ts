import { options } from "../common.dto";
import { ODataEntity, ODataResponse } from "./base.types";

/**
 * Defines all possible leave category types in the system
 */
export type LeaveCategory =
  | "Annual_x0020_Leave"
  | "Sick_x0020_Leave"
  | "Maternity_x0020_Leave"
  | "Paternity_x0020_Leave"
  | "Compassionate_x0020_Leave"
  | "Study_x0020_Leave"
  | "Others"
  | "Unpaid_x0020_Leave";

/**
 * Business Central Yes/No type
 */
export type BCYesNo = "Yes" | "No";

/**
 * Base interface for Leave Request data
 */
export interface LeaveRequest {
  // Employee Information
  documentNo: string;
  employeeNo: string;
  employeeName: string;
  employeeTitle: string;
  telephoneNumber: string;

  // Leave Details
  leaveAddress: string;
  leaveCategoryType: LeaveCategory;
  fromDate: string;
  toDate: string;
  noofDays: number;
  postingDescription: string;
  returnDate: string;
  delegate: string;

  // Leave Type Indicators
  annualLeaveWS: BCYesNo;
  sickLeaveWS: BCYesNo;
  maternityLeaveWS: BCYesNo;
  paternityLeaveWS: BCYesNo;
  compassionateLeaveWS: BCYesNo;
  studyLeaveWS: BCYesNo;
  othersWS: BCYesNo;
  unpaidLeaveWS: BCYesNo;
  specifyOtherLeave: string;

  // Leave Balances
  leaveDuePreviousYear: number;
  leaveDueCurrentYear: number;
  totalDue: number;
  totalDays: number;
  noOfDaysAppliedfo: number;
  balance: number;

  // Additional Settings
  leaveinLinewithRoster: boolean;
  status: string;
}

/**
 * Combines OData requirements with Leave Request data
 */
export interface LeaveRequestValue extends ODataEntity, LeaveRequest {}

/**
 * State interface for managing leave document data
 */
export interface LeaveDocumentState {
  isLoading: boolean;
  leaveRequests: LeaveRequestValue[];
}

/**
 * Initial state for leave document management
 */
export const initialLeaveDocumentState: LeaveDocumentState = {
  isLoading: false,
  leaveRequests: [],
};

/**
 * @interface LeaveFormData
 * Represents the data structure for a leave form, including details such as telephone number, delegate, leave dates, and optional leave category.
 */
export interface LeaveFormData {
  telephoneNumber: string;
  delegate: options | string;
  fromDate: string;
  toDate: string;
  leaveAddress: string;
  leaveCategoryType: options | string;
  employeeNo?: string;
  employeeName?: string;
  employeeTitle?: string;
  documentNo?: string;
  noofDays?: number;
  status?: string;
}

export interface LeaveFormUpdate extends Partial<LeaveFormData> {}

/**
 * Type for the OData response containing leave requests
 */
export type LeaveRequestResponse = ODataResponse<LeaveRequestValue>;
