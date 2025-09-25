import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import Lines from "../../../Components/ui/Lines/Lines";
import { useGrievanceCases } from "./hooks/useGrievanceCases";
import { grievanceLinesService } from "../../../services/GrievanceLinesService";
import BcApiService from "../../../services/BcApiServices";
import { grievanceCasesService } from "../../../services/GrievanceCasesService";
import { GrievanceLine } from "../../../@types/grievanceLines.dto";
import { ActionFormatterLines } from "../../../Components/ui/Table/TableUtils";
import { getErrorMessage } from "../../../utils/common";
import {
  closeModalRequisition,
  editRequisitionLine,
  modelLoadingRequisition,
  openModalRequisition,
} from "../../../store/slices/Requisitions";

const GrievanceCaseDetails: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { email } = useAppSelector((state) => state.auth.user);

  const [grievanceLines, setGrievanceLines] = useState<GrievanceLine[]>([]);
  const [lineSystemId, setLineSystemId] = useState("");
  const [lineEtag, setLineEtag] = useState("");
  const [status, setStatus] = useState("");

  // Line form state
  const [entryType, setEntryType] = useState("");
  const [description, setDescription] = useState("");

  const { updateGrievanceCase, getFormFields, state } = useGrievanceCases({
    mode: "view",
    systemId,
  });

  // API handler function for ActionFormatterLines
  const apiGrievanceLines = async (
    companyId: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    systemId?: string,
    etag?: string,
    filterQuery?: string
  ) => {
    if (method === "DELETE") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/grievanceLines(${systemId})?Company=${companyId}`,
        method,
        headers: {
          "If-Match": etag,
        },
      });
    } else if (method === "PATCH") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/grievanceLines(${systemId})?Company=${companyId}`,
        method,
        data,
        headers: {
          "If-Match": etag,
        },
      });
    } else if (method === "POST") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/grievanceLines?Company=${companyId}`,
        method,
        data,
      });
    } else {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/grievanceLines?Company=${companyId}${
          filterQuery ? `&${filterQuery}` : ""
        }`,
        method,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await updateGrievanceCase();
    } catch (error) {
      // Error is already handled in updateGrievanceCase
    }
  };

  const columns = [
    {
      dataField: "lineNo",
      text: "Line No",
      sort: true,
    },
    {
      dataField: "entryType",
      text: "Entry Type",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
    },
    (status === "Open" ? true : false) && {
      dataField: "action",
      text: "Action",
      sort: true,
      isDummyField: true,
      formatter: (_: any, row: any) => {
        return (
          <ActionFormatterLines
            row={row}
            companyId={companyId}
            apiHandler={apiGrievanceLines}
            handleEditLine={handleEditLine}
            handleDeleteLine={handleDeleteLine}
            populateData={populateData}
          />
        );
      },
    },
  ];

  const modalFields = [
    [
      {
        label: "Entry Type",
        type: "select",
        value: entryType
          ? { label: entryType, value: entryType }
          : { label: "Select Entry Type", value: "" },
        id: "entryType",
        options: [
          { label: "Select Entry Type", value: "" },
          {
            label: "Issue Detail Description",
            value: "Issue Detail Description",
          },
          { label: "Findings", value: "Findings" },
          { label: "Recommendations", value: "Recommendations" },
          { label: "Employee Response", value: "Employee Response" },
        ],
        onChange: (e: any) => setEntryType(e?.value || ""),
      },
      {
        label: "Description",
        type: "textarea",
        value: description,
        id: "description",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setDescription(e.target.value),
      },
    ],
  ];

  const populateData = async () => {
    try {
      if (systemId) {
        // Use $expand to get grievance lines with the case
        const expandQuery = `$expand=grievanceLines`;
        const response = await grievanceCasesService.getGrievanceCase(
          companyId,
          systemId,
          expandQuery
        );

        console.log("Expanded response:", response);

        // Extract grievance lines from the expanded data
        // The API response shows 'grievanceLines' property
        let grievanceLines = response.grievanceLines || [];

        // The $expand is working correctly, so we can use the lines directly
        console.log("Found grievance lines:", grievanceLines.length);

        setGrievanceLines(grievanceLines);
        setStatus(response.status || "Open");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error(`Error fetching grievance lines: ${getErrorMessage(error)}`);
    } finally {
    }
  };

  const handleSubmitLines = async () => {
    dispatch(modelLoadingRequisition(true));
    const data = {
      lineNo: 0, // Will be auto-generated by the API
      entryType: entryType,
      description: description,
      issueNo: state.grievanceCase?.no || "",
    };
    console.log("Submitting grievance line data:", data);
    if (data) {
      try {
        const res = await grievanceLinesService.createGrievanceLine(
          companyId,
          data
        );
        if (res.status === 201 || res.status === 200) {
          toast.success("Grievance line added successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
      } catch (error) {
        toast.error(
          `Error submitting grievance line: ${getErrorMessage(error)}`
        );
      } finally {
        dispatch(modelLoadingRequisition(false));
      }
    }
  };

  const clearLineFields = () => {
    setEntryType("");
    setDescription("");
  };

  const handleEditLine = (row: any) => {
    clearLineFields();
    dispatch(modelLoadingRequisition(true));
    dispatch(openModalRequisition());
    dispatch(editRequisitionLine(true));
    setEntryType(row.entryType);
    setDescription(row.description);
    setLineSystemId(row.systemId);
    setLineEtag(row["@odata.etag"]);
    dispatch(modelLoadingRequisition(false));
  };

  const handleSubmitUpdatedLine = async () => {
    try {
      const data = {
        systemId: lineSystemId,
        lineNo: 0, // Will be auto-generated by the API
        entryType: entryType,
        description: description,
        issueNo: state.grievanceCase?.no || "",
      };
      console.log("Updating grievance line data:", data);
      if (lineSystemId && lineEtag) {
        const res = await grievanceLinesService.updateGrievanceLine(
          companyId,
          data,
          lineSystemId,
          lineEtag
        );
        if (res.status === 200) {
          toast.success("Grievance line updated successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
      }
    } catch (error) {
      toast.error(`Error updating grievance line: ${getErrorMessage(error)}`);
    } finally {
      dispatch(modelLoadingRequisition(false));
    }
  };

  const handleDeleteLine = async (row: any) => {
    try {
      await grievanceLinesService.deleteGrievanceLine(
        companyId,
        row.systemId,
        row["@odata.etag"]
      );
      toast.success("Grievance line deleted successfully");
      populateData();
    } catch (error) {
      toast.error(`Error deleting grievance line: ${getErrorMessage(error)}`);
    }
  };

  const handleSendResponse = async () => {
    try {
      if (!state.grievanceCase?.no) {
        toast.error("No grievance case number found");
        return;
      }

      if (!email) {
        toast.error("User email not found. Please sign in again.");
        return;
      }

      const responseData = {
        no: state.grievanceCase.no,
      };

      console.log("Sending grievance response:", responseData);

      // Try the simple response method first
      const response = await grievanceCasesService.sendGrievanceResponse(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Grievance case sent for processing successfully!");
        // Optionally refresh the data or navigate
        populateData();
      } else {
        toast.error("Failed to send grievance case for processing");
      }
    } catch (error) {
      console.error("Error sending grievance case for processing:", error);
      toast.error(
        `Error sending grievance case for processing: ${getErrorMessage(error)}`
      );
    }
  };

  useEffect(() => {
    if (state.grievanceCase?.no) {
      populateData();
    }
  }, [state.grievanceCase?.no]);

  return (
    <HeaderMui
      title="Grievance Case Details"
      subtitle="Grievance Case Details"
      breadcrumbItem="Grievance Case Details"
      fields={getFormFields()}
      isLoading={state.isLoading}
      handleBack={() => navigate("/grievances")}
      handleSubmit={handleSubmit}
      handleSendResponse={handleSendResponse}
      documentType="Grievance Case"
      pageType="detail"
      status={status}
      lines={
        <Lines
          title="Grievance Lines"
          subTitle="Case Lines and Comments"
          breadcrumbItem="Grievance Lines"
          addLink=""
          addLabel=""
          iconClassName=""
          noDataMessage="No lines found"
          data={grievanceLines}
          status={status}
          modalFields={modalFields}
          columns={columns}
          handleSubmitLines={() => {
            handleSubmitLines();
          }}
          handleSubmitUpdatedLine={() => {
            handleSubmitUpdatedLine();
          }}
          clearLineFields={() => {
            setEntryType("");
            setDescription("");
          }}
          handleValidateHeaderFields={() => true}
        />
      }
    />
  );
};

export default GrievanceCaseDetails;
