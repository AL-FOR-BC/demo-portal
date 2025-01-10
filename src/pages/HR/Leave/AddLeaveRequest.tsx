import { useState } from "react";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";

// interface
interface FormData {
  telephoneNumber: string;
  delegate: string;
  startDate: string;
  endDate: string;
  leaveAddress: string;
}

function AddLeaveRequest() {
  const navigate = useNavigate();

  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );
  //   const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    telephoneNumber: "",
    delegate: "",
    startDate: "",
    endDate: "",
    leaveAddress: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

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
    ],
    [
      {
        label: "Telephone Number",
        type: "text",
        value: formData.telephoneNumber || "",
        id: "telephoneNumber",
        placeholder: "XXX-XXX-XXXX",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value.replace(/\D/g, "");
          const formattedValue =
            value.length <= 10
              ? value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
              : value.slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
          handleInputChange("telephoneNumber", formattedValue);
        },
        required: true,
      },
      {
        label: "Delegate",
        type: "text",
        value: formData.delegate || "",
        id: "delegate",
        placeholder: "Enter delegate name",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("delegate", e.target.value);
        },
        required: true,
      },
    ],
    [
      {
        label: "Start Date",
        type: "date",
        value: formData.startDate || "",
        id: "startDate",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("startDate", e.target.value);
          // Automatically set minimum date for end date
          if (
            e.target.value &&
            (!formData.endDate || formData.endDate < e.target.value)
          ) {
            handleInputChange("endDate", e.target.value);
          }
        },
        min: new Date().toISOString().split("T")[0], // Today's date as minimum
        required: true,
      },
      {
        label: "End Date",
        type: "date",
        value: formData.endDate || "",
        id: "endDate",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("endDate", e.target.value);
        },
        min: formData.startDate || new Date().toISOString().split("T")[0],
        required: true,
      },
    ],
    [
      {
        label: "Leave Address",
        type: "textarea",
        value: formData.leaveAddress || "",
        id: "leaveAddress",
        placeholder: "Enter your address during leave",
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          handleInputChange("leaveAddress", e.target.value);
        },
        rows: 3,
        required: true,
      },
    ],
  ];

  const handleSubmit = () => {};

  return (
    <HeaderMui
      title="Leave Request"
      subtitle="Leave Request"
      breadcrumbItem="Add Leave Request"
      fields={fields}
      isLoading={false}
      // docError={docError}
      handleBack={() => navigate("/leave-requests")}
      handleSubmit={handleSubmit}
      pageType="add"
    />
  );
}

export default AddLeaveRequest;
