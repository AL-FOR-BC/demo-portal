import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import HeaderMui from "../../Components/ui/Header/HeaderMui";
// import { options } from "../../@types/common.dto";
import { getErrorMessage } from "../../utils/common";
// import Swal from "sweetalert2";
import { isWeekend, format, eachDayOfInterval } from 'date-fns';
import { TimeSheetsService } from '../../services/TimeSheetsService';
import { TimeSheetLine } from '../../@types/timesheet.dto';

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

    const fields = [
        [
            { label: 'No.', type: 'text', value: timeSheetNo, disabled: true, id: 'timeSheetNo' },
            { label: 'Resource No.', type: 'text', value: resourceNo, disabled: true, id: 'resourceNo' },
            { label: 'Resource Name', type: 'text', value: resourceName, disabled: true, id: 'resourceName' },
            {
                label: 'Description',
                type: 'text',
                value: description,
                disabled: status !== 'Open',
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
                disabled: status !== 'Open',
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
                disabled: status !== 'Open',
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

    const generateDateColumns = () => {
        if (!startingDate || !endingDate) return [];

        const dateRange = eachDayOfInterval({
            start: new Date(startingDate),
            end: new Date(endingDate)
        });

        return dateRange.map(date => {
            const dayNumber = format(date, 'd');
            const dayName = format(date, 'EEE');
            const dateStr = format(date, 'yyyy-MM-dd');
            const isWeekendDay = isWeekend(date);
            const isHoliday = publicHolidays.some(holiday => holiday.date === dateStr);

            return {
                field: `day${dayNumber}`,
                headerName: `${dayNumber} ${dayName}`,
                width: 80,
                // Disable editing if status is 'Submitted' or it's a weekend/holiday
                editable: (params: any) => {
                    if (!params.row) return false;
                    return params.row.status !== 'Submitted' && !isWeekendDay && !isHoliday;
                },
                type: 'number',
                valueFormatter: (params: any) => {
                    // if (!params) return '0.00';
                    const value = params ?? 0;
                    return Number(value);
                },
                // Add cellClassName to style disabled cells
                cellClassName: (params: any) => {
                    if (params.row?.status === 'Submitted') {
                        return 'submitted-cell';
                    }
                    return isWeekendDay ? 'weekend-cell' : 
                           isHoliday ? 'holiday-cell' : '';
                },
            };
        });
    };

    const columns = [
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            editable: false,
            
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 200,
            editable: (params: any) => !params.row.id.toString().startsWith('holiday-'),
        },
        {
            field: 'project',
            headerName: 'Project',
            width: 150,
            editable: (params: any) => !params.row.id.toString().startsWith('holiday-'),
        },
        {
            field: 'causeOfAbsenceCode',
            headerName: 'Cause of Absence Code',
            width: 180,
            editable: (params: any) => !params.row.id.toString().startsWith('holiday-'),
        },
        ...generateDateColumns(),
        {
            field: 'total',
            headerName: 'Total',
            width: 100,
            editable: false,
            valueGetter: (params: any) => {
                // Early return if params or row is undefined
                if (!params?.row) {
                    return 0;
                }

                try {
                    const dateRange = eachDayOfInterval({
                        start: new Date(startingDate),
                        end: new Date(endingDate)
                    });

                    return dateRange.reduce((sum, date) => {
                        const dayNumber = format(date, 'd');
                        const fieldName = `day${dayNumber}`;
                        const value = params.row[fieldName];
                        return sum + (Number(value) || 0);
                    }, 0);
                } catch (error) {
                    console.error('Error calculating total:', error);
                    return 0;
                }
            },
            valueFormatter: (params: any) => {
                if (params?.value == null) {
                    return '0.00';
                }
                return Number(params.value).toFixed(2);
            },
        }
    ];
    // Add styles for weekend and holiday cells
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

    // const dummyTimeSheet = {
    //     no: 'TSH-00000002',
    //     startingDate: '2024-10-01',
    //     endingDate: '2024-10-31',
    //     resourceNo: 'RES-001',
    //     resourceName: 'SHRP',
    //     description: 'Monthly Time Sheet',
    //     status: 'Open',
    //     lines: [
    //         {
    //             id: 1,
    //             status: 'Open',
    //             description: 'Development work',
    //             project: 'PROJ-001',
    //             causeOfAbsenceCode: '',
    //             // Initialize all days with 0
    //             ...Array.from({ length: 31 }, (_, i) => ({
    //                 [`day${i + 1}`]: 0
    //             })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    //         }
    //     ]
    // };

    const quickUpdate = async (data) => {
        try {
            console.log(data)
            // In real implementation, call your API here
            toast.success("Updated successfully");
        } catch (error) {
            toast.error(`Error updating: ${getErrorMessage(error)}`);
        }
    };

    const handleSubmitLines = async () => {
        try {
            // Implement your line submission logic here
            return { success: true };
        } catch (error) {
            toast.error(`Error submitting line: ${getErrorMessage(error)}`);
            throw error;
        }
    };

    const handleDeleteLine = async () => {
        try {
            // Implement your line deletion logic here
            return true;
        } catch (error) {
            toast.error(`Error deleting line: ${getErrorMessage(error)}`);
            return false;
        }
    };

    const handleEditLine = async () => {
        try {
            // Implement your line editing logic here
            return { success: true };
        } catch (error) {
            toast.error(`Error editing line: ${getErrorMessage(error)}`);
            throw error;
        }
    };

    const [timeSheetLines, setTimeSheetLines] = useState<Array<any>>([{
        id: 1,
        status: 'Open',
        description: 'Development work',
        project: 'PROJ-001',
        causeOfAbsenceCode: '',
        ...Array.from({ length: 31 }, (_, i) => ({
            [`day${i + 1}`]: 0
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }]);

    const createNewLine = (lineNo: number) => {
        return {
            id: lineNo,
            lineNo: lineNo,
            status: 'Open',
            description: '',
            project: '',
            causeOfAbsenceCode: '',
            editable: true,
            ...Array.from({ length: 31 }, (_, i) => ({
                [`day${i + 1}`]: 0
            })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
        };
    };

    useEffect(() => {
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
                setTimeSheetLines(res.data.timeSheetLines.filter((line: any) => line.timeSheetNo === res.data.timeSheetNo));


                // setStatus(res.data.status);
                const filterQuery2 = `&$filter=timeSheetNo eq '${res.data.timeSheetNo}'`;
                const resTimeSheetDetail = await TimeSheetsService.getTimeSheetDetails(companyId, filterQuery2);

                // Create holiday lines
                const holidayLines = publicHolidays.map((holiday, index) => {
                    const dayNumber = format(new Date(holiday.date), 'd');
                    return {
                        id: `holiday-${index}`,
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

                const timeSheetLinesData = res.data.timeSheetLines.filter((line: TimeSheetLine) => line.timeSheetNo === res.data.timeSheetNo);
                const timeSheetLines = timeSheetLinesData.map((line: TimeSheetLine) => {
                    const daysObject = {};

                    for (let i = 1; i <= 31; i++) {
                        daysObject[`day${i}`] = 0;
                    }

                    // Find all details for this line number
                    const lineDetails = resTimeSheetDetail.data.value.filter(
                        (detail: any) => detail.timeSheetLineNo === line.lineNo
                    );

                    // Map the quantities to the corresponding days
                    lineDetails.forEach((detail) => {
                        const dayNumber = format(new Date(detail.date), 'd');
                        daysObject[`day${dayNumber}`] = detail.quantity;
                    });

                    return {
                        id: line.lineNo,
                        lineNo: line.lineNo,
                        status: line.Status || 'Open',
                        description: line.description,
                        project: line.jobNo,
                        causeOfAbsenceCode: line.type,
                        editable: line.Status === 'Submitted' ? false : true,
                        ...daysObject
                    };
                });
                // Regular line
                // const regularLine = {
                //     id: 1,
                //     status: 'Open',
                //     description: 'Development work',
                //     project: 'PROJ-001',
                //     causeOfAbsenceCode: '',
                //     editable: true,
                //     ...Array.from({ length: 31 }, (_, i) => ({
                //         [`day${i + 1}`]: 0
                //     })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
                // };

                setTimeSheetLines([...holidayLines, ...timeSheetLines]);
            } catch (error) {
                toast.error(`Error fetching data: ${getErrorMessage(error)}`);
            } finally {
                setIsLoading(false);
            }
        };

        populateData();
    }, [id]);


    return (
        <>
            <style>{customStyles}</style>
            <HeaderMui
                title="Time Sheet Detail"
                subtitle="Time Sheet Detail"
                breadcrumbItem="Time Sheet Detail"
                fields={fields}
                isLoading={isLoading}
                editableLines={true}
                columns={columns as any}
                rowLines={timeSheetLines}
                handleSubmitLines={handleSubmitLines}
                handleDeleteLine={handleDeleteLine as any}
                handleEditLine={handleEditLine as any}
                handleBack={() => navigate('/time-sheets')}
                pageType="detail"
                status={status}
                companyId={companyId}
                documentType="Time Sheet"
                requestNo={timeSheetNo}
                createNewLine={createNewLine}
            />
        </>
    );
}

export default TimeSheetDetail;