import { LeavePlanLine } from "../@types/leave.dto";

export type LeaveStatus = "approved" | "pending" | "rejected" | "cancelled" | "draft";

export type LeaveType =
  | "annual"
  | "sick"
  | "personal"
  | "maternity"
  | "paternity"
  | "other";

export interface LeaveDay {
  id: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  employeeName: string;
  quantity?: number;
  description?: string;
  notes?: string;
  status?: LeaveStatus;
}

const normalizeLeaveType = (leaveType: string | undefined | null): LeaveType => {
  const normalized = (leaveType || "").toLowerCase();

  if (normalized.includes("annual")) return "annual";
  if (normalized.includes("sick")) return "sick";
  if (normalized.includes("personal")) return "personal";
  if (normalized.includes("maternity")) return "maternity";
  if (normalized.includes("paternity")) return "paternity";

  return "other";
};

const getLineSystemId = (line: LeavePlanLine): string => {
  const systemId = (line as unknown as { SystemId?: string; systemId?: string }).SystemId
    ?? (line as unknown as { SystemId?: string; systemId?: string }).systemId;

  if (systemId && systemId.trim()) {
    return systemId;
  }

  const documentNo = (line as unknown as { documentNo?: string; documentNo_?: string }).documentNo;
  return `${documentNo ?? "leave-line"}-${line.lineNo}`;
};

export const transformLeavePlanLinesToLeaveDays = (
  lines: LeavePlanLine[]
): LeaveDay[] => {
  return (lines || [])
    .filter((line) => Boolean(line?.startDate && line?.endDate))
    .map((line) => ({
      id: getLineSystemId(line),
      startDate: line.startDate,
      endDate: line.endDate,
      leaveType: normalizeLeaveType(line.leaveType),
      employeeName: line.employeeName ?? "Unknown",
      quantity: line.quantity,
      description: line.description,
      status: "approved",
    }))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
};
