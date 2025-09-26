import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import Lines from "../../../Components/ui/Lines/Lines";
import { useDisciplinaryCases } from "./hooks/useDisciplinaryCases";
import { disciplinaryLinesService } from "../../../services/DisciplinaryLinesService";
import BcApiService from "../../../services/BcApiServices";
import { disciplinaryCasesService } from "../../../services/DisciplinaryCasesService";
import { DisciplinaryLine } from "../../../@types/disciplinaryLines.dto";
import { ActionFormatterLines } from "../../../Components/ui/Table/TableUtils";
import { getErrorMessage } from "../../../utils/common";
import {
  closeModalRequisition,
  editRequisitionLine,
  modelLoadingRequisition,
  openModalRequisition,
} from "../../../store/slices/Requisitions";

const DisciplinaryCaseDetails: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { email } = useAppSelector((state) => state.auth.user);

  const [disciplinaryLines, setDisciplinaryLines] = useState<
    DisciplinaryLine[]
  >([]);
  const [lineSystemId, setLineSystemId] = useState("");
  const [lineEtag, setLineEtag] = useState("");
  const [status, setStatus] = useState("");

  // Line form state
  const [entryType, setEntryType] = useState("");
  const [description, setDescription] = useState("");

  const { updateDisciplinaryCase, getFormFields, state } = useDisciplinaryCases(
    {
      mode: "view",
      systemId,
    }
  );

  // API handler function for ActionFormatterLines
  const apiDisciplinaryLines = async (
    companyId: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    systemId?: string,
    etag?: string,
    filterQuery?: string
  ) => {
    if (method === "DELETE") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines(${systemId})?Company=${companyId}`,
        method,
        headers: {
          "If-Match": etag,
        },
      });
    } else if (method === "PATCH") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines(${systemId})?Company=${companyId}`,
        method,
        data,
        headers: {
          "If-Match": etag,
        },
      });
    } else if (method === "POST") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines?Company=${companyId}`,
        method,
        data,
      });
    } else {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines?Company=${companyId}${
          filterQuery ? `&${filterQuery}` : ""
        }`,
        method,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await updateDisciplinaryCase();
    } catch (error) {
      // Error is already handled in updateDisciplinaryCase
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
            apiHandler={apiDisciplinaryLines}
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
        // Use $expand to get disciplinary lines with the case
        const expandQuery = `$expand=disciplinaryLines`;
        const response = await disciplinaryCasesService.getDisciplinaryCase(
          companyId,
          systemId,
          expandQuery
        );

        console.log("Expanded response:", response);

        // Extract disciplinary lines from the expanded data
        let disciplinaryLines = response.disciplinaryLines || [];

        console.log("Found disciplinary lines:", disciplinaryLines.length);

        setDisciplinaryLines(disciplinaryLines);
        setStatus(response.status || "Open");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        `Error fetching disciplinary lines: ${getErrorMessage(error)}`
      );
    } finally {
    }
  };

  const handleSubmitLines = async () => {
    dispatch(modelLoadingRequisition(true));
    const data = {
      lineNo: 0, // Will be auto-generated by the API
      entryType: entryType,
      description: description,
      issueNo: state.disciplinaryCase?.no || "",
    };
    console.log("Submitting disciplinary line data:", data);
    if (data) {
      try {
        const res = await disciplinaryLinesService.createDisciplinaryLine(
          companyId,
          data
        );
        if (res.status === 201 || res.status === 200) {
          toast.success("Disciplinary line added successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
      } catch (error) {
        toast.error(
          `Error submitting disciplinary line: ${getErrorMessage(error)}`
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
        issueNo: state.disciplinaryCase?.no || "",
      };
      console.log("Updating disciplinary line data:", data);
      if (lineSystemId && lineEtag) {
        const res = await disciplinaryLinesService.updateDisciplinaryLine(
          companyId,
          data,
          lineSystemId,
          lineEtag
        );
        if (res.status === 200) {
          toast.success("Disciplinary line updated successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
      }
    } catch (error) {
      toast.error(
        `Error updating disciplinary line: ${getErrorMessage(error)}`
      );
    } finally {
      dispatch(modelLoadingRequisition(false));
    }
  };

  const handleDeleteLine = async (row: any) => {
    try {
      await disciplinaryLinesService.deleteDisciplinaryLine(
        companyId,
        row.systemId,
        row["@odata.etag"]
      );
      toast.success("Disciplinary line deleted successfully");
      populateData();
    } catch (error) {
      toast.error(
        `Error deleting disciplinary line: ${getErrorMessage(error)}`
      );
    }
  };

  const handleSendResponse = async () => {
    try {
      if (!state.disciplinaryCase?.no) {
        toast.error("No disciplinary case number found");
        return;
      }

      if (!email) {
        toast.error("User email not found. Please sign in again.");
        return;
      }

      const responseData = {
        no: state.disciplinaryCase.no,
      };

      console.log("Sending disciplinary response:", responseData);

      // Try the simple response method first
      const response = await disciplinaryCasesService.sendDisciplinaryResponse(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Disciplinary case sent for processing successfully!");
        // Optionally refresh the data or navigate
        populateData();
      } else {
        toast.error("Failed to send disciplinary case for processing");
      }
    } catch (error) {
      console.error("Error sending disciplinary case for processing:", error);
      toast.error(
        `Error sending disciplinary case for processing: ${getErrorMessage(
          error
        )}`
      );
    }
  };

  const handleNotifySupervisor = async () => {
    try {
      if (!state.disciplinaryCase?.no) {
        toast.error("Disciplinary case number not found");
        return;
      }

      const responseData = {
        no: state.disciplinaryCase.no,
      };

      console.log("Notifying supervisor:", responseData);

      const response = await disciplinaryCasesService.notifySupervisor(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Supervisor notified successfully!");
        // Optionally refresh the data
        populateData();
      } else {
        toast.error("Failed to notify supervisor");
      }
    } catch (error) {
      console.error("Error notifying supervisor:", error);
      toast.error(`Error notifying supervisor: ${getErrorMessage(error)}`);
    }
  };

  useEffect(() => {
    if (state.disciplinaryCase?.no) {
      populateData();
    }
  }, [state.disciplinaryCase?.no]);

  return (
    <HeaderMui
      title="Disciplinary Case Details"
      subtitle="Disciplinary Case Details"
      breadcrumbItem="Disciplinary Case Details"
      fields={getFormFields()}
      isLoading={state.isLoading}
      handleBack={() => navigate("/disciplinary-cases")}
      handleSubmit={handleSubmit}
      handleSendResponse={handleSendResponse}
      handleNotifySupervisor={handleNotifySupervisor}
      documentType="Disciplinary Case"
      pageType="detail"
      status={status}
      lines={
        <Lines
          title="Disciplinary Lines"
          subTitle="Case Lines and Comments"
          breadcrumbItem="Disciplinary Lines"
          addLink=""
          addLabel=""
          iconClassName=""
          noDataMessage="No lines found"
          data={disciplinaryLines}
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

export default DisciplinaryCaseDetails;
