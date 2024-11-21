import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { toast } from "react-toastify";
import HeaderMui from "../../Components/ui/Header/HeaderMui";
import { options } from "../../@types/common.dto";
import { apiLocation, apiDimensionValue, apiUnitOfMeasure } from "../../services/CommonServices";
import { handleSendForApproval } from "../../actions/actions";
import { cancelApprovalButton, getErrorMessage } from "../../utils/common";

import { apiStoreRequestDetail, apiUpdateStoreRequest, apiDeleteStoreRequest, apiDeleteStoreRequestLine, apiCreateStoreRequestLine, apiUpdateStoreRequestLine, apiStoreRequestLines } from "../../services/StoreRequestServices";
import Swal from "sweetalert2";
import Lines from "../../Components/ui/Lines/Lines";
import { openModalRequisition } from '../../store/slices/Requisitions/purchaseRequisitionSlice';
import { useDispatch } from 'react-redux';
import { ActionFormatterLines } from '../../Components/ui/Table/TableUtils';
import { closeModalRequisition, modelLoadingRequisition } from '../../store/slices/Requisitions';



function StoreRequestDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { companyId } = useAppSelector(state => state.auth.session);
    const { employeeNo, employeeName, email } = useAppSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [selectedLocationType, setSelectedLocationType] = useState < options[] > ([]);
    const [selectedTransferTo, setSelectedTransferTo] = useState < options[] > ([]);
    const [selectedDimension, setSelectedDimension] = useState < options[] > ([]);
    const [requisitionType, setRequisitionType] = useState < options[] > ([]);
    const [purpose, setPurpose] = useState < string > ('');
    const [transitCode, setTransitCode] = useState < string > ('');
    const [status, setStatus] = useState < string > ('');
    const [requestNo, setRequestNo] = useState < string > ('');
    const [storeRequestLines, setStoreRequestLines] = useState([]);
    const [unitOfMeasureOptions, setUnitOfMeasureOptions] = useState < options[] > ([]);

    // Options states
    const [locationOptions, setLocationOptions] = useState < options[] > ([]);
    const [dimensionValues, setDimensionValues] = useState < options[] > ([]);

    const [lineDescription, setLineDescription] = useState('');
    const [lineQuantity, setLineQuantity] = useState(0);
    const [selectedUnitOfMeasure, setSelectedUnitOfMeasure] = useState < options[] > ([]);
    const [lineSystemId, setLineSystemId] = useState < string | undefined > (undefined);
    const [lineEtag, setLineEtag] = useState < string | undefined > (undefined);

    const requisitionTypeOptions = [
        { label: 'Issue', value: 'Issue' },
        { label: 'Transfer Order', value: 'TransferOrder' }
    ];

    const fields = [
        [
            { label: 'Requisition No', type: 'text', value: requestNo, disabled: true, id: 'requestNo' },
            { label: 'Requestor No', type: 'text', value: employeeNo, disabled: true, id: 'empNo' },
            { label: 'Requestor Name', type: 'text', value: employeeName, disabled: true, id: 'empName' },
            {
                label: 'Project Code',
                type: 'select',
                value: selectedDimension,
                disabled: status === 'Open' ? false : true,
                id: 'projectCode',
                options: dimensionValues,
                onChange: async (e: options) => {
                    if (storeRequestLines.length > 0) {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "Changing the project code will delete all existing lines. This action cannot be undone!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, delete all lines!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // deleteAllLines();
                                quickUpdate({ projectCode: e.value });
                                setSelectedDimension([{ label: e.label, value: e.value }]);
                            }
                        });
                    } else {
                        quickUpdate({ projectCode: e.value });
                        setSelectedDimension([{ label: e.label, value: e.value }]);
                    }
                }
            },
        ],
        [
            {
                label: 'Requisition Type',
                type: 'select',
                options: requisitionTypeOptions,
                value: requisitionType,
                disabled: status === 'Open' ? false : true,
                onChange: (e: options) => {
                    setRequisitionType([{ label: e.label, value: e.value }]);
                    quickUpdate({ storeReqType: e.value });
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
                disabled: status === 'Open' ? false : true,
                onChange: (e: options) => {
                    setSelectedLocationType([{ label: e.label, value: e.value }]);
                    quickUpdate({ locationCode: e.value });
                },
                id: 'location'
            },
            ...(requisitionType[0]?.value === 'TransferOrder' ? [
                {
                    label: 'Transfer To',
                    type: 'select',
                    options: locationOptions,
                    value: selectedTransferTo,
                    disabled: status === 'Open' ? false : true,
                    onChange: (e: options) => {
                        if (selectedLocationType[0]?.value === e.value) {
                            toast.error('Transfer to cannot be the same as location code');
                        } else {
                            setSelectedTransferTo([{ label: e.label, value: e.value }]);
                            quickUpdate({ transferTo: e.value });
                        }
                    },
                    id: 'transferTo'
                },
                {
                    label: 'Transit Code',
                    type: 'text',
                    value: transitCode,
                    disabled: status === 'Open' ? false : true,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        setTransitCode(e.target.value);
                        quickUpdate({ transitCode: e.target.value });
                    },
                    id: 'transitCode'
                }
            ] : []),
            {
                label: 'Purpose',
                type: 'textarea',
                value: purpose,
                rows: 2,
                disabled: status === 'Open' ? false : true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setPurpose(e.target.value);
                    quickUpdate({ purpose: e.target.value });
                },
                id: 'purpose'
            },
            { label: "Status", type: 'text', value: status, disabled: true, id: 'docStatus' },
        ]
    ];

    const quickUpdate = async (kwargs: any) => {
        try {
            if (id) {
                const response = await apiUpdateStoreRequest(companyId, id, kwargs);
                if (response.status === 200) {
                    toast.success("Updated successfully");
                }
            }
        } catch (error) {
            toast.error(`Error updating: ${getErrorMessage(error)}`);
        }
    };

    const populateData = async () => {
        try {
            setIsLoading(true);

            // Fetch store request details
            if (id) {
                const filter = `$expand=storeRequestline`;
                const response = await apiStoreRequestDetail(companyId, id, filter);
                const data = response.data;

                setRequestNo(data.no || '');
                setStatus(data.status || '');
                setPurpose(data.purpose || '');
                setTransitCode(data.transitCode || '');
                console.log(data.storeRequestline);

                // Set requisition type
                if (data.storeReqType) {
                    const reqType = requisitionTypeOptions.find(opt => opt.value === data.storeReqType);
                    if (reqType) setRequisitionType([reqType]);
                }

                // Fetch and set locations
                const resLocationCodes = await apiLocation(companyId);
                const locationOpts = resLocationCodes.data.value.map((e) => ({
                    label: `${e.code}::${e.name}`,
                    value: e.code
                }));
                setLocationOptions(locationOpts);

                // Set selected location
                if (data.locationCode) {
                    const loc = locationOpts.find(opt => opt.value === data.locationCode);
                    if (loc) setSelectedLocationType([loc]);
                }

                // Set transfer to location
                if (data.transferTo) {
                    const transferLoc = locationOpts.find(opt => opt.value === data.transferTo);
                    if (transferLoc) setSelectedTransferTo([transferLoc]);
                }

                // Fetch and set dimension values
                const dimensionFilter = `&$filter=globalDimensionNo eq 1`;
                const resDimensionValues = await apiDimensionValue(companyId, dimensionFilter);
                const dimensionOpts = resDimensionValues.data.value.map((e) => ({
                    label: `${e.code}::${e.name}`,
                    value: e.code
                }));
                setDimensionValues(dimensionOpts);


                // Fetch Unit of Measure
                const resUnitOfMeasure = await apiUnitOfMeasure(companyId);
                const unitOfMeasureOpts = resUnitOfMeasure.data.value.map((e) => ({
                    label: `${e.code}::${e.description}`,
                    value: e.code
                }));
                setUnitOfMeasureOptions(unitOfMeasureOpts);

                // Set selected dimension
                if (data.projectCode) {
                    const dim = dimensionOpts.find(opt => opt.value === data.projectCode);
                    if (dim) setSelectedDimension([dim]);
                }

                // Ensure each line has a unique ID
                if (data.storeRequestline) {
                    setStoreRequestLines(data.storeRequestline);
                }
            }
        } catch (error) {
            toast.error(`Error fetching data: ${getErrorMessage(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        populateData();
    }, [id, companyId]);

    const handleCancelApproval = async () => {
        const data = {
            documentNo: requestNo
        }
        try {
            const response = await cancelApprovalButton({
                companyId,
                data,
                action: "cancelStoreHeaderApprovalReq",
                populateDoc: populateData,
                documentLines: storeRequestLines
            })
            if (response) {
                toast.success("Approval canceled successfully");
            }
        } catch (error) {
            toast.error(`Error canceling approval: ${error}`);
        }
    }

    const handleDeleteStoreRequisition = async () => {
        try {
            const response = await apiDeleteStoreRequest(companyId, id || '');
            if (response.status === 204) {
                toast.success("Store requisition deleted successfully");
                navigate('/store-requisitions');
            }
        } catch (error) {
            toast.error(`Error deleting store requisition: ${getErrorMessage(error)}`);
        }
    }

    const columns = (status == "Open") ? [
        {
            dataField: 'description2',
            text: 'Description',
            sort: true,
        },
        {
            dataField: 'quantity',
            text: 'Quantity',
            sort: true,
        },
        {
            dataField: 'unitOfMeasure',
            text: 'Unit of Measure',

        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell: any, row: any) => {
                console.log(cell);
                return <ActionFormatterLines
                    row={row}
                    companyId={companyId}
                    apiHandler={apiStoreRequestLines}
                    handleDeleteLine={handleDeleteLine}
                    populateData={populateData}
                    handleEditLine={handleEditLine}

                />
            }

        }
    ] : [
        {
            dataField: 'description2',
            text: 'Description',
            sort: true,
        },
        {
            dataField: 'quantity',
            text: 'Quantity',
            sort: true,
        },
        {
            dataField: 'unitOfMeasure',
            text: 'Unit of Measure',

        }
    ];

    const modalFields = [
        [
            {
                label: 'Description',
                type: 'text',
                value: lineDescription,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLineDescription(e.target.value),
                id: 'description'
            },
            {
                label: 'Quantity',
                type: 'number',
                value: lineQuantity,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLineQuantity(Number(e.target.value)),
                id: 'quantity'
            },
            {
                label: 'Unit of Measure',
                type: 'select',
                options: unitOfMeasureOptions,
                value: selectedUnitOfMeasure,
                onChange: (e: options) => setSelectedUnitOfMeasure([{ label: e.label, value: e.value }]),
                id: 'unitOfMeasure'
            }
        ]
    ];

    const clearLineFields = () => {
        setLineDescription('');
        setLineQuantity(0);
        setSelectedUnitOfMeasure([]);
    };



    const handleSubmitLines = async () => {
        try {
            if (!id) {
                throw new Error("Document ID is missing");
            }

            // Validate before submitting
            if (!lineDescription || !lineQuantity || !selectedUnitOfMeasure[0]?.value) {
                toast.error("Please fill in all required fields");
                return { success: false };
            }

            const formattedData = {
                documentNo: requestNo,
                description2: lineDescription,
                quantity: Number(lineQuantity),
                unitOfMeasure: selectedUnitOfMeasure[0]?.value,
            };



            const response = await apiCreateStoreRequestLine(companyId, formattedData);

            if (response.status === 201) {
                toast.success("Line added successfully");
                await populateData();
                dispatch(closeModalRequisition())
                return { success: true };
            } else {
                throw new Error("Failed to create line");
            }
        } catch (error) {
            toast.error(`Error submitting line: ${getErrorMessage(error)}`);
            return { success: false };
        }
    };

    const handleEditLine = async (row: any) => {
        dispatch(openModalRequisition())
        dispatch(modelLoadingRequisition(true))
        clearLineFields()
        setLineSystemId(row.systemId)
        setLineEtag(row['@odata.etag'])
        setLineDescription(row.description2)
        setLineQuantity(row.quantity)
        const unitOfMeasureRes = await apiUnitOfMeasure(companyId)
        const unitOfMeasureOptions = unitOfMeasureRes.data.value.map(e => ({ label: `${e.code}::${e.description}`, value: e.code }))
        setUnitOfMeasureOptions(unitOfMeasureOptions)
        const unitOfMeasureData = unitOfMeasureOptions.filter(e => e.value === row.unitOfMeasure);
        unitOfMeasureData.length > 0 ? setSelectedUnitOfMeasure([{ label: unitOfMeasureData[0].label, value: unitOfMeasureData[0].value }]) : setSelectedUnitOfMeasure([{ label: '', value: '' }]);
        dispatch(modelLoadingRequisition(false))

    };

    const handleSubmitUpdatedLine = async () => {
        try {
            if (!lineSystemId || !lineEtag) {
                throw new Error("Line ID or ETag is missing");
            }

            const formattedData = {
                description2: lineDescription,
                quantity: Number(lineQuantity),
                unitOfMeasure: selectedUnitOfMeasure[0]?.value,
            };

            const response = await apiUpdateStoreRequestLine(
                companyId,
                lineSystemId,
                formattedData,
                lineEtag
            );

            if (response.status === 200) {
                toast.success("Line updated successfully");
                await populateData(); // Refresh the data
                dispatch(closeModalRequisition())

            } else {
                throw new Error("Failed to update line");
            }
        } catch (error) {
            toast.error(`Error updating line: ${getErrorMessage(error)}`);

        }
    };

    const handleDeleteLine = async (row: any) => {
        try {
            const response = await apiDeleteStoreRequestLine(companyId, row.systemId);
            if (response.status === 204) {
                toast.success("Line deleted successfully");
                await populateData(); // Refresh the data
                return response.status;
            }
        } catch (error) {
            toast.error(`Error deleting line: ${getErrorMessage(error)}`);
            throw error;
        }
    };

    return (
        <>
            <HeaderMui
                title="Store Requisition Detail"
                subtitle="Store Requisition Detail"
                breadcrumbItem="Store Requisition Detail"
                fields={fields}
                isLoading={isLoading}
                handleBack={() => navigate('/store-requisitions')}
                pageType="detail"
                status={status}
                companyId={companyId}
                documentType="Store Requisition"
                requestNo={requestNo}
                handleSendApprovalRequest={async () => {
                    const documentNo = requestNo;
                    const documentLines = storeRequestLines;
                    const link = 'sendStoreHeaderApprovalReq';

                    await handleSendForApproval(
                        documentNo,
                        email,
                        documentLines,
                        companyId,
                        link,
                        populateData
                    )
                }}
                handleCancelApprovalRequest={handleCancelApproval}
                handleDeletePurchaseRequisition={handleDeleteStoreRequisition}
                lines={
                    <Lines
                        clearLineFields={clearLineFields}
                        title="Store Requisition Lines"
                        subTitle="Store Requisition Lines"
                        breadcrumbItem="Store Requisition Lines"
                        addLink=""
                        addLabel=""
                        iconClassName=""
                        data={storeRequestLines}
                        columns={columns}
                        noDataMessage="No Store Requisition Lines found"
                        status={status}
                        modalFields={modalFields}
                        handleSubmitLines={handleSubmitLines}
                        handleDeleteLines={handleDeleteLine}
                        handleSubmitUpdatedLine={handleSubmitUpdatedLine}
                        handleValidateHeaderFields={() => true}
                    />
                }
            />
        </>
    );
}

export default StoreRequestDetail;