import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Calendar from "rc-year-calendar";
import BreadCrumbs from "../../../Components/BreadCrumbs";
// import { useLeaveCalendar } from '../LeaveCalendarContext';
// import { formatDate } from '../utils';

const LeaveCalendarView: React.FC = () => {
  //   const { leaveTaken, toggleModal, setLvDetails } = useLeaveCalendar();

  return (
    <>
      <div style={{ padding: "20px 24px" }}>
        <Typography variant="h6" sx={{ mb: 3, color: "#666" }}>
          Leave Calendar
        </Typography>
        <BreadCrumbs
          title="Leave Calendar"
          subTitle="Leave Calendar"
          breadcrumbItem="Leave Calendar"
        />
      </div>

      <Card
        sx={{
          mx: 3,
          mb: 2,
          bgcolor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "#555",
            }}
          >
            Click On any Date to View Details
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          mx: 3,
          mb: 3,
          bgcolor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Calendar
            style="background"
            enableRangeSelection={true}
            enableContextMenu={true}
            displayWeekNumber={true}
            roundRangeLimits={true}
            alwaysHalfDay={true}
            onDayClick={(e) => {
              // toggleModal();
              console.log("e", e);
              // setLvDetails(e.events);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default LeaveCalendarView;
