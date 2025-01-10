import { useState, useEffect } from "react";
import { useAppSelector } from "../../../store/hook";
import { LeaveRequestValue } from "../../../@types/leave.dto";
import { apiLeaveRequest } from "../../../services/LeaveServices";
import TableMui from "../../../Components/ui/Table/TableMui";
import { toast } from "react-toastify";
import { decodeValue } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";

export const LeaveRequests = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);

  const [isLoading, setIsLoading] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequestValue[]>([]);

  const populateData = async () => {
    try {
      setIsLoading(true);
      const responseLR = await apiLeaveRequest(companyId, "GET");
      console.log(responseLR.data.value);
      setLeaveRequest(responseLR.data.value);
    } catch (error) {
      toast.error(`Error fetching leave requests: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      dataField: "documentNo",
      text: "Document No",
      sort: true,
    },
    {
      dataField: "employeeNo",
      text: "Employee No",
      sort: true,
    },
    {
      dataField: "employeeName",
      text: "Employee Name",
      sort: true,
    },
    {
      dataField: "leaveCategoryType",
      text: "Leave Type",
      sort: true,
      formatter: decodeValue,
    },
    {
      dataField: "noofDays",
      text: "No of Days",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: "action",
      text: "Action",
      formatter: (cell: any, row: any) => (
        <ActionFormatter
          row={row}
          cellContent={cell}
          navigateTo="/leave-request-details"
        />
      ),
    },
  ];

  const defaultSorted = [
    {
      dataField: "requestNo",
      order: "asc",
    },
  ];
  useEffect(() => {
    populateData();
  }, []);
  return (
    <TableMui
      title="Leave Requests"
      subTitle="List of Leave Requests"
      addLink={"/add-leave-request"}
      addLabel={"Add Leave Request"}
      isLoading={isLoading}
      data={leaveRequest}
      columns={columns}
      noDataMessage="No Leave Requests found"
      breadcrumbItem="Leave Requests"
      defaultSorted={defaultSorted}
      iconClassName="bx bx-cart"
    />
  );
};

export default LeaveRequests;
