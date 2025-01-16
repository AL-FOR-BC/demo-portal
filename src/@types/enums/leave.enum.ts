/**
 * @enum LeaveCategory
 * Enum for Leave Categories.
 * The values maintain the BC space encoding ('_x0020_') for API compatibility.
 */
export enum LeaveCategory {
  ANNUAL = "Annual_x0020_Leave",
  SICK = "Sick_x0020_Leave",
  MATERNITY = "Maternity_x0020_Leave",
  PATERNITY = "Paternity_x0020_Leave",
  COMPASSIONATE = "Compassionate_x0020_Leave",
  STUDY = "Study_x0020_Leave",
  OTHERS = "Others",
  Hospitalization = "Hospitalization",
  //   UNPAID = "Unpaid_x0020_Leave",
}

export const leaveCategoryLabels: Record<LeaveCategory, string> = {
  [LeaveCategory.ANNUAL]: "Annual Leave",
  [LeaveCategory.SICK]: "Sick Leave",
  [LeaveCategory.MATERNITY]: "Maternity Leave",
  [LeaveCategory.PATERNITY]: "Paternity Leave",
  [LeaveCategory.COMPASSIONATE]: "Compassionate Leave",
  [LeaveCategory.STUDY]: "Study Leave",
  [LeaveCategory.OTHERS]: "Others",
  [LeaveCategory.Hospitalization]: "Hospitalization",
};
