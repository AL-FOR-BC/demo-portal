import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { disciplinaryTypesService } from "../../../services/DisciplinaryTypesService";
import { DisciplinaryType } from "../../../@types/disciplinaryTypes.dto";
import { getErrorMessage } from "../../../utils/common";
import TableMui from "../../../Components/ui/Table/TableMui";

const GrievanceTypes: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [grievanceTypes, setGrievanceTypes] = useState<DisciplinaryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievanceTypes();
  }, [companyId]);

  const fetchGrievanceTypes = async () => {
    try {
      setLoading(true);
      // Filter for Grievance types only
      const filterQuery = `$filter=type eq 'Grievance'`;
      const data = await disciplinaryTypesService.getDisciplinaryTypes(
        companyId,
        filterQuery
      );
      setGrievanceTypes(data);
    } catch (error) {
      toast.error(`Error fetching Grievance Types: ${getErrorMessage(error)}`);
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
      title="Grievance Types"
      subTitle="List of Grievance Types"
      addLink=""
      addLabel=""
      data={grievanceTypes}
      columns={columns}
      breadcrumbItem="Grievance Types"
      noDataMessage="No Grievance Types found"
      iconClassName="fa fa-balance-scale"
      isLoading={loading}
    />
  );
};

export default GrievanceTypes;
