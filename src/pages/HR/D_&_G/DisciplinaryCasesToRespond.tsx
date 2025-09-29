import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { disciplinaryCasesService } from "../../../services/DisciplinaryCasesService";
import { DisciplinaryCase } from "../../../@types/disciplinaryCases.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const DisciplinaryCasesToRespond: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [disciplinaryCases, setDisciplinaryCases] = useState<
    DisciplinaryCase[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisciplinaryCasesToRespond();
  }, [companyId, employeeNo]);

  const fetchDisciplinaryCasesToRespond = async () => {
    try {
      setLoading(true);

      // Filter for cases where current user is the indicted employee
      // and the case is in a status that requires response
      const filterQuery = `$filter=indictedEmployeeNo eq '${employeeNo}' and status eq 'Submitted to Employee'`;

      const data = await disciplinaryCasesService.getDisciplinaryCases(
        companyId,
        filterQuery
      );

      // Now fetch additional cases where user is in sendGrievanceTo field
      const processFilterQuery = `$filter=sendGrievanceTo eq '${employeeNo}' and status eq 'Submitted to Employee'`;

      const processData = await disciplinaryCasesService.getDisciplinaryCases(
        companyId,
        processFilterQuery
      );

      // Combine both results and remove duplicates
      const combinedData = [...data, ...processData];
      const uniqueData = combinedData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.systemId === item.systemId)
      );

      setDisciplinaryCases(uniqueData);
    } catch (error) {
      toast.error(
        `Error fetching Disciplinary Cases to Respond: ${getErrorMessage(
          error
        )}`
      );
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
      dataField: "caseCategory",
      text: "Case Category",
      sort: true,
    },
    {
      dataField: "disciplinaryCaseDescription",
      text: "Case Description",
      sort: true,
    },
    {
      dataField: "sendGrievanceTo",
      text: "Sent To",
      sort: true,
      formatter: (cell: any) => {
        // Show who the disciplinary case was sent to
        return cell || "N/A";
      },
    },
    {
      dataField: "incidentDate",
      text: "Incident Date",
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
      isDummyField: true,
      text: "Action",
      formatter: (cell: any, row: any) => (
        <ActionFormatter
          row={row}
          cellContent={cell}
          navigateTo="/disciplinary-case-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Disciplinary Cases to Respond"
      subTitle="Disciplinary cases requiring your response (as accused employee or assigned stakeholder)"
      data={disciplinaryCases}
      columns={columns}
      breadcrumbItem="Disciplinary Cases to Respond"
      noDataMessage="No disciplinary cases requiring your response found"
      iconClassName="fa fa-exclamation-triangle"
      isLoading={loading}
      addLink=""
      addLabel=""
    />
  );
};

export default DisciplinaryCasesToRespond;
