import React, { useEffect } from 'react';
import { Col, Container, Row } from "reactstrap";
import UserCard from "./components/UserCard.tsx";
import { useAppDispatch, useAppSelector } from "../../store/hook.ts";
import CardWelcome from './components/CardWelcome.tsx';
// import { DocumentCountSummaryTypes } from '../../@types/dashboard.dto.ts';
import MiniWidget from './components/MiniWidget.tsx';
import { BageAccountHorizontalIcon, BagSuitCaseIcon, BusIcon, CartIcon, ReceiptIcon, TeachIcon } from '../../Components/common/icons/icons.tsx';
import { fetchEmployeeData, fetchPaymentRequests, fetchPurchaseRequests, fetchRequestToApprove, fetchTimeSheetApproval, fetchTravelRequests, fetchLeaveRequests, fetchStoreRequests, fetchLeavePlans } from '../../store/slices/dashboard/dashBoardSlice.ts';
import LeaveDetails from './components/LeaveDetails.tsx';
import Reports from './components/Reports.tsx';
import Notifications from './components/Notification.tsx';

function Dashboard() {
    // const [contracts, setContracts] = useState()
    // const [birthdays, setBirthdays] = useState()
    // const birthdayIndividuals: string[] = []
    const dispatch = useAppDispatch()
    const userProfile = useAppSelector(state => state.auth.user);
    const { companyId } = useAppSelector(state => state.auth.session)
    const { employeeNo, email, employeeGender } = useAppSelector(state => state.auth.user)
    const dashBoardData = useAppSelector(state => state.dashboard.userDashBoard.userDashBoardData)
    const leavalDashoardData = useAppSelector(state => state.dashboard.userDashBoard.leavalDashoardData)
    const birthdayIndividuals = useAppSelector(state => state.dashboard.userDashBoard.notificationDate.birthdayIndividuals)
    const pendingApprovals = useAppSelector(state => state.dashboard.userDashBoard.userDashBoardData.pendingApprovals)
    useEffect(() => {
        if (employeeNo) {
            dispatch(fetchTravelRequests({ employeeNo, companyId }));
            dispatch(fetchPurchaseRequests({ employeeNo, companyId }))
            dispatch(fetchPaymentRequests({ employeeNo, companyId }))
            dispatch(fetchRequestToApprove({ companyId, email }))
            dispatch(fetchTimeSheetApproval({ companyId, email }))
            dispatch(fetchEmployeeData({ companyId }))
            dispatch(fetchLeaveRequests({ companyId, employeeNo }))
            dispatch(fetchStoreRequests({ companyId, employeeNo }))
            dispatch(fetchLeavePlans({ companyId, employeeNo }))
        }
    }, [dispatch, employeeNo, companyId]);

    const documentCountSummary = [
        {
            icon: <BusIcon />,
            title: "Leave Requests",
            value: dashBoardData.leaveRequests,
            url: "/leave-requests",
        },
        {
            icon: <BageAccountHorizontalIcon />,
            title: "Appraisals",
            value: dashBoardData.appraisals,
            url: "/individual-performance-appraisal",
        },
        {
            icon: <TeachIcon />,
            title: "Training Requests",
            value: dashBoardData.trainingRequests,
            url: "/training-plans",
        },
        {
            icon: <CartIcon />,
            title: "Purchases",
            value: dashBoardData.pruchaseRequests,
            url: "/purchase-requisitions",
        },
        {
            icon: <ReceiptIcon />,
            title: "Payments",
            value: dashBoardData.paymentRequests,
            url: "/payment-requisitions",
        },
        {
            icon: <BagSuitCaseIcon />,
            title: "Travel Requests",
            value: dashBoardData.travelRequests,
            url: "/travel-requests",
        },
    ]


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Card User */}
                    <UserCard
                        username={userProfile.employeeName ?? ''}
                        role={userProfile.jobTitle ?? ''}
                        abbrev={userProfile.nameAbbrev ?? ''}
                        pendingApprovals={pendingApprovals}
                        leavePlans={dashBoardData.leavePlans}
                        // leaveRequests={dashBoardData.leaveRequests}
                        storeRequests={dashBoardData.storeRequests}

                    />
                    <Row>
                        <Col xl="4">
                            {/* welcome card */}
                            <CardWelcome />
                        </Col>
                        <Col xl="8">
                            <Row>
                                {/*mimi widgets */}
                                <MiniWidget documentCountSummary={documentCountSummary} />
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        {/* Leave */}
                        <LeaveDetails leavalDashoardData={leavalDashoardData} employeeGender={employeeGender} />
                        <Notifications birthdayIndividuals={birthdayIndividuals} />
                        <Col xl={4}>
                            <Reports />
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default Dashboard;