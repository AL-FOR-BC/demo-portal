import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  apiLocation,
  apiDimensionValue,
} from "../../services/CommonServices.ts";
import { useAppSelector } from "../../store/hook.ts";
import { useNavigate } from "react-router-dom";
import HeaderMui from "../../Components/ui/Header/HeaderMui.tsx";
import { options } from "../../@types/common.dto.ts";
import { apiCreateStoreRequest } from "../../services/StoreRequestServices.ts";
import { getErrorMessage } from "../../utils/common.ts";
// import { StoreRequisitionSubmitData } from '../../@types/storeReq.dto.ts';

function AddStoreRequest() {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const navigate = useNavigate();
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );

  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  // Form states
  const [selectedLocationType, setSelectedLocationType] = useState<options[]>(
    []
  );
  const [selectedTransferTo, setSelectedTransferTo] = useState<options[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<options[]>([]);
  const [requisitionType, setRequisitionType] = useState<options[]>([]);
  const [purpose, setPurpose] = useState<string>("");
  const [transitCode, setTransitCode] = useState<options[]>([]);
  const [status] = useState<string>("Open");

  // Options states
  const [locationOptions, setLocationOptions] = useState<options[]>([]);
  const [dimensionValues, setDimensionValues] = useState<options[]>([]);
  const [transitCodeOptions, setTransitCodeOptions] = useState<options[]>([]);

  const requisitionTypeOptions = [
    { label: "Issue", value: "Issue" },
    { label: "Transfer Order", value: "Transfer Order" },
  ];

  const fields = [
    [
      {
        label: "Requisition No",
        type: "text",
        value: "",
        disabled: true,
        id: "requestNo",
      },
      {
        label: "Requestor No",
        type: "text",
        value: employeeNo,
        disabled: true,
        id: "empNo",
      },
      {
        label: "Requestor Name",
        type: "text",
        value: employeeName,
        disabled: true,
        id: "empName",
      },
      {
        label: "Department",
        type: "select",
        value: selectedDimension,
        id: "projectCode",
        options: dimensionValues,
        onChange: (e: options) =>
          setSelectedDimension([{ label: e.label, value: e.value }]),
      },
    ],
    [
      {
        label: "Requisition Type",
        type: "select",
        options: requisitionTypeOptions,
        value: requisitionType,
        onChange: (e: options) => {
          setRequisitionType([{ label: e.label, value: e.value }]);
          // Reset transfer-related fields when switching types
          if (e.value !== "Transfer Order") {
            setSelectedTransferTo([]);
            setTransitCode([]);
          }
        },
        id: "requisitionType",
      },
      {
        label: "Location Code",
        type: "select",
        options: locationOptions,
        value: selectedLocationType,
        onChange: (e: options) =>
          setSelectedLocationType([{ label: e.label, value: e.value }]),
        id: "location",
      },
      ...(requisitionType[0]?.value === "Transfer Order"
        ? [
            {
              label: "Transfer To",
              type: "select",
              options: locationOptions,
              value: selectedTransferTo,
              onChange: (e: options) => {
                if (selectedLocationType[0]?.value === e.value) {
                  toast.error(
                    "Transfer to cannot be the same as location code"
                  );
                } else {
                  setSelectedTransferTo([{ label: e.label, value: e.value }]);
                }
              },
              id: "transferTo",
            },
            {
              label: "Transit Code",
              type: "select",
              value: transitCode,
              options: transitCodeOptions,
              onChange: (e: options) =>
                setTransitCode([{ label: e.label, value: e.value }]),
              id: "transitCode",
            },
          ]
        : []),
      {
        label: "Purpose",
        type: "textarea",
        value: purpose,
        rows: 2,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setPurpose(e.target.value),
        id: "purpose",
      },
      {
        label: "Status",
        type: "text",
        value: status,
        disabled: true,
        id: "docStatus",
      },
    ],
  ];

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = {
        requestorNo: employeeNo,
        globalDimension1Code: selectedDimension[0]?.value,
        purpose: purpose,
        storeReqType: requisitionType[0]?.value,
        locationCode: selectedLocationType[0]?.value,
        ...(requisitionType[0]?.value === "Transfer Order"
          ? {
              transferTo: selectedTransferTo[0]?.value,
              transitCode: transitCode[0]?.value,
            }
          : {}),
      };
      const res = await apiCreateStoreRequest(companyId, data);
      if (res.status === 201) {
        toast.success("Store requisition created successfully");
        navigate(`/store-request-details/${res.data.systemId}`);
      }
    } catch (error) {
      toast.error(
        `Error creating store requisition: ${getErrorMessage(error)}`
      );
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
        value: e.code,
      }));
      setLocationOptions(locationOptions);

      // Fetch dimension values
      //? filter by globalDimensionNo eq 1
      const dimensionFilter = `&$filter=globalDimensionNo eq 1`;
      const resDimensionValues = await apiDimensionValue(
        companyId,
        dimensionFilter
      );
      const dimensionValues = resDimensionValues.data.value.map((e) => ({
        label: `${e.code}::${e.name}`,
        value: e.code,
      }));
      setDimensionValues(dimensionValues);

      // Fetch transit codes
      const transitCodeFilter = `&$filter=useInTransit eq true`;
      const resTransitCodes = await apiLocation(companyId, transitCodeFilter);
      const transitCodeOptions = resTransitCodes.data.value.map((e) => ({
        label: `${e.code}::${e.name}`,
        value: e.code,
      }));
      setTransitCodeOptions(transitCodeOptions);
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
      handleBack={() => navigate("/stores-requests")}
      handleSubmit={handleSubmit}
      pageType="add"
    />
  );
}

export default AddStoreRequest;
