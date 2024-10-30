
import { Link } from "react-router-dom"
import { Row, Col, BreadcrumbItem } from "reactstrap"
import {breadCrumbProps} from "../@types/common.dto.ts";

const BreadCrumbs = (props:breadCrumbProps) => {
    return (
        <Row>
            <Col className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                    <h4 className="mb-sm-0 font-size-18">{props.breadcrumbItem}</h4>
                    <div className="page-title-right">
                        <ol className="breadcrumb m-0">
                            <BreadcrumbItem>
                                <Link to="#">{props.title}</Link>
                            </BreadcrumbItem>
                            {props.subTitle != null ?
                                <BreadcrumbItem>
                                    <Link to="#">{props.subTitle}</Link>
                                </BreadcrumbItem> : '' }
                            <BreadcrumbItem active>
                                <Link to="#">{props.breadcrumbItem}</Link>
                            </BreadcrumbItem>
                        </ol>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default BreadCrumbs;