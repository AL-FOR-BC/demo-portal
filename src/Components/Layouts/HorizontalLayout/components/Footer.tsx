import React from "react"
import { Container, Row, Col } from "reactstrap"
import { COMPANY_NAME } from "../../../../constants/app.constants"


const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid={true}>
                    <Row>
                        <Col md={6}>{new Date().getFullYear()} © Ehub.{COMPANY_NAME}</Col>
                        <Col md={6}>
                            <div className="text-sm-end d-none d-sm-block">
                                {COMPANY_NAME}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    )
}

export default Footer
