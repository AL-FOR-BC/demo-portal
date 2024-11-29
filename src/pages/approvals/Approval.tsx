import { useEffect, useState } from 'react';
// import { Button } from 'reactstrap';
import TableMui from '../../Components/ui/Table/TableMui';
import { apiApprovalToRequest } from '../../services/CommonServices';
import { statusFormatter, ActionFormatter } from '../../Components/ui/Table/TableUtils';
import { useAppSelector } from '../../store/hook';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { decodeValue, formatEmailDomain, formatEmailFirstPart } from '../../utils/common';
import { TimeSheetsService } from '../../services/TimeSheetsService';

interface ApprovalType {
    DocumentNo: string;          // Updated to match API response
    DocumentType: string;        // Updated to match API response
    ApprovalCode: string;
    SenderID: string;
    DateTimeSentforApproval: string;
    Status: string;
    SystemId: string;
}

const APPROVAL_TYPES = [
    { value: '', label: 'All Types' },
    { value: 'PURCHASE REQ', label: 'Purchase Requisition' },
    { value: 'PAYMENT REQUISITION', label: 'Payment Requisition' },
    { value: 'STORE REQUISITION', label: 'Store Requisition' },
    { value: 'LEAVE REQUEST', label: 'Leave Request' }
];

function Approvals() {
    const { companyId } = useAppSelector(state => state.auth.session);
    const { email } = useAppSelector(state => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);
    const [approvals, setApprovals] = useState < ApprovalType[] > ([]);
    const [timeSheetApprovals, setTimeSheetApprovals] = useState < ApprovalType[] > ([]);
    const [selectedType, setSelectedType] = useState('');

    const defaultSorted = [{
        dataField: 'DocumentNo',
        order: 'desc'
    }];

    const getApprovalPath = (documentType: string, documentNo: string) => {
        console.log("documentType:", decodeValue(documentType));
        const type = (decodeValue(documentType) || '').toLowerCase();
        console.log("type:", type);

        switch (type) {
            case 'purchase requisition':
                return `/approve-purchase-requisition/${documentNo}`
            case 'payment requisition':
                return `/approve-payment-requisition/${documentNo}`;

            case 'time sheets':
                return `/approved-time-sheets/${documentNo}`;
            // case 'store requisition':
            //     return `/approve-store-requisition/${documentNo}/${systemId}`;
            // case 'leave request':
            //     return `/approve-leave-request/${documentNo}/${systemId}`;
            default:
                return '#';
        }
    };



    const columns = [
        {
            dataField: 'DocumentNo',
            text: 'Document No',
            sort: true,
            formatter: (cell: string) => <strong>{cell}</strong>
        },
        {
            dataField: 'DocumentType',
            text: 'Document Type',
            sort: true,
            formatter: (cell: any) => decodeValue(cell)
        },
        {
            dataField: 'SenderID',
            text: 'Requested By',
            sort: true
        },
        {
            dataField: 'DateTimeSentforApproval',
            text: 'Date Sent',
            sort: true,
            formatter: (cell: string) => cell ? new Date(cell).toLocaleDateString() : '-'
        },
        {
            dataField: 'Status',
            text: 'Status',
            formatter: statusFormatter
        },
        {
            dataField: 'action',
            isDummyField: true,
            text: 'Action',
            formatter: (cell: any, row: any) => {
                console.log("row:", row.DocumentNo);
                console.log("getApprovalPath:", getApprovalPath(row.DocumentType, row.DocumentNo));
                return (
                    < ActionFormatter
                        row={row}
                        cellContent={cell}
                        navigateTo={getApprovalPath(row.DocumentType, row.DocumentNo)}
                        pageType="approval"
                    />
                )
            }
        }
    ];


    const fetchApprovals = async (filterType = '') => {
        try {
            setIsLoading(true);
            let filterQuery = `$filter=(UserEmail eq '${email}' or UserEmail eq '${email}' or UserEmail eq '${email.toUpperCase()}' or UserEmail eq '${formatEmailFirstPart(email)}' or UserEmail eq '${formatEmailDomain(email)}') and Status eq 'Open'`;

            if (filterType) {
                filterQuery += `and ApprovalCode eq '${filterType}'`;
            }

            // export const fetchTimeSheetApproval = createAsyncThunk(
            //     `${SLICE_NAME}/fetchTimeSheetApproval`,
            //     async ({ companyId, email }: { companyId: string; email: string }) => {
            //       const filterQuery = `$filter=(approverEmailAddress eq '${email}' or approverEmailAddress eq '${email}' or approverEmailAddress eq '${email.toUpperCase()}' or approverEmailAddress eq '${formatEmailFirstPart(
            //         email
            //       )}' or approverEmailAddress eq '${formatEmailDomain(
            //         email
            //       )}')&$expand=timeSheetLines`;
            //       const response = await TimeSheetsService.getTimeSheetHeader(
            //         companyId,
            //         filterQuery
            //       );
            //       // if lines contain any line with status submitted if yes return the count
            //       const timeSheetWithSubmittedLines = response.data.value.filter(
            //         (timeSheet) =>
            //           timeSheet.timeSheetLines.some((line) => line.Status === "Submitted")
            //       );
            //       if (timeSheetWithSubmittedLines.length > 0) {
            //         return timeSheetWithSubmittedLines.length;
            //       }
            //       return 0;
            //     }
            const response = await apiApprovalToRequest(companyId, filterQuery);
            if (response.data?.value) {
                console.log("response.data.value:", response.data.value);
                setApprovals(response.data.value);
            }
            const filterQuery2 = `$filter=(approverEmailAddress eq '${email}' or approverEmailAddress eq '${email}' or approverEmailAddress eq '${email.toUpperCase()}' or approverEmailAddress eq '${formatEmailFirstPart(email)}' or approverEmailAddress eq '${formatEmailDomain(email)}')&$expand=timeSheetLines`;

            const timeSheetApproval = await TimeSheetsService.getTimeSheetHeader(companyId, filterQuery2);

            if (timeSheetApproval.data.value.length > 0) {
                const hasSubmittedLines = timeSheetApproval.data.value.filter(
                    (timeSheet) =>
                        timeSheet.timeSheetLines.some((line) => line.Status === "Submitted")
                );
                if (hasSubmittedLines.length > 0) {
                    // Map through the filtered list to add "documentType" after approverEmailAddress
                    const approvalList = hasSubmittedLines.map((timeSheet) => {
                        return {
                            ...timeSheet,
                            DocumentType: "Time_x0020_Sheets",
                            DocumentNo: timeSheet.timeSheetNo,
                            SenderID: timeSheet.ResourceNo,
                            Status: 'Open'
                        };
                    });

                    console.log("approvalList:", approvalList);
                    setTimeSheetApprovals(approvalList);
                }
            }




        } catch (error) {
            toast.error(`Error fetching approvals: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchTimeSheetApprovals = async () => {
    //     const response = await TimeSheetsService.getTimeSheetHeader(companyId, `$filter=Status eq 'Open' and UserEmail eq '${email}'`);
    //     if (response.data?.value) {
    //         setApprovals(response.data.value);
    //     }
    // }

    useEffect(() => {
        fetchApprovals(selectedType);
    }, [companyId, email, selectedType]);

    const handleTypeChange = (option: any) => {
        setSelectedType(option?.value || '');
    };

    return (
        <TableMui
            isLoading={isLoading}
            data={[...approvals, ...timeSheetApprovals]}
            columns={columns}
            defaultSorted={defaultSorted}
            noDataMessage="No approvals pending"
            iconClassName="bx bx-check-circle"
            title="Approvals"
            subTitle="Manage all pending approvals"
            breadcrumbItem="Approvals"
            addLink=""
            addLabel=""
            filterComponent={
                <div className="d-flex align-items-center mb-3">
                    <Select
                        className="react-select"
                        classNamePrefix="select"
                        options={APPROVAL_TYPES}
                        value={APPROVAL_TYPES.find(type => type.value === selectedType)}
                        onChange={handleTypeChange}
                        isClearable={false}
                        placeholder="Filter by type..."
                        styles={{
                            control: (base) => ({
                                ...base,
                                minWidth: '200px'
                            })
                        }}
                    />
                </div>
            }
        />
    );
}

export default Approvals;