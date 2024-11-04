import { useEffect, useState } from 'react';
// import TableComponent from "../../Components/ui/Table/Table.tsx";
import { ActionFormatter, noFormatter, statusFormatter } from "../../Components/ui/Table/TableUtils.tsx";
import { apiPaymentRequisition } from "../../services/RequisitionServices.ts";
import { useAppSelector } from "../../store/hook.ts";
import { toast } from "react-toastify";
import TableMui from '../../Components/ui/Table/TableMui.tsx';

const PaymentRequisition = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentRequisitions, setPaymentRequisitions] = useState < any[] > ([]);
    const { companyId } = useAppSelector(state => state.auth.session)
    const { employeeNo } = useAppSelector(state => state.auth.user)
    const defaultSorted = [{
        dataField: 'no',
        order: 'desc'
    }];
    const columns = [
        {
            dataField: 'no',
            text: 'Payment No',
            sort: true,
            formatter: noFormatter
        },
        // {
        //     dataField: 'documentType',
        //     text: 'Document Type',
        //     sort: true,
        //     formatter: documentTypeFormatter
        // },
        {
            dataField: 'documentDate',
            text: 'Document Date',
            sort: true
        },
        // {
        //     dataField: 'payeeNo',
        //     text: 'Payee No',
        //     sort: true
        // },
        {
            dataField: 'payeeName',
            text: 'Payee Name',
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
            dataField: 'budgetCode',
            text: 'Budget Code',
            sort: true
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
                    navigateTo="/payment-requisition-details"
                />
            )
        }];
    useEffect(() => {
        const populateData = async () => {
            try {
                setIsLoading(true);

                const filterQuery = `$filter=requisitionedBy eq '${employeeNo}'`;
                const res = await apiPaymentRequisition(companyId,'GET',filterQuery);

                if (res.data.value.length > 0) {
                    setPaymentRequisitions(res.data.value);
                }
            } catch (error) {
                toast.error(`Error fetching payment requisitions:${error}`)

            } finally {
                setIsLoading(false);
            }
        }
        populateData()
    }, []);

    return (
        <>
            <TableMui
                isLoading={isLoading}
                data={paymentRequisitions}
                columns={columns}
                defaultSorted={defaultSorted}
                noDataMessage={"No Payment Requisition found"}
                iconClassName="bx bx-cart"
                title="Payment Requisitions"
                subTitle="Manage all your payment requests"
                breadcrumbItem="Payment Requests"
                addLink="/add-payment-requisition"
                addLabel="Add Payment Requisition" />
        </>
    );
}
    ;

export default PaymentRequisition;