import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hook";
import { exitInterviewService } from "../../../services/ExitInterviewService";
import { ExitInterview } from "../../../@types/exitInterview.dto";
import { getErrorMessage } from "../../../utils/common";
import TableMui from "../../../Components/ui/Table/TableMui";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";

function ExitInterviews() {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [exitInterviews, setExitInterviews] = useState<ExitInterview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExitInterviews();
  }, [companyId, employeeNo]);

  const fetchExitInterviews = async () => {
    try {
      setIsLoading(true);
      const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
      const response = await exitInterviewService.getExitInterviews(
        companyId,
        filterQuery
      );
      setExitInterviews(response);
    } catch (error) {
      console.error(
        `Error fetching exit interviews: ${getErrorMessage(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      dataField: "no",
      text: "Document No",
      sort: true,
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      formatter: (cell: any) => {
        return cell ? new Date(cell).toLocaleDateString() : "";
      },
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
      dataField: "organizationUnitName",
      text: "Organization Unit",
      sort: true,
    },

    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: "durationOfService",
      text: "Duration of Service",
      sort: true,
    },
    {
      dataField: "action",
      text: "Action",
      formatter: (cell: any, row: any) => (
        <ActionFormatter
          row={row}
          cellContent={cell}
          navigateTo="/exit-interview-details"
        />
      ),
    },
  ];

  const defaultSorted = [
    {
      dataField: "no",
      order: "asc",
    },
  ];

  return (
    <TableMui
      title="Exit Interviews"
      subTitle="List of Exit Interviews"
      addLink="/add-exit-interview"
      addLabel={`${exitInterviews.length > 0 ? `` : "Add Exit Interview"}`}
      isLoading={isLoading}
      data={exitInterviews || []}
      columns={columns}
      noDataMessage="No Exit Interviews found"
      breadcrumbItem="Exit Interviews"
      defaultSorted={defaultSorted}
      iconClassName="bx bx-log-out"
    />
  );
}

export default ExitInterviews;
