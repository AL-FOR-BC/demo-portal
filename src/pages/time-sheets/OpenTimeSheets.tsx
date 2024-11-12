import TableMui from '../../Components/ui/Table/TableMui';
import { useEffect, useState } from "react";
//import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import { ActionFormatter, statusFormatter, noFormatter } from "../../Components/ui/Table/TableUtils";

// You should define this type in your types file
interface TimeSheetType {
    no: string;
    startingDate: string;
    endingDate: string;
    description: string;
    resourceNo: string;
    total: number;
    open: number;
    submitted: number;
    approved: number;
    rejected: number;
    comment?: string;
}

function TimeSheets() {
    // const { companyId } = useAppSelector(state => state.auth.session);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSheets, setTimeSheets] = useState<TimeSheetType[]>([]);

    const defaultSorted = [{
        dataField: 'no',
        order: 'desc'
    }];

    const columns = [
        {
            dataField: 'no',
            text: 'No.',
            sort: true,
            formatter: noFormatter
        },
        {
            dataField: 'startingDate',
            text: 'Starting Date',
            sort: true,
            formatter: (cell: string) => new Date(cell).toLocaleDateString()
        },
        {
            dataField: 'endingDate',
            text: 'Ending Date',
            sort: true,
            formatter: (cell: string) => new Date(cell).toLocaleDateString()
        },
        {
            dataField: 'description',
            text: 'Description',
            sort: true
        },
        {
            dataField: "status",
            text: "Status",
            formatter: statusFormatter
        },
        {
            dataField: "action",
            isDummyField: true,
            text: "Action",
            formatter: (cell: any, row: any) => (
                <ActionFormatter
                    row={row}
                    cellContent={cell}
                    navigateTo="/time-sheet-details"
                />
            )
        }
    ];

    // Dummy data based on your example
    const dummyData: TimeSheetType[] = [
        {
            no: "TSH-00000004",
            startingDate: "2024-09-16",
            endingDate: "2024-09-22",
            description: "Week 38",
            resourceNo: "RES-002",
            total: 40.00,
            open: 0.00,
            submitted: 40.00,
            approved: 0.00,
            rejected: 0.00
        },
        {
            no: "TSH-00000005",
            startingDate: "2024-09-23",
            endingDate: "2024-09-29",
            description: "Week 39",
            resourceNo: "RES-001",
            total: 40.00,
            open: 0.00,
            submitted: 40.00,
            approved: 0.00,
            rejected: 0.00
        },
        // Add more dummy data as needed
    ];

    useEffect(() => {
        const populateData = async () => {
            try {
                setIsLoading(true);
                // In a real implementation, you would fetch data from your API here
                // const res = await apiTimeSheets(companyId);
                // setTimeSheets(res.data.value);
                
                // For now, we'll use the dummy data
                setTimeSheets(dummyData);
            } catch (error) {
                toast.error(`Error fetching time sheets: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
        populateData();
    }, []);

    return (
        <TableMui
            isLoading={isLoading}
            data={timeSheets}
            columns={columns}
            defaultSorted={defaultSorted}
            noDataMessage="No Time Sheets found"
            iconClassName="bx bx-time"
            title="Time Sheets"
            subTitle="Manage all your time sheets"
            breadcrumbItem="Time Sheets"
            addLink="/add-time-sheet"
            addLabel="Add Time Sheet"
        />
    );
}

export default TimeSheets;