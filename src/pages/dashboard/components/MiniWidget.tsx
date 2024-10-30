
import React from "react";
import { Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { DocumentCountSummaryTypes } from "../../../@types/dashboard.dto";



interface MiniWidgetProps {
    documentCountSummary: DocumentCountSummaryTypes[];
}

const MiniWidget: React.FC<MiniWidgetProps> = ({ documentCountSummary }) => {
    return (
        <React.Fragment>
            {documentCountSummary.map((doc, key) => (
                <Col sm="4" key={key}>
                    <Card>
                        <Link to={doc.url}>
                            <CardBody>
                                <div className="d-flex flex-wrap">
                                    <div className="me-3">
                                        <p className="mb-2">{doc.title}</p>
                                        <h6 className="mb-0">{doc.value}</h6>
                                    </div>
                                    <div className="avatar-sm ms-auto">
                                        <span className="avatar-title  rounded-circle bg-primary bg-soft text-primary font-size-16">
                                            <>
                                                {doc.icon}
                                            </>
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Link>
                    </Card>
                </Col>
            ))}
        </React.Fragment>
    )
}

export default MiniWidget;
