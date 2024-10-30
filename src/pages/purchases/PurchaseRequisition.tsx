// import TableComponent from "../../Components/ui/Table/Table.tsx";
import TableMui from '../../Components/ui/Table/TableMui';
import { useEffect, useState } from "react";
import { apiPurchaseRequisition } from "../../services/RequisitionServices.ts";
import { statusFormatter, ActionFormatter, noFormatter } from "../../Components/ui/Table/TableUtils.tsx";
import { useAppSelector } from "../../store/hook.ts";
import { PurchaseRequisitionType } from "../../@types/purchaseReq.dto.ts";
import { toast } from "react-toastify";

function PurchaseRequisition() {
    const { companyId } = useAppSelector(state => state.auth.session)
    const { employeeNo } = useAppSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseRequisition, setPurchaseRequisition] = useState < PurchaseRequisitionType[] > ([])
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
            dataField: 'documentDate',
            text: 'Document Date',
            sort: true
        },
        {
            dataField: 'requestorName',
            text: 'Requestor Name',
            sort: true,

        },

        {
            dataField: 'budgetCode',
            text: 'Budget Code',
            sort: true,

        },
        {
            dataField: 'amount',
            text: 'Amount',
            sort: true,
            formatter: (cell: any,) => {
                return parseInt(cell).toLocaleString();
            },
        },
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
                    navigateTo="/purchase-requisition-details"
                />
            )
        }
    ]; 

    useEffect(() => {
        const populateData = async () => {
            try {
                setIsLoading(true)
                const filterQuery = `$filter=requestorNo eq '${employeeNo}'`
                const res = await apiPurchaseRequisition(companyId, 'GET', filterQuery)
                if (res.data.value.length > 0) {
                    setPurchaseRequisition(res.data.value)
                }
            } catch (error) {
                toast.error(`Error fetching purchase requisitions:${error}`)
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
                data={purchaseRequisition}
                columns={columns}
                defaultSorted={defaultSorted}
                noDataMessage={"No Purchase Requisition found"}
                iconClassName="bx bx-cart"
                title="Purchase Requisitions"
                subTitle="Manage all your purchase requests"
                breadcrumbItem="Purchase Requests"
                addLink="/add-purchase-requisition"
                addLabel="Add Purchase Requisition" />
        </>
    );
}

export default PurchaseRequisition;



