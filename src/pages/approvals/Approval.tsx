import { useEffect, useState } from 'react';
// import { Button } from 'reactstrap';
import TableMui from '../../Components/ui/Table/TableMui';
import { apiApprovalToRequest } from '../../services/CommonServices';
import { statusFormatter, ActionFormatter } from '../../Components/ui/Table/TableUtils';
import { useAppSelector } from '../../store/hook';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { decodeValue } from '../../utils/common';

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
            let filterQuery = `$filter=Status eq 'Open' and UserEmail eq '${email}'`;

            if (filterType) {
                filterQuery += ` and ApprovalCode eq '${filterType}'`;
            }

            const response = await apiApprovalToRequest(companyId, filterQuery);
            if (response.data?.value) {
                setApprovals(response.data.value);
            }
        } catch (error) {
            toast.error(`Error fetching approvals: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals(selectedType);
    }, [companyId, email, selectedType]);

    const handleTypeChange = (option: any) => {
        setSelectedType(option?.value || '');
    };

    return (
        <TableMui
            isLoading={isLoading}
            data={approvals}
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