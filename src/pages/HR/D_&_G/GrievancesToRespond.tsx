import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { grievanceCasesService } from "../../../services/GrievanceCasesService";
import { GrievanceCase } from "../../../@types/grievanceCases.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const GrievancesToRespond: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [grievanceCases, setGrievanceCases] = useState<GrievanceCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievancesToRespond();
  }, [companyId, employeeNo]);

  const fetchGrievancesToRespond = async () => {
    try {
      setLoading(true);

      // Filter for cases where current user is the indicted employee
      // and the case is in a status that requires response
      const filterQuery = `$filter=indictedEmployeeNo eq '${employeeNo}' and status eq 'Submitted to Employee'`;

      const data = await grievanceCasesService.getGrievanceCases(
        companyId,
        filterQuery
      );

      // Now fetch additional cases where user is in sendGrievanceTo field
      // and process type is not empty (indicating process-related grievance)
      const processFilterQuery = `$filter=sendGrievanceTo eq '${employeeNo}' and processType ne '' and status eq 'Submitted to Employee'`;

      const processData = await grievanceCasesService.getGrievanceCases(
        companyId,
        processFilterQuery
      );

      // Combine both results and remove duplicates
      const combinedData = [...data, ...processData];
      const uniqueData = combinedData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.systemId === item.systemId)
      );

      setGrievanceCases(uniqueData);
    } catch (error) {
      toast.error(
        `Error fetching Grievances to Respond: ${getErrorMessage(error)}`
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
      dataField: "natureOfGrievance",
      text: "Nature of Grievance",
      sort: true,
    },
    {
      dataField: "processType",
      text: "Process Type",
      sort: true,
      formatter: (cell: any) => {
        // Show process type if it exists, otherwise show "Person-related"
        return cell || "Person-related";
      },
    },
    
    {
      dataField: "sendGrievanceTo",
      text: "Sent To",
      sort: true,
      formatter: (cell: any) => {
        // Show who the grievance was sent to
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
          navigateTo="/grievance-case-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Grievances to Respond"
      subTitle="Grievance cases requiring your response (as accused employee or process stakeholder)"
      data={grievanceCases}
      columns={columns}
      breadcrumbItem="Grievances to Respond"
      noDataMessage="No grievances requiring your response found"
      iconClassName="fa fa-exclamation-triangle"
      isLoading={loading}
      addLink=""
      addLabel=""
    />
  );
};

export default GrievancesToRespond;
