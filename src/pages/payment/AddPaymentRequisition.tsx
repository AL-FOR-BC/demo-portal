import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hook";
import { apiBankAccountsApi, apiCurrencyCodes, apiCustomersApi, apiDimensionValue, apiPaymentCategory, apiPaymentSubCategoryApi, apiWorkPlans } from "../../services/CommonServices";
import { options } from "../../@types/common.dto";
import { toast } from "react-toastify";
import Header from "../../Components/ui/Header/Header";
import {split } from "lodash";

import { apiCreatePaymentRequisition } from "../../services/RequisitionServices";
import { useNavigate } from "react-router-dom";



function AddPaymentRequisition() {
    const { companyId } = useAppSelector(state => state.auth.session)
    const navigate = useNavigate();

    const { employeeNo, employeeName } = useAppSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false);
    // const [docError, setDocError] = useState('');
    const [showError, setShowError] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState < options[] > ([]);
    const [selectedWorkPlan, setSelectedWorkPlan] = useState < options[] > ([]);
    const [selectedPaymentCategory, setSelectedPaymentCategory] = useState < options[] > ([]);
    const [selectedDimension, setSelectedDimension] = useState < options[] > ([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState < options[] > ([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState < options[] > ([]);
    const [selectedCustomer, setSelectedCustomer] = useState < options[] > ([]);


    const [customerOptions, setCustomerOptions] = useState < options[] > ([]);
    const [dimensionValues, setDimensionValues] = useState < options[] > ([]);
    const [paymentSubCategory, setPaymentSubCategory] = useState < options[] > ([]);
    const [bankAccountOptions, setBankAccountOptions] = useState < options[] > ([]);

    const [currencyOptions, setCurrencyOptions] = useState < { label: string; value: string }[] > ([]);
    const [workPlans, setWorkPlans] = useState < { label: string; value: string }[] > ([]);
    const [paymentCategoryOptions, setPaymentCategoryOptions] = useState < { label: string; value: string }[] > ([]);
    const [description, setDescription] = useState < string > ('');
    const [expectedReceiptDate, setExpectedReceiptDate] = useState < Date > (new Date());

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            if (selectedCurrency.length == 0 || selectedWorkPlan.length == 0 || selectedPaymentCategory.length == 0 || description == '' || expectedReceiptDate == null) {
                const missingFields = selectedCurrency.length == 0 ? 'Currency' : selectedWorkPlan.length == 0 ? 'WorkPlan' : selectedPaymentCategory.length == 0 ? 'Payment Category' : description == '' ? 'Purpose' : expectedReceiptDate == null ? 'Expected Receipt Date' : '';
                toast.error(`${missingFields} is required`);
                return;
            }
            const data = {
                requisitionedBy: employeeNo,
                payeeNo: selectedPaymentCategory[0]?.value === 'IMPREST' ? selectedCustomer[0]?.value : '',
                paymentCategory: selectedPaymentCategory[0]?.value,
                paySubcategory: selectedSubCategory[0]?.value,
                project: selectedDimension[0]?.value,
                workPlanNo: split(selectedWorkPlan[0].value, '::')[0],
                purpose: description,
                // locationCode: employeeDepartment,

                currencyCode: selectedCurrency[0]?.value,
                // documentDate: formatDate(expectedReceiptDate),
            }

            const res = await apiCreatePaymentRequisition(companyId, data);
            if (res.status == 201) {
                toast.success('Requisition created successfully')
                navigate(`/payment-requisition-details/${res.data.systemId}`);
            } else {
                toast.error('Error creating requisition')
            }
            setIsLoading(false)
        } catch (error) {
            toast.error(`Error creating requisition:${error}`)

        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => { }

    const fields = [
        // First row of inputs
        [
            { label: 'Requisition No', type: 'text', value: '', disabled: true, id: 'requestNo' },
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
                id: 'projectCode'
            },

            {
                label: 'Payment Category',
                type: 'select',
                value: selectedPaymentCategory,
                options: paymentCategoryOptions,
                onChange: (e: options) => {
                    setSelectedPaymentCategory([{ label: e.label, value: e.value }])
                    setSelectedSubCategory([])
                    setSelectedCustomer([])
                    setSelectedBankAccount([])
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

            ...(
                selectedPaymentCategory[0]?.value === 'IMPREST'
                    ? [
                        {
                            label: 'Payee',
                            type: 'select',
                            value: selectedCustomer,
                            options: customerOptions,
                            onChange: (e: options) => setSelectedCustomer([{ label: e.label, value: e.value }]),
                            id: 'payee',
                        }
                    ]
                    : selectedPaymentCategory[0]?.value === 'BANK'
                        ? [
                            {
                                label: 'Payee',
                                type: 'select',
                                value: selectedBankAccount,
                                options: bankAccountOptions,
                                onChange: (e: options) => setSelectedBankAccount([{ label: e.label, value: e.value }]),
                                id: 'bankAccount',
                            }
                        ]
                        : []
            )

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
                label: 'Currency',
                type: 'select',
                value: selectedCurrency,
                options: currencyOptions,
                onChange: (e: options) => setSelectedCurrency([{ label: e.label, value: e.value }]),
                id: 'currency',
            },
            {
                label: 'Purpose',
                type: 'textarea',
                value: description,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value),
                id: 'purpose',
                rows: 2,
            },


        ],

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
                    paymentCategoryOptions.push({ label: e.description, value: e.code })
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
                setCustomerOptions(customerOptions)


                const resBankAccounts = await apiBankAccountsApi(companyId);
                let bankAccountOptions: options[] = [];
                resBankAccounts.data.value.map((e) => {
                    bankAccountOptions.push({ label: `${e.no}::${e.name}`, value: e.no })
                });
                setBankAccountOptions(bankAccountOptions)





            } catch (error) {
                toast.error(`Error fetching data requisitions:${error}`)
            } finally {
                setIsLoading(false)
            }

        }

        populateData();
    }, [])

    return (
        <Header
            title="Requisitions"
            subtitle="Payment Requisitions"
            breadcrumbItem="Add Payment Requisitions"
            fields={fields}
            isLoading={isLoading}
            showError={showError}
            // docError={docError}
            pageType="add"
            toggleError={() => setShowError(!showError)}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
        />
    );
}

export default AddPaymentRequisition;