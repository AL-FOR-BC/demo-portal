import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { options } from "../../../@types/common.dto";
import { ipaService } from "../../../services/IpaSerivces";
import { formatDate, getErrorMessage } from "../../../utils/common";
import { apiEmployees } from "../../../services/CommonServices";
import Lines from "../../../Components/ui/Lines/Lines";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { IPA, IPALine } from "../../../@types/ipa.dto";

function ApproveIPA() {
  const navigate = useNavigate();
  const { documentNo } = useParams();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [ipaNo, setIpaNo] = useState("");
  const [status, setStatus] = useState("");
  const [postingDate, setPostingDate] = useState<Date>();
  const [selectedAppraiser, setSelectedAppraiser] = useState<options[]>([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [appraisalPeriod, setAppraisalPeriod] = useState("");
  const [performanceYear, setPerformanceYear] = useState("");
  const [convertToAppraisal, setConvertToAppraisal] = useState("");
  const [performanceType, setPerformanceType] = useState("");
  const [stage, setStage] = useState("");
  const [timeInPresentPosition, setTimeInPresentPosition] = useState("");
  const [lengthOfService, setLengthOfService] = useState("");
  const [ipaLines, setIpaLines] = useState<IPALine[]>([]);

  const fields = [
    [
      {
        label: "IPA No",
        type: "text",
        value: ipaNo,
        disabled: true,
        id: "ipaNo",
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
      {
        label: "Time in Present Position",
        type: "text",
        value: timeInPresentPosition,
        disabled: true,
        id: "timeInPresentPosition",
      },
      {
        label: "Length of Service",
        type: "text",
        value: lengthOfService || "",
        disabled: true,
        id: "lengthOfService",
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
        label: "Convert to Appraisal",
        type: "text",
        value: convertToAppraisal,
        disabled: true,
        id: "convertToAppraisal",
      },
      {
        label: "Performance Type",
        type: "text",
        value: performanceType,
        disabled: true,
        id: "performanceType",
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
      dataField: "jobObjective",
      text: "Job Objective",
      sort: true,
    },
    {
      dataField: "keyPerformanceIndicators",
      text: "Key Performance Indicator(s)",
      sort: true,
    },
    {
      dataField: "deliverables",
      text: "Measures/Deliverables",
      sort: true,
    },
    {
      dataField: "byWhichTargetDate",
      text: "By which Target Date?",
      sort: true,
      formatter: (cell: string) => (cell ? formatDate(cell) : ""),
    },
  ];

  const populateData = async () => {
    setIsLoading(true);
    try {
      if (documentNo) {
        const filterQuery = `$expand=ipaLines&$filter=no eq '${documentNo}'`;
        const res = await ipaService.getIPAS(companyId, filterQuery);
        console.log("res", res);
        if (res && res.length > 0) {
          const data = res[0] as IPA;
          setIpaNo(data.no);
          setPostingDate(
            data.postingDate ? new Date(data.postingDate) : undefined
          );
          setStatus(data.status);
          setEmployeeNo(data.employeeNo);
          setEmployeeName(data.employeeName);
          setAppraisalPeriod(data.appraisalPeriod);
          setPerformanceYear(data.performanceYear?.toString() || "");
          setConvertToAppraisal(data.convertToAppraisal);
          setPerformanceType(data.performanceType);
          setStage(data.stage);
          setTimeInPresentPosition(data.timeInPresentPosition);
          setLengthOfService(data.lengthOfService);
          setIpaLines(data.ipaLines || []);

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
      toast.error(`Error fetching IPA: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    populateData();
  }, [documentNo, companyId]);

  return (
    <HeaderMui
      title="IPA Approval"
      subtitle="Individual Performance Agreement Approval"
      breadcrumbItem="IPA Approval"
      fields={fields}
      isLoading={isLoading}
      handleBack={() => navigate("/approvals")}
      pageType="approval"
      status={status}
      companyId={companyId}
      documentType="Individual Performance Agreement"
      requestNo={ipaNo}
      lines={
        <Lines
          title="IPA Lines"
          subTitle="Individual Performance Agreement Lines"
          breadcrumbItem="IPA Lines"
          data={ipaLines.map((line) => ({
            ...line,
            documentType: "Individual Performance Appraisal",
          }))}
          columns={columns}
          noDataMessage="No IPA Lines found"
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

export default ApproveIPA;
