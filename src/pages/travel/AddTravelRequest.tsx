import React, { useEffect, useState } from 'react'
import { options } from '../../@types/common.dto';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hook';
import { apiBankAccountsApi, apiCurrencyCodes, apiCustomersApi, apiDimensionValue, apiEmployees, apiPaymentCategory, apiPaymentSubCategoryApi, apiWorkPlans } from '../../services/CommonServices';
import { includes, split } from 'lodash';
import { toast } from 'react-toastify';
import { apiCreateTravelRequests } from '../../services/TravelRequestsService';
import { formatDate } from '../../utils/common';
import HeaderMui from '../../Components/ui/Header/HeaderMui';

function AddTravelRequest() {
    const { companyId } = useAppSelector(state => state.auth.session)
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

    const [startDate, setStartDate] = useState < string > ('');
    const [endDate, setEndDate] = useState < string > ('');
    const [budgetCode, setBudgetCode] = useState < string > ('');



    const fields = [
        [
            { label: 'Requisition No', type: 'text', value: '', disabled: true, id: 'requestNo' },
            { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
            { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },
            {
                label: 'Project Code', type: 'select',
                options: dimensionValues,
                onChange: (e: options) => {
                    setSelectedWorkPlan([])
                    setBudgetCode('')
                    setSelectedDimension([{ label: e.label, value: e.value }])
                },
                id: 'departmentCode',
            },

        ],

        [
            {
                label: "WorkPlan",
                type: 'select',
                options: workPlans.filter(plan => split(plan.value, "::")[1] == selectedDimension[0]?.value),
                value: selectedWorkPlan,
                onChange: (e: options) => {
                    setSelectedWorkPlan([{ label: e.label, value: e.value }]);
                    setBudgetCode((split(e.label, '::')[1]));
                },
                id: 'workPlan'
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
            }



        ],
        // Third row of inputs
        [


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
                label: 'Document Date',
                type: 'date',
                value: expectedReceiptDate,
                onChange: (e: Date) => setExpectedReceiptDate(e),
                id: 'documentDate',
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
    useEffect(() => {
        const populateData = async () => {
            try {
                setIsLoading(true)
                const resCurrencyCodes = await apiCurrencyCodes(companyId);
                let currencyOptions = [{ label: 'UGX', value: '' }]; // Add UGX as the first option
                resCurrencyCodes.data.value.map((e) => {
                    currencyOptions.push({ label: e.code, value: e.code });
                });
                setCurrencyOptions(currencyOptions);

                const resWorkPlans = await apiWorkPlans(companyId);
                setWorkPlans(resWorkPlans.data.value.map(plan => ({ label: `${plan.no}::${plan.description}`, value: `${plan.no}::${plan.shortcutDimension1Code}` })));


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
                    if (includes(e.code, 'TRAVEL')) {
                        paymentCategoryOptions.push({ label: e.description, value: e.code })
                    }
                });
                setPaymentCategoryOptions(paymentCategoryOptions);


                const dimensionFilter = `&$filter=globalDimensionNo eq 1`
                const resDimensionValues = await apiDimensionValue(companyId, dimensionFilter);
                let dimensionValues: options[] = [];
                resDimensionValues.data.value.map((e) => {
                    dimensionValues.push({ label: `${e.code}::${e.name}`, value: e.code })
                });
                setDimensionValues(dimensionValues)

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

                const resEmployee = await apiEmployees(companyId)
                let employeeOptions: options[] = []
                resEmployee.data.value.map((e) => {
                    employeeOptions.push({ label: `${e.No}::${e.LastName}-${e.FirstName}`, value: e.No })
                })
                setEmployeeOptions(employeeOptions)






            } catch (error) {
                toast.error(`Error fetching data :${error}`)
            } finally {
                setIsLoading(false)
            }

        }

        populateData();
    }, [])



    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            if (selectedCurrency.length === 0 || selectedWorkPlan.length === 0 || selectedPaymentCategory.length === 0 || selectedSubCategory.length === 0 || selectedEmployee.length === 0 || selectedDimension.length === 0 || description === '' || startDate === '' || endDate === '' || selectedDelegatee.length === 0) {
                const missingFields = selectedCurrency.length === 0 ? 'Currency' : selectedWorkPlan.length === 0 ? 'Work Plan' : selectedPaymentCategory.length === 0 ? 'Payment Category' : selectedSubCategory.length === 0 ? 'Payment Subcategory' : selectedEmployee.length === 0 ? 'Customer' : selectedDimension.length === 0 ? 'Dimension' : description === '' ? 'Description' : startDate === '' ? 'Start Date' : endDate === '' ? 'End Date' : selectedDelegatee.length === 0 ? 'Delegatee' : ''

                toast.error(`Please fill in ${missingFields}`)
                setIsLoading(false)
                return
            }

            const data = {
                requisitionedBy: employeeNo,
                paymentCategory: selectedPaymentCategory[0].value,
                paySubcategory: selectedSubCategory[0].value,
                payeeNo: selectedEmployee[0].value,
                projectCode: selectedDimension[0].value,
                workPlanNo: split(selectedWorkPlan[0].value, "::")[0],
                currencyCode: selectedCurrency[0].value,
                payeeName: selectedEmployee[0].value,
                purpose: description,
                destination: description,
                travelStartDate: formatDate(startDate),
                travelEndDate: formatDate(endDate),
                delegatee: selectedDelegatee[0].value,


            }
            console.log(data)

            const res = await apiCreateTravelRequests(companyId, data)
            console.log(res)
            if (res.status === 201) {
                toast.success('Travel request created successfully')
                navigate(`/travel-request-details/${res.data.systemId}`)
            }
        } catch (error) {
            console.log(error)
            toast.error(`Error creating travel request:${error}`)
        }
        finally {
            setIsLoading(false)
        }
    }


    return (
        <HeaderMui
            title="Add Travel Request"
            subtitle="Travel Request"
            breadcrumbItem="Travel Request"
            fields={fields}
            isLoading={isLoading}
            pageType='add'
            handleSubmit={handleSubmit}
            handleBack={() => navigate('/travel-requests')}

        />
    )
}

export default AddTravelRequest