import { Link } from "react-router-dom";
import { Card, Col, Row, Modal } from "reactstrap";
import { useState } from "react";
import {
  postedPayrollHeaders,
  PrintPaySlip,
} from "../../../services/DashBoardService";
import { useAppSelector } from "../../../store/hook";

function Reports() {
  const [modal_period, setmodal_period] = useState(false);
  const [period, setPeriod] = useState<string>("");
  const [periodList, setPeriodList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);

  const handlePayslips = () => {
    setmodal_period(true);
    fetchPeriodList();
  };

  const handleNSSF = () => {
    console.log("NSSF");
  };
  const handlePAYE = () => {
    console.log("PAYE");
  };
  const handleRBS = () => {
    console.log("RBS");
  };
  const handleLeaveUtilization = () => {
    console.log("Leave Utilization");
  };
  const tog_leaverRoster = () => {
    console.log("Leave Roster");
  };

  const fetchPeriodList = async () => {
    try {
      setLoading(true);
      // You'll need to get the companyId from your app context or props
      const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
      const response = await postedPayrollHeaders(companyId, filterQuery);
      setPeriodList(response.data.value || []);
    } catch (error) {
      console.error("Error fetching period data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSlip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value);
  };

  const tog_period = () => {
    setmodal_period(!modal_period);
    if (!modal_period) {
      setPeriod("");
    }
  };

  return (
    <>
      <Card className="bg-primary bg-soft">
        <div>
          <Row>
            <Col xs="12">
              <div className="text-primary p-3">
                <h6 className="text-primary">Reports:</h6>
                <ul className="ps-3 mb-0">
                  <li className="py-1">
                    <Link to="#" onClick={() => handlePayslips()}>
                      Payslip
                    </Link>{" "}
                  </li>
                  <li className="py-1">
                    <Link to="#" onClick={() => handleNSSF()}>
                      NSSF
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link to="#" onClick={() => handlePAYE()}>
                      PAYE
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link to="#" onClick={() => handleRBS()}>
                      RBS
                    </Link>
                  </li>
                  <li className="py-1">
                    <Link to="#" onClick={() => handleLeaveUtilization()}>
                      Leave Utilization
                    </Link>
                  </li>

                  <li className="py-1">
                    <Link to="#" onClick={() => tog_leaverRoster()}>
                      Consolidated Leave Roster
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Period Modal */}
      <Modal
        isOpen={modal_period}
        toggle={() => {
          tog_period();
        }}
        centered
        size="md"
        className="period-selection-modal"
      >
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title mb-0" id="myModalLabel">
            📄 Payroll Period Selection
          </h5>
          <button
            type="button"
            onClick={() => {
              setmodal_period(false);
            }}
            className="btn-close btn-close-white"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body p-4">
          <div className="text-center mb-4">
            <div className="avatar-sm mx-auto mb-3">
              <div className="avatar-title bg-primary bg-soft rounded-circle">
                📄
              </div>
            </div>
            <h6 className="text-muted">
              Select a payroll period to generate payslip
            </h6>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark mb-2">
              📅 Payroll Period
            </label>
            <select
              className="form-select form-select-lg border-2"
              value={period}
              onChange={(e) => handleGetSlip(e)}
              style={{ borderColor: period ? "#28a745" : "#dee2e6" }}
            >
              <option value="" className="text-muted">
                Choose a period...
              </option>
              {periodList.map((p, k) => (
                <option key={k} value={p.payrollId} className="py-2">
                  {p.payrollId}
                </option>
              ))}
            </select>
            {loading && (
              <div className="d-flex align-items-center mt-2">
                <div
                  className="spinner-border spinner-border-sm text-primary me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <small className="text-muted">Loading payroll periods...</small>
              </div>
            )}
            {!loading && periodList.length === 0 && (
              <small className="text-muted">
                No payroll periods found for this employee.
              </small>
            )}
          </div>

          {period && (
            <div className="alert alert-info border-0 bg-light-info">
              <div className="d-flex align-items-center">
                ✅
                <div className="ms-2">
                  <strong>Selected Period:</strong> {period}
                  <br />
                  <small className="text-muted">
                    Ready to generate payslip
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer border-0 pt-0">
          <button
            type="button"
            onClick={() => {
              tog_period();
            }}
            className="btn btn-light me-2"
          >
            ❌ Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!period || loading}
            onClick={async () => {
              if (period && employeeNo) {
                try {
                  setLoading(true);
                  console.log("Generating payslip for period:", period);

                  // Call the payslip service
                  const response = await PrintPaySlip(
                    companyId,
                    period,
                    employeeNo
                  );

                  console.log("Payslip generated successfully:", response);

                  // Close modal and reset
                  setmodal_period(false);
                  setPeriod("");

                  // Show success message
                  alert("✅ Payslip generated and downloaded successfully!");
                } catch (error) {
                  console.error("Error generating payslip:", error);
                  // Show error message
                  alert("❌ Failed to generate payslip. Please try again.");
                } finally {
                  setLoading(false);
                }
              } else {
                console.error("Period or Employee Number is missing");
                alert(
                  "❌ Please select a period and ensure employee number is available."
                );
              }
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Generating...
              </>
            ) : (
              "📄 Generate Payslip"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Reports;
