import { toast } from "react-toastify";

export interface BaseField {
  label: string;
  value: any;
  required?: boolean;
}

export interface validationOptions {
  showToast?: boolean;
  customErrorMessage?: string;
  validateSingle?: (field: BaseField) => boolean;
}

export class FormValidator {
  private static ValidateSingleField(field: any) {
    if (!field.required) return true;

    if (Array.isArray(field.value)) {
      return field.value.length > 0;
    }

    return (
      field.value !== null && field.value !== undefined && field.value !== ""
    );
  }
  static validateFields(
    fields: BaseField[] | BaseField[][],
    options: validationOptions = {}
  ) {
    const {
      showToast = true,
      customErrorMessage,
      validateSingle = FormValidator.ValidateSingleField,
    } = options;

    const flatFields = Array.isArray(fields[0])
      ? (fields as BaseField[][]).flat()
      : (fields as BaseField[]);
    const missingFields = flatFields.filter((field) => !validateSingle(field));

    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields
        .map((field) => field.label)
        .join(", ");

      const errorMessage =
        customErrorMessage || `Please fill in: ${missingFieldLabels}`;

      if (showToast) {
        toast.error(errorMessage);
      }

      return {
        isValid: false,
        missingFields: missingFields,
        errorMessage,
      };
    }
    return {
      isValid: true,
      missingFields: [],
      errorMessage: "",
    };
  }
}
