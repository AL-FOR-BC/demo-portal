import { useEffect, useState } from 'react'
import { ActionFormatter, noFormatter, statusFormatter } from '../../Components/ui/Table/TableUtils';
import { apiLeavePlans } from '../../services/LeaveServices';
import { useAppSelector } from '../../store/hook';
import { toast } from 'react-toastify';
// import TableComponent from '../../Components/ui/Table/Table';
import TableMui from '../../Components/ui/Table/TableMui';

// Add an interface for the leave plan structure
interface LeavePlan {
    documentNo: string;
    employeeNo: string;
    employeeName: string;
    postingDate: string;
    status: string;
    // Add other properties as needed
}

function LeavePlan() {
    const [isLoading, setIsLoading] = useState(false)
    const [leavePlans, setLeavePlans] = useState<LeavePlan[]>([])
    const { companyId } = useAppSelector(state => state.auth.session)
    const { employeeNo } = useAppSelector(state => state.auth.user)

    const columns = [
        {
            dataField: 'documentNo',
            text: 'Plan No',
            sort: true,
            formatter: noFormatter
        },
        {
            dataField: 'employeeNo',
            text: 'Employee No',
            sort: true
        },
        {
            dataField: 'employeeName',
            text: 'Employee Name',
            sort: true
        },
        {
            dataField: 'postingDate',
            text: 'Posting Date',
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true,
            formatter: statusFormatter
        },
        {
            dataField: "action",
            isDummyField: true,
            text: "Action",
            formatter: (cell, row) => (
                <ActionFormatter
                    row={row}
                    cellContent={cell}
                    navigateTo='/leave-plan-details'
                />
            )
        }];

    const defaultSorted = [{
        dataField: 'No',
        order: 'desc'
    }];


    useEffect(() => {
        const populateData = async () => {
            setIsLoading(true)
            try {
                const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
                const leavePlanResponse = await apiLeavePlans(companyId, "GET", filterQuery)
                if (leavePlanResponse.data.value) {
                    setLeavePlans(leavePlanResponse.data.value as LeavePlan[])
                }


            } catch (error) {
                toast.error(`Error fetching payment requisitions:${error}`)

            } finally {
                setIsLoading(false)
            }
        }

        populateData()
    }, [])
    return (
        <>
            <TableMui
                isLoading={isLoading}
                data={leavePlans}
                columns={columns}
                defaultSorted={defaultSorted}
                noDataMessage={"No Leave Plan found"}
                iconClassName="bx bx-cart"
                title="Leave Plans"
                subTitle="Manage all your Leave Plan"
                breadcrumbItem="Leave Plan"
                addLink="/add-leave-plan"
                addLabel="Add Leave Plan" />
        </>
    )
}

export default LeavePlan
