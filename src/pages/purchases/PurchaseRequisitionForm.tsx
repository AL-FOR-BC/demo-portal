import React, { useState, useEffect } from 'react';
import { options } from '../../@types/common.dto.ts';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/common.ts';

interface PurchaseRequisitionFormProps {
    isDetailView: boolean;
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
    fields: any[]; // Your form fields structure
    disableFields: boolean; // Pass true if you want to disable the fields (e.g., for approval)
}

const PurchaseRequisitionForm: React.FC<PurchaseRequisitionFormProps> = ({
    isDetailView,
    initialData,
    onSubmit,
    isLoading,
    fields,
    disableFields
}) => {
    const [selectedCurrency, setSelectedCurrency] = useState < options[] > (initialData?.currency || []);
    const [selectedWorkPlan, setSelectedWorkPlan] = useState < options[] > (initialData?.workPlan || []);
    const [selectedLocation, setSelectedLocation] = useState < options[] > (initialData?.location || []);
    const [selectedDimension, setSelectedDimension] = useState < options[] > (initialData?.dimension || []);
    const [subjectOfProcurement, setSubjectOfProcurement] = useState < string > (initialData?.procurementDescription || '');
    const [expectedReceiptDate, setExpectedReceiptDate] = useState < Date > (initialData?.expectedReceiptDate || new Date());
    // const [budgetCode, setBudgetCode] = useState < string > (initialData?.budgetCode || []);


    useEffect(() => {
        setSelectedCurrency(initialData?.currency || []);
        setSelectedWorkPlan(initialData?.workPlan || []);
        setSelectedLocation(initialData?.location || []);
        setSelectedDimension(initialData?.dimension || [])
        setSubjectOfProcurement(initialData?.procurementDescription || '')
        setExpectedReceiptDate(initialData?.expectedReceiptDate || new Date())
        // Update other state variables as needed
    }, [initialData]);

    const handleSubmit = async () => {
        try {
            if (!isDetailView) {
                // Handle form validation
                if (selectedCurrency.length === 0 || selectedWorkPlan.length === 0 || selectedLocation.length === 0 || !subjectOfProcurement || !expectedReceiptDate) {
                    toast.error('All fields are required');
                    return;
                }
            }

            const data = {
                currencyCode: selectedCurrency[0]?.value,
                workPlanNo: selectedWorkPlan[0]?.value,
                locationCode: selectedLocation[0]?.value,
                procurementDescription: subjectOfProcurement,
                expectedReceiptDate: formatDate(expectedReceiptDate.toISOString()),
                project: selectedDimension[0]?.value,
                requestorNo: initialData?.requestorNo || '',
            };

            await onSubmit(data);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            {/* Iterate through fields to render them */}
            {fields.map((fieldGroup, index) => (
                <div key={index}>
                    {fieldGroup.map((field) => (
                        <div key={field.id}>
                            <label>{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    disabled={disableFields || isLoading || field.disabled}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    {field.options.map((option: any) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    disabled={disableFields || isLoading || field.disabled}
                                    rows={field.rows}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    disabled={disableFields || isLoading || field.disabled}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}
            {!disableFields && (
                <button onClick={handleSubmit} disabled={isLoading}>
                    {isDetailView ? 'Update Requisition' : 'Create Requisition'}
                </button>
            )}
        </div>
    );
};

export default PurchaseRequisitionForm;
