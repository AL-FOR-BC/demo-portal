import { useState, useEffect, useMemo } from "react";
import { addDays,  } from "date-fns";

// Types for leave data
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
}

export interface LeaveCalendarFilters {
  employeeId?: string;
  leaveType?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const useLeaveCalendar = (filters?: LeaveCalendarFilters) => {
  const [leaveData, setLeaveData] = useState<LeaveDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data for demonstration
  const sampleLeaveData: LeaveDay[] = useMemo(
    () => [
      {
        id: "1",
        employeeId: "EMP001",
        employeeName: "John Doe",
        leaveType: "annual",
        startDate: addDays(new Date(), 5),
        endDate: addDays(new Date(), 7),
        status: "approved",
        notes: "Summer vacation",
      },
      {
        id: "2",
        employeeId: "EMP002",
        employeeName: "Jane Smith",
        leaveType: "sick",
        startDate: new Date(),
        endDate: addDays(new Date(), 2),
        status: "approved",
        notes: "Medical appointment",
      },
      {
        id: "3",
        employeeId: "EMP003",
        employeeName: "Mike Johnson",
        leaveType: "personal",
        startDate: addDays(new Date(), 10),
        endDate: addDays(new Date(), 10),
        status: "pending",
        notes: "Family event",
      },
      {
        id: "4",
        employeeId: "EMP004",
        employeeName: "Sarah Wilson",
        leaveType: "maternity",
        startDate: addDays(new Date(), 30),
        endDate: addDays(new Date(), 90),
        status: "approved",
        notes: "Maternity leave",
      },
      {
        id: "5",
        employeeId: "EMP005",
        employeeName: "David Brown",
        leaveType: "annual",
        startDate: addDays(new Date(), 15),
        endDate: addDays(new Date(), 19),
        status: "approved",
        notes: "Holiday trip",
      },
      {
        id: "6",
        employeeId: "EMP001",
        employeeName: "John Doe",
        leaveType: "sick",
        startDate: addDays(new Date(), 25),
        endDate: addDays(new Date(), 26),
        status: "pending",
        notes: "Dental appointment",
      },
      {
        id: "7",
        employeeId: "EMP006",
        employeeName: "Lisa Davis",
        leaveType: "paternity",
        startDate: addDays(new Date(), 45),
        endDate: addDays(new Date(), 52),
        status: "approved",
        notes: "Paternity leave",
      },
      {
        id: "8",
        employeeId: "EMP007",
        employeeName: "Tom Anderson",
        leaveType: "other",
        startDate: addDays(new Date(), 60),
        endDate: addDays(new Date(), 60),
        status: "approved",
        notes: "Training course",
      },
    ],
    []
  );

  // Filter leave data based on provided filters
  const filteredLeaveData = useMemo(() => {
    let filtered = [...leaveData];

    if (filters?.employeeId) {
      filtered = filtered.filter(
        (leave) => leave.employeeId === filters.employeeId
      );
    }

    if (filters?.leaveType) {
      filtered = filtered.filter(
        (leave) => leave.leaveType === filters.leaveType
      );
    }

    if (filters?.status) {
      filtered = filtered.filter((leave) => leave.status === filters.status);
    }

    if (filters?.dateRange) {
      filtered = filtered.filter((leave) => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        const filterStart = filters.dateRange!.start;
        const filterEnd = filters.dateRange!.end;

        return leaveStart <= filterEnd && leaveEnd >= filterStart;
      });
    }

    return filtered;
  }, [leaveData, filters]);

  // Get statistics
  const statistics = useMemo(() => {
    const total = filteredLeaveData.length;
    const approved = filteredLeaveData.filter(
      (leave) => leave.status === "approved"
    ).length;
    const pending = filteredLeaveData.filter(
      (leave) => leave.status === "pending"
    ).length;
    const rejected = filteredLeaveData.filter(
      (leave) => leave.status === "rejected"
    ).length;

    const byType = filteredLeaveData.reduce((acc, leave) => {
      acc[leave.leaveType] = (acc[leave.leaveType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      approved,
      pending,
      rejected,
      byType,
    };
  }, [filteredLeaveData]);

  // Get leaves for a specific date
  const getLeavesForDate = (date: Date): LeaveDay[] => {
    return filteredLeaveData.filter((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return date >= start && date <= end;
    });
  };

  // Get leaves for a date range
  const getLeavesForDateRange = (
    startDate: Date,
    endDate: Date
  ): LeaveDay[] => {
    return filteredLeaveData.filter((leave) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return leaveStart <= endDate && leaveEnd >= startDate;
    });
  };

  // Add new leave
  const addLeave = (leave: Omit<LeaveDay, "id">) => {
    const newLeave: LeaveDay = {
      ...leave,
      id: Date.now().toString(),
    };
    setLeaveData((prev) => [...prev, newLeave]);
  };

  // Update leave
  const updateLeave = (id: string, updates: Partial<LeaveDay>) => {
    setLeaveData((prev) =>
      prev.map((leave) => (leave.id === id ? { ...leave, ...updates } : leave))
    );
  };

  // Delete leave
  const deleteLeave = (id: string) => {
    setLeaveData((prev) => prev.filter((leave) => leave.id !== id));
  };

  // Load sample data (simulate API call)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLeaveData(sampleLeaveData);
        setError(null);
      } catch (err) {
        setError("Failed to load leave data");
        console.error("Error loading leave data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sampleLeaveData]);

  return {
    leaveData: filteredLeaveData,
    loading,
    error,
    statistics,
    getLeavesForDate,
    getLeavesForDateRange,
    addLeave,
    updateLeave,
    deleteLeave,
  };
};
