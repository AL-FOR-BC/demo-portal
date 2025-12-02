import { LeavePlanLine } from "../@types/leave.dto";

// Types for leave data in calendar
export interface LeaveDay {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType:
    | "annual"
    | "sick"
    | "personal"
    | "maternity"
    | "paternity"
    | "other";
  startDate: Date;
  endDate: Date;
  status: "approved" | "pending" | "rejected";
  notes?: string;
  quantity?: number;
  description?: string;
}

/**
 * Maps API leave type to calendar leave type
 * @param apiLeaveType - Leave type from API (e.g., "ANNUAL", "SICK")
 * @returns Mapped leave type for calendar component
 */
export function mapLeaveType(
  apiLeaveType: string
): LeaveDay["leaveType"] {
  const normalized = apiLeaveType?.toUpperCase().trim();
  
  const leaveTypeMap: Record<string, LeaveDay["leaveType"]> = {
    ANNUAL: "annual",
    SICK: "sick",
    PERSONAL: "personal",
    MATERNITY: "maternity",
    PATERNITY: "paternity",
    COMPASSIONATE: "other",
    STUDY: "other",
    UNPAID: "other",
  };

  return leaveTypeMap[normalized] || "other";
}

/**
 * Transforms LeavePlanLine array to LeaveDay array for calendar display
 * @param leavePlanLines - Array of leave plan lines from API
 * @returns Array of LeaveDay objects for calendar
 */
export function transformLeavePlanLinesToLeaveDays(
  leavePlanLines: LeavePlanLine[]
): LeaveDay[] {
  return leavePlanLines.map((line) => {
    // Use SystemId as unique identifier, fallback to lineNo if SystemId is not available
    const id = line.SystemId || `line-${line.lineNo}`;
    
    // Extract employee ID from employeeName if possible, or use a generated one
    // This is a fallback since employeeNo is not in LeavePlanLine
    const employeeId = `EMP-${line.lineNo}`;

    return {
      id,
      employeeId,
      employeeName: line.employeeName || "Unknown Employee",
      leaveType: mapLeaveType(line.leaveType),
      startDate: new Date(line.startDate),
      endDate: new Date(line.endDate),
      status: "approved" as const, // Leave plans are typically approved
      notes: line.description,
      quantity: line.quantity,
      description: line.description,
    };
  });
}



