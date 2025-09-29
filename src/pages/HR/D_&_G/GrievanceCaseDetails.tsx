import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
  const { email, employeeNo } = useAppSelector((state) => state.auth.user);

  const [grievanceLines, setGrievanceLines] = useState<GrievanceLine[]>([]);
  const [lineSystemId, setLineSystemId] = useState("");
  const [lineEtag, setLineEtag] = useState("");
  const [status, setStatus] = useState<string>("");
  const [indictedEmployeeNo, setIndictedEmployeeNo] = useState<string>("");
  const [caseRegisteredByNo, setCaseRegisteredByNo] = useState<string>("");

  // Line form state
  const [entryType, setEntryType] = useState("");
  const [description, setDescription] = useState("");

  const { updateGrievanceCase, getFormFields, state } = useGrievanceCases({
    mode: "edit",
    systemId,
    status: status,
  });

  // State for complainant satisfaction and feedback
  const [complainantSatisfaction, setComplainantSatisfaction] =
    useState<boolean>(false);
  const [complainantFeedback, setComplainantFeedback] = useState<string>("");

  // Check if current user can add lines
  const canAddLines = () => {
    // Can add lines if status is "Open" OR if status is "Submitted to Employee" and current user is the indicted employee OR current user is in sendGrievanceTo field
    const canAdd =
      status === "Open" ||
      (status === "Submitted to Employee" &&
        (employeeNo === indictedEmployeeNo ||
          employeeNo === state.grievanceCase?.sendGrievanceTo));

    console.log("Can Add Lines Debug:", {
      status,
      employeeNo,
      indictedEmployeeNo,
      sendGrievanceTo: state.grievanceCase?.sendGrievanceTo,
      canAdd,
    });

    return canAdd;
  };

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
      dataField: "entryType",
      text: "Entry Type",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
    },
    canAddLines() && {
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
            currentUserEmployeeNo={employeeNo}
            indictedEmployeeNo={indictedEmployeeNo}
            status={status}
            sendGrievanceTo={state.grievanceCase?.sendGrievanceTo}
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
          // If status is "Submitted to Employee", show appropriate options based on user role
          ...(status === "Submitted to Employee"
            ? // If user is indicted employee, only show Employee Response
              employeeNo === indictedEmployeeNo
              ? [{ label: "Employee Response", value: "Employee Response" }]
              : // If user is in sendGrievanceTo field, show Findings, Recommendations, and Employee Response
              employeeNo === state.grievanceCase?.sendGrievanceTo
              ? [
                  // { label: "Findings", value: "Findings" },
                  // { label: "Recommendations", value: "Recommendations" },
                  { label: "Employee Response", value: "Employee Response" },
                ]
              : // Default for other users
                [
                  { label: "Findings", value: "Findings" },
                  { label: "Recommendations", value: "Recommendations" },
                  { label: "Employee Response", value: "Employee Response" },
                ]
            : // For other statuses, show Issue Detail Description and other options
              [
                {
                  label: "Issue Detail Description",
                  value: "Issue Detail Description",
                },
                // Only show other options when status is not "Open"
                ...(status !== "Open"
                  ? [
                      { label: "Findings", value: "Findings" },
                      { label: "Recommendations", value: "Recommendations" },
                      {
                        label: "Employee Response",
                        value: "Employee Response",
                      },
                    ]
                  : []),
              ]),
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
        setIndictedEmployeeNo(response.indictedEmployeeNo || "");
        setCaseRegisteredByNo(response.caseRegisteredByNo || "");

        // Set complainant satisfaction and feedback
        setComplainantSatisfaction(
          response.complainantSatisfaction === "Yes" ||
            response.complainantSatisfaction === "true" ||
            (typeof response.complainantSatisfaction === "boolean" &&
              response.complainantSatisfaction) ||
            Boolean(response.complainantSatisfaction)
        );
        setComplainantFeedback(response.complainantFeedback || "");
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

  // Get extended form fields that include complainant satisfaction and feedback when status is 'Withdrawn(Cancelled)'
  const getExtendedFormFields = () => {
    const baseFields = getFormFields();

    // If status is 'Withdrawn(Cancelled)', add complainant satisfaction and feedback fields
    if (status === "Withdrawn(Cancelled)") {
      const complainantFields = [
        {
          label: "Complainant Satisfaction",
          type: "toggle",
          value: complainantSatisfaction.toString(),
          disabled: true, // Make it read-only
          id: "complainantSatisfaction",
          checked: complainantSatisfaction,
        },
        {
          label: "Complainant Feedback",
          type: "text",
          value: complainantFeedback,
          disabled: true, // Make it read-only
          id: "complainantFeedback",
        },
      ];

      // Add complainant fields to the first row of fields
      if (baseFields[0]) {
        baseFields[0].push(...complainantFields);
      } else {
        baseFields.push([...complainantFields]);
      }
    }

    return baseFields;
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
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Send Response",
      text: "Are you sure you want to send your response for this grievance case?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Send Response",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

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

  const handleNotifySupervisor = async () => {
    try {
      if (!state.grievanceCase?.no) {
        toast.error("Grievance case number not found");
        return;
      }

      const responseData = {
        no: state.grievanceCase.no,
      };

      console.log(
        "Notifying Supervisor, Accused Employee and HR:",
        responseData
      );

      const response = await grievanceCasesService.notifySupervisor(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Supervisor, Accused Employee and HR notified successfully!"
        );
        // Navigate back to the list page after successful notification
        setTimeout(() => {
          navigate("/grievances");
        }, 1500); // Wait 1.5 seconds to show the success message
      } else {
        toast.error("Failed to notify Supervisor, Accused Employee and HR");
      }
    } catch (error) {
      console.error(
        "Error notifying Supervisor, Accused Employee and HR:",
        error
      );
      toast.error(
        `Error notifying Supervisor, Accused Employee and HR: ${getErrorMessage(
          error
        )}`
      );
    }
  };

  const handleCloseGrievance = async () => {
    try {
      // Show a more professional and compact SweetAlert modal
      const result = await Swal.fire({
        title: "Close Grievance Case",
        html: `
          <div style="text-align: left; margin: 10px 0; max-width: 400px;">
            <p style="margin-bottom: 12px; color: #666; font-size: 14px;">Please provide feedback before closing this case:</p>
            
            <div style="margin-bottom: 12px;">
              <label for="complainantSatisfaction" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 13px; color: #333;">
                Satisfaction Level
              </label>
              <select id="complainantSatisfaction" class="swal2-select" style="width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 13px;">
                <option value="false">Not Satisfied</option>
                <option value="true">Satisfied</option>
              </select>
            </div>
            
            <div style="margin-bottom: 10px;">
              <label for="complainantFeedback" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 13px; color: #333;">
                Feedback
              </label>
              <textarea id="complainantFeedback" class="swal2-textarea" placeholder="Brief feedback..." 
                        style="width: 100%; min-height: 60px; padding: 6px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 13px; resize: vertical;"></textarea>
            </div>
            
            <p style="color: #dc3545; font-size: 12px; margin-top: 8px; font-weight: 500;">
              ⚠️ This action cannot be undone
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Close",
        cancelButtonText: "Cancel",
        width: "420px",
        padding: "20px",
        preConfirm: () => {
          const satisfaction =
            (
              document.getElementById(
                "complainantSatisfaction"
              ) as HTMLSelectElement
            )?.value === "true";
          const feedback =
            (
              document.getElementById(
                "complainantFeedback"
              ) as HTMLTextAreaElement
            )?.value || "";

          if (!feedback.trim()) {
            Swal.showValidationMessage("Please provide feedback");
            return false;
          }

          return { satisfaction, feedback };
        },
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading(),
      });

      if (!result.isConfirmed || !result.value) {
        return;
      }

      const { satisfaction, feedback } = result.value;

      if (!state.grievanceCase?.no) {
        toast.error("Grievance case number not found");
        return;
      }

      // First, update the complainant satisfaction and feedback
      console.log("Updating complainant data before closing:", {
        satisfaction,
        feedback,
      });

      const updateData: any = {
        systemId: state.grievanceCase.systemId,
        complainantSatisfaction: satisfaction,
        complainantFeedback: feedback,
      };

      await grievanceCasesService.updateGrievanceCase(
        companyId,
        updateData,
        state.grievanceCase.systemId,
        state.grievanceCase["@odata.etag"] || "*"
      );

      // Update local state
      setComplainantSatisfaction(satisfaction);
      setComplainantFeedback(feedback);

      toast.success("Complainant feedback updated successfully!");

      // Then proceed with closing the case
      const responseData = {
        no: state.grievanceCase.no,
      };

      console.log("Closing case:", responseData);

      const response = await grievanceCasesService.closeGrievanceCase(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Grievance case closed successfully!");
        // Navigate back to the grievance list page
        navigate("/grievances");
      } else {
        toast.error("Failed to close grievance case");
      }
    } catch (error) {
      console.error("Error closing grievance case:", error);
      toast.error(`Error closing grievance case: ${getErrorMessage(error)}`);
    }
  };

  const handleDeleteGrievanceCase = async () => {
    try {
      if (!state.grievanceCase?.systemId) {
        toast.error("Grievance case system ID not found");
        return;
      }

      console.log("Deleting grievance case:", state.grievanceCase.systemId);

      const response = await grievanceCasesService.deleteGrievanceCase(
        companyId,
        state.grievanceCase.systemId
      );

      if (response.status === 200 || response.status === 204) {
        toast.success("Grievance case deleted successfully!");
        // Navigate back to the grievance list page
        navigate("/grievances");
      } else {
        toast.error("Failed to delete grievance case");
      }
    } catch (error) {
      console.error("Error deleting grievance case:", error);
      toast.error(`Error deleting grievance case: ${getErrorMessage(error)}`);
    }
  };

  const handleWithdrawCase = async () => {
    try {
      // Show a more professional and compact SweetAlert modal
      const result = await Swal.fire({
        title: "Withdraw Grievance Case",
        html: `
          <div style="text-align: left; margin: 10px 0; max-width: 400px;">
            <p style="margin-bottom: 12px; color: #666; font-size: 14px;">Please provide feedback before withdrawing this case:</p>
            
            <div style="margin-bottom: 12px;">
              <label for="complainantSatisfaction" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 13px; color: #333;">
                Satisfaction Level
              </label>
              <select id="complainantSatisfaction" class="swal2-select" style="width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 13px;">
                <option value="false">Not Satisfied</option>
                <option value="true">Satisfied</option>
              </select>
            </div>
            
            <div style="margin-bottom: 10px;">
              <label for="complainantFeedback" style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 13px; color: #333;">
                Feedback
              </label>
              <textarea id="complainantFeedback" class="swal2-textarea" placeholder="Brief feedback..." 
                        style="width: 100%; min-height: 60px; padding: 6px 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 13px; resize: vertical;"></textarea>
            </div>
            
            <p style="color: #dc3545; font-size: 12px; margin-top: 8px; font-weight: 500;">
              ⚠️ This action cannot be undone
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Withdraw",
        cancelButtonText: "Cancel",
        width: "420px",
        padding: "20px",
        preConfirm: () => {
          const satisfaction =
            (
              document.getElementById(
                "complainantSatisfaction"
              ) as HTMLSelectElement
            )?.value === "true";
          const feedback =
            (
              document.getElementById(
                "complainantFeedback"
              ) as HTMLTextAreaElement
            )?.value || "";

          if (!feedback.trim()) {
            Swal.showValidationMessage("Please provide feedback");
            return false;
          }

          return { satisfaction, feedback };
        },
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading(),
      });

      if (!result.isConfirmed || !result.value) {
        return;
      }

      const { satisfaction, feedback } = result.value;

      if (!state.grievanceCase?.no) {
        toast.error("Grievance case number not found");
        return;
      }

      // First, update the complainant satisfaction and feedback
      console.log("Updating complainant data before withdrawal:", {
        satisfaction,
        feedback,
      });

      const updateData: any = {
        systemId: state.grievanceCase.systemId,
        complainantSatisfaction: satisfaction,
        complainantFeedback: feedback,
      };

      await grievanceCasesService.updateGrievanceCase(
        companyId,
        updateData,
        state.grievanceCase.systemId,
        state.grievanceCase["@odata.etag"] || "*"
      );

      // Update local state
      setComplainantSatisfaction(satisfaction);
      setComplainantFeedback(feedback);

      toast.success("Complainant feedback updated successfully!");

      // Then proceed with the withdrawal
      const responseData = {
        no: state.grievanceCase.no,
      };

      console.log("Withdrawing case:", responseData);

      const response = await grievanceCasesService.withdrawCase(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Grievance case withdrawn successfully!");
        // Navigate back to the grievance list page
        navigate("/grievances");
      } else {
        toast.error("Failed to withdraw grievance case");
      }
    } catch (error) {
      console.error("Error withdrawing grievance case:", error);
      toast.error(
        `Error withdrawing grievance case: ${getErrorMessage(error)}`
      );
    }
  };

  useEffect(() => {
    if (state.grievanceCase?.no) {
      populateData();
    }
  }, [state.grievanceCase?.no]);

  // Debug logging for Send Response button visibility
  useEffect(() => {
    console.log("Send Response Button Debug:", {
      documentType: "Grievance Case",
      status: status,
      currentUserEmployeeNo: employeeNo,
      indictedEmployeeNo: indictedEmployeeNo,
      sendGrievanceTo: state.grievanceCase?.sendGrievanceTo,
      shouldShowButton:
        "Grievance Case" === "Grievance Case" &&
        String(status) === "Submitted to Employee" &&
        (employeeNo === indictedEmployeeNo ||
          employeeNo === state.grievanceCase?.sendGrievanceTo),
    });
  }, [
    status,
    employeeNo,
    indictedEmployeeNo,
    state.grievanceCase?.sendGrievanceTo,
  ]);

  return (
    <HeaderMui
      title="Grievance Case Details"
      subtitle="Grievance Case Details"
      breadcrumbItem="Grievance Case Details"
      fields={getExtendedFormFields()}
      isLoading={state.isLoading}
      handleBack={() => navigate("/grievances")}
      handleSubmit={handleSubmit}
      handleSendResponse={handleSendResponse}
      handleNotifySupervisor={handleNotifySupervisor}
      handleWithdrawCase={handleWithdrawCase}
      handleDelete={handleDeleteGrievanceCase}
      handleCloseGrievance={handleCloseGrievance}
      documentType="Grievance Case"
      pageType="detail"
      status={status}
      tableId={50413}
      currentUserEmployeeNo={employeeNo}
      indictedEmployeeNo={indictedEmployeeNo}
      caseRegisteredByNo={caseRegisteredByNo}
      sendGrievanceTo={state.grievanceCase?.sendGrievanceTo}
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
          canAddLines={canAddLines()}
        />
      }
    />
  );
};

export default GrievanceCaseDetails;
