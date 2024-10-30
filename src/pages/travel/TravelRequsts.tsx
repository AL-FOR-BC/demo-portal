import { ActionFormatter, noFormatter, statusFormatter } from "../../Components/ui/Table/TableUtils.tsx";
// import TableComponent from "../../Components/ui/Table/Table.tsx";
import TableMui from '../../Components/ui/Table/TableMui';
import { useEffect, useState } from "react";
import { apiTravelRequests } from "../../services/TravelRequestsService.ts";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/hook.ts";

function Travelrequest() {
    const [isLoading, setIsLoading] = useState(false);
    const [travelRequests, setTravelrequest] = useState < any[] > ([])
    const { employeeNo } = useAppSelector(state => state.auth.user)
    const { companyId } = useAppSelector(state => state.auth.session)
    const columns = [
        {
            dataField: 'no',
            text: 'No.',
            sort: true,
            formatter: noFormatter
        },
        {
            dataField: 'payeeNo',
            text: 'Payee No',
            sort: true
        },
        {
            dataField: 'payeeName',
            text: 'Payee Name',
            sort: true
        },

        {
            dataField: 'travelStartDate',
            text: 'Travel Start Date',
            sort: true
        },
        {
            dataField: 'travelEndDate',
            text: 'Travel End Date',
            sort: true
        },

        {
            dataField: 'totalAmount',
            text: 'Amount',
            sort: true,
            formatter: (cell: any) => {
                return parseInt(cell).toLocaleString();
            },
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: statusFormatter,
            style: {
                overflow: 'hidden',   // Hide overflowing text
                textOverflow: 'ellipsis', // Add ellipsis for hidden text
            },
        },
        {
            dataField: "action",
            isDummyField: true,
            text: "Action",
            formatter: (cell: any, row: any) => (
                <ActionFormatter
                    row={row}
                    cellContent={cell}
                    navigateTo="/travel-request-details"
                />
            )
        }];

    const defaultSorted = [{
        dataField: 'no',
        order: 'desc'
    }];
    useEffect(() => {
        const populateData = async () => {
            // const filterQuery = `$expand=purchaserequestLines`
            try {
                setIsLoading(true)
                const filterQuery = `$filter=requisitionedBy eq '${employeeNo}'`;
                const res = await apiTravelRequests(companyId, "GET", filterQuery);
                if (res.data.value.length > 0) {
                    setTravelrequest(res.data.value)
                }
            } catch (error) {
                toast.error(`Error fetching purchase Requests:${error}`)
            } finally {
                setIsLoading(false);
            }
        }
        populateData()
    }, []
    );
    return (
        <>
            <TableMui
                isLoading={isLoading}
                data={travelRequests}
                columns={columns}
                defaultSorted={defaultSorted}
                noDataMessage={"No Travel request found"}
                iconClassName="bx bx-cart"
                title="Travel Requests"
                subTitle="Manage all your travel requests"
                breadcrumbItem="Travel Requests"
                addLink="/add-travel-request"
                addLabel="Add Travel request" />
        </>
    );
}

export default Travelrequest;