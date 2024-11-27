import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import HeaderMui from "../../Components/ui/Header/HeaderMui";
import { getErrorMessage } from "../../utils/common";
import { TimeSheetsService } from '../../services/TimeSheetsService';
// import { TimeSheetLine } from '../../@types/timesheet.dto';
import TimeSheetLines from '../../Components/ui/Lines/TimeSheetLines';
import { format } from 'date-fns';

function TimeSheetDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { companyId } = useAppSelector(state => state.auth.session);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [timeSheetNo, setTimeSheetNo] = useState < string > ('');
    const [startingDate, setStartingDate] = useState < Date > (new Date());
    const [endingDate, setEndingDate] = useState < Date > (new Date());
    const [resourceNo, setResourceNo] = useState < string > ('');
    const [resourceName, setResourceName] = useState < string > ('');
    const [description, setDescription] = useState < string > ('');
    // const [status, setStatus] = useState < string > ('');
    const status = 'Open'

    const [projects, setProjects] = useState([
        { value: 'JOB00020', label: 'JOB00020' },
        { value: 'JOB00030', label: 'JOB00030' },
        { value: 'JOB00010', label: 'JOB00010' },
        // Add more projects as needed
    ]);

    const fields = [
        [
            { label: 'No.', type: 'text', value: timeSheetNo, disabled: true, id: 'timeSheetNo' },
            { label: 'Resource No.', type: 'text', value: resourceNo, disabled: true, id: 'resourceNo' },
            { label: 'Resource Name', type: 'text', value: resourceName, disabled: true, id: 'resourceName' },
            {
                label: 'Description',
                type: 'text',
                value: description,
                disabled: true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setDescription(e.target.value);
                    quickUpdate({ description: e.target.value });
                },
                id: 'description'
            }

        ],
        [
            {
                label: 'Starting Date',
                type: 'date',
                value: startingDate,
                disabled: true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setStartingDate(new Date(e.target.value));
                    quickUpdate({ startingDate: e.target.value });
                },
                id: 'startingDate'
            },
            {
                label: 'Ending Date',
                type: 'date',
                value: endingDate,
                disabled: true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setEndingDate(new Date(e.target.value));
                    quickUpdate({ endingDate: e.target.value });
                },
                id: 'endingDate'
            },

        ]
    ];

    const publicHolidays = [
        { date: '2024-10-09', description: 'Independence Day' },
        { date: '2024-10-20', description: "Martin Luther King Day" },
    ];
    const customStyles = `
        .weekend-cell {
            background-color: #f5f5f5;
            color: #999;
        }
        .holiday-cell {
            background-color: #fff3e0;
            color: #ff9800;
        }
        .submitted-cell {
            background-color: #f5f5f5;
            color: #666;
            pointer-events: none;
            cursor: not-allowed;
        }
    `;

    const quickUpdate = async (data) => {
        try {
            console.log(data)
            // In real implementation, call your API here
            toast.success("Updated successfully");
        } catch (error) {
            toast.error(`Error updating: ${getErrorMessage(error)}`);
        }
    };

    const handleSubmitLines = async (data) => {
        try {
            const res = await TimeSheetsService.addTimeSheetLines(companyId, data);
            if (res.status === 201) {
                populateData();
                toast.success('New line added successfully');
                return res
            }
        } catch (error) {
            toast.error(`Error submitting line: ${getErrorMessage(error)}`);
            throw error;
        }
    };

    const handleDeleteLine = async (systemId: string) => {
        try {
            const res = await TimeSheetsService.deleteTimeSheetDetails(companyId, systemId);
            console.log(res)
            return true;
        } catch (error) {
            toast.error(`Error deleting line: ${getErrorMessage(error)}`);
            return false;
        }
    };

    const handleEditLine = async (data: any) => {
        try {
            // Add interface for day update type
            interface DayUpdate {
                systemId: string;
                timeSheetLineNo: string;
                date: string;
                quantity: number;
            }

            // Initialize array with type
            const dayUpdates: DayUpdate[] = [];

            for (let i = 1; i <= 31; i++) {
                const dayKey = `day${i}`;
                const dayData = data[dayKey];

                if (dayData) {
                    dayUpdates.push({
                        systemId: dayData.systemId,
                        timeSheetLineNo: data.lineNo,
                        date: dayData.date,
                        quantity: dayData.value
                    });
                }
            }

            const res = await TimeSheetsService.updateTimeSheetLines(
                companyId,
                data.systemId,
                {
                    // lineNo: data.lineNo
                    description: data.description,
                    jobNo: data.project,
                    type: data.causeOfAbsenceCode,
                    // timeSheetDetails: dayUpdates
                },
                ''
            );


            return { success: true, data: res.data };
        } catch (error) {
            toast.error(`Error editing line: ${getErrorMessage(error)}`);
            throw error;
        }
    };

    const [timeSheetLines, setTimeSheetLines] = useState < Array < any >> ([{
        id: 1,
        status: 'Open',
        description: 'Development work',
        project: 'PROJ-001',
        causeOfAbsenceCode: '',
        ...Array.from({ length: 31 }, (_, i) => ({
            [`day${i + 1}`]: 0
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }]);
    const populateData = async () => {
        try {
            setIsLoading(true);
            if (!id) return;
            const filterQuery = `$expand=timeSheetLines`;
            const res = await TimeSheetsService.getTimeSheetHeaderById(companyId, id, filterQuery);

            setTimeSheetNo(res.data.timeSheetNo);
            setStartingDate(new Date(res.data.startingDate));
            setEndingDate(new Date(res.data.endingDate));
            setResourceNo(res.data.ResourceNo);
            setResourceName(res.data.resourceName);
            setDescription(res.data.Description);
            setTimeSheetLines(res.data.timeSheetLines.filter((line) => line.timeSheetNo === res.data.timeSheetNo));


            // setStatus(res.data.status);
            const filterQuery2 = `&$filter=timeSheetNo eq '${res.data.timeSheetNo}'`;
            const resTimeSheetDetail = await TimeSheetsService.getTimeSheetDetails(companyId, filterQuery2);

            // Create holiday lines
            const holidayLines = publicHolidays.map((holiday, index) => {
                const dayNumber = format(new Date(holiday.date), 'd');
                return {
                    id: `holiday-${index}`,
                    systemId: '',
                    status: 'Closed',
                    description: holiday.description,
                    project: '',
                    causeOfAbsenceCode: 'HOLIDAY',
                    editable: false,
                    ...Array.from({ length: 31 }, (_, i) => ({
                        [`day${i + 1}`]: (i + 1) === parseInt(dayNumber) ? 8 : 0
                    })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
                };
            });

            const projectRes = await TimeSheetsService.getJobs(companyId)
            const projectOptions = projectRes.data.value.map(e => ({ label: `${e.jobNo}::${e.description}`, value: e.jobNo }))
            setProjects(projectOptions)

            const timeSheetLinesData = res.data.timeSheetLines.filter((line) => line.timeSheetNo === res.data.timeSheetNo);
            const timeSheetLines = timeSheetLinesData.map((line) => {


                const daysObject = {};

                for (let i = 1; i <= 31; i++) {
                    daysObject[`day${i}`] = 0;
                }

                // Find all details for this line number
                const lineDetails = resTimeSheetDetail.data.value.filter(
                    (detail) => detail.timeSheetLineNo === line.lineNo
                );

                // Map the quantities to the corresponding days
                lineDetails.forEach((detail) => {
                    const dayNumber = format(new Date(detail.date), 'd');
                    daysObject[`day${dayNumber}`] = {
                        value: detail.quantity,
                        systemId: detail.systemId, // Store the systemId for each day
                        date: detail.date
                    };
                });

                return {
                    id: line.lineNo,
                    timeSheetNo: line.timeSheetNo,
                    jobTaskNo: line.jobTaskNo,
                    systemId: line.systemId,
                    lineNo: line.lineNo,
                    status: line.Status || 'Open',
                    description: line.description,
                    project: line.jobNo,
                    causeOfAbsenceCode: line.type,
                    editable: line.Status === 'Submitted' ? false : true,
                    ...daysObject
                };
            });
            // setTimeSheetLines([...holidayLines, ...timeSheetLines]);
            console.log(timeSheetLines)
            setTimeSheetLines(timeSheetLines)
        } catch (error) {
            toast.error(`Error fetching data: ${getErrorMessage(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        populateData();
    }, [id]);


    const handleReopen = async () => {
        try {
            const res = await TimeSheetsService.reopenTimeSheet(companyId, { documentNo: timeSheetNo });
            if (res.status === 200 || res.status === 204) {
                populateData();
                toast.success('Time sheet reopened successfully');
            }
        } catch (error) {
            toast.error(`Error reopening time sheet: ${getErrorMessage(error)}`);
        }
    }

    const handleSubmit = async () => {
        try {
            const res = await TimeSheetsService.submitTimeSheet(companyId, { documentNo: timeSheetNo });
            if (res.status === 200 || res.status === 204) {
                populateData();
                toast.success('Time sheet submitted successfully');
            }
        } catch (error) {
            toast.error(`Error submitting time sheet: ${getErrorMessage(error)}`);
        }
    }

    const handleEditLineOnHoursUpdate = async (lineId, date, value, systemId) => {
        try {
            const result = await TimeSheetsService.updateTimeSheetDetails(companyId, systemId, {
                timeSheetLineNo: lineId,
                date: date,
                quantity: value
            }, '');
            if (result.status === 200) {
                // populateData();
                toast.success('Line updated successfully');
            }
            return result;
        } catch (error) {
            toast.error(`Failed to update line: ${getErrorMessage(error)}`);
            throw error;
        }
    }

    const handleSubmitLineHours = async (data) => {
        try {
            console.log(data)
            const result = await TimeSheetsService.postTimeSheetDetails(companyId, data);
            if (result.status === 201) {
                toast.success('Line updated successfully');
                return result;
            }
        } catch (error) {
            toast.error(`Failed to update line: ${getErrorMessage(error)}`);
            throw error;
        }
    }

    return (
        <>
            <style>{customStyles}</style>
            <HeaderMui
                title="Time Sheet Detail"
                subtitle="Time Sheet Detail"
                breadcrumbItem="Time Sheet Detail"
                fields={fields}
                isLoading={isLoading}
                status={status}
                handleBack={() => navigate('/time-sheets')}
                handleSendApprovalRequest={() => { }}
                handleDeletePurchaseRequisition={() => { }}
                handleCancelApprovalRequest={() => { }}
                companyId={companyId}
                documentType="Time Sheet"
                requestNo={timeSheetNo}
                pageType="time-sheet"
                handleReopen={handleReopen}
                handleSubmit={handleSubmit}
                lines={
                    <TimeSheetLines
                        startingDate={startingDate}
                        endingDate={endingDate}
                        lines={timeSheetLines}
                        projects={projects}
                        timeSheetNo={timeSheetNo}
                        onLineHoursSubmit={handleSubmitLineHours}
                        onLineHoursUpdate={async (lineId, date, value, systemId) => {
                            try {
                                const result = await handleEditLineOnHoursUpdate(lineId, date, value, systemId);
                                if (result.status === 200) {
                                    // toast.success('Line updated successfully');
                                }
                            } catch (error) {
                                toast.error(`Failed to update line: ${getErrorMessage(error)}`);
                                throw error;
                            }
                        }}
                        onLineUpdate={async (updatedLine) => {
                            try {
                                const result = await handleEditLine(updatedLine);
                                if (result.success) {
                                    // toast.success('Line updated successfully');
                                    // return result;
                                }
                            } catch (error) {
                                toast.error(`Failed to update line: ${getErrorMessage(error)}`);
                                throw error;
                            }
                        }}
                        onLineDelete={async (systemId) => {
                            try {
                                const success = await handleDeleteLine(systemId);
                                if (success) {
                                    // toast.success('Line deleted successfully');
                                } else {
                                    throw new Error('Failed to delete line');
                                }
                            } catch (error) {
                                toast.error(`Failed to delete line: ${getErrorMessage(error)}`);
                                throw error;
                            }
                        }}
                        onLineAdd={handleSubmitLines}
                        // publicHolidays={publicHolidays}
                        publicHolidays={[]}
                    />
                }
            />
        </>
    );
}

export default TimeSheetDetail;