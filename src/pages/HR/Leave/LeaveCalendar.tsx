import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  Person,
  CalendarMonth,
} from "@mui/icons-material";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import BreadCrumbs from "../../../Components/BreadCrumbs";
import { useSettings } from "../../../contexts/SettingsContext";

// Types for leave data
interface LeaveDay {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other';
  startDate: Date;
  endDate: Date;
  status: 'approved' | 'pending' | 'rejected';
  notes?: string;
}

interface LeaveCalendarProps {
  leaveData?: LeaveDay[];
  onDayClick?: (date: Date, leaves: LeaveDay[]) => void;
  onLeaveClick?: (leave: LeaveDay) => void;
}

// Leave type configurations
const LEAVE_TYPES = {
  annual: { label: 'Annual Leave', color: '#4caf50', bgColor: '#e8f5e8' },
  sick: { label: 'Sick Leave', color: '#f44336', bgColor: '#ffebee' },
  personal: { label: 'Personal Leave', color: '#ff9800', bgColor: '#fff3e0' },
  maternity: { label: 'Maternity Leave', color: '#9c27b0', bgColor: '#f3e5f5' },
  paternity: { label: 'Paternity Leave', color: '#2196f3', bgColor: '#e3f2fd' },
  other: { label: 'Other Leave', color: '#607d8b', bgColor: '#eceff1' },
};

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  leaveData = [],
  onDayClick,
  onLeaveClick,
}) => {
  const { settings } = useSettings();
  const { themeColor } = settings;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Get leaves for a specific date
  const getLeavesForDate = (date: Date): LeaveDay[] => {
    return leaveData.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return date >= start && date <= end;
    });
  };

  // Get leaves for current month
  const monthLeaves = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return leaveData.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return (start <= monthEnd && end >= monthStart);
    });
  }, [leaveData, currentDate]);

  // Navigation handlers
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Day click handler
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const leaves = getLeavesForDate(date);
    onDayClick?.(date, leaves);
  };

  // Leave click handler
  const handleLeaveClick = (leave: LeaveDay, event: React.MouseEvent) => {
    event.stopPropagation();
    onLeaveClick?.(leave);
  };

  // Get leave indicator for a day
  const getLeaveIndicator = (date: Date) => {
    const leaves = getLeavesForDate(date);
    if (leaves.length === 0) return null;

    const approvedLeaves = leaves.filter(leave => leave.status === 'approved');
    const pendingLeaves = leaves.filter(leave => leave.status === 'pending');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
        {approvedLeaves.slice(0, 2).map((leave, _) => (
          <Box
            key={leave.id}
            sx={{
              height: 4,
              borderRadius: 1,
              backgroundColor: LEAVE_TYPES[leave.leaveType].color,
              cursor: 'pointer',
            }}
            onClick={(e) => handleLeaveClick(leave, e)}
          />
        ))}
        {approvedLeaves.length > 2 && (
          <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
            +{approvedLeaves.length - 2} more
          </Typography>
        )}
        {pendingLeaves.length > 0 && (
          <Box
            sx={{
              height: 4,
              borderRadius: 1,
              backgroundColor: '#ff9800',
              opacity: 0.6,
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <>
      {/* Header */}
      <div style={{ padding: "20px 24px" }}>
        <Typography variant="h6" sx={{ mb: 3, color: "#666" }}>
          Leave Calendar
        </Typography>
        <BreadCrumbs
          title="Leave Calendar"
          subTitle="View and manage employee leave schedules"
          breadcrumbItem="Leave Calendar"
        />
      </div>

      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        {/* Calendar Navigation */}
        <Grid item xs={12}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton onClick={goToPreviousMonth} size="small">
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: themeColor }}>
                    {format(currentDate, 'MMMM yyyy')}
                  </Typography>
                  <IconButton onClick={goToNextMonth} size="small">
                    <ChevronRight />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="Go to Today">
                    <IconButton onClick={goToToday} size="small">
                      <Today />
                    </IconButton>
                  </Tooltip>
                  <Chip
                    icon={<Event />}
                    label={`${monthLeaves.length} Leave(s) this month`}
                    size="small"
                    sx={{ backgroundColor: themeColor, color: 'white' }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Grid */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              {/* Calendar Header */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa'
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Box
                    key={day}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      fontWeight: 600,
                      color: '#666',
                      fontSize: '0.875rem',
                      borderRight: '1px solid #e0e0e0',
                      '&:last-child': { borderRight: 'none' }
                    }}
                  >
                    {day}
                  </Box>
                ))}
              </Box>

              {/* Calendar Days */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)',
                minHeight: '500px'
              }}>
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const leaves = getLeavesForDate(day);
                  const hasLeaves = leaves.length > 0;

                  return (
                    <Box
                      key={index}
                      onClick={() => handleDayClick(day)}
                      sx={{
                        p: 1,
                        minHeight: '80px',
                        border: '1px solid #e0e0e0',
                        borderLeft: 'none',
                        borderTop: 'none',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? `${themeColor}15` : 'transparent',
                        '&:hover': {
                          backgroundColor: isSelected ? `${themeColor}25` : '#f5f5f5',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      {/* Date Number */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isToday ? 700 : 400,
                          color: isCurrentMonth 
                            ? (isToday ? themeColor : '#333')
                            : '#ccc',
                          fontSize: '0.875rem',
                          mb: 0.5,
                        }}
                      >
                        {format(day, 'd')}
                      </Typography>

                      {/* Leave Indicators */}
                      {hasLeaves && getLeaveIndicator(day)}

                      {/* Today indicator */}
                      {isToday && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: themeColor,
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Leave Details */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth sx={{ color: themeColor }} />
                Leave Details
              </Typography>
              
              {selectedDate ? (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  
                  {getLeavesForDate(selectedDate).length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {getLeavesForDate(selectedDate).map(leave => (
                        <Paper
                          key={leave.id}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: `1px solid ${LEAVE_TYPES[leave.leaveType].color}20`,
                            backgroundColor: LEAVE_TYPES[leave.leaveType].bgColor,
                            '&:hover': {
                              backgroundColor: LEAVE_TYPES[leave.leaveType].color + '10',
                            },
                          }}
                          onClick={() => onLeaveClick?.(leave)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Person sx={{ fontSize: '1rem', color: LEAVE_TYPES[leave.leaveType].color }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {leave.employeeName}
                            </Typography>
                          </Box>
                          <Chip
                            label={LEAVE_TYPES[leave.leaveType].label}
                            size="small"
                            sx={{
                              backgroundColor: LEAVE_TYPES[leave.leaveType].color,
                              color: 'white',
                              fontSize: '0.7rem',
                            }}
                          />
                          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                            {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                          </Typography>
                          {leave.notes && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                              {leave.notes}
                            </Typography>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No leave scheduled for this date.
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Click on any date to view leave details.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Leave Type Legend */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Leave Types
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(LEAVE_TYPES).map(([key, config]) => (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 1,
                        backgroundColor: config.color,
                      }}
                    />
                    <Typography variant="body2">{config.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default LeaveCalendar; 