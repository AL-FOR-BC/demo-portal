import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import HeaderMui from "../../Components/ui/Header/HeaderMui";
// import { options } from "../../@types/common.dto";
import { getErrorMessage } from "../../utils/common";
// import Swal from "sweetalert2";
import { isWeekend, format, eachDayOfInterval } from 'date-fns';

function TimeSheetDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { companyId } = useAppSelector(state => state.auth.session);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [requestNo, setRequestNo] = useState < string > ('');
    const [startingDate, setStartingDate] = useState < Date > (new Date());
    const [endingDate, setEndingDate] = useState < Date > (new Date());
    const [resourceNo, setResourceNo] = useState < string > ('');
    const [resourceName, setResourceName] = useState < string > ('');
    const [description, setDescription] = useState < string > ('');
    const [status, setStatus] = useState < string > ('');

    const fields = [
        [
            { label: 'No.', type: 'text', value: requestNo, disabled: true, id: 'requestNo' },
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
        ],
        [
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
            },
            { label: 'Status', type: 'text', value: status, disabled: true, id: 'status' },
        ]
    ];

    const publicHolidays = [
        '2024-10-09', // Independence Day
        // Add other holidays as needed
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
            const isHoliday = publicHolidays.includes(dateStr);

            return {
                field: `day${dayNumber}`,
                headerName: `${dayNumber} ${dayName}`,
                width: 80,
                editable: !isWeekendDay && !isHoliday && status === 'Open',
                type: 'number',
                valueFormatter: (params: any) => {
                    if (params.value === null || params.value === undefined) {
                        return '';
                    }
                    return Number(params.value).toFixed(2);
                },
                cellClassName: () =>
                    isWeekendDay ? 'weekend-cell' :
                        isHoliday ? 'holiday-cell' : '',
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
            editable: status === 'Open',
        },
        {
            field: 'project',
            headerName: 'Project',
            width: 150,
            editable: status === 'Open',
        },
        {
            field: 'causeOfAbsenceCode',
            headerName: 'Cause of Absence Code',
            width: 180,
            editable: status === 'Open',
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
    `;

    const dummyTimeSheet = {
        no: 'TSH-00000002',
        startingDate: '2024-10-01',
        endingDate: '2024-10-31',
        resourceNo: 'RES-001',
        resourceName: 'SHRP',
        description: 'Monthly Time Sheet',
        status: 'Open',
        lines: [
            {
                id: 1,
                status: 'Open',
                description: 'Development work',
                project: 'PROJ-001',
                causeOfAbsenceCode: '',
                // Initialize all days with 0
                ...Array.from({ length: 31 }, (_, i) => ({
                    [`day${i + 1}`]: 0
                })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
            }
        ]
    };

    const quickUpdate = async (kwargs: any) => {
        try {
            // In real implementation, call your API here
            console.log('Updating with:', kwargs);
            toast.success("Updated successfully");
        } catch (error) {
            toast.error(`Error updating: ${getErrorMessage(error)}`);
        }
    };

    const handleSubmitLines = async (data: any[]) => {
        try {
            console.log('Submitting line:', data);
            // Implement your line submission logic here
            return { success: true };
        } catch (error) {
            toast.error(`Error submitting line: ${getErrorMessage(error)}`);
            throw error;
        }
    };

    const handleDeleteLine = async (id: string) => {
        try {
            console.log('Deleting line:', id);
            // Implement your line deletion logic here
            return true;
        } catch (error) {
            toast.error(`Error deleting line: ${getErrorMessage(error)}`);
            return false;
        }
    };

    const handleEditLine = async (data: any) => {
        try {
            console.log('Editing line:', data);
            // Implement your line editing logic here
            return { success: true };
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

    useEffect(() => {
        const populateData = async () => {
            try {
                setIsLoading(true);
                // In real implementation, fetch from API
                setRequestNo(dummyTimeSheet.no);
                setStartingDate(new Date(dummyTimeSheet.startingDate));
                setEndingDate(new Date(dummyTimeSheet.endingDate));
                setResourceNo(dummyTimeSheet.resourceNo);
                setResourceName(dummyTimeSheet.resourceName);
                setDescription(dummyTimeSheet.description);
                setStatus(dummyTimeSheet.status);

                // Ensure timeSheetLines has proper structure
                const formattedLines = dummyTimeSheet.lines.map(line => ({
                    ...line,
                    ...Array.from({ length: 31 }, (_, i) => ({
                        [`day${i + 1}`]: line[`day${i + 1}`] || 0
                    })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
                }));

                setTimeSheetLines(formattedLines);
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
                requestNo={requestNo}
            />
        </>
    );
}

export default TimeSheetDetail;