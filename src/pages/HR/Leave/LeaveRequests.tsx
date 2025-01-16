import { useEffect } from "react";
import { useLeaveDocument } from "../../../hooks/documents/useLeaveDocument";
import TableMui from "../../../Components/ui/Table/TableMui";
import { decodeValue } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";

const LeaveRequests = () => {
  const { state, populateDocument } = useLeaveDocument({ mode: "list" });
  const { isLoading, leaveRequests } = state;

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
      dataField: "documentNo",
      order: "asc",
    },
  ];

  useEffect(() => {
    populateDocument();
    console.log("------------------------  LeaveRequests ------------------------ ");
    console.log(leaveRequests);
    console.log("------------------------  LeaveRequests ------------------------ ");
  }, []);

  return (
    <TableMui
      title="Leave Requests"
      subTitle="List of Leave Requests"
      addLink="/add-leave-request"
      addLabel="Add Leave Request"
      isLoading={isLoading}
      data={leaveRequests || []}
      columns={columns}
      noDataMessage="No Leave Requests found"
      breadcrumbItem="Leave Requests"
      defaultSorted={defaultSorted}
      iconClassName="bx bx-calendar-check"
    />
  );
};

export default LeaveRequests;
