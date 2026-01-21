import BcApiService from "./BcApiServices.ts";
import { EmployeeData } from "../@types/employee.dto.ts";
import { PostedPayrollHeadersResponse } from "../@types/dashboard.dto.ts";

interface response {
  "@odata.context": string;
  value: EmployeeData[];
}

export async function employees(companyId: string, filterQuery?: string) {
  return BcApiService.fetchData<response>({
    url: `/api/hrpsolutions/hrmis/v2.0/employees?Company=${companyId}&${filterQuery}`,
  });
}

export async function postedPayrollHeaders(
  companyId: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<PostedPayrollHeadersResponse>({
    url: `/api/hrpsolutions/hrmis/v2.0/postedPayrollHeaders?Company=${companyId}${
      filterQuery ? `&${filterQuery}` : ""
    }`,
  });
}

export async function PrintPaySlip(
  companyId: string,
  payrollId: string,
  employeeNo: string
) {
  const response = await BcApiService.fetchData<any>({
    url: `/ODataV4/PayslipAPI_PrintPaySlip?Company=${companyId}`,
    method: "POST",
    data: {
      no: employeeNo,
      period: payrollId,
    },
  });

  console.log("Full API Response:", response);
  console.log("Response data:", response.data);

  // Extract base64 string from response
  // The new codeunit returns the Base64 string directly as Text
  // It may be in response.data.value or response.data depending on OData wrapping
  let base64String: string | null = null;

  if (response.data) {
    // Try different possible response structures
    if (typeof response.data === "string") {
      base64String = response.data;
    } else if (response.data.value) {
      base64String = response.data.value;
    } else if (response.data.result) {
      base64String = response.data.result;
    }
  }

  if (!base64String) {
    console.error("No base64 string in response data:", response.data);
    throw new Error("No base64 string found in response");
  }

  try {
    console.log("Base64 string length:", base64String.length);
    console.log("Base64 string starts with:", base64String.substring(0, 50));

    // Validate base64 string
    if (base64String.length === 0) {
      throw new Error("Base64 string is empty");
    }

    // Check if it's valid base64
    try {
      atob(base64String);
    } catch (e) {
      throw new Error("Invalid base64 string");
    }

    const byteCharacters = atob(base64String);
    console.log("Decoded bytes length:", byteCharacters.length);

    // Check if it's actually a PDF (should start with %PDF)
    if (
      byteCharacters.length < 4 ||
      byteCharacters.substring(0, 4) !== "%PDF"
    ) {
      console.warn("Warning: Data doesn't start with PDF signature");
      console.log("First 10 characters:", byteCharacters.substring(0, 10));
    }

    // Check if PDF has any substantial content
    if (byteCharacters.length < 1000) {
      console.warn(
        "⚠️ WARNING: PDF is very small (" +
          byteCharacters.length +
          " bytes). This might be an empty or failed PDF."
      );
    }

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    console.log("Blob size:", blob.size);
    console.log("Blob type:", blob.type);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payslip_${employeeNo}_${payrollId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("PDF downloaded successfully");
  } catch (error) {
    console.error("Error converting PDF:", error);
    throw new Error(
      `Failed to convert PDF response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  return response;
}
