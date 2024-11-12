import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { apiApproveRequest, apiRejectApprovalRequest } from "../../services/ActionServices";
import { getErrorMessage } from "../../utils/common";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { CancelIcon, SendIcon } from "./icons/icons";

const ApprovalAction = ({ docNo, docType, companyId }) => {
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(false);

    const handleApproveDocument = async () => {
        const result = await Swal.fire({
            title: 'Sure you want to Approve?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Approve it!'
        });

        if (result.isConfirmed) {
            try {
                setIsDisabled(true);
                Swal.fire({
                    title: 'Approving: please wait...',
                    showConfirmButton: false,
                    timer: 1500
                });

                const response = await apiApproveRequest(companyId, { no: docNo });
                if (response.data.value) {
                    toast.success(`${docType} ${docNo} Approved Successfully`);
                    navigate('/approvals');
                }

            } catch (err) {
                toast.error(getErrorMessage(err.response.data.error.message));
                setIsDisabled(false);
            }
        }
    };

    const handleRejectDocument = async () => {
        const result = await Swal.fire({
            title: 'Sure you want to Reject this?',
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Reject it!'
        });

        if (result.isConfirmed) {
            const { value: rejComment } = await Swal.fire({
                input: 'textarea',
                inputLabel: 'Rejection Comment',
                inputPlaceholder: 'Type your comment here...',
                inputAttributes: {
                    'aria-label': 'Type your comment here'
                },
                confirmButtonColor: '#146C43',
                showLoaderOnConfirm: true,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) return 'Rejection Comment is Required!';
                }
            });

            if (rejComment) {
                try {
                    setIsDisabled(true);
                    Swal.fire({
                        title: 'Rejecting: please wait...',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    const response = await apiRejectApprovalRequest(companyId, {
                        no: docNo,
                        rejectioncomment: rejComment
                    },

                    );

                    toast.success(response.data.value);
                    navigate('/approvals');
                } catch (err) {
                    toast.error(getErrorMessage(err.response.data.error.message));
                    setIsDisabled(false);
                }
            }
        }
    };

    return (
        <div className="d-flex gap-2">
            <Button
                color="primary"
                disabled={isDisabled}
                onClick={handleApproveDocument}
                className="btn btn-label"
            >
                <i className="label-icon">
                    <SendIcon className="label-icon" />
                </i>
                Approve {docType}
            </Button>
            <Button
                color="danger"
                disabled={isDisabled}
                onClick={handleRejectDocument}
                className="btn btn-label"
            >
                <i className="label-icon">
                    <CancelIcon className="label-icon" />
                </i>
                Reject {docType}
            </Button>
        </div>
    );
};

export default ApprovalAction;