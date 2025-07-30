import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import HeaderMui from "../../Components/ui/Header/HeaderMui";
import { getErrorMessage } from "../../utils/common";
import { TimeSheetsService } from "../../services/TimeSheetsService";
import TimeSheetLines from "../../Components/ui/Lines/TimeSheetLines";
import { format } from "date-fns";
import Swal from "sweetalert2";

function TimeSheetDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { email } = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [timeSheetNo, setTimeSheetNo] = useState<string>("");
  const [startingDate, setStartingDate] = useState<Date>(new Date());
  const [endingDate, setEndingDate] = useState<Date>(new Date());
  const [resourceNo, setResourceNo] = useState<string>("");
  const [resourceName, setResourceName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [viewStats, setViewStats] = useState<any>({
    quantityOpen: 0,
    quantityApproved: 0,
    quantitySubmitted: 0,
    quantityRejected: 0,
    quantity: 0,
  });
  // const [status, setStatus] = useState < string > ('');
  const status = "Open";

  const [projects, setProjects] = useState([
    { value: "JOB00020", label: "JOB00020" },
    { value: "JOB00030", label: "JOB00030" },
    { value: "JOB00010", label: "JOB00010" },
    // Add more projects as needed
  ]);
  const [documentId, setDocumentId] = useState<string>("");

  const fields = [
    [
      {
        label: "No.",
        type: "text",
        value: timeSheetNo,
        disabled: true,
        id: "timeSheetNo",
      },
      {
        label: "Resource No.",
        type: "text",
        value: resourceNo,
        disabled: true,
        id: "resourceNo",
      },
      {
        label: "Resource Name",
        type: "text",
        value: resourceName,
        disabled: true,
        id: "resourceName",
      },
      {
        label: "Description",
        type: "text",
        value: description,
        disabled: true,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setDescription(e.target.value);
          quickUpdate({ description: e.target.value });
        },
        id: "description",
      },
    ],
    [
      {
        label: "Starting Date",
        type: "date",
        value: startingDate,
        disabled: true,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setStartingDate(new Date(e.target.value));
          quickUpdate({ startingDate: e.target.value });
        },
        id: "startingDate",
      },
      {
        label: "Ending Date",
        type: "date",
        value: endingDate,
        disabled: true,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setEndingDate(new Date(e.target.value));
          quickUpdate({ endingDate: e.target.value });
        },
        id: "endingDate",
      },
    ],
  ];

  const publicHolidays = [
    { date: "2024-10-09", description: "Independence Day" },
    { date: "2024-10-20", description: "Martin Luther King Day" },
  ];
  const customStyles = `
        .weekend-cell {
            background-color: #f5f5f5;
            color: #999;
        }
        .holiday-cell {
            background-color: #fff3e0;
            color: #ff9800;
        }
        .submitted-cell {
            background-color: #f5f5f5;
            color: #666;
            pointer-events: none;
            cursor: not-allowed;
        }
    `;

  const quickUpdate = async (data) => {
    try {
      console.log(data);
      // In real implementation, call your API here
      toast.success("Updated successfully");
    } catch (error) {
      toast.error(`Error updating: ${getErrorMessage(error)}`);
    }
  };

  const handleSubmitLines = async (data) => {
    try {
      const res = await TimeSheetsService.addTimeSheetLines(companyId, data);
      if (res.status === 201) {
        populateData();
        toast.success("New line added successfully");
        return res;
      }
    } catch (error) {
      toast.error(`Error submitting line: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const handleDeleteLine = async (systemId: string) => {
    try {
      const res = await TimeSheetsService.deleteTimeSheetDetails(
        companyId,
        systemId
      );
      console.log("delete line", res);
      return true;
    } catch (error) {
      toast.error(`Error deleting line: ${getErrorMessage(error)}`);
      return false;
    }
  };

  const handleEditLine = async (data: any) => {
    try {
      // Add interface for day update type
      interface DayUpdate {
        systemId: string;
        timeSheetLineNo: string;
        date: string;
        quantity: number;
        resourceNo: string;
      }

      // Initialize array with type
      const dayUpdates: DayUpdate[] = [];

      for (let i = 1; i <= 31; i++) {
        const dayKey = `day${i}`;
        const dayData = data[dayKey];

        if (dayData) {
          dayUpdates.push({
            timeSheetLineNo: data.lineNo,
            resourceNo: resourceNo,
            systemId: dayData.systemId,
            date: dayData.date,
            quantity: dayData.value,
          });
        }
      }

      const res = await TimeSheetsService.updateTimeSheetLines(
        companyId,
        data.systemId,
        {
          // lineNo: data.lineNo
          description: data.description,
          jobNo: data.project,
          type: data.causeOfAbsenceCode,
          // timeSheetDetails: dayUpdates
        },
        ""
      );

      return { success: true, data: res.data };
    } catch (error) {
      toast.error(`Error editing line: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const [timeSheetLines, setTimeSheetLines] = useState<Array<any>>([
    {
      id: 1,
      status: "Open",
      description: "Development work",
      project: "PROJ-001",
      causeOfAbsenceCode: "",
      ...Array.from({ length: 31 }, (_, i) => ({
        [`day${i + 1}`]: 0,
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    },
  ]);
  const populateData = async () => {
    try {
      setIsLoading(true);
      if (!id) return;
      setDocumentId(id);
      const filterQuery = `$expand=timeSheetLines`;
      const res = await TimeSheetsService.getTimeSheetHeaderById(
        companyId,
        id,
        filterQuery
      );

      setTimeSheetNo(res.data.timeSheetNo);
      setStartingDate(new Date(res.data.startingDate));
      setEndingDate(new Date(res.data.endingDate));
      setResourceNo(res.data.ResourceNo);
      setResourceName(res.data.resourceName);
      setDescription(res.data.Description);
      setViewStats({
        quantityOpen: res.data.quantityOpen,
        quantityApproved: res.data.quantityApproved,
        quantitySubmitted: res.data.quantitySubmitted,
        quantityRejected: res.data.quantityRejected,
        quantity: res.data.quantity,
      });
      setTimeSheetLines(
        res.data.timeSheetLines.filter(
          (line) => line.timeSheetNo === res.data.timeSheetNo
        )
      );

      // setStatus(res.data.status);
      const filterQuery2 = `&$filter=timeSheetNo eq '${res.data.timeSheetNo}'`;
      const resTimeSheetDetail = await TimeSheetsService.getTimeSheetDetails(
        companyId,
        filterQuery2
      );

      // Create holiday lines
      const holidayLines = publicHolidays.map((holiday, index) => {
        const dayNumber = format(new Date(holiday.date), "d");
        return {
          id: `holiday-${index}`,
          systemId: "",
          status: "Closed",
          description: holiday.description,
          project: "",
          causeOfAbsenceCode: "HOLIDAY",
          editable: false,
          ...Array.from({ length: 31 }, (_, i) => ({
            [`day${i + 1}`]: i + 1 === parseInt(dayNumber) ? 8 : 0,
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        };
      });
      console.log(holidayLines);

      const projectRes = await TimeSheetsService.getJobs(companyId);
      const projectOptions = projectRes.data.value.map((e) => ({
        label: `${e.jobNo}::${e.description}`,
        value: e.jobNo,
      }));
      setProjects(projectOptions);

      const timeSheetLinesData = res.data.timeSheetLines.filter(
        (line) => line.timeSheetNo === res.data.timeSheetNo
      );
      console.log(timeSheetLinesData);
      const timeSheetLines = timeSheetLinesData.map((line) => {
        const daysObject = {};

        for (let i = 1; i <= 31; i++) {
          daysObject[`day${i}`] = 0;
        }

        // Find all details for this line number
        const lineDetails = resTimeSheetDetail.data.value.filter(
          (detail) => detail.timeSheetLineNo === line.lineNo
        );

        // Map the quantities to the corresponding days
        lineDetails.forEach((detail) => {
          const dayNumber = format(new Date(detail.date), "d");
          daysObject[`day${dayNumber}`] = {
            value: detail.quantity,
            systemId: detail.systemId, // Store the systemId for each day
            date: detail.date,
          };
        });

        return {
          id: line.lineNo,
          timeSheetNo: line.timeSheetNo,
          jobTaskNo: line.jobTaskNo,
          systemId: line.systemId,
          lineNo: line.lineNo,
          status: line.Status || "Open",
          description: line.description,
          project: line.jobNo,
          causeOfAbsenceCode: line.type,
          loe: parseFloat(line.loe).toFixed(2),
          editable: line.Status === "Submitted" ? false : true,
          ...daysObject,
        };
      });
      // setTimeSheetLines([...holidayLines, ...timeSheetLines]);
      setTimeSheetLines(timeSheetLines);
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    populateData();
  }, [id]);

  const handleReopen = async () => {
    try {
      setIsLoading(true);
      const res = await TimeSheetsService.reopenTimeSheet(companyId, {
        documentNo: timeSheetNo,
      });
      if (res.status === 200 || res.status === 204) {
        populateData();
        toast.success("Time sheet reopened successfully");
      }
    } catch (error) {
      toast.error(`Error reopening time sheet: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Check for lines with all zero hours
      // const zeroHourLines = timeSheetLines.filter((line) => {
      //   const dayValues = Array.from({ length: 31 }, (_, i) => {
      //     const day = line[`day${i + 1}`];
      //     return typeof day === "object" ? day?.value || 0 : day || 0;
      //   });
      //   return dayValues.every((value) => value === 0);
      // });

      // if (zeroHourLines.length > 0) {
      //   Swal.fire({
      //     title: "Empty TimeSheet Entries Detected",
      //     html: `
      //       <div style="text-align: left">
      //         <p><strong>The following lines have no time recorded:</strong></p>
      //         <ul style="margin-top: 10px; margin-bottom: 15px; color: #666">
      //           ${zeroHourLines
      //             .map(
      //               (line) =>
      //                 `<li style="margin-bottom: 5px">• ${
      //                   line.description || `Line ${line.lineNo}`
      //                 }</li>`
      //             )
      //             .join("")}
      //         </ul>
      //         <p style="color: #444; margin-top: 15px">
      //           Would you like to delete these empty lines?
      //         </p>
      //       </div>
      //     `,
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonText: "Yes, Delete Empty Lines",
      //     cancelButtonText: "No, I'll Review Them",
      //     confirmButtonColor: "#d33",
      //     cancelButtonColor: "#3085d6",
      //     reverseButtons: true,
      //   }).then(async (result) => {
      //     if (result.isConfirmed) {
      //       // Show loading state
      //       Swal.fire({
      //         title: "Deleting Empty Lines",
      //         html: "Please wait...",
      //         allowOutsideClick: false,
      //         didOpen: () => {
      //           Swal.showLoading();
      //         },
      //       });

      //       // Delete all empty lines
      //       try {
      //         const deletePromises = zeroHourLines.map((line) =>
      //           handleDeleteLine(line.systemId)
      //         );

      //         const results = await Promise.all(deletePromises);

      //         if (results.every((result) => result === true)) {
      //           await populateData(); // Refresh the data
      //           Swal.fire({
      //             title: "Success",
      //             text: "Empty lines have been deleted. You can now submit the timesheet.",
      //             icon: "success",
      //             confirmButtonColor: "#3085d6",
      //           });
      //         } else {
      //           throw new Error("Some lines could not be deleted");
      //         }
      //       } catch (error) {
      //         Swal.fire({
      //           title: "Error",
      //           text: "There was a problem deleting the empty lines. Please try again.",
      //           icon: "error",
      //           confirmButtonColor: "#3085d6",
      //         });
      //       }
      //     }
      //   });
      //   return;
      // }
      console.log(timeSheetLines);
      setIsLoading(true);
      Swal.fire({
        title: "Submit Time Sheet",
        text: "Are you sure you want to submit the time sheet?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, submit",
        cancelButtonText: "No, I'll Review Them",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await TimeSheetsService.submitTimeSheet(companyId, {
            documentNo: timeSheetNo,
            senderEmailAddress: email,
          });
          if (res.status === 200 || res.status === 204) {
            populateData();
            toast.success("Time sheet submitted successfully");
          }
        }
      });
    } catch (error) {
      toast.error(`Error submitting time sheet: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLineOnHoursUpdate = async (lineId, date, value, systemId) => {
    try {
      const result = await TimeSheetsService.updateTimeSheetDetails(
        companyId,
        systemId,
        {
          timeSheetLineNo: lineId,
          resourceNo: resourceNo,
          date: date,
          quantity: value,
        },
        ""
      );
      if (result.status === 200) {
        // populateData();
        const filterQuery = `$expand=timeSheetLines`;
        const res = await TimeSheetsService.getTimeSheetHeaderById(
          companyId,
          documentId,
          filterQuery
        );
        return {
          result,
          lines: res.data.timeSheetLines,
          totalHours: res.data.quantity,
        };
      }
    } catch (error) {
      // toast.error(`Failed to update line: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const handleSubmitLineHours = async (data) => {
    try {
      const result = await TimeSheetsService.postTimeSheetDetails(companyId, {
        resourceNo: resourceNo,
        ...data,
      });
      if (result.status === 201) {
        // toast.success("Line updated successfully");
        return result;
      }
    } catch (error) {
      toast.error(`Failed to update line: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <HeaderMui
        title="Time Sheet Detail"
        subtitle="Time Sheet Detail"
        breadcrumbItem="Time Sheet Detail"
        fields={fields}
        isLoading={isLoading}
        status={status}
        handleBack={() => navigate("/time-sheets")}
        handleSendApprovalRequest={() => {}}
        handleDeletePurchaseRequisition={() => {}}
        handleCancelApprovalRequest={() => {}}
        companyId={companyId}
        documentType="Time Sheet"
        requestNo={timeSheetNo}
        pageType="time-sheet"
        handleReopen={handleReopen}
        handleSubmit={handleSubmit}
        lines={
          <TimeSheetLines
            viewStats={viewStats}
            startingDate={startingDate}
            endingDate={endingDate}
            lines={timeSheetLines}
            projects={projects}
            timeSheetNo={timeSheetNo}
            resourceNo={resourceNo}
            onLineHoursSubmit={handleSubmitLineHours}
            onLineHoursUpdate={async (lineId, date, value, systemId) => {
              try {
                const response = await handleEditLineOnHoursUpdate(
                  lineId,
                  date,
                  value,
                  systemId
                );
                if (response?.result?.status === 200) {
                  ///
                  return response;
                }
              } catch (error) {
                // toast.error(`Failed to update line: ${getErrorMessage(error)}`);
                throw error;
              }
            }}
            onLineUpdate={async (updatedLine) => {
              try {
                const result = await handleEditLine(updatedLine);
                if (result.success) {
                  // toast.success('Line updated successfully');
                  // return result;
                }
              } catch (error) {
                toast.error(`Failed to update line: ${getErrorMessage(error)}`);
                throw error;
              }
            }}
            onLineDelete={async (systemId) => {
              try {
                const success = await handleDeleteLine(systemId);
                if (success) {
                  // toast.success('Line deleted successfully');
                } else {
                  throw new Error("Failed to delete line");
                }
              } catch (error) {
                toast.error(`Failed to delete line: ${getErrorMessage(error)}`);
                throw error;
              }
            }}
            onLineAdd={handleSubmitLines}
            // publicHolidays={publicHolidays}
            publicHolidays={[]}
          />
        }
      />
    </>
  );
}

export default TimeSheetDetail;
