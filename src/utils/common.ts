import { split, upperCase } from "lodash";
import {
  apiCancelApproval,
  apiSendForApproval,
} from "../services/ActionServices";
import { toast } from "react-toastify";


export function lowercaseOrganizationEmail(email: string): string {
    const organizationDomains = ['@hrpsolutions.com', '@reachoutmbuya.org'];
    
    const matchedDomain = organizationDomains.find(domain => 
        email.toLowerCase().endsWith(domain.toLowerCase())
    );

    if (matchedDomain) {
        const [localPart, domain] = email.split('@');
        
        return `${localPart.toLowerCase()}@${domain}`;
    }
    
    return email;
}

export const emailUpperCase = (mail: string) => {
  const parts = mail.split("@");
  if (parts.length > 1) {
    const firstPart = upperCase(parts[0]);
    return `${firstPart}@${parts[1].substring(0)}`;
  } else {
    return mail;
  }
};

export const formatDate = (date: string) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const customStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    opacity: 1,
  }),
};

export function decodeValue(encodedValue: string): string {
  return encodedValue
    .replace(/_x002F_/g, "/") // Replace encoded slashes
    .replace(/_x0020_/g, " ") // Replace encoded spaces
    .replace(/_x0028_/g, "(") // Replace encoded (
    .replace(/_x0029_/g, ")"); // Replace encoded )
}

interface SendApprovalProps {
  data: {
    documentNo: string;
  };
  documentLines: any[];
  companyId: string;
  populateDoc: () => void;
  link: string;
}
interface CancelApprovalProps {
  data: {
    documentNo: string;
  };
  documentLines?: any[];
  companyId: string;
  populateDoc: () => void;
  action: string;
}
type ErrorResponse = {
  response: {
    data: {
      error: {
        code: string;
        message: string;
      };
    };
  };
};
export const SendApprovalButton = async ({
  data,
  documentLines,
  companyId,
  link,
  populateDoc,
}: SendApprovalProps) => {
  if (documentLines.length == 0) {
    toast.error("Please add lines to the document");
    return;
  }
  const documentData = JSON.stringify(data);
  try {
    const response = await apiSendForApproval(companyId, documentData, link);
    if (response.status === 204) {
      toast.success(`Document ${data.documentNo} sent for approval`);
      populateDoc();
      return response.data;
    }
  } catch (error: unknown) {
    console.log("error", error);
    if (isErrorResponse(error)) {
      toast.error(
        `Error sending document for approval:${error.response.data.error.message}`
      );
    } else {
      toast.error("An unknown error occurred");
    }
  }
};

export const cancelApprovalButton = async ({
  companyId,
  data,
  action,
  populateDoc,
}: CancelApprovalProps) => {
  const documentData = JSON.stringify(data);
  try {
    const response = await apiCancelApproval(companyId, documentData, action);
    if (response.status === 204) {
      toast.success(`Document ${documentData} approval cancelled`);
      populateDoc();
      return response.data;
    }
  } catch (error: unknown) {
    console.log("error", error);
    if (isErrorResponse(error)) {
      toast.error(
        `Error cancelling document approval:${error.response.data.error.message}`
      );
    } else {
      toast.error("An unknown error occurred");
    }
  }
};

export const formatDateTime = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  var hr =
      ("" + d.getHours()).length < 2 ? "0" + d.getHours() : "" + d.getHours(),
    min =
      ("" + d.getMinutes()).length < 2
        ? "0" + d.getMinutes()
        : "" + d.getMinutes();

  var time = hr + ":" + min;

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  var day = [year, month, day].join("-");

  return [day, time].join(" ");
};




export const getErrorMessage = (error:string) => {
  return(split(error, 'CorrelationId:')[0]);
}

function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'error' in error.response.data
  );
}
