import * as React from "react";
import { Collapse } from "reactstrap";
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

  // Generate array of dates between start and end
  const dateRange = React.useMemo(() => {
    if (!startingDate || !endingDate) return [];
    return eachDayOfInterval({ start: startingDate, end: endingDate });
  }, [startingDate, endingDate]);

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
          onLineHoursUpdate(
            lineId,
            value.date,
            value.value,
            value.systemId
          ).catch((error) => {
            setLocalLines((prevLines) =>
              prevLines.map((l) => (l.id === lineId ? line : l))
            );
            toast.error(`Failed to update hours: ${getErrorMessage(error)}`);
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
            console.log(data);

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
              });
          }
        }

        if (
          typeof updatedLine === "object" &&
          typeof updatedLine.id === "string" &&
          updatedLine.id.startsWith("temp-") &&
          updatedLine?.description === ""
        ) {
          const newLine = {
            jobNo: updatedLine.project,
            timeSheetNo: updatedLine.timeSheetNo,
            // type: 'project',
            // jobTaskNo: updatedLine.jobTaskNo,
            description: updatedLine.description,
            // status: 'Open'
          };
          console.log("newLine");
          console.log(newLine);

          onLineAdd(newLine).then((result) => {
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
          });
        }
        if (typeof updatedLine === "object" && updatedLine.systemId !== "") {
          onLineUpdate(updatedLine).catch((error) => {
            toast.error(`Failed to save changes: ${getErrorMessage(error)}`);
            console.log("it runs runser ursnesrusern usernsuer ");

            // Revert changes on error
            setLocalLines((prevLines) =>
              prevLines.map((l) => (l.id === lineId ? line : l))
            );
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

  const handleLocalHoursChange = (
    lineId: string,
    date: Date,
    value: number
  ) => {
    const dayKey = `day${format(date, "d")}`;
    handleLocalChange(lineId, dayKey, {
      value,
      date: format(date, "yyyy-MM-dd"),
      systemId:
        localLines.find((l) => l.id === lineId)?.[dayKey]?.systemId || "",
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
          <div className="d-flex justify-content-end mb-3">
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
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
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
                        key={`${line.id}-${format(date, "yyyy-MM-dd")}` || `date-cell-${line.id}-${index}`}
                        className={classNames("text-center", {
                          "bg-light": isWeekend(date),
                          "bg-warning-subtle": isHoliday(date),
                        })}
                      >
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={line[`day${format(date, "d")}`]?.value}
                          onChange={(e) => {
                            if (Number(e.target.value) > 8) {
                              toast.error("Hours cannot be greater than 8");
                              return;
                            }
                            // project is empty then show error
                            if (line.project === "") {
                              toast.error("Please first select a project");
                              return;
                            }
                            handleLocalHoursChange(
                              line.id,
                              date,
                              Number(e.target.value)
                            );
                          }}
                          onBlur={(e) =>
                            handleHoursChange(
                              line.id,
                              date,
                              Number(e.target.value)
                            )
                          }
                          disabled={!isEditable(line, date)}
                          min="0"
                          max="24"
                          step="0.5"
                          style={{ width: "60px" }}
                        />
                      </td>
                    ))}
                    <td className="text-center" style={{ fontWeight: "bold" }}>
                      {calculateLineTotal(line).toFixed(2)}
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
