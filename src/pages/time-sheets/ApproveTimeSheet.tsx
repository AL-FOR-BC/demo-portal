import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import HeaderMui from "../../Components/ui/Header/HeaderMui";
import { getErrorMessage } from "../../utils/common";
import { TimeSheetsService } from "../../services/TimeSheetsService";
import TimeSheetLines from "../../Components/ui/Lines/TimeSheetLines";
import { format } from "date-fns";

function ApprovalTimeSheet() {
  // Keep the same state and variables as TimeSheetDetails
  const navigate = useNavigate();
  const { id } = useParams();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [isLoading, setIsLoading] = useState(false);

  // Form states (same as TimeSheetDetails)
  const [timeSheetNo, setTimeSheetNo] = useState<string>("");
  const [startingDate, setStartingDate] = useState<Date>(new Date());
  const [endingDate, setEndingDate] = useState<Date>(new Date());
  const [resourceNo, setResourceNo] = useState<string>("");
  const [resourceName, setResourceName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [projects, setProjects] = useState([]);
  const [timeSheetLines, setTimeSheetLines] = useState<Array<any>>([]);

  // Define fields with all inputs disabled
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
        id: "description",
      },
    ],
    [
      {
        label: "Starting Date",
        type: "text",
        value: startingDate,
        disabled: true,
        id: "startingDate",
      },
        {
        label: "Ending Date",
        type: "text",
        value: endingDate,
        disabled: true,
        id: "endingDate",
      },
    ],
  ];

  // Populate data function (same as TimeSheetDetails)
  const populateData = async () => {
    try {
      setIsLoading(true);
      if (!id) return;
      const filterQuery1 = `$filter=timeSheetNo eq '${id}'`;

      const resHeader = await TimeSheetsService.getTimeSheetHeader(
        companyId,
        filterQuery1
      );
      if (resHeader.data.value.length > 0) {
        const systemId = resHeader.data.value[0].systemId;
        const filterQuery = `$expand=timeSheetLines`;
        const res = await TimeSheetsService.getTimeSheetHeaderById(
          companyId,
          systemId,
          filterQuery
        );
        setTimeSheetNo(res.data.timeSheetNo);
        setStartingDate(res.data.startingDate);
        setEndingDate(res.data.endingDate);
        setResourceNo(res.data.ResourceNo);
        setResourceName(res.data.resourceName);
        setDescription(res.data.Description);
        // setDocumentType(res.data.documentType);

        const filterQuery2 = `&$filter=timeSheetNo eq '${res.data.timeSheetNo}'`;
        const resTimeSheetDetail = await TimeSheetsService.getTimeSheetDetails(
          companyId,
          filterQuery2
        );

        const projectRes = await TimeSheetsService.getJobs(companyId);
        const projectOptions = projectRes.data.value.map((e) => ({
          label: `${e.jobNo}::${e.description}`,
          value: e.jobNo,
        }));
        setProjects(projectOptions);

        // Map timesheet lines (same as TimeSheetDetails)
        const timeSheetLinesData = res.data.timeSheetLines
          .filter((line) => line.timeSheetNo === res.data.timeSheetNo)
          .map((line) => {
            const daysObject = {};
            for (let i = 1; i <= 31; i++) {
              daysObject[`day${i}`] = 0;
            }

            const lineDetails = resTimeSheetDetail.data.value.filter(
              (detail) => detail.timeSheetLineNo === line.lineNo
            );

            lineDetails.forEach((detail) => {
              const dayNumber = format(new Date(detail.date), "d");
              daysObject[`day${dayNumber}`] = {
                value: detail.quantity,
                systemId: detail.systemId,
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
              editable: false, // Force all lines to be non-editable
              ...daysObject,
            };
          });

        setTimeSheetLines(timeSheetLinesData);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    populateData();
  }, [id]);

  

  return (
    <HeaderMui
      title="Time Sheet Approval"
      subtitle="Time Sheet Approval"
      breadcrumbItem="Time Sheet Approval"
      fields={fields}
      isLoading={isLoading}
      handleBack={() => navigate("/time-sheets")}
      companyId={companyId}
      documentType={"Time Sheets"}
      requestNo={timeSheetNo}
      pageType="approval"
    //   handleApprove={handleApprove}
    //   handleReject={handleReject}
      lines={
        <TimeSheetLines
          startingDate={startingDate}
          endingDate={endingDate}
          lines={timeSheetLines}
          projects={projects}
          timeSheetNo={timeSheetNo}
          onLineHoursSubmit={() => Promise.resolve()} // Empty function
          onLineHoursUpdate={() => Promise.resolve()} // Empty function
          onLineUpdate={() => Promise.resolve()} // Empty function
          onLineDelete={() => Promise.resolve()} // Empty function
          onLineAdd={() => Promise.resolve()} // Empty function
          publicHolidays={[]}
          isApprovalMode={true} // Add this prop to TimeSheetLines
        />
      }
    />
  );
}

export default ApprovalTimeSheet;
