import TableMui from '../../Components/ui/Table/TableMui';
import { useEffect, useState } from "react";
//import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import { ActionFormatter, noFormatter } from "../../Components/ui/Table/TableUtils";
import { TimeSheetType } from '../../@types/timesheet.dto';
import { TimeSheetsService } from '../../services/TimeSheetsService';
import { useAppSelector } from '../../store/hook';

// You should define this type in your types file

function TimeSheets() {
    const { companyId } = useAppSelector(state => state.auth.session);
    const { employeeNo } = useAppSelector(state => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSheets, setTimeSheets] = useState < TimeSheetType[] > ([]);

    const defaultSorted = [{
        dataField: 'no',
        order: 'desc'
    }];

    const columns = [
        {
            dataField: 'timeSheetNo',
            text: 'No.',
            sort: true,
            formatter: noFormatter
        },
        {
            dataField: 'startingDate',
            text: 'Starting Date',
            sort: true,
            // formatter: (cell: string) => new Date(cell).toLocaleDateString()
        },
        {
            dataField: 'endingDate',
            text: 'Ending Date',
            sort: true,
            // formatter: (cell: string) => new Date(cell).toLocaleDateString()
        },
        {
            dataField: 'ResourceNo',
            text: 'Resource No.',
            sort: true
        },
        {
            dataField: 'Description',
            text: 'Description',
            sort: true
        },
        {
            dataField: 'quantity',
            text: 'Total',
            sort: true
        },
        {
            dataField: "action",
            isDummyField: true,
            text: "Action",
            formatter: (cell: any, row: any) => (
                <ActionFormatter
                    row={row}
                    cellContent={cell}
                    navigateTo="/time-sheet-details/"
                />
            )
        }
    ];



    useEffect(() => {
        const populateData = async () => {
            try {
                setIsLoading(true);
                const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
                const res = await TimeSheetsService.getTimeSheetHeader(companyId, filterQuery);
                setTimeSheets(res.data.value);
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