import React from "react"
import {
    Row,
    Col,
    Card,
    CardBody
} from "reactstrap"

import { Link } from "react-router-dom"
interface userCard{
    username: string,
    abbrev: string,
    role: string
    pendingApprovals: number
    leaveRequests:number
    leavePlans:number


}
function UserCard(props:userCard) {
    // const [settingsMenu, setSettingsMenu] = useState(false)
    // //Setting Menu
    // // const toggleSettings = () => {
    // //     setSettingsMenu(settingsMenu)
    // }

    return (
        <React.Fragment>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <Row>
                                <Col lg="4">
                                    <div className="d-flex">
                                        <div className="me-2">
                                            <div className="avatar-sm mx-auto mt-1">
                                                <span
                                                    className={
                                                        "avatar-title rounded-circle bg-soft bg-primary primary text-primary font-size-16"
                                                    }
                                                >
                                                    {props.abbrev}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 align-self-center">
                                            <div className="text-muted">
                                                <h6 className="mb-1">{props.username}</h6>
                                                <p className="mb-0">{props.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg="8" className="align-self-center">
                                    <div className="text-lg-center mt-4 mt-lg-0">
                                        <Row>
                                            <Col xs="4">
                                                <Link to="/approvals">
                                                    <div>
                                                        <p className="text-truncate mb-2">
                                                            Pending Approvals
                                                        </p>
                                                        <h6 className="mb-0">{props.pendingApprovals}</h6>
                                                    </div>
                                                </Link>
                                            </Col>
                                            <Col xs="4">
                                                <Link to="/leave-plans">
                                                    <div>
                                                        <p className="text-truncate mb-2">
                                                            Your Leave Plans
                                                        </p>
                                                        <h6 className="mb-0">{props.leavePlans}</h6>
                                                    </div>
                                                </Link>
                                            </Col>
                                            <Col xs="4">
                                                <Link to="/leave-requests">
                                                    <div>
                                                        <p className="text-truncate mb-2">
                                                            Your Leave Requests
                                                        </p>
                                                        <h6 className="mb-0">{props.leaveRequests}</h6>
                                                    </div>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default UserCard
