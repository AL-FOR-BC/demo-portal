import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import Lines from "../../../Components/ui/Lines/Lines";
import { useTrainingPlanDocument } from "../../../hooks/documents/useTrainingPlanDocument";
import { useAppSelector } from "../../../store/hook";
import Select from "react-select";
import {
  PlusIcon,
  DeleteIcon,
  UserIcon,
} from "../../../Components/common/icons/icons";
import { decodeValue, formatNumberWithCommas } from "../../../utils/common";

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

const ApproveTrainingPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);

  const {
    formData,
    getFormFields,
    state,
    populateDocument,
    fetchTrainingPlanLines,
    fetchProgramOptions,
    // Expected participants functions
    openParticipantsModal,
    closeParticipantsModal,
    openAddParticipantModal,
    closeAddParticipantModal,
    updateNewParticipantData,
    addExpectedParticipant,
    updateParticipantAttendance,
    deleteExpectedParticipant,
  } = useTrainingPlanDocument({ mode: "approve" });

  // Load the training plan data
  React.useEffect(() => {
    if (id) {
      // For approval pages, id is the document number (e.g., TP-00002), not systemId
      populateDocument(undefined, id);
    }
  }, [id, populateDocument]);

  // Load training plan lines
  React.useEffect(() => {
    if (formData.no) {
      fetchTrainingPlanLines(formData.no);
    }
  }, [formData.no, fetchTrainingPlanLines]);

  // Load program options
  React.useEffect(() => {
    fetchProgramOptions();
  }, [fetchProgramOptions]);

  const getFormFieldsForApproval = () => {
    const fields = getFormFields();

    // Make all fields read-only for approval
    return fields.map((fieldGroup) =>
      fieldGroup.map((field) => ({
        ...field,
        disabled: true,
        onChange: undefined,
        onBlur: undefined,
      }))
    );
  };

  // Custom columns with participant management for approval
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
      <div>
        <HeaderMui
          title="Approve Training Plan"
          subtitle={`Training Plan: ${formData.no || id}`}
          breadcrumbItem="Approve Training Plan"
          fields={getFormFieldsForApproval()}
          isLoading={state.isLoading}
          pageType="approval"
          handleBack={() => navigate("/approvals")}
          companyId={companyId}
          documentType={decodeValue("Training_x0020_Plan")}
          requestNo={formData.no || id}
          status={formData.status}
          lines={
            <Lines
              title="Training Plan Lines"
              subTitle="Training Plan Lines"
              breadcrumbItem="Training Plan Lines"
              addLink=""
              addLabel=""
              iconClassName=""
              noDataMessage="No training plan lines found"
              data={state.trainingPlanLines as any[]}
              columns={getCustomLinesColumns()}
              status={formData.status || ""}
              modalFields={[]}
              handleSubmitLines={() => {}}
              handleDeleteLines={() => {}}
              handleSubmitUpdatedLine={() => {}}
              clearLineFields={() => {}}
              handleValidateHeaderFields={() => true}
            />
          }
        />
      </div>

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

export default ApproveTrainingPlan;
