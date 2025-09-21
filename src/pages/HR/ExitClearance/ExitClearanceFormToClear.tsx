import { useEffect, useState } from "react";
import TableMui from "../../../Components/ui/Table/TableMui";
import { exitClearanceService } from "../../../services/ExitClearanceService";
import { ExitClearance } from "../../../@types/exitClearance.dto";
import { ActionFormatter } from "../../../Components/ui/Table/TableUtils";
import { useAppSelector } from "../../../store/hook";

type Column = {
  dataField: keyof ExitClearance | "action";
  text: string;
  sort: boolean;
  formatter?: any;
  action?: (cell: string, row: any) => JSX.Element;
};

function StaffHandoverFormToClear() {
  const [data, setData] = useState<ExitClearance[]>([]);
  const [loading, setLoading] = useState(false);
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);

  const columns: Column[] = [
    {
      dataField: "no",
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
      dataField: "supervisorName",
      text: "Supervisor Name",
      sort: true,
    },
    {
      dataField: "hrOfficerName",
      text: "HR Officer Name",
      sort: true,
    },
    {
      dataField: "financeManagerName",
      text: "Finance Manager Name",
      sort: true,
    },
    {
      dataField: "ictManagerName",
      text: "IT Manager Name",
      sort: true,
    },
    {
      dataField: "adminName",
      text: "Admin Name",
      sort: true,
    },
    {
      dataField: "headOfDepartmentName",
      text: "Head of Department Name",
      sort: true,
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: (cell: string, _: any) => {
        return (
          <>
            {cell === "Open" ? (
              <span className="badge bg-info">Open</span>
            ) : cell === "Pending Approval" ? (
              <span className="badge bg-warning">Pending Approval</span>
            ) : cell === "Approved" ? (
              <span className="badge bg-success">Approved</span>
            ) : cell === "Rejected" ? (
              <span className="badge bg-danger">Rejected</span>
            ) : (
              <span className="badge bg-secondary">{cell}</span>
            )}
          </>
        );
      },
    },
    {
      dataField: "action",
      text: "Action",
      sort: true,
      formatter: (cell: string, row: any) => {
        return (
          <ActionFormatter
            row={row}
            cellContent={cell}
            navigateTo="/exit-clearance-details"
          />
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // For review page, we want to show Exit Clearances where the current user is involved
        // This includes cases where the user is:
        // 1. Initial HR Officer
        // 2. Finance Manager
        // 3. Admin
        // 4. Supervisor
        // 5. IT Manager
        // 6. Head of Department
        // 7. Final HR Manager
        const result = await exitClearanceService.getExitClearances(companyId);

        const filteredResult = result.filter((item) => {
          console.log("Filtering Exit Clearance:", {
            itemNo: item.no,
            currentUser: employeeNo,
            hrOfficerNo: item.hrOfficerNo,
            financeManager: item.financeManager,
            ictManagerNo: item.ictManagerNo,
            admin: item.admin,
            supervisorNo: item.supervisorNo,
            headOfDepartmentNo: item.headOfDepartmentNo,
            hrManagerNo: item.hrManagerNo,
            status: item.status,
          });

          return (
            // Initial HR Officer review
            (item.hrOfficerNo === employeeNo &&
              item.hrOfficerStage === "Pending Clearance") ||
            // Finance Manager review
            (item.financeManager === employeeNo &&
              item.financeStage === "Pending Clearance") ||
            // IT Manager review
            (item.ictManagerNo === employeeNo &&
              item.ictStage === "Pending Clearance") ||
            // Admin review
            (item.admin === employeeNo &&
              item.adminStage === "Pending Clearance") ||
            // Supervisor review
            (item.supervisorNo === employeeNo &&
              item.supervisorStage === "Pending Clearance") ||
            // Head of Department review
            (item.headOfDepartmentNo === employeeNo &&
              item.headOfDepartmentStage === "Pending Clearance") ||
            // Final HR Manager review
            (item.hrManagerNo === employeeNo &&
              item.hrManagerStage === "Pending Clearance")
          );
        });

        console.log("Filtered Exit Clearances for review:", filteredResult);
        setData(filteredResult || []);
      } catch (error) {
        console.log("Error fetching Exit Clearances for review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, employeeNo]);

  return (
    <TableMui
      title="Exit Clearance Review"
      subTitle="List of Exit Clearances for Review"
      addLink=""
      addLabel=""
      data={data}
      columns={columns}
      breadcrumbItem="Exit Clearance Review"
      noDataMessage="No Exit Clearances found for review"
      iconClassName="fa fa-user-check"
      isLoading={loading}
    />
  );
}

export default StaffHandoverFormToClear;
