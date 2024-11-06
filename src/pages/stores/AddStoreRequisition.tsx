import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { apiLocation, apiDimensionValue } from "../../services/CommonServices.ts";
import { useAppSelector } from "../../store/hook.ts";
import { useNavigate } from 'react-router-dom';
import HeaderMui from '../../Components/ui/Header/HeaderMui.tsx';
import { options } from '../../@types/common.dto.ts';

function AddStoreRequisition() {
    const { companyId } = useAppSelector(state => state.auth.session);
    const navigate = useNavigate();
    const { employeeNo, employeeName } = useAppSelector(state => state.auth.user);

    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    // Form states
    const [selectedLocationType, setSelectedLocationType] = useState<options[]>([]);
    const [selectedTransferTo, setSelectedTransferTo] = useState<options[]>([]);
    const [selectedDimension, setSelectedDimension] = useState<options[]>([]);
    const [requisitionType, setRequisitionType] = useState<options[]>([]);
    const [purpose, setPurpose] = useState<string>('');
    const [transitCode, setTransitCode] = useState<string>('');
    const [status] = useState<string>('Open');

    // Options states
    const [locationOptions, setLocationOptions] = useState<options[]>([]);
    const [dimensionValues, setDimensionValues] = useState<options[]>([]);

    const requisitionTypeOptions = [
        { label: 'Issue', value: 'Issue' },
        { label: 'Transfer Order', value: 'TransferOrder' }
    ];

    const fields = [
        [
            { label: 'Requisition No', type: 'text', value: '', disabled: true, id: 'requestNo' },
            { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
            { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },
            {
                label: 'Project Code',
                type: 'select',
                value: selectedDimension,
                id: 'projectCode',
                options: dimensionValues,
                onChange: (e: options) => setSelectedDimension([{ label: e.label, value: e.value }])
            },
        ],
        [
            {
                label: 'Requisition Type',
                type: 'select',
                options: requisitionTypeOptions,
                value: requisitionType,
                onChange: (e: options) => {
                    setRequisitionType([{ label: e.label, value: e.value }]);
                    // Reset transfer-related fields when switching types
                    if (e.value !== 'TransferOrder') {
                        setSelectedTransferTo([]);
                        setTransitCode('');
                    }
                },
                id: 'requisitionType'
            },
            {
                label: 'Location Code',
                type: 'select',
                options: locationOptions,
                value: selectedLocationType,
                onChange: (e: options) => setSelectedLocationType([{ label: e.label, value: e.value }]),
                id: 'location'
            },
            ...(requisitionType[0]?.value === 'TransferOrder' ? [
                {
                    label: 'Transfer To',
                    type: 'select',
                    options: locationOptions,
                    value: selectedTransferTo,
                    onChange: (e: options) => setSelectedTransferTo([{ label: e.label, value: e.value }]),
                    id: 'transferTo'
                },
                {
                    label: 'Transit Code',
                    type: 'text',
                    value: transitCode,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTransitCode(e.target.value),
                    id: 'transitCode'
                }
            ] : []),
            {
                label: 'Purpose',
                type: 'textarea',
                value: purpose,
                rows: 2,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPurpose(e.target.value),
                id: 'purpose'
            },
            { label: "Status", type: 'text', value: status, disabled: true, id: 'docStatus' },
        ]
    ];

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            // Add your submission logic here
            // Similar to the purchase requisition but with store-specific fields
            toast.success('Store requisition created successfully');
        } catch (error) {
            toast.error(`Error creating store requisition: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const populateData = async () => {
        try {
            setIsLoading(true);
            
            // Fetch locations
            const resLocationCodes = await apiLocation(companyId);
            const locationOptions = resLocationCodes.data.value.map((e) => ({
                label: `${e.code}::${e.name}`,
                value: e.code
            }));
            setLocationOptions(locationOptions);

            // Fetch dimension values
            const dimensionFilter = `&$filter=globalDimensionNo eq 1`;
            const resDimensionValues = await apiDimensionValue(companyId, dimensionFilter);
            const dimensionValues = resDimensionValues.data.value.map((e) => ({
                label: `${e.code}::${e.name}`,
                value: e.code
            }));
            setDimensionValues(dimensionValues);

        } catch (error) {
            toast.error(`Error fetching data: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        populateData();
    }, []);

    return (
        <HeaderMui
            title="Stores"
            subtitle="Store Requisitions"
            breadcrumbItem="Add Store Requisition"
            fields={fields}
            isLoading={isLoading}
            showError={showError}
            toggleError={() => setShowError(!showError)}
            handleBack={() => navigate('/store-requisitions')}
            handleSubmit={handleSubmit}
            pageType='add'
        />
    );
}

export default AddStoreRequisition;
