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
      text: "IT Name",
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
        // Sequential approval flow implementation
        // Records are only shown to users when it's their turn in the approval sequence:
        // 1. HR Officer (First) - Can always proceed if their stage is pending
        // 2. Finance Manager (Second) - Can only proceed if HR Officer is completed
        // 3. Admin Manager (Third) - Can only proceed if HR Officer and Finance are completed
        // 4. Supervisor (Fourth) - Can only proceed if HR Officer, Finance, and Admin are completed
        // 5. IT (Fifth) - Can only proceed if HR Officer, Finance, Admin, and Supervisor are completed
        // 6. Head of Department (Sixth) - Can only proceed if all previous stages are completed
        // 7. HR Manager (Final) - Can only proceed if all previous stages are completed
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
            // Stage statuses
            hrOfficerStage: item.hrOfficerStage,
            financeStage: item.financeStage,
            adminStage: item.adminStage,
            supervisorStage: item.supervisorStage,
            ictStage: item.ictStage,
            headOfDepartmentStage: item.headOfDepartmentStage,
            hrManagerStage: item.hrManagerStage,
          });

          // Sequential approval flow: HR Officer → Finance → Admin → Supervisor → IT → Head of Department → HR Manager
          // Each stage must be completed before the next one can proceed
          // This ensures proper workflow control and prevents users from seeing records out of sequence

          // Helper function to check if a stage is completed
          const isStageCompleted = (stage: string) => {
            return stage === "Cleared" || stage === "Approved";
          };

          // Helper function to check if a stage is pending
          const isStagePending = (stage: string) => {
            return stage === "Pending Clearance";
          };

          // Check if it's the user's turn in the sequential flow
          const isUserTurn = () => {
            // 1. HR Officer (First in sequence)
            if (
              item.hrOfficerNo === employeeNo &&
              isStagePending(item.hrOfficerStage)
            ) {
              return true;
            }

            // 2. Finance Manager (Second in sequence)
            if (
              item.financeManager === employeeNo &&
              isStagePending(item.financeStage)
            ) {
              // Can only proceed if HR Officer stage is completed
              return isStageCompleted(item.hrOfficerStage);
            }

            // 3. Admin Manager (Third in sequence)
            if (item.admin === employeeNo && isStagePending(item.adminStage)) {
              // Can only proceed if HR Officer and Finance stages are completed
              return (
                isStageCompleted(item.hrOfficerStage) &&
                isStageCompleted(item.financeStage)
              );
            }

            // 4. Supervisor (Fourth in sequence)
            if (
              item.supervisorNo === employeeNo &&
              isStagePending(item.supervisorStage)
            ) {
              // Can only proceed if HR Officer, Finance, and Admin stages are completed
              return (
                isStageCompleted(item.hrOfficerStage) &&
                isStageCompleted(item.financeStage) &&
                isStageCompleted(item.adminStage)
              );
            }

            // 5. IT (Fifth in sequence)
            if (
              item.ictManagerNo === employeeNo &&
              isStagePending(item.ictStage)
            ) {
              // Can only proceed if HR Officer, Finance, Admin, and Supervisor stages are completed
              return (
                isStageCompleted(item.hrOfficerStage) &&
                isStageCompleted(item.financeStage) &&
                isStageCompleted(item.adminStage) &&
                isStageCompleted(item.supervisorStage)
              );
            }

            // 6. Head of Department (Sixth in sequence)
            if (
              item.headOfDepartmentNo === employeeNo &&
              item.headOfDepartmentStage &&
              isStagePending(item.headOfDepartmentStage)
            ) {
              // Can only proceed if all previous stages are completed
              return (
                isStageCompleted(item.hrOfficerStage) &&
                isStageCompleted(item.financeStage) &&
                isStageCompleted(item.adminStage) &&
                isStageCompleted(item.supervisorStage) &&
                isStageCompleted(item.ictStage)
              );
            }

            // 7. HR Manager (Final in sequence)
            if (
              item.hrManagerNo === employeeNo &&
              item.hrManagerStage &&
              isStagePending(item.hrManagerStage)
            ) {
              // Can only proceed if all previous stages are completed
              return (
                isStageCompleted(item.hrOfficerStage) &&
                isStageCompleted(item.financeStage) &&
                isStageCompleted(item.adminStage) &&
                isStageCompleted(item.supervisorStage) &&
                isStageCompleted(item.ictStage) &&
                item.headOfDepartmentStage &&
                isStageCompleted(item.headOfDepartmentStage)
              );
            }

            return false;
          };

          return isUserTurn();
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
