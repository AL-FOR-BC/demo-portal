import { useEffect, useState } from 'react'

import { GridColDef } from '@mui/x-data-grid'
import Header from '../../Components/ui/Header/Header'
import { options } from '../../@types/common.dto'
import { apiEmployees } from '../../services/CommonServices'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiLeavePlanDetail, apiLeavePlanLines,  } from '../../services/LeaveServices'
import { useAppSelector } from '../../store/hook'
import { getErrorMessage } from '../../utils/common'
export default function LeavePlanDetails() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
   
    const [status, setStatus] = useState('')
    const [employeeOptions, setEmployeeOptions] = useState < options[] > ([])
    const [selectedDelegatee, setSelectedDelegatee] = useState < options[] > ([])
    const [postingDate, setPostingDate] = useState < Date > ()
    // const [leavePlanLines, setLeavePlanLines] = useState < any[] > ([])
    const { companyId } = useAppSelector(state => state.auth.session)
    const { employeeNo, employeeName } = useAppSelector(state => state.auth.user)




    const columns: GridColDef[] = [
        {
            field: 'leaveType',
            headerName: 'Leave Type',
            type: 'singleSelect',
            width: 180,
            editable: true,
            valueOptions: ['Annual', 'Medical', 'Maternity', 'Paternity', 'Bereavement'],
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            type: 'date',
            width: 180,
            editable: true

        },
        {
            field: 'endDate',
            headerName: 'End Date',
            type: 'date',
            width: 180,
            editable: true
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 180,
            editable: true
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            width: 180,
            editable: true

        }

    ]


    const fields = [
        [
            { label: 'Requisition No', type: 'text', value: '', disabled: true, id: 'requestNo' },
            { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
            { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },

            {
                label: 'Posting Date',
                type: 'date',
                value: postingDate,
                disabled: true,
                onChange: (e: Date) => setPostingDate(e),
                id: 'documentDate',
            },
            {
                label: "Status",
                type: 'text',
                value: status,
                id: 'docStatus',
                disabled: true


            },

            {
                label: "Delegatee",
                type: "select",
                value: selectedDelegatee,
                options: employeeOptions,
                onChange: (e: options) => setSelectedDelegatee([{ label: e.label, value: e.value }]),
                id: "delegatee"

            },
        ],
    ]

    const handleSubmitLines = async (data: any,id:string) => {
        try{
            // const res = await apiLeavePlanDetail(companyId, id, data)
            const resLines = await apiLeavePlanLines(companyId, "POST", data, id)
            console.log(resLines)
            // console.log(res)
        }catch(error){
            toast.error(`Error submitting leave plan: ${getErrorMessage(error)}`)
        }
    }

    const populateData = async () => {
        setIsLoading(true)
        try {
            if (id) {
                const filterQuery = `$expand=leavePlanLines`
                const res = await apiLeavePlanDetail(companyId, id, filterQuery)
                console.log(res)
                if (res.data) {
                    const data = res.data
                    // setLeavePlan(res.data)
                    setPostingDate(data.postingDate ? new Date(data.postingDate) : undefined)
                    setStatus(data.status)
                    setSelectedDelegatee([{ label: res.data.delegate, value: res.data.delegate }])
                    // setLeavePlanLines(res.data.leavePlanLines)
                }
                const resEmployee = await apiEmployees(companyId)
                let employeeOptions: options[] = []
                resEmployee.data.value.map((e) => {
                    employeeOptions.push({ label: `${e.No}::${e.LastName}-${e.FirstName}`, value: e.No })
                })
                setEmployeeOptions(employeeOptions)
            }
        } catch (error) {
            toast.error(`Error fetching leave plan: ${getErrorMessage(error)}`)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        populateData()
    }, [])
    return (
        <Header
            title="Leave Plan Details"
            subtitle="Leave Plan Details"
            breadcrumbItem="Leave Plan Details"
            documentType='Leave Plan'
            fields={fields}
            isLoading={isLoading}
            handleBack={() => navigate('/leave-plans')}
            pageType="detail"
            status={status}
            editableLines={true}
            columns={columns}
            // rowLines={leavePlanLines}
            handleSubmitLines={handleSubmitLines}

        />
    )
}
