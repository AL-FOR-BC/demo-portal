
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../Components/ui/Header/Header'
import { useAppSelector } from '../../store/hook'
import { options } from '../../@types/common.dto'
import { GridColDef } from '@mui/x-data-grid'
import { apiEmployees } from '../../services/CommonServices'
import { apiCreateLeavePlan } from '../../services/LeaveServices'

function AddLeavePlan() {
    const { companyId } = useAppSelector(state => state.auth.session)
    const { employeeNo, employeeName } = useAppSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false)
    const [postingDate, setPostingDate] = useState < Date > (new Date())
    const status = "Open"
    const [selectedDelegatee, setSelectedDelegatee] = useState < options[] > ([]);
    const [employeeOptions, setEmployeeOptions] = useState < options[] > ([]);



    const navigate = useNavigate();
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
                id: 'docStatus'


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

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const data = {
                employeeNo: employeeNo,
                delegate: selectedDelegatee[0].value
            }
            const res = await apiCreateLeavePlan(companyId, data)
            if (res.status === 201) {
                toast.success("Leave Plan Added Successfully")
                console.log(res.data)
                navigate(`/leave-plan-details/${res.data.systemId}`)
            }
        } catch (error) {
            toast.error(`Error Adding Leave Plan :${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const populateData = async () => {
            try {
                const resEmployee = await apiEmployees(companyId)
                let employeeOptions: options[] = []
                resEmployee.data.value.map((e) => {
                    employeeOptions.push({ label: `${e.No}::${e.LastName}-${e.FirstName}`, value: e.No })
                })
                setEmployeeOptions(employeeOptions)


            } catch (error) {
                toast.error(`Error fetching data :${error}`)
            }
        }
        populateData()
    }, [])
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

        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerName: 'Actions',
        //     width: 100,
        //     cellClassName: 'actions',
        //     getActions: ({ id }) => {
        //         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        //         if (isInEditMode) {
        //             return [
        //                 <GridActionsCellItem
        //                     icon={<SaveIcon />}
        //                     label="Save"
        //                     sx={{
        //                         color: 'primary.main',
        //                     }}
        //                     onClick={handleSaveClick(id)}
        //                 />,
        //                 <GridActionsCellItem
        //                     icon={<CancelIcon />}
        //                     label="Cancel"
        //                     className="textPrimary"
        //                     onClick={handleCancelClick(id)}
        //                     color="inherit"
        //                 />,
        //             ];
        //         }
        //     }
        // }
    ]

    return (
        <Header
            title='Add Leave Plan'
            subtitle='Leave Plan'
            breadcrumbItem='Leave Plan'
            fields={fields}
            isLoading={isLoading}
            pageType='add'
            handleSubmit={handleSubmit}
            handleBack={() => navigate("/leave-plans")}
            // editableLines={true}
            columns={columns}
        />
    )
}

export default AddLeavePlan