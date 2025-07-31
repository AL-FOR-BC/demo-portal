import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import LeaveCalendar from "./LeaveCalendar";
import { useLeaveCalendar, LeaveDay } from "./hooks/useLeaveCalendar";
import { format } from "date-fns";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LeaveCalendarDemo: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLeaves, setSelectedLeaves] = useState<LeaveDay[]>([]);

  // Sample filters
  const [filters, setFilters] = useState({
    employeeId: "",
    leaveType: "",
    status: "",
  });

  const {
    leaveData,
    loading,
    error,
    statistics,
    addLeave,
    updateLeave,
    deleteLeave,
  } = useLeaveCalendar();

  // New leave form state
  const [newLeave, setNewLeave] = useState({
    employeeName: "",
    leaveType: "annual" as LeaveDay["leaveType"],
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDayClick = (date: Date, leaves: LeaveDay[]) => {
    setSelectedDate(date);
    setSelectedLeaves(leaves);
  };

  const handleLeaveClick = (leave: LeaveDay) => {
    // Handle leave click - could open edit dialog
    console.log("Leave clicked:", leave);
  };

  const handleAddLeave = () => {
    if (newLeave.employeeName && newLeave.startDate && newLeave.endDate) {
      addLeave({
        employeeId: `EMP${Date.now()}`,
        employeeName: newLeave.employeeName,
        leaveType: newLeave.leaveType,
        startDate: new Date(newLeave.startDate),
        endDate: new Date(newLeave.endDate),
        status: "pending",
        notes: newLeave.notes,
      });

      // Reset form
      setNewLeave({
        employeeName: "",
        leaveType: "annual",
        startDate: "",
        endDate: "",
        notes: "",
      });
      setShowAddDialog(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography>Loading leave calendar...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      {/* Header with Actions */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
              Leave Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and view employee leave schedules
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilterDialog(true)}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddDialog(true)}
              >
                Add Leave
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Leaves
                </Typography>
                <Typography variant="h4">{statistics.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Approved
                </Typography>
                <Typography variant="h4" color="success.main">
                  {statistics.approved}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {statistics.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Rejected
                </Typography>
                <Typography variant="h4" color="error.main">
                  {statistics.rejected}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Calendar View" />
              <Tab label="Leave Details" />
              <Tab label="Statistics" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <LeaveCalendar
              leaveData={leaveData}
              onDayClick={handleDayClick}
              onLeaveClick={handleLeaveClick}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {leaveData.map((leave) => (
                <Grid item xs={12} md={6} lg={4} key={leave.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {leave.employeeName}
                      </Typography>
                      <Chip
                        label={leave.leaveType}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(leave.startDate), "MMM d")} -{" "}
                        {format(new Date(leave.endDate), "MMM d, yyyy")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {leave.status}
                      </Typography>
                      {leave.notes && (
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontStyle: "italic" }}
                        >
                          {leave.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Leave Types Distribution
                    </Typography>
                    {Object.entries(statistics.byType).map(([type, count]) => (
                      <Box
                        key={type}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {type}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {count}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Status Overview
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">Approved</Typography>
                        <Chip
                          label={statistics.approved}
                          color="success"
                          size="small"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">Pending</Typography>
                        <Chip
                          label={statistics.pending}
                          color="warning"
                          size="small"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">Rejected</Typography>
                        <Chip
                          label={statistics.rejected}
                          color="error"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Box>

      {/* Add Leave Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Leave</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee Name"
                value={newLeave.employeeName}
                onChange={(e) =>
                  setNewLeave((prev) => ({
                    ...prev,
                    employeeName: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={newLeave.leaveType}
                  label="Leave Type"
                  onChange={(e) =>
                    setNewLeave((prev) => ({
                      ...prev,
                      leaveType: e.target.value as LeaveDay["leaveType"],
                    }))
                  }
                >
                  <MenuItem value="annual">Annual Leave</MenuItem>
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="personal">Personal Leave</MenuItem>
                  <MenuItem value="maternity">Maternity Leave</MenuItem>
                  <MenuItem value="paternity">Paternity Leave</MenuItem>
                  <MenuItem value="other">Other Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={newLeave.startDate}
                onChange={(e) =>
                  setNewLeave((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={newLeave.endDate}
                onChange={(e) =>
                  setNewLeave((prev) => ({ ...prev, endDate: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={newLeave.notes}
                onChange={(e) =>
                  setNewLeave((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLeave} variant="contained">
            Add Leave
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Leaves</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee ID"
                value={filters.employeeId}
                onChange={(e) =>
                  handleFilterChange("employeeId", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={filters.leaveType}
                  label="Leave Type"
                  onChange={(e) =>
                    handleFilterChange("leaveType", e.target.value)
                  }
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="annual">Annual Leave</MenuItem>
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="personal">Personal Leave</MenuItem>
                  <MenuItem value="maternity">Maternity Leave</MenuItem>
                  <MenuItem value="paternity">Paternity Leave</MenuItem>
                  <MenuItem value="other">Other Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFilterDialog(false)}>Cancel</Button>
          <Button
            onClick={() => setShowFilterDialog(false)}
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeaveCalendarDemo;
