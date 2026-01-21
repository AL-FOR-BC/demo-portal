import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { disciplinaryTypesService } from "../../../services/DisciplinaryTypesService";
import { DisciplinaryType } from "../../../@types/disciplinaryTypes.dto";
import { getErrorMessage } from "../../../utils/common";
import TableMui from "../../../Components/ui/Table/TableMui";

const DisciplinaryTypes: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [disciplinaryTypes, setDisciplinaryTypes] = useState<
    DisciplinaryType[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisciplinaryTypes();
  }, [companyId]);

  const fetchDisciplinaryTypes = async () => {
    try {
      setLoading(true);
      // Filter for Disciplinary types only
      const filterQuery = `$filter=type eq 'Disciplinary'`;
      const data = await disciplinaryTypesService.getDisciplinaryTypes(
        companyId,
        filterQuery
      );
      setDisciplinaryTypes(data);
    } catch (error) {
      toast.error(
        `Error fetching Disciplinary Types: ${getErrorMessage(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      dataField: "code",
      text: "Code",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
    },
    {
      dataField: "type",
      text: "Type",
      sort: true,
    },
  ];

  return (
    <TableMui
      title="Disciplinary Types"
      subTitle="List of Disciplinary Types"
      addLink=""
      addLabel=""
      data={disciplinaryTypes}
      columns={columns}
      breadcrumbItem="Disciplinary Types"
      noDataMessage="No Disciplinary Types found"
      iconClassName="fa fa-gavel"
      isLoading={loading}
    />
  );
};

export default DisciplinaryTypes;
