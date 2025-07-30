import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { options } from "../../../@types/common.dto";
import { paService } from "../../../services/PaServices";
import { formatDate, getErrorMessage } from "../../../utils/common";
import { apiEmployees } from "../../../services/CommonServices";
import Lines from "../../../Components/ui/Lines/Lines";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { PA, PALine } from "../../../@types/pa.dto";

function ApprovePA() {
  const navigate = useNavigate();
  const { documentNo } = useParams();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [paNo, setPaNo] = useState("");
  const [status, setStatus] = useState("");
  const [postingDate, setPostingDate] = useState<Date>();
  const [selectedAppraiser, setSelectedAppraiser] = useState<options[]>([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [appraisalPeriod, setAppraisalPeriod] = useState("");
  const [performanceYear, setPerformanceYear] = useState("");
  const [appraisalType, setAppraisalType] = useState("");
  const [stage, setStage] = useState("");
  const [paLines, setPaLines] = useState<PALine[]>([]);

  const fields = [
    [
      {
        label: "Document No",
        type: "text",
        value: paNo,
        disabled: true,
        id: "paNo",
      },
      {
        label: "Employee No",
        type: "text",
        value: employeeNo,
        disabled: true,
        id: "employeeNo",
      },
      {
        label: "Employee Name",
        type: "text",
        value: employeeName,
        disabled: true,
        id: "employeeName",
      },
      {
        label: "Posting Date",
        type: "input",
        value: postingDate ? formatDate(postingDate.toString()) : "",
        disabled: true,
        id: "postingDate",
      },
      {
        label: "Status",
        type: "text",
        value: status,
        disabled: true,
        id: "docStatus",
      },
      {
        label: "Appraiser",
        type: "text",
        value: selectedAppraiser[0]?.label || "",
        disabled: true,
        id: "appraiser",
      },
    ],
    [
      {
        label: "Appraisal Period",
        type: "text",
        value: appraisalPeriod,
        disabled: true,
        id: "appraisalPeriod",
      },
      {
        label: "Performance Year",
        type: "text",
        value: performanceYear,
        disabled: true,
        id: "performanceYear",
      },
      {
        label: "Appraisal Type",
        type: "text",
        value: appraisalType,
        disabled: true,
        id: "appraisalType",
      },
      {
        label: "Stage",
        type: "text",
        value: stage,
        disabled: true,
        id: "stage",
      },
    ],
  ];

  const columns = [
    {
      dataField: "strategicObjective",
      text: "Strategic Objective",
      sort: true,
    },
    {
      dataField: "individualObjective",
      text: "Individual Objective",
      sort: true,
    },
    {
      dataField: "initiative",
      text: "Initiative",
      sort: true,
    },
    {
      dataField: "measures",
      text: "Measures",
      sort: true,
    },
    {
      dataField: "targetDate",
      text: "Target Date",
      sort: true,
      formatter: (cell: string) => (cell ? formatDate(cell) : ""),
    },
    {
      dataField: "rating",
      text: "Rating",
      sort: true,
    },
  ];

  const populateData = async () => {
    setIsLoading(true);
    try {
      if (documentNo) {
        const filterQuery = `$expand=paLines&$filter=no eq '${documentNo}'`;
        const res = await paService.getPAS(companyId, filterQuery);
        console.log("res", res);
        if (res && res.length > 0) {
          const data = res[0] as PA;
          setPaNo(data.no);
          setPostingDate(
            data.postingDate ? new Date(data.postingDate) : undefined
          );
          setStatus(data.status);
          setEmployeeNo(data.employeeNo);
          setEmployeeName(data.employeeName);
          setAppraisalPeriod(data.appraisalPeriod);
          setPerformanceYear(data.performanceYear?.toString() || "");
          setAppraisalType(data.appraisalType);
          setStage(data.stage);
          setPaLines(data.paLines || []);

          // Get appraiser info
          const resEmployee = await apiEmployees(companyId);
          const appraiser = resEmployee.data.value.find(
            (e) => e.No === data.appraiser
          );
          if (appraiser) {
            setSelectedAppraiser([
              {
                label: `${appraiser.No}::${appraiser.LastName}-${appraiser.FirstName}`,
                value: appraiser.No,
              },
            ]);
          }
        }
      }
    } catch (error) {
      toast.error(`Error fetching PA: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    populateData();
  }, [documentNo, companyId]);

  return (
    <HeaderMui
      title="PA Approval"
      subtitle="Performance Appraisal Approval"
      breadcrumbItem="PA Approval"
      fields={fields}
      isLoading={isLoading}
      handleBack={() => navigate("/approvals")}
      pageType="approval"
      status={status}
      companyId={companyId}
      documentType="Performance Appraisal"
      requestNo={paNo}
      lines={
        <Lines
          title="PA Lines"
          subTitle="Performance Appraisal Lines"
          breadcrumbItem="PA Lines"
          data={paLines.map((line) => ({
            ...line,
            documentType: "Performance Appraisal",
          }))}
          columns={columns}
          noDataMessage="No PA Lines found"
          status={status}
          modalFields={[]}
          addLink={""}
          addLabel={""}
          iconClassName="fa fa-file-text"
          handleSubmitLines={() => {}}
          handleSubmitUpdatedLine={() => {}}
          clearLineFields={() => {}}
          handleValidateHeaderFields={() => true}
        />
      }
    />
  );
}

export default ApprovePA;
