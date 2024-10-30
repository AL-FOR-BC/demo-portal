
import { Link } from 'react-router-dom'
import { Card, Col, Row } from 'reactstrap'

function Reports() {
    const handlePayslips = () => {
        console.log('Payslips')
    }
    const handleNSSF = () => {
        console.log('NSSF')
    }
    const handlePAYE = () => {
        console.log('PAYE')
    }
    const handleRBS = () => {
        console.log('RBS')
    }
    const handleLeaveUtilization = () => {
        console.log('Leave Utilization')
    }
    const tog_leaverRoster = () => {
        console.log('Leave Roster')
    }
   return (
        <Card className="bg-primary bg-soft">
            <div>
                <Row>
                    <Col xs="12">
                        <div className="text-primary p-3">
                            <h6 className="text-primary">Reports:</h6>
                            <ul className="ps-3 mb-0">
                                <li className="py-1"><Link to="#" onClick={() => handlePayslips()}>Payslip</Link> </li>
                                <li className="py-1"><Link to="#" onClick={() => handleNSSF()}>NSSF</Link></li>
                                <li className="py-1"><Link to="#" onClick={() => handlePAYE()}>PAYE</Link></li>
                                <li className="py-1"><Link to="#" onClick={() => handleRBS()}>RBS</Link></li>
                                <li className="py-1"><Link to="#" onClick={() => handleLeaveUtilization()}>Leave Utilization</Link></li>

                                <li className="py-1"><Link to="#" onClick={() => tog_leaverRoster()}>Consolidated Leave Roster</Link></li>

                            </ul>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
    )
}

export default Reports