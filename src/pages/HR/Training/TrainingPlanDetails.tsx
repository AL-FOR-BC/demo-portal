import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import Lines from "../../../Components/ui/Lines/Lines";
import { useTrainingPlanDocument } from "../../../hooks/documents/useTrainingPlanDocument";
import { useAppDispatch } from "../../../store/hook";
import {
  closeModalRequisition,
  editRequisitionLine,
  openModalRequisition,
} from "../../../store/slices/Requisitions";
import { ActionFormatterLines } from "../../../Components/ui/Table/TableUtils";
import { trainingPlanLinesService } from "../../../services/TrainingPlanLinesService";
import { useAppSelector } from "../../../store/hook";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  PlusIcon,
  DeleteIcon,
  UserIcon,
} from "../../../Components/common/icons/icons";
import { formatNumberWithCommas } from "../../../utils/common";

// Utility function to format category for display
const formatCategory = (value: string): string => {
  const categoryMap: Record<string, string> = {
    Certificate: "Professional Certificates",
    Coaching: "Coaching",
    Conference: "Conferences",
    Seminars: "Seminars",
    Workshops: "Workshops",
    Course: "Course",
  };
  return categoryMap[value] || value;
};

const TrainingPlanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { email } = useAppSelector((state) => state.auth.user);
  const isEdit = useAppSelector(
    (state) => state.purchaseRequisition.purchaseRequisition.isEdit
  );
  const [editingLine, setEditingLine] = useState<any>(null);

  const {
    formData,
    state,
    getFormFields,
    deleteTrainingPlan,
    sendTrainingPlanForApproval,
    cancelTrainingPlanApproval,
    populateDocument,
    // Lines functions
    fetchTrainingPlanLines,
    fetchProgramOptions,
    createTrainingPlanLine,
    updateTrainingPlanLine,
    deleteTrainingPlanLine,
    getLinesModalFields,
    clearLineModalData,
    populateLineModalData,
    // Expected participants functions
    openParticipantsModal,
    closeParticipantsModal,
    openAddParticipantModal,
    closeAddParticipantModal,
    updateNewParticipantData,
    addExpectedParticipant,
    updateParticipantAttendance,
    deleteExpectedParticipant,
  } = useTrainingPlanDocument({ mode: "detail" });

  useEffect(() => {
    if (id) {
      // Populate the document with the training plan data using the systemId
      populateDocument(id);
      // Fetch program options for lines
      fetchProgramOptions();
    }
  }, [id]); // Only depend on id, not the functions

  // Fetch lines after form data is populated
  useEffect(() => {
    if (formData.no) {
      fetchTrainingPlanLines(formData.no);
    }
  }, [formData.no, fetchTrainingPlanLines]);

  const handleSubmitLines = async () => {
    try {
      // Validate required fields
      if (!state.lineModalData.performanceGap.trim()) {
        toast.error("Please enter a performance gap");
        return;
      }
      if (state.lineModalData.category.length === 0) {
        toast.error("Please select a category");
        return;
      }
      if (state.lineModalData.programCode.length === 0) {
        toast.error("Please select a program code");
        return;
      }

      // Validate conditional fields based on delivery method
      if (state.lineModalData.deliveryMethod[0]?.value === "Internal") {
        if (state.lineModalData.coachMentor.length === 0) {
          toast.error("Please select a coach/mentor for internal delivery");
          return;
        }
      }

      if (state.lineModalData.deliveryMethod[0]?.value === "External") {
        if (state.lineModalData.trainingProvider.length === 0) {
          toast.error(
            "Please select a training provider for external delivery"
          );
          return;
        }
      }

      // Create line data
      const lineData = {
        performanceGap: state.lineModalData.performanceGap,
        category: state.lineModalData.category[0].value as
          | "Certificate"
          | "Coaching"
          | "Conference"
          | "Seminars"
          | "Workshops"
          | "Course",
        programCode: state.lineModalData.programCode[0].value,
        trainingGroup: state.lineModalData.targetGroup[0]?.value || "",
        deliveryMethod:
          (state.lineModalData.deliveryMethod[0]?.value as
            | "On the job"
            | "Internal"
            | "External") || undefined,
        trainingLocation: state.lineModalData.trainingLocation[0]?.value || "",
        coach: state.lineModalData.coachMentor[0]?.value || "",
        trainingProvider: state.lineModalData.trainingProvider[0]?.value || "",
        plannedStartDate: state.lineModalData.plannedStartDate,
        plannedEndDate: state.lineModalData.plannedEndDate,
        expectedParticipants: state.lineModalData.expectedParticipants,
        estimatedUnitCost: state.lineModalData.estimatedUnitCost,
        estimatedTotalCost: state.lineModalData.estimatedTotalCost,
      };

      if (isEdit && editingLine) {
        // Update existing line
        await updateTrainingPlanLine(
          editingLine.systemId,
          lineData,
          editingLine["@odata.etag"]
        );
        toast.success("Training plan line updated successfully");
      } else {
        // Create new line
        await createTrainingPlanLine(lineData);
        toast.success("Training plan line created successfully");
      }

      // Clear modal data and close modal
      clearLineModalData();
      setEditingLine(null);
      dispatch(closeModalRequisition());
      dispatch(editRequisitionLine(false));
    } catch (error) {
      console.error("Error submitting line:", error);
    }
  };

  const handleSubmitUpdatedLine = async () => {
    try {
      // Similar validation and update logic
      // You can implement edit functionality here when needed
      dispatch(closeModalRequisition());
    } catch (error) {
      console.error("Error updating line:", error);
    }
  };

  const handleDeleteLines = (row: any) => {
    if (row.systemId && row["@odata.etag"]) {
      deleteTrainingPlanLine(row.systemId, row["@odata.etag"]);
    } else {
      console.error("Missing required data for deletion:", {
        systemId: row.systemId,
        etag: row["@odata.etag"],
      });
      toast.error("Missing required data for deletion");
    }
  };

  const clearLineFields = () => {
    clearLineModalData();
    setEditingLine(null);
    dispatch(editRequisitionLine(false));
  };

  const handleValidateHeaderFields = () => {
    return true; // Add validation logic here if needed
  };

  const handleEditLine = (row: any) => {
    console.log("Editing line:", row);
    // Store the line being edited
    setEditingLine(row);
    // Populate the modal with existing line data
    populateLineModalData(row);
    // Open the modal
    dispatch(openModalRequisition());
    dispatch(editRequisitionLine(true));
  };

  // Custom columns with proper action formatter
  const getCustomLinesColumns = () => {
    // Check if participant management should be disabled based on status
    // Only disable when status is "Pending Approval"
    const isParticipantManagementDisabled =
      formData.status === "Pending Approval";

    return [
      {
        dataField: "performanceGap",
        text: "Performance Gap",
        sort: true,
      },
      {
        dataField: "category",
        text: "Category",
        sort: true,
        formatter: (cell: any) => formatCategory(cell),
      },
      {
        dataField: "programCode",
        text: "Program Code",
        sort: true,
      },
      {
        dataField: "programName",
        text: "Program Name",
        sort: true,
      },
      {
        dataField: "expectedParticipants",
        text: "Expected Participants",
        sort: true,
        formatter: (cell: any) => formatNumberWithCommas(cell),
      },
      {
        dataField: "estimatedUnitCost",
        text: "Estimated Unit Cost",
        sort: true,
        formatter: (cell: any) => formatNumberWithCommas(cell),
      },
      {
        dataField: "estimatedTotalCost",
        text: "Estimated Total Cost",
        sort: true,
        formatter: (cell: any) => formatNumberWithCommas(cell),
      },
      {
        dataField: "action",
        isDummyField: true,
        text: "Action",
        formatter: (_cell: any, row: any) => (
          <div className="d-flex gap-1">
            <ActionFormatterLines
              row={row}
              companyId={companyId}
              apiHandler={async (
                companyId: string,
                method: string,
                _data?: any,
                systemId?: string,
                etag?: string
              ) => {
                if (method === "DELETE" && systemId && etag) {
                  await trainingPlanLinesService.deleteTrainingPlanLine(
                    companyId,
                    systemId,
                    etag
                  );
                  return { status: 204 }; // Return expected response format
                }
                throw new Error(`Unsupported method: ${method}`);
              }}
              handleEditLine={handleEditLine}
              handleDeleteLine={handleDeleteLines}
              populateData={() => {
                if (formData.no) {
                  fetchTrainingPlanLines(formData.no);
                }
              }}
              status={formData.status}
            />
            <button
              className={`btn btn-sm ${
                isParticipantManagementDisabled ? "btn-secondary" : "btn-info"
              }`}
              onClick={() => openParticipantsModal(row)}
              title={
                isParticipantManagementDisabled
                  ? "View Participants (Read Only) - Status: " + formData.status
                  : "Manage Expected Participants"
              }
            >
              <UserIcon />
            </button>
          </div>
        ),
      },
    ];
  };

  return (
    <>
      <HeaderMui
        title="Training Plan Details"
        subtitle="Training Plan Details"
        breadcrumbItem="Training Plan Details"
        fields={getFormFields()}
        isLoading={state.isLoading}
        pageType="detail"
        status={formData.status}
        handleBack={() => navigate("/training-plans")}
        handleDelete={() => deleteTrainingPlan(id!)}
        handleSendApprovalRequest={() => {
          if (formData.no) {
            sendTrainingPlanForApproval(formData.no, email);
          }
        }}
        handleCancelApprovalRequest={() => {
          if (formData.no) {
            cancelTrainingPlanApproval(formData.no);
          }
        }}
        companyId={companyId}
        documentType="Training Plan"
        requestNo={formData.no}
        lines={
          <Lines
            title="Training Plan Lines"
            subTitle="Training Plan Lines"
            breadcrumbItem="Training Plan Lines"
            addLink="#"
            addLabel="Add Training Line"
            iconClassName="fas fa-plus"
            noDataMessage="No training plan lines found"
            data={state.trainingPlanLines as any[]}
            columns={getCustomLinesColumns()}
            status={formData.status || ""}
            modalFields={getLinesModalFields()}
            handleSubmitLines={handleSubmitLines}
            handleDeleteLines={handleDeleteLines}
            handleSubmitUpdatedLine={handleSubmitUpdatedLine}
            clearLineFields={clearLineFields}
            handleValidateHeaderFields={handleValidateHeaderFields}
          />
        }
      />

      {/* Expected Participants Modal */}
      {state.isParticipantsModalOpen && state.selectedLineForParticipants && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Manage Expected Participants -{" "}
                  {state.selectedLineForParticipants.performanceGap}
                  {formData.status === "Pending Approval" ? (
                    <span className="badge bg-warning ms-2">
                      Read Only - Status: {formData.status}
                    </span>
                  ) : null}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeParticipantsModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Employee No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Attended</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.expectedParticipants.map((participant) => (
                        <tr key={participant.systemId}>
                          <td>{participant.no}</td>
                          <td>{participant.name}</td>
                          <td>{participant.email}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={participant.attended || false}
                              disabled={formData.status === "Pending Approval"}
                              onChange={(e) => {
                                if (
                                  participant.systemId &&
                                  participant["@odata.etag"] &&
                                  formData.status !== "Pending Approval"
                                ) {
                                  updateParticipantAttendance(
                                    participant.systemId,
                                    participant["@odata.etag"],
                                    e.target.checked
                                  );
                                }
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${
                                formData.status === "Pending Approval"
                                  ? "btn-secondary"
                                  : "btn-danger"
                              }`}
                              disabled={formData.status === "Pending Approval"}
                              onClick={() => {
                                if (
                                  participant.systemId &&
                                  participant["@odata.etag"] &&
                                  formData.status !== "Pending Approval"
                                ) {
                                  deleteExpectedParticipant(
                                    participant.systemId,
                                    participant["@odata.etag"]
                                  );
                                }
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {state.expectedParticipants.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No expected participants found. Add participants to
                            this training line.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${
                    formData.status === "Pending Approval"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  disabled={formData.status === "Pending Approval"}
                  onClick={openAddParticipantModal}
                >
                  <PlusIcon /> Add Participant
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeParticipantsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {state.isAddParticipantModalOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Add Expected Participant
                  {formData.status === "Pending Approval" ? (
                    <span className="badge bg-warning ms-2">
                      Disabled - Status: {formData.status}
                    </span>
                  ) : null}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeAddParticipantModal}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="employeeNo" className="form-label">
                      Employee <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={state.employeeOptions}
                      value={state.newParticipantData.no}
                      onChange={(selectedOption) => {
                        if (
                          selectedOption &&
                          formData.status !== "Pending Approval"
                        ) {
                          updateNewParticipantData("no", [selectedOption]);
                        } else if (formData.status !== "Pending Approval") {
                          updateNewParticipantData("no", []);
                        }
                      }}
                      id="employeeNo"
                      classNamePrefix="select"
                      isSearchable={true}
                      isDisabled={formData.status === "Pending Approval"}
                      placeholder="Search and select an employee..."
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: "white",
                          borderColor: state.isFocused ? "#556ee6" : "#ced4da",
                          "&:hover": {
                            borderColor: "#556ee6",
                          },
                          boxShadow: state.isFocused
                            ? "0 0 0 0.2rem rgba(85, 110, 230, 0.25)"
                            : "none",
                          minHeight: "36px",
                        }),
                        menu: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: "white",
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="trainingNeed" className="form-label">
                      Training Need
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="trainingNeed"
                      value={state.newParticipantData.trainingNeed}
                      disabled={formData.status === "Pending Approval"}
                      onChange={(e) => {
                        if (formData.status !== "Pending Approval") {
                          updateNewParticipantData(
                            "trainingNeed",
                            e.target.value
                          );
                        }
                      }}
                      placeholder="Training need description"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className={`btn ${
                    formData.status === "Pending Approval"
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                  disabled={formData.status === "Pending Approval"}
                  onClick={() => {
                    if (formData.status !== "Pending Approval") {
                      addExpectedParticipant();
                    }
                  }}
                >
                  <PlusIcon /> Add Participant
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeAddParticipantModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainingPlanDetails;
