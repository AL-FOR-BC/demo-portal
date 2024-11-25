import * as React from 'react';
import { Collapse } from 'reactstrap';
import classNames from 'classnames';
import { format, eachDayOfInterval, isWeekend } from 'date-fns';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { PlusIcon } from '../../common/icons/icons';
import { getErrorMessage } from '../../../utils/common';

interface TimeSheetLinesProps {
  startingDate: Date;
  endingDate: Date;
  lines: any[];
  projects: { value: string; label: string }[];
  onLineUpdate: (updatedLine: any) => Promise<void>;
  onLineDelete: (lineId: string) => Promise<void>;
  onLineAdd: (newLine: any) => Promise<void>;
  publicHolidays: { date: string; description: string }[];
}

const TimeSheetLines: React.FC<TimeSheetLinesProps> = ({
  startingDate,
  endingDate,
  lines,
  projects,
  onLineUpdate,
  onLineDelete,
  onLineAdd,
  publicHolidays
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

  const handleInputChange = async (lineId: string, field: string, value: any) => {
    const updatedLines = localLines.map(line => {
      if (line.id === lineId) {
        const updatedLine = { ...line, [field]: value };
        // Trigger save
        onLineUpdate(updatedLine).catch(error => {
          toast.error(`Failed to save changes: ${getErrorMessage(error)}`);
          // Revert changes on error
          setLocalLines(prevLines => prevLines.map(l => l.id === lineId ? line : l));
        });
        return updatedLine;
      }
      return line;
    });
    setLocalLines(updatedLines);
  };

  const handleHoursChange = async (lineId: string, date: Date, value: number) => {
    const dayKey = `day${format(date, 'd')}`;
    await handleInputChange(lineId, dayKey, {
      value,
      date: format(date, 'yyyy-MM-dd'),
      systemId: localLines.find(l => l.id === lineId)?.[dayKey]?.systemId || ''
    });
  };

  const handleDelete = async (lineId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onLineDelete(lineId);
          setLocalLines(prevLines => prevLines.filter(line => line.id !== lineId));
          toast.success('Line deleted successfully');
        } catch (error) {
          toast.error('Failed to delete line');
        }
      }
    });
  };

  const handleAddLine = async () => {
    const newLineNo = Math.floor(Math.random() * 1000000);
    const newLine = {
      id: `temp-${newLineNo}`,
      lineNo: newLineNo,
      status: 'Open',
      description: '',
      project: '',
      causeOfAbsenceCode: '',
      ...dateRange.reduce((acc, date) => ({
        ...acc,
        [`day${format(date, 'd')}`]: { value: 0, date: format(date, 'yyyy-MM-dd') }
      }), {})
    };

    try {
      await onLineAdd(newLine);
      setLocalLines(prevLines => [newLine, ...prevLines]);
      toast.success('New line added successfully');
    } catch (error) {
      toast.error('Failed to add new line');
    }
  };

  const isHoliday = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return publicHolidays.some(holiday => holiday.date === dateStr);
  };

  const isEditable = (line: any, date: Date) => {
    if (!line || !line.id) return false;
    
    const isHolidayLine = typeof line.id === 'string' && line.id.startsWith('holiday-');
    const isSubmitted = line.status === 'Submitted';
    const isWeekendDay = isWeekend(date);
    const isHolidayDate = publicHolidays.some(
        holiday => holiday.date === format(date, 'yyyy-MM-dd')
    );

    return !isHolidayLine && 
           !isSubmitted && 
           !isWeekendDay && 
           !isHolidayDate;
  };

  const handleLocalChange = (lineId: string, field: string, value: any) => {
    setLocalLines(prevLines => prevLines.map(line => 
      line.id === lineId ? { ...line, [field]: value } : line
    ));
  };

  const handleLocalHoursChange = (lineId: string, date: Date, value: number) => {
    const dayKey = `day${format(date, 'd')}`;
    handleLocalChange(lineId, dayKey, {
      value,
      date: format(date, 'yyyy-MM-dd'),
      systemId: localLines.find(l => l.id === lineId)?.[dayKey]?.systemId || ''
    });
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingLines">
        <button
          className={classNames("accordion-button", "fw-medium", { collapsed: !isOpen })}
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
            <button
              className="btn btn-primary btn-label"
              onClick={handleAddLine}
            >
              <PlusIcon className="label-icon" />
              Add Line
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead>
                <tr>
                  <th>Status</th>
                  <th style={{ minWidth: '200px' }}>Description</th>
                  <th style={{ minWidth: '200px' }}>Project</th>
                  <th style={{ minWidth: '150px' }}>Absence Code</th>
                  {dateRange.map(date => (
                    <th 
                      key={format(date, 'yyyy-MM-dd')} 
                      className={classNames("text-center", {
                        'bg-light': isWeekend(date),
                        'bg-warning-subtle': isHoliday(date)
                      })}
                      style={{ minWidth: '60px' }}
                    >
                      {format(date, 'd')}<br/>
                      {format(date, 'EEE')}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localLines.map(line => (
                  <tr key={line.id}>
                    <td>{line.status}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={line.description}
                        onChange={e => handleLocalChange(line.id, 'description', e.target.value)}
                        onBlur={e => handleInputChange(line.id, 'description', e.target.value)}
                        disabled={!isEditable(line, new Date())}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={line.project}
                        onChange={e => handleLocalChange(line.id, 'project', e.target.value)}
                        onBlur={e => handleInputChange(line.id, 'project', e.target.value)}
                        disabled={!isEditable(line, new Date())}
                      >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                          <option key={project.value} value={project.value}>
                            {project.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={line.causeOfAbsenceCode}
                        onChange={e => handleLocalChange(line.id, 'causeOfAbsenceCode', e.target.value)}
                        onBlur={e => handleInputChange(line.id, 'causeOfAbsenceCode', e.target.value)}
                        disabled={!isEditable(line, new Date())}
                      />
                    </td>
                    {dateRange.map(date => (
                      <td 
                        key={format(date, 'yyyy-MM-dd')}
                        className={classNames("text-center", {
                          'bg-light': isWeekend(date),
                          'bg-warning-subtle': isHoliday(date)
                        })}
                      >
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={line[`day${format(date, 'd')}`]?.value || 0}
                          onChange={e => handleLocalHoursChange(line.id, date, Number(e.target.value))}
                          onBlur={e => handleHoursChange(line.id, date, Number(e.target.value))}
                          disabled={!isEditable(line, date)}
                          min="0"
                          max="24"
                          step="0.5"
                          style={{ width: '60px' }}
                        />
                      </td>
                    ))}
                    <td>
                      {isEditable(line, new Date()) && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(line.id)}
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