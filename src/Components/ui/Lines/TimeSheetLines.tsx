import * as React from "react";
import {
  Collapse,
  Tooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import classNames from "classnames";
import { format, eachDayOfInterval, isWeekend } from "date-fns";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { PlusIcon } from "../../common/icons/icons";
import { getErrorMessage } from "../../../utils/common";
import { TimeSheetLinesProps } from "../../../@types/timesheet.dto";

const TimeSheetLines: React.FC<TimeSheetLinesProps> = ({
  startingDate,
  endingDate,
  viewStats,
  lines,
  projects,
  timeSheetNo,
  onLineUpdate,
  onLineHoursSubmit,
  onLineHoursUpdate,
  onLineDelete,
  onLineAdd,
  publicHolidays,
  isApprovalMode,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [localLines, setLocalLines] = React.useState(lines);
  const [savingStatus, setSavingStatus] = React.useState(false);

  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Generate array of dates between start and end
  const dateRange =
    !startingDate || !endingDate
      ? []
      : //? return array of all days between startingDate and endingDate
        eachDayOfInterval({ start: startingDate, end: endingDate });

  React.useEffect(() => {
    setLocalLines(lines);
  }, [lines]);

  const handleInputChange = async (
    lineId: string,
    field: string,
    value: any
  ) => {
    const updatedLines = localLines.map((line) => {
      if (line.id === lineId) {
        const updatedLine = { ...line, [field]: value };
        if (typeof value === "object" && value?.systemId) {
          setSavingStatus(true);

          onLineHoursUpdate(lineId, value.date, value.value, value.systemId)
            .catch((error) => {
              // Revert to the previous value stored in value.previousValue
              toast.error(`Failed to update hours: ${getErrorMessage(error)}`);
            })
            .finally(() => {
              setSavingStatus(false);
            });

          return updatedLine;
        }

        if (
          typeof value === "object" &&
          value?.date &&
          value?.value &&
          value?.systemId === ""
        ) {
          if (value.value > 0) {
            const data = {
              jobNo: line.project,
              jobTaskNo: line.jobTaskNo,
              timeSheetNo: line.timeSheetNo,
              timeSheetLineNo: line.id,
              date: value.date,
              quantity: value.value,
            };
            setSavingStatus(true);

            onLineHoursSubmit(data)
              .then((result) => {
                // update the line with the new systemId
                const dayKey = `day${format(value.date, "d")}`;
                const updatedLine = {
                  ...line,
                  [dayKey]: { ...line[dayKey], systemId: result.data.systemId },
                };
                setLocalLines((prevLines) =>
                  prevLines.map((l) => (l.id === lineId ? updatedLine : l))
                );
              })
              .catch((error) => {
                setLocalLines((prevLines) =>
                  prevLines.map((l) => (l.id === lineId ? line : l))
                );
                toast.error(
                  `Failed to submit hours: ${getErrorMessage(error)}`
                );
              })
              .finally(() => {
                setSavingStatus(false);
              });
          }
        }

        if (
          typeof updatedLine === "object" &&
          typeof updatedLine.id === "string" &&
          updatedLine.id.startsWith("temp-") &&
          updatedLine?.description === ""
        ) {
          setSavingStatus(true);

          const newLine = {
            jobNo: updatedLine.project,
            timeSheetNo: updatedLine.timeSheetNo,
            // type: 'project',
            // jobTaskNo: updatedLine.jobTaskNo,
            description: updatedLine.description,
            // status: 'Open'
          };

          onLineAdd(newLine)
            .then((result) => {
              const prevLineNo = updatedLine.lineNo;

              if (result.status === 201) {
                console.log("updatedLine");
                console.log(updatedLine);
                const line = {
                  ...updatedLine,
                  systemId: result.data.systemId,
                  lineNo: result.data.lineNo,
                  jobTaskNo: result.data.jobTaskNo,
                  id: result.data.lineNo,
                };
                setLocalLines((prevLines) =>
                  prevLines.map((l) => (l.id === prevLineNo ? line : l))
                );
                return line;
              }
            })
            .finally(() => {
              setSavingStatus(false);
            });
        }
        if (typeof updatedLine === "object" && updatedLine.systemId !== "") {
          setSavingStatus(true);

          onLineUpdate(updatedLine)
            .catch((error) => {
              toast.error(`Failed to save changes: ${getErrorMessage(error)}`);
              console.log("it runs runser ursnesrusern usernsuer ");

              // Revert changes on error
              setLocalLines((prevLines) =>
                prevLines.map((l) => (l.id === lineId ? line : l))
              );
            })
            .finally(() => {
              setSavingStatus(false);
            });
          return updatedLine;
        }
      }
      return line;
    });
    setLocalLines(updatedLines);
  };

  const handleHoursChange = async (
    lineId: string,
    date: Date,
    value: number
  ) => {
    const dayKey = `day${format(date, "d")}`;
    // const currentLine = localLines.find((l) => l.id === lineId);
    // const previousValue = currentLine?.[dayKey]?.value || 0;

    // first get the date column being edited.
    const columnDate = dayKey;
    // second get sum up all the values of that date column.
    const columnTotal = localLines.reduce((acc, line) => {
      return acc + (line[columnDate]?.value || 0);
    }, 0);
    console.log("columnTotal --------------");
    console.log("columnTotal", columnTotal);

    // if (columnTotal + value > 8) {
    //   console.log("running here -----------------------------")
    //   toast.error("Total hours cannot be greater than 8");
    //   //revert the value to the previous value
    //   await handleInputChange(lineId, dayKey, {
    //     value: previousValue,
    //     date: format(date, "yyyy-MM-dd"),
    //     systemId:
    //       localLines.find((l) => l.id === lineId)?.[dayKey]?.systemId || "",
    //   });
    //   return;
    // }

    await handleInputChange(lineId, dayKey, {
      value,
      date: format(date, "yyyy-MM-dd"),
      systemId:
        localLines.find((l) => l.id === lineId)?.[dayKey]?.systemId || "",
    });
  };

  const handleDelete = async (line: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // if id starts temp- then delete from
          if (line.systemId === "") {
            setLocalLines((prevLines) =>
              prevLines.filter((l) => l.id !== line.id)
            );
          } else {
            await onLineDelete(line.systemId);
            setLocalLines((prevLines) =>
              prevLines.filter((l) => l.id !== line.id)
            );
          }
          toast.success("Line deleted successfully");
        } catch (error) {
          toast.error("Failed to delete line");
        }
      }
    });
  };

  const handleAddLine = async () => {
    const newLineNo = Math.floor(Math.random() * 1000000);
    const newLine = {
      id: `temp-${newLineNo}`,
      lineNo: newLineNo,
      status: "Open",
      description: "",
      project: "",
      causeOfAbsenceCode: "",
      jobTaskNo: "",
      timeSheetNo: timeSheetNo,
      systemId: "",
      ...dateRange.reduce(
        (acc, date) => ({
          ...acc,
          [`day${format(date, "d")}`]: {
            value: 0,
            date: format(date, "yyyy-MM-dd"),
          },
        }),
        {}
      ),
    };

    try {
      // await onLineAdd(newLine);
      setLocalLines((prevLines) => [...prevLines, newLine]);
      // toast.success('New line added successfully');
    } catch (error) {
      toast.error("Failed to add new line");
    }
  };

  const isHoliday = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return publicHolidays.some((holiday) => holiday.date === dateStr);
  };

  const isEditable = (line: any, date: Date) => {
    if (isApprovalMode) return false;

    // if (!line || !line.id) return false;

    const isHolidayLine =
      typeof line.id === "string" && line.id.startsWith("holiday-");
    const isSubmitted = line.status === "Submitted";
    const isApproved = line.status === "Approved";
    const isWeekendDay = isWeekend(date);
    const isHolidayDate = publicHolidays.some(
      (holiday) => holiday.date === format(date, "yyyy-MM-dd")
    );

    return (
      !isHolidayLine &&
      !isSubmitted &&
      !isApproved &&
      !isWeekendDay &&
      !isHolidayDate
    );
  };
  // if contain any submitted line user should not be able to add new line
  const canAddLine = !localLines.some(
    (line) => line.status === "Submitted" || line.status === "Approved"
  );

  const handleLocalChange = (lineId: string, field: string, value: any) => {
    setLocalLines((prevLines) =>
      prevLines.map((line) =>
        line.id === lineId ? { ...line, [field]: value } : line
      )
    );
  };

  const handleLocalHoursChange = async (
    lineId: string,
    date: Date,
    value: number
  ) => {
    const dayKey = `day${format(date, "d")}`;
    const currentLine = localLines.find((l) => l.id === lineId);
    const previousValue = currentLine?.[dayKey]?.value || 0;

    // first get the date column being edited.
    const columnDate = dayKey;
    // second get sum up all the values of that date column.
    const columnTotal = localLines.reduce((acc, line) => {
      return acc + (line[columnDate]?.value || 0);
    }, 0);

    console.log("columnTotal", columnTotal);
    console.log("value", value);
    console.log(
      "total + value",
      parseInt(columnTotal) + parseInt(value.toString())
    );

    // third if the sum is greater than 8 then don't allow to save.
    if (parseInt(columnTotal) + parseInt(value.toString()) > 8) {
      toast.error("Total hours cannot be greater than 8");
      //revert the value to the previous value
      await handleInputChange(lineId, dayKey, {
        value: previousValue,
        date: format(date, "yyyy-MM-dd"),
        systemId:
          localLines.find((l) => l.id === lineId)?.[dayKey]?.systemId || "",
      });
      return;
    }

    handleLocalChange(lineId, dayKey, {
      value,
      date: format(date, "yyyy-MM-dd"),
      systemId: currentLine?.[dayKey]?.systemId || "",
      previousValue, // This value will now be used in the revert logic
    });
  };

  // Add a function to calculate total for a line
  const calculateLineTotal = (line: any) => {
    let total = 0;
    for (let i = 1; i <= 31; i++) {
      const dayKey = `day${i}`;
      if (line[dayKey]?.value) {
        total += parseFloat(line[dayKey].value) || 0;
      }
    }
    return total;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    lineId: string,
    currentDate: Date,
    dateRange: Date[]
  ) => {
    const currentIndex = dateRange.findIndex(
      (date) => format(date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
    );

    if (e.key === "ArrowRight" || e.key === "Tab") {
      e.preventDefault();
      const nextInput = document.querySelector(
        `input[data-line="${lineId}"][data-date="${format(
          dateRange[currentIndex + 1] || currentDate,
          "yyyy-MM-dd"
        )}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevInput = document.querySelector(
        `input[data-line="${lineId}"][data-date="${format(
          dateRange[currentIndex - 1] || currentDate,
          "yyyy-MM-dd"
        )}"]`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingLines">
        <button
          className={classNames("accordion-button", "fw-medium", {
            collapsed: !isOpen,
          })}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: "pointer" }}
        >
          Lines
        </button>
      </h2>
      <Collapse isOpen={isOpen} className="accordion-collapse">
        <div className="accordion-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex flex-column gap-3">
              {/* Saving Status */}
              <div>
                {savingStatus ? (
                  <span className="badge bg-primary">Saving...</span>
                ) : (
                  <span className="badge bg-success">Saved</span>
                )}
              </div>

              {/* Stats Cards */}
              <div className="d-flex gap-3">
                {/* Total Hours Card */}
                <div className="card border-0 bg-light">
                  <div className="card-body p-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="ri-time-line text-primary fs-4"></i>
                      <div>
                        <small className="text-muted d-block">
                          Total Hours
                        </small>
                        <h5 className="mb-0 fw-semibold">
                          {viewStats.quantity}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Dropdown */}
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle className="btn btn-light">
                    <i className="ri-bar-chart-line me-1"></i>
                    View Stats
                  </DropdownToggle>
                  <DropdownMenu className="p-3" style={{ minWidth: "240px" }}>
                    <h6 className="dropdown-header border-bottom pb-2">
                      Hours Breakdown
                    </h6>
                    <div className="pt-2">
                      {/* Open Hours */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <i className="ri-checkbox-blank-circle-fill text-info fs-6"></i>
                          </div>
                          <span className="text-muted">Open</span>
                        </div>
                        <span className="badge text-bg-info">
                          {viewStats.quantityOpen}
                        </span>
                      </div>

                      {/* Submitted Hours */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <i className="ri-checkbox-blank-circle-fill text-warning fs-6"></i>
                          </div>
                          <span className="text-muted">Submitted</span>
                        </div>
                        <span className="badge text-bg-warning">
                          {viewStats.quantitySubmitted}
                        </span>
                      </div>

                      {/* Approved Hours */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <i className="ri-checkbox-blank-circle-fill text-success fs-6"></i>
                          </div>
                          <span className="text-muted">Approved</span>
                        </div>
                        <span className="badge text-bg-success">
                          {viewStats.quantityApproved}
                        </span>
                      </div>

                      {/* Rejected Hours */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <i className="ri-checkbox-blank-circle-fill text-danger fs-6"></i>
                          </div>
                          <span className="text-muted">Rejected</span>
                        </div>
                        <span className="badge text-bg-danger">
                          {viewStats.quantityRejected}
                        </span>
                      </div>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            {/* Add Line Button */}
            <div>
              {canAddLine && (
                <button
                  className="btn btn-primary btn-label"
                  onClick={handleAddLine}
                >
                  <PlusIcon className="label-icon" />
                  Add Line
                </button>
              )}
            </div>
          </div>
          <div
            className="table-responsive"
            style={{ position: "relative", overflowX: "auto" }}
          >
            <style>
              {`
                .sticky-columns th:nth-child(-n+3),
                .sticky-columns td:nth-child(-n+3) {
                  position: sticky;
                  background: white;
                  z-index: 1;
                }
                .sticky-columns th:nth-child(1),
                .sticky-columns td:nth-child(1) {
                  left: 0;
                }
                .sticky-columns th:nth-child(2),
                .sticky-columns td:nth-child(2) {
                  left: 65px;
                }
                .sticky-columns th:nth-child(3),
                .sticky-columns td:nth-child(3) {
                left: 250px;
                }
                /* Add shadow to create separation */
                .sticky-columns td:nth-child(3),
                .sticky-columns th:nth-child(3) {
                  box-shadow: 6px 0 8px -5px rgba(0,0,0,0.2);
                }
              `}
            </style>
            <table className="table table-bordered mb-0 sticky-columns">
              <thead>
                <tr>
                  <th>Status</th>
                  <th style={{ minWidth: "200px" }}>Project</th>
                  <th style={{ minWidth: "200px" }}>Description</th>
                  {dateRange.map((date, index) => (
                    <th
                      key={format(date, "yyyy-MM-dd") || `date-header-${index}`}
                      className={classNames("text-center", {
                        "bg-light": isWeekend(date),
                        "bg-warning-subtle": isHoliday(date),
                      })}
                      style={{ minWidth: "60px" }}
                    >
                      {format(date, "d")}
                      <br />
                      {format(date, "EEE")}
                    </th>
                  ))}
                  <th className="text-center">Total</th>
                  <th
                    className="text-center"
                    id="loeTooltip"
                    style={{ cursor: "help" }}
                    onMouseEnter={toggle}
                    onMouseLeave={toggle}
                  >
                    Loe
                    <Tooltip
                      target="loeTooltip"
                      placement="top"
                      isOpen={tooltipOpen}
                      toggle={toggle}
                    >
                      Level of Effort
                    </Tooltip>
                  </th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...localLines].reverse().map((line, index) => (
                  <tr key={line.id || `line-${index}`}>
                    <td>{line.status}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={line.project}
                        onChange={(e) =>
                          handleLocalChange(line.id, "project", e.target.value)
                        }
                        onBlur={(e) =>
                          handleInputChange(line.id, "project", e.target.value)
                        }
                        disabled={!isEditable(line, new Date())}
                      >
                        <option value="">Select Project</option>
                        {projects.map((project, index) => (
                          <option
                            key={project.value || `project-${index}`}
                            value={project.value}
                          >
                            {project.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={line.description}
                        onChange={(e) => {
                          if (line.project === "") {
                            toast.error("Please first select a project");
                            return;
                          }
                          handleLocalChange(
                            line.id,
                            "description",
                            e.target.value
                          );
                        }}
                        onBlur={(e) =>
                          handleInputChange(
                            line.id,
                            "description",
                            e.target.value
                          )
                        }
                        disabled={!isEditable(line, new Date())}
                      />
                    </td>
                    {dateRange.map((date, index) => (
                      <td
                        key={
                          `${line.id}-${format(date, "yyyy-MM-dd")}` ||
                          `date-cell-${line.id}-${index}`
                        }
                        className={classNames("text-center", {
                          "bg-light": isWeekend(date),
                          "bg-warning-subtle": isHoliday(date),
                        })}
                      >
                        <style>
                          {`
          /* Chrome, Safari, Edge, Opera */
          .number-input::-webkit-outer-spin-button,
          .number-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          .number-input {
            -moz-appearance: textfield;
          }
        `}
                        </style>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center number-input"
                          value={line[`day${format(date, "d")}`]?.value}
                          data-line={line.id}
                          data-date={format(date, "yyyy-MM-dd")}
                          onChange={(e) => {
                            if (line.project === "") {
                              toast.error("Please first select a project");
                              return;
                            }
                            handleLocalHoursChange(
                              line.id,
                              date,
                              Number(e.target.value.replace(/^0+/, ""))
                            );
                          }}
                          onBlur={(e) =>
                            handleHoursChange(
                              line.id,
                              date,
                              Number(e.target.value.replace(/^0+/, ""))
                            )
                          }
                          onKeyDown={(e) => handleKeyDown(e, line.id, date, dateRange)}
                          disabled={!isEditable(line, date)}
                          min="0"
                          max="8"
                          step="1"
                          style={{
                            width: "60px",
                            MozAppearance: "textfield",
                            WebkitAppearance: "none",
                            margin: "0",
                            appearance: "none",
                          }}
                        />
                      </td>
                    ))}

                    <td className="text-center" style={{ fontWeight: "bold" }}>
                      {calculateLineTotal(line).toFixed(2)}
                    </td>
                    <td className="text-center" style={{ fontWeight: "bold" }}>
                      {line?.loe ? line.loe : 0}
                    </td>
                    <td>
                      {isEditable(line, new Date()) && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(line)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default TimeSheetLines;
