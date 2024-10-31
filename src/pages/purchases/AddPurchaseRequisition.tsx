import React, { useEffect, useState } from 'react';
// import Header from "../../Components/ui/Header/Header.tsx";
import { toast } from "react-toastify";
import { apiCurrencyCodes, apiDimensionValue, apiLocation, apiWorkPlans } from "../../services/CommonServices.ts";
import { useAppSelector } from "../../store/hook.ts";
import { split } from "lodash";
import { apiCreatePurchaseRequisition, } from '../../services/RequisitionServices.ts';
import { PurchaseRequisitionType } from '../../@types/purchaseReq.dto.ts';
import { formatDate } from '../../utils/common.ts';
import { options } from '../../@types/common.dto.ts';
import { useNavigate } from 'react-router-dom';
import HeaderMui from '../../Components/ui/Header/HeaderMui.tsx';

function AddPurchaseRequisition() {
    const { companyId } = useAppSelector(state => state.auth.session)
    const navigate = useNavigate();

    const { employeeNo, employeeName } = useAppSelector(state => state.auth.user)
    const [isLoading, setIsLoading] = useState(false);
    // const [docError, setDocError] = useState('');
    const [showError, setShowError] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState < options[] > ([]);
    const [selectedWorkPlan, setSelectedWorkPlan] = useState < options[] > ([]);
    const [selectedLocation, setSelectedLocation] = useState < options[] > ([]);
    const [selectedDimension, setSelectedDimension] = useState < options[] > ([]);



    const [currencyOptions, setCurrencyOptions] = useState < { label: string; value: string }[] > ([]);
    const [workPlans, setWorkPlans] = useState < { label: string; value: string }[] > ([]);
    const [locationOptions, setLocationOptions] = useState < { label: string; value: string }[] > ([]);
    const [subjectOfProcurement, setSubjectOfProcurement] = useState < string > ('');
    const [expectedReceiptDate, setExpectedReceiptDate] = useState < Date > (new Date());
    const [budgetCode, setBudgetCode] = useState < string > ('');
    const [dimensionValues, setDimensionValues] = useState < options[] > ([]);

    const [workPlansList, setWorkPlansList] = useState < any[] > ([]);




    const handleSubmit = async () => {
        try {

            setIsLoading(true);
            if (selectedCurrency.length == 0 || selectedWorkPlan.length == 0 || selectedLocation.length == 0 || subjectOfProcurement == '' || expectedReceiptDate == null) {
                const missingFields = selectedCurrency.length == 0 ? 'Currency' : selectedWorkPlan.length == 0 ? 'WorkPlan' : selectedLocation.length == 0 ? 'Location' : subjectOfProcurement == '' ? 'Subject of Procurement' : expectedReceiptDate == null ? 'Expected Receipt Date' : '';
                toast.error(`${missingFields} is required`);
                return;
            }

            /* Submit logic */
            const data: PurchaseRequisitionType = {
                currencyCode: selectedCurrency[0].value,
                workPlanNo: split(selectedWorkPlan[0].value, '::')[0],
                locationCode: selectedLocation[0].value,
                procurementDescription: subjectOfProcurement,
                // budgetCode: budgetCode,
                expectedReceiptDate: formatDate(expectedReceiptDate.toISOString()),
                project: selectedDimension[0].value,
                requestorNo: employeeNo || '',

            }


            const resp = await apiCreatePurchaseRequisition(companyId, data);

            navigate(`/purchase-requisition-details/${resp.data.systemId}`);
            toast.success('Requisition created successfully')
        } catch (error) {
            toast.error(`Error creating requisition:${error}`)
        } finally {
            setIsLoading(false)
        }



    };


    const fields = [
        [
            { label: 'Requisition No', type: 'text', value: '', disabled: true, id: 'requestNo' },
            { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
            { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },
            {
                label: 'Project Code', type: 'select',
                value: selectedDimension,
                disabled: false,
                id: 'projectCode',
                options: dimensionValues,
                onChange: (e: options) => {
                    setSelectedWorkPlan([])
                    setBudgetCode('')
                    setSelectedDimension([{ label: e.label, value: e.value }])
                }

            },
        ],
        [
            {
                label: 'Expected Receipt Date',
                type: 'date',
                value: expectedReceiptDate,
                onChange: (date: Date) => setExpectedReceiptDate(date),
                id: 'requisitionDate'
            },
            {
                label: 'Location',
                type: 'select',
                options: locationOptions,
                value: selectedLocation,
                onChange: (e: options) => setSelectedLocation([{ label: e.label, value: e.value }]),
                id: 'location'
            },
            {
                label: 'Currency',
                type: 'select',
                options: currencyOptions,
                value: selectedCurrency,
                onChange: (e: options) => setSelectedCurrency([{ label: e.label, value: e.value }]),
                id: 'currency'
            },
            {
                label: "WorkPlan",
                type: 'select',
                options: workPlans.filter(plan => split(plan.value, "::")[1] == selectedDimension[0]?.value),
                value: selectedWorkPlan,
                onChange: (e: options) => {

                    setSelectedWorkPlan([{ label: e.label, value: e.value }]);
                    setBudgetCode(workPlansList.filter(plan => plan.no == split(e.value, '::')[0])[0].budgetCode)
                },
                id: 'workPlan'
            },
            {
                label: "Budget Code",
                type: 'text',
                value: budgetCode,
                disabled: true,
                id: 'budgetCode'
            },
            { label: "Status", type: 'text', value: 'Open', disabled: true, id: 'docStatus' },
            {
                label: "Subject of Procurement", type: 'textarea', value: subjectOfProcurement, id: 'subjectOfProcurement',
                rows: 2,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSubjectOfProcurement(e.target.value)
            },



        ]

    ]

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
            setWorkPlansList(resWorkPlans.data.value)
            setWorkPlans(resWorkPlans.data.value.map(plan => ({ label: `${plan.no}::${plan.description}`, value: `${plan.no}::${plan.shortcutDimension1Code}` })));

            const resLocationCodes = await apiLocation(companyId);
            let locationOptions: options[] = [];
            resLocationCodes.data.value.map((e) => {
                locationOptions.push({ label: `${e.code}::${e.name}`, value: e.code })
            });
            setLocationOptions(locationOptions)

            const dimensionFilter = `&$filter=globalDimensionNo eq 1`
            const resDimensionValues = await apiDimensionValue(companyId, dimensionFilter);
            let dimensionValues: options[] = [];
            resDimensionValues.data.value.map((e) => {
                dimensionValues.push({ label: `${e.code}::${e.name}`, value: e.code })
            });
            setDimensionValues(dimensionValues)

        } catch (error) {
            toast.error(`Error fetching data requisitions:${error}`)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {

        populateData();
    }, [])



    return (
        <HeaderMui
            title="Requisitions"
            subtitle="Purchase Requisitions"
            breadcrumbItem="Add Purchase Requisitions"
            fields={fields}
            isLoading={isLoading}
            showError={showError}
            // docError={docError}
            toggleError={() => setShowError(!showError)}
            handleBack={() => navigate('/purchase-requisitions')}
            handleSubmit={handleSubmit}
            pageType='add'
        />
    );
}

export default AddPurchaseRequisition;