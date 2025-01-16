import { useNavigate, useParams } from "react-router-dom";
// import { useAppSelector } from "../../store/hook";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { options } from "../../../@types/common.dto";
import {
  apiLeavePlanDetail,
  apiLeavePlans,
} from "../../../services/LeaveServices";
import { formatDate, getErrorMessage } from "../../../utils/common";
import { apiEmployees } from "../../../services/CommonServices";
import Lines from "../../../Components/ui/Lines/Lines";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
// import { formatDate, getErrorMessage } from "../../utils/common";
// import HeaderMui from "../../Components/ui/Header/HeaderMui";
// import Lines from "../../Components/ui/Lines/Lines";
// import { apiEmployees } from "../../services/CommonServices";
// import { apiLeavePlanDetail } from "../../services/LeaveServices";
// import { options } from "../../@types/common.dto";

function ApproveLeavePlan() {
  const navigate = useNavigate();
  const { documentNo } = useParams();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [leavePlanNo, setLeavePlanNo] = useState("");
  const [status, setStatus] = useState("");
  const [postingDate, setPostingDate] = useState<Date>();
  const [selectedDelegatee, setSelectedDelegatee] = useState<options[]>([]);
  const [requestorName, setRequestorName] = useState("");
  const [requestorNo, setRequestorNo] = useState("");
  const [leavePlanLines, setLeavePlanLines] = useState<any[]>([]);

  const fields = [
    [
      {
        label: "Leave Plan No",
        type: "text",
        value: leavePlanNo,
        disabled: true,
        id: "leavePlanNo",
      },
      {
        label: "Requestor No",
        type: "text",
        value: requestorNo,
        disabled: true,
        id: "requestorNo",
      },
      {
        label: "Requestor Name",
        type: "text",
        value: requestorName,
        disabled: true,
        id: "requestorName",
      },
      {
        label: "Posting Date",
        type: "input",
        value: postingDate ? formatDate(postingDate.toString()) : "",
        disabled: true,
        id: "postingDate",
        // options: {
        //   format: "dd/MM/yyyy",
        // },
      },
      {
        label: "Status",
        type: "text",
        value: status,
        disabled: true,
        id: "docStatus",
      },
      {
        label: "Delegatee",
        type: "text",
        value: selectedDelegatee[0]?.label || "",
        disabled: true,
        id: "delegatee",
      },
    ],
  ];

  const columns = [
    {
      dataField: "leaveType",
      text: "Leave Type",
      sort: true,
    },
    {
      dataField: "startDate",
      text: "Start Date",
      sort: true,
      formatter: (cell: string) => formatDate(cell),
    },
    {
      dataField: "endDate",
      text: "End Date",
      sort: true,
      formatter: (cell: string) => formatDate(cell),
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
    },
    {
      dataField: "quantity",
      text: "Quantity",
      sort: true,
    },
  ];

  const populateData = async () => {
    setIsLoading(true);
    try {
      if (documentNo) {
        const filterQuery = `$expand=leavePlanLines&$filter=documentNo eq '${documentNo}'`;
        const res = await apiLeavePlans(companyId, "GET", filterQuery);
        console.log("res", res);
        if (res.data) {
          const data = res.data.value[0];
          setLeavePlanNo(data.documentNo);
          setPostingDate(
            data.postingDate ? new Date(data.postingDate) : undefined
          );
          setStatus(data.status);
          setRequestorNo(data.employeeNo);
          setRequestorName(data.employeeName);
          setLeavePlanLines(data.leavePlanLines);

          // Get delegatee info
          const resEmployee = await apiEmployees(companyId);
          const delegate = resEmployee.data.value.find(
            (e) => e.No === data.delegate
          );
          if (delegate) {
            setSelectedDelegatee([
              {
                label: `${delegate.No}::${delegate.LastName}-${delegate.FirstName}`,
                value: delegate.No,
              },
            ]);
          }
        }
      }
    } catch (error) {
      toast.error(`Error fetching leave plan: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    populateData();
  }, [documentNo, companyId]);

  return (
    <HeaderMui
      title="Leave Plan Approval"
      subtitle="Leave Plan Approval"
      breadcrumbItem="Leave Plan Approval"
      fields={fields}
      isLoading={isLoading}
      handleBack={() => navigate("/approvals")}
      pageType="approval"
      status={status}
      companyId={companyId}
      documentType="Leave Plan"
      requestNo={leavePlanNo}
      lines={
        <Lines
          title="Leave Plan Lines"
          subTitle="Leave Plan Lines"
          breadcrumbItem="Leave Plan Lines"
          data={leavePlanLines}
          columns={columns}
          noDataMessage="No Leave Plan Lines found"
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

export default ApproveLeavePlan;
