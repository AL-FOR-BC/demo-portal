import React, { useEffect, useState } from 'react'
import Header from '../../Components/ui/Header/Header';
import Lines from '../../Components/ui/Lines/Lines';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { useNavigate, useParams } from 'react-router-dom';
import { apiBankAccountsApi, apiCurrencyCodes, apiCustomersApi, apiDimensionValue, apiEmployees, apiGLAccountsApi, apiPaymentCategory, apiPaymentSubCategoryApi, apiWorkPlanLines, apiWorkPlans } from '../../services/CommonServices';
import { toast } from 'react-toastify';
import { apiCreateTravelRequestsLines, apiTravelRequestDetail, apiTravelRequests, apiTravelRequestsLines } from '../../services/TravelRequestsService';


import { cancelApprovalButton } from '../../utils/common';
import { closeModalPurchaseReq, editPurchaseReqLine, modelLoadingPurchaseReq, openModalPurchaseReq } from '../../store/slices/Requisitions';
import Swal from 'sweetalert2';
import { ActionFormatterLines } from '../../Components/ui/Table/TableUtils';
import { handleSendForApproval } from '../../actions/actions';
import { options } from '../../@types/common.dto';
import { split } from 'lodash';

function TravelRequestDetails() {
    const { id } = useParams();

    const { companyId } = useAppSelector(state => state.auth.session)
    const dispatch = useAppDispatch();

    const { employeeNo, employeeName } = useAppSelector(state => state.auth.user)
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState < options[] > ([]);
    const [selectedWorkPlan, setSelectedWorkPlan] = useState < options[] > ([]);
    const [selectedPaymentCategory, setSelectedPaymentCategory] = useState < options[] > ([]);
    const [selectedDimension, setSelectedDimension] = useState < options[] > ([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState < options[] > ([]);
    // const [selectedBankAccount, setSelectedBankAccount] = useState < options[] > ([]);
    // const [selectedCustomer, setSelectedCustomer] = useState < options[] > ([]);
    const [requestNo, setRequest] = useState < string > ('');
    const [status, setStatus] = useState < string > ('');
    const [travelRequisitionLines, setTravelRequisitionLines] = useState < any[] > ([]);

    // const [customerOptions, setCustomerOptions] = useState < options[] > ([]);
    const [dimensionValues, setDimensionValues] = useState < options[] > ([]);
    const [paymentSubCategory, setPaymentSubCategory] = useState < options[] > ([]);
    // const [bankAccountOptions, setBankAccountOptions] = useState < options[] > ([]);
    const [currencyOptions, setCurrencyOptions] = useState < options[] > ([]);
    const [employeeOptions, setEmployeeOptions] = useState < options[] > ([]);

    const [workPlans, setWorkPlans] = useState < { label: string; value: string }[] > ([]);
    const [paymentCategoryOptions, setPaymentCategoryOptions] = useState < { label: string; value: string }[] > ([]);
    const [description, setDescription] = useState < string > ('');
    const [expectedReceiptDate, setExpectedReceiptDate] = useState < Date > (new Date());
    // const [selectedCurrencyCode, setSelectedCurrencyCode] = useState < string > ('');
    const [selectedDelegatee, setSelectedDelegatee] = useState < options[] > ([]);
    const [selectedEmployee, setSelectedEmployee] = useState < options[] > ([]);
    const [rate, setRate] = useState < number > (0);
    // const [directUnitCost, setDirectUnitCost] = useState < number > (0);
    const [selectedAccountNo, setSelectedAccountNo] = useState < options[] > ([]);
    const [workPlanLines, setWorkPlanLines] = useState < options[] > ([]);
    const [selectedWorkPlanLine, setSelectedWorkPlanLine] = useState < options[] > ([]);
    const [noOfNights, setNoOfNights] = useState < number > (0);
    const accountTypeOptions: options[] = [
        { label: 'G/L Account', value: 'G/L Account' },
        { label: 'Fixed Asset', value: 'Fixed Asset' },
        { label: 'Bank Account', value: 'Bank Account' }
    ];
    const [accountType, setAccountType] = useState < options[] > ([]);
    const [glAccounts, setGlAccounts] = useState < options[] > ([]);



    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [budgetCode, setBudgetCode] = useState<string>('');

    const fields = [
        [
            { label: 'Request No', type: 'text', value: requestNo, disabled: true, id: 'requestNo' },
            { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
            { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },

            {
                label: 'Document Date',
                type: 'date',
                value: expectedReceiptDate,
                onChange: (e: Date) => setExpectedReceiptDate(e),
                id: 'documentDate',
            },
        ],

        [
            {
                label: 'Department Code', type: 'select',
                options: dimensionValues,
                onChange: (e: options) => setSelectedDimension([{ label: e.label, value: e.value }]),
                id: 'departmentCode',
                value: selectedDimension
            },

            {
                label: 'Payment Category',
                type: 'select',
                value: selectedPaymentCategory,
                options: paymentCategoryOptions,
                onChange: (e: options) => {
                    setSelectedPaymentCategory([{ label: e.label, value: e.value }])
                    setSelectedSubCategory([])
                    // setSelectedCustomer([])
                    // setSelectedBankAccount([])
                },
                id: 'paymentCategory',
            }, {
                label: 'Payment Subcategory',
                type: 'select',
                value: selectedSubCategory,
                options: paymentSubCategory.filter(sub => sub.value == selectedPaymentCategory[0]?.value),
                onChange: (e: options) => setSelectedSubCategory([{ label: e.label, value: e.value }]),
                id: 'subCategory',
            },



            {
                label: 'Payee',
                type: 'select',
                value: selectedEmployee,
                options: employeeOptions,
                onChange: (e: options) => setSelectedEmployee([{ label: e.label, value: e.value }]),
                id: 'payee',
            },




        ],
        // Third row of inputs
        [
            {
                label: 'Work Plan',
                type: 'select',
                value: selectedWorkPlan,
                onChange: (e: options) => setSelectedWorkPlan([{ label: e.label, value: e.value }]),
                options: workPlans.filter(plan => split(plan.value, "::")[1] == selectedDimension[0]?.value),
                id: 'workPlan',
            },
            {
                label: "Budget Code",
                type: 'text',
                value: budgetCode,
                disabled: true,
                id: 'budgetCode'
            },

            {
                label: 'Currency',
                type: 'select',
                value: selectedCurrency,
                options: currencyOptions,
                onChange: (e: options) => setSelectedCurrency([{ label: e.label, value: e.value }]),
                id: 'currency',
            },
            {
                label: 'Start Date',
                type: 'date',
                value: startDate,
                onChange: (e: string) => setStartDate(e),
                id: 'startDate',
            },
            {
                label: 'End Date',
                type: 'date',
                value: endDate,
                onChange: (e: string) => setEndDate(e),
                id: 'endDate',

            },
            {
                label: "Delegatee",
                type: "select",
                value: selectedDelegatee,
                options: employeeOptions,
                onChange: (e: options) => setSelectedDelegatee([{ label: e.label, value: e.value }]),
                id: "delegatee"

            },
            {
                label: 'Purpose',
                type: 'textarea',
                value: description,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value),
                id: 'purpose',
                rows: 2,
            },


        ]
    ];

    const columns =
        status == "Open"
            ? [
                {
                    dataField: "accountType",
                    text: "Account Type",
                    sort: true,
                },
                {
                    dataField: "accountNo",
                    text: "Account No",
                    sort: true,
                },
                {
                    dataField: "accountName",
                    text: "Account Name",
                    sort: true,
                },
                {
                    dataField: "description",
                    text: "Description",
                    sort: true,
                },
                {
                    dataField: "noOfNights",
                    text: "No of Nights",
                    sort: true,
                },
                {
                    dataField: "rate",
                    text: "Rate",
                    sort: true,
                    formatter: (cell) => {
                        return parseInt(cell).toLocaleString()
                    },
                },
                {
                    dataField: "amount",
                    text: "Amount",
                    sort: true,
                    formatter: (cell) => {
                        return parseInt(cell).toLocaleString()
                    },
                },
                {
                    dataField: "action",
                    isDummyField: true,
                    text: "Action",
                    formatter: (row) => (
                        <ActionFormatterLines
                            row={row}
                            companyId={companyId}
                            apiHandler={apiTravelRequestsLines}
                            handleEditLine={handleEditLine}
                            handleDeleteLine={handleDelteLine}
                            populateData={populateData}
                        />
                    )

                },


            ]
            : [
                {
                    dataField: "accountType",
                    text: "Account Type",
                    sort: true,
                },
                {
                    dataField: "accountNo",
                    text: "Account No",
                    sort: true,
                },
                {
                    dataField: "accountName",
                    text: "Account Name",
                    sort: true,
                },
                {
                    dataField: "description",
                    text: "Description",
                    sort: true,
                },
                {
                    dataField: "noOfNights",
                    text: "No of Nights",
                    sort: true,
                },
                {
                    dataField: "rate",
                    text: "Rate",
                    sort: true,
                    formatter: (cell) => {
                        return parseInt(cell).toLocaleString()
                    },
                },
                {
                    dataField: "amount",
                    text: "Amount",
                    sort: true,
                    formatter: (cell) => {
                        return parseInt(cell).toLocaleString()
                    },
                },
            ]

    const modalFields = [
        [
            {
                label: "Account Type",
                type: "select",
                value: accountType,
                options: accountTypeOptions,
                readOnly: true, disabled: false,
                onChange: async (e: options) => {
                    setSelectedAccountNo([])
                    setSelectedWorkPlanLine([])
                    setAccountType([{ label: e.label, value: e.value }])
                    const glAccounts = await apiGLAccountsApi(companyId);
                    let glAccountsOptions: options[] = [];
                    glAccounts.data.value.map((e) => {
                        glAccountsOptions.push({ label: e.name, value: e.no })
                    });
                    setGlAccounts(glAccountsOptions)
                },

                style: { backgroundColor: 'grey' }
            },
            {
                label: "Account No", type: "select", value: selectedAccountNo,
                onChange: async (e: options) => {
                    setSelectedWorkPlanLine([])
                    setSelectedAccountNo([{ label: e.label, value: e.value }])
                    const filterQuery = `$filter=workPlanNo eq '${split(selectedWorkPlan[0].value, '::')[0]}' and accountNo eq '${e?.value}'`
                    const workPlanLines = await apiWorkPlanLines(companyId, filterQuery);
                    let workPlanLinesOptions: options[] = [];
                    workPlanLines.data.value.map((e) => {
                        workPlanLinesOptions.push({
                            label: e.entryNo + ':: ' + e.activityDescription,
                            value: `${e.entryNo}`
                        })
                    });
                    setWorkPlanLines(workPlanLinesOptions)
                }
                , options: glAccounts, isSearchable: true
            },
            {
                label: "Work Entry No",
                type: "select",
                value: selectedWorkPlanLine,
                options: workPlanLines,
                disabled: false,
                onChange: (e: options) => setSelectedWorkPlanLine([{ label: e.label, value: e.value }]),

            }
        ],
        [


            {
                label: "No of Nights", type: "number",
                value: noOfNights.toString(),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNoOfNights(Number(e.target.value))
            },
            { label: "Rate", type: "number", value: rate.toString(), onChange: (e) => setRate(Number(e.target.value)) },
            { label: "Description", type: "textarea", rows: 2, value: description, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value) },



        ],

    ]
    const populateData = async () => {
        try {
            setIsLoading(true)

            const resEmployee = await apiEmployees(companyId)
            let employeeOptions: options[] = []
            resEmployee.data.value.map((e) => {
                employeeOptions.push({ label: `${e.No}::${e.LastName}-${e.FirstName}`, value: e.No })
            })
            setEmployeeOptions(employeeOptions)


            const resWorkPlans = await apiWorkPlans(companyId);
            setWorkPlans(resWorkPlans.data.value.map(plan => ({ label: `${plan.no}::${plan.description}`, value: `${plan.no}::${plan.shortcutDimension1Code}` })));

            const dimensionFilter = `&$filter=globalDimensionNo eq 1`
            const resDimensionValues = await apiDimensionValue(companyId, dimensionFilter);
            let dimensionValues: options[] = [];
            resDimensionValues.data.value.map((e) => {
                dimensionValues.push({ label: `${e.code}::${e.name}`, value: e.code })
            });
            setDimensionValues(dimensionValues)

            if (id) {
                const filterQuery = `$expand=travelRequisitionLines`
                const res = await apiTravelRequestDetail(companyId, id, filterQuery);
                // if (res.data.)
                if (res.data.no) {
                    setRequest(res.data.no)
                    setStatus(res.data.status)
                    setDescription(res.data.purpose)
                    setStartDate(res.data.travelStartDate.split('T')[0])
                    setEndDate(res.data.travelEndDate.split('T')[0])
                    setSelectedCurrency([{ label: res.data.currencyCode, value: res.data.currencyCode }])
                    setSelectedPaymentCategory([{ label: res.data.paymentCategory, value: res.data.paymentCategory }])
                    setSelectedSubCategory([{ label: res.data.paySubcategory, value: res.data.paySubcategory }])
                    setBudgetCode(res.data.budgetCode)


                    employeeOptions.map((e) => {
                        if (e.value === res.data.delegatee) {
                            setSelectedDelegatee([{ label: e.label, value: e.value }])
                        }
                    })

                    employeeOptions.map((e) => {
                        if (e.value === res.data.payeeNo) {
                            setSelectedEmployee([{ label: e.label, value: e.value }])
                        }
                    })

                    resWorkPlans.data.value.map((e) => {
                        if (e.no === res.data.workPlanNo) {
                            setSelectedWorkPlan([{ label: `${e.no}::${e.description}`, value: e.no }])
                        }
                    })

                    dimensionValues.map((e) => {
                        if (e.value === res.data.projectCode) {
                            setSelectedDimension([{ label: e.label, value: e.value }])
                        }
                    })


                    // setSelectedBankAccount([{ label: res.data.payeeNo, value: res.data.payeeNo }])
                    setSelectedCurrency(res.data.currencyCode === "" ? [{ label: 'UGX', value: '' }] : [{ label: res.data.currencyCode, value: res.data.currencyCode }])
                    setTravelRequisitionLines(res.data.travelRequisitionLines)

                }

            }

            const resCurrencyCodes = await apiCurrencyCodes(companyId);
            let currencyOptions = [{ label: 'UGX', value: '' }]; // Add UGX as the first option
            resCurrencyCodes.data.value.map((e) => {
                currencyOptions.push({ label: e.code, value: e.code });
            });
            setCurrencyOptions(currencyOptions);


            const resPaymentSubCategory = await apiPaymentSubCategoryApi(companyId);
            let paymentSubCategoryOptions: options[] = [];
            resPaymentSubCategory.data.value.map((e) => {
                paymentSubCategoryOptions.push({ label: e.name, value: e.code })
            });
            setPaymentSubCategory(paymentSubCategoryOptions);


            const resPaymentCategory = await apiPaymentCategory(companyId);
            let paymentCategoryOptions: options[] = [];
            resPaymentCategory.data.value.map((e) => {
                console.log(e.code)
                if (e.code === 'TRAVEL') {
                    paymentCategoryOptions.push({ label: e.description, value: e.code })
                }
            });
            setPaymentCategoryOptions(paymentCategoryOptions);




            const customerFilter = `&$filter=staff eq true`
            const resCustomers = await apiCustomersApi(companyId, customerFilter);
            let customerOptions: options[] = [];
            resCustomers.data.value.map((e) => {
                customerOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
            });
            // setCustomerOptions(customerOptions)


            const resBankAccounts = await apiBankAccountsApi(companyId);
            let bankAccountOptions: options[] = [];
            resBankAccounts.data.value.map((e) => {
                bankAccountOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
            });
            // setBankAccountOptions(bankAccountOptions)


        } catch (error) {
            toast.error(`Error fetching data requisitions:${error}`)
        } finally {
            setIsLoading(false)
        }

    }
    useEffect(() => {
        populateData();
    }, [])


    const updatedLineAfterBudgetCheck = async (systemId?: string, etag?: string) => {
        try {
            const data = {
                noOfNights: noOfNights,
                rate: rate,
            }
            const res = await apiTravelRequestsLines(companyId, 'PATCH', data, systemId, etag)
            if (res.status == 200) {
                toast.success('Line updated successfully')
                populateData()
            }
        } catch (error) {
            toast.error(`Error updating line:${error}`)
        }
    }


    const handleSubmitLines = async () => {
        console.log(
            selectedAccountNo.length,
            selectedWorkPlanLine.length,
            rate,
            noOfNights,
            description
        )
        if (selectedAccountNo.length === 0) {
            toast.error(`Please select an account`)
            return
        }
        if (selectedWorkPlanLine.length === 0) {
            toast.error(`Please select a work plan line`)
            return
        }
        if (rate == 0) {
            toast.error(`Please enter the rate`)
            return
        }
        if (noOfNights == 0) {
            toast.error(`Please enter the no of nights`)
            return
        }
        if (description == '') {
            toast.error(`Please enter a description`)
            return
        }

        try {
            const data = {
                accountNo: selectedAccountNo[0].value,
                accountType: accountType[0].value,
                workPlanEntryNo: split(selectedWorkPlanLine[0].value, '::')[0],
                documentNo: requestNo,
                description: description,
            }
            const res = await apiCreateTravelRequestsLines(companyId, data)
            console.log(res.data)
            if (res.status == 201) {
                updatedLineAfterBudgetCheck(res.data.systemId, res.data['@odata.etag'] ?? '')
                toast.success('Line added successfully')
                populateData()
                dispatch(closeModalPurchaseReq())
            }
        } catch (error) {
            toast.error(`Error saving line:${error}`)
            console.log(error)

        }
    }
    const handleDelteLine = async (row: any) => {
        Swal.fire({
            title: 'Are you sure you want to delete this line?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: 'red',
            icon: 'warning',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await apiTravelRequestsLines(companyId, 'DELETE', '', row.systemId, row['@odata.etag'])
                    if (res.status == 204) {
                        toast.success('Line deleted successfully')
                        populateData()
                    }
                } catch (error) {
                    toast.error(`Error deleting line:${error}`)
                }
            }
        })

    }

    const clear = () => {
        setAccountType([])
        setSelectedAccountNo([])
        setSelectedWorkPlanLine([])
        setRate(0)
        setNoOfNights(0)
        setDescription("")
    }
    const handleEditLine = async (row: any) => {
        dispatch(openModalPurchaseReq())
        dispatch(modelLoadingPurchaseReq(true))
        dispatch(editPurchaseReqLine(true))

        clear()

        setAccountType([{ label: row.accountType, value: row.accountType }])
        setSelectedAccountNo([{ label: row.accountNo, value: row.accountNo }])
        setSelectedWorkPlanLine([{ label: row.workPlanEntryNo, value: row.workPlanEntryNo }])
        setRate(row.rate)
        setNoOfNights(row.noOfNights)
        setDescription(row.description)


        dispatch(modelLoadingPurchaseReq(false))


    }

    const handleSubmitUpdatedLine = async () => {
        if (selectedAccountNo.length === 0) {
            toast.error(`Please select an account`)
            return
        }
        if (selectedWorkPlanLine.length === 0) {
            toast.error(`Please select a work plan line`)
            return
        }
        if (rate == 0) {
            toast.error(`Please enter the rate`)
            return
        }
        if (noOfNights == 0) {
            toast.error(`Please enter the no of nights`)
            return
        }
        if (description == '') {
            toast.error(`Please enter a description`)
            return
        }

        try {
            const data = {
                accountNo: selectedAccountNo[0].value,
                accountType: accountType[0].value,
                workPlanEntryNo: split(selectedWorkPlanLine[0].value, '::')[0],
                documentNo: requestNo,
                description: description,
                rate: rate,
                noOfNights: noOfNights
            }
            const res = await apiTravelRequestsLines(companyId, 'PATCH', data, travelRequisitionLines[0].systemId, travelRequisitionLines[0]['@odata.etag'])
            if (res.status == 200) {
                toast.success('Line updated successfully')
                populateData()
                clear()
                dispatch(closeModalPurchaseReq())
            }
        } catch (error) {
            toast.error(`Error saving line:${error}`)
            console.log(error)

        }
    }

    const handleDeleteTravelRequest = async () => {
        Swal.fire({
            title: 'Are you sure you want to delete this travel request?',
            showCancelButton: true,
            confirmButtonText: `Delete`,
            confirmButtonColor: 'red',
            icon: 'warning',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await apiTravelRequests(companyId, 'DELETE', undefined, undefined, id)
                    if (res.status == 204) {
                        toast.success('Travel request deleted successfully')
                        navigate('/travel-requests')
                    }
                } catch (error) {
                    toast.error(`Error deleting travel request:${error}`)
                }
            }
        })
    }

    return (
        <>
            <Header
                title="Travel Request Detail"
                subtitle='Purchase Request Detail'
                breadcrumbItem='Travel Request Detail'
                documentType='Travel_x0020_Requests'
                requestNo={requestNo}
                companyId={companyId}
                fields={fields}
                isLoading={isLoading}
                handleBack={() => navigate('/travel-requests')}
                status={status}
                pageType='detail'
                handleCancelApprovalRequest={
                    async () => {
                        const documentNo = requestNo;
                        const action = 'cancelPaymentHeaderApprovalRequest'
                        await cancelApprovalButton({ companyId, data: { documentNo }, action, populateDoc: populateData, documentLines: travelRequisitionLines });
                    }}
                handleSendApprovalRequest={async () => {
                    const documentNo = requestNo;
                    const documentLines = travelRequisitionLines;
                    const link = 'sendPaymtHeaderApprovalReqs'

                    await handleSendForApproval(documentNo, documentLines, companyId, link, populateData);
                }}
                handleDeletePurchaseRequisition={handleDeleteTravelRequest}

                lines={
                    <Lines
                        isLoading={isLoading}
                        title="Travel Request Lines"
                        subTitle="Travel Request Lines"
                        breadcrumbItem="Travel Request Lines"
                        addLink=""
                        addLabel=""
                        noDataMessage="No lines found"
                        iconClassName=""
                        clearLineFields={clear}
                        handleValidateHeaderFields={() => true}
                        data={travelRequisitionLines}
                        columns={columns}
                        status={status}
                        modalFields={modalFields}
                        handleSubmitLines={handleSubmitLines}
                        handleDeleteLines={handleDelteLine}
                        handleSubmitUpdatedLine={handleSubmitUpdatedLine}

                    />
                }


            />

        </>
    )
}
export default TravelRequestDetails

