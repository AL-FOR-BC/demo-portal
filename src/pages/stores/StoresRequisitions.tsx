import TableMui from '../../Components/ui/Table/TableMui.tsx';
import { useEffect, useState } from "react";
import { apiStoreRequisition } from "../../services/RequisitionServices.ts";
import { statusFormatter, ActionFormatter, noFormatter } from "../../Components/ui/Table/TableUtils.tsx";
import { useAppSelector } from "../../store/hook.ts";
import { toast } from "react-toastify";

function StoresRequisitions() {
    const { companyId } = useAppSelector(state => state.auth.session)
    const { employeeNo } = useAppSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false);
    const [storeRequisitions, setStoreRequisitions] = useState<any[]>([])

    const defaultSorted = [{
        dataField: 'no',
        order: 'desc'
    }];

    const columns = [
        {
            dataField: 'no',
            text: 'Requisition No',
            sort: true,
            formatter: noFormatter
        },
      
        {
            dataField: 'requestorName',
            text: 'Requestor Name',
            sort: true,
        },
        {
            dataField: 'purpose',
            text: 'Purpose',
            sort: true
        },
        // {
        //     dataField: 'documentType',
        //     text: 'Document Type',
        //     sort: true,
        //     formatter: documentTypeFormatter
        // },
        {
            dataField: 'locationCode',
            text: 'Location',
            sort: true,
        },
        // {
        //     dataField: 'transferTo',
        //     text: 'Transfer To',
        //     sort: true,
        //     formatter: (cell: any, row: any) => {
        //         return row.requisitionType === 'TransferOrder' ? cell : '-';
        //     },
        // },
        {
            dataField: "status",
            text: "Status",
            formatter: statusFormatter,
            style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
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
                    navigateTo="/store-request-details"
                />
            )
        }
    ];

    useEffect(() => {
        const populateData = async () => {
            try {
                setIsLoading(true)
                const filterQuery = `$filter=requestorNo eq '${employeeNo}'`
                const res = await apiStoreRequisition(companyId, 'GET', filterQuery)
                if (res.data.value.length > 0) {
                    setStoreRequisitions(res.data.value)
                }
            } catch (error) {
                toast.error(`Error fetching store requisitions: ${error}`)
            } finally {
                setIsLoading(false);
            }
        }
        populateData()
    }, []);

    return (
        <TableMui
            isLoading={isLoading}
            data={storeRequisitions}
            columns={columns}
            defaultSorted={defaultSorted}
            noDataMessage={"No Store Requisitions found"}
            iconClassName="bx bx-store"
            title="Store Requisitions"
            subTitle="Manage all your store requests"
            breadcrumbItem="Store Requests"
            addLink="/add-store-request"
            addLabel="Add Store Request"
        />
    );
}

export default StoresRequisitions;
