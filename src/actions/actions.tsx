import { SendApprovalButton } from "../utils/common";

// approvalActions.ts
export const handleSendForApproval = async (
    documentNo: string,
    documentLines: any[],
    companyId: string,
    link: string,
    populateDoc: () => void
): Promise<void> => {
    const data = { documentNo };

    try {
        const response = await SendApprovalButton({ data, documentLines, companyId, link, populateDoc });

        if (response) {
            console.log("response", response);
        }
    } catch (error) {
        console.error("Error sending for approval:", error);
    }
}