import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { exitClearanceService } from "../../../services/ExitClearanceService";
import { ExitClearance as ExitClearanceType } from "../../../@types/exitClearance.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const ExitClearance: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [exitClearance, setExitClearance] = useState<ExitClearanceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExitClearance();
  }, [companyId, employeeNo]);

  const fetchExitClearance = async () => {
    try {
      setLoading(true);
      const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
      const data = await exitClearanceService.getExitClearances(
        companyId,
        filterQuery
      );
      setExitClearance(data);
    } catch (error) {
      toast.error(`Error fetching Exit Clearances: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      dataField: "no",
      text: "No",
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
      dataField: "date",
      text: "Date",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
    },

    {
      dataField: "organizationUnitName",
      text: "Organization Unit",
      sort: true,
    },
    {
      dataField: "action",
      isDummyField: true,
      text: "Action",
      formatter: (cell: any, row: any) => (
        <ActionFormatter
          row={row}
          cellContent={cell}
          navigateTo="/exit-clearance-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Exit Clearances"
      subTitle="List of Exit Clearances"
      addLink="/add-exit-clearance"
      addLabel="Add Exit Clearance"
      data={exitClearance}
      columns={columns}
      breadcrumbItem="Exit Clearances"
      noDataMessage="No Exit Clearances found"
      iconClassName="fa fa-user"
      isLoading={loading}
    />
  );
};

export default ExitClearance;
