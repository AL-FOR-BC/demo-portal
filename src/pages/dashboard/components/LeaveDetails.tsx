import React from "react";
import { CardBody, Col, Table, Card } from "reactstrap";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const LeaveDetails = ({ leavalDashoardData, employeeGender }) => {
  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <h5 className="card-title mb-4">Leave</h5>
            <div className="mt-4">
              <SimpleBar style={{ maxHeight: "320px" }}>
                <div className="table-responsive">
                  <Table className="table table-striped table-hover mb-0 table table-sm m-0">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Entitled</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leavalDashoardData &&
                        leavalDashoardData.map((lv, lvID) => {
                          if (
                            employeeGender.toUpperCase() === "MALE" &&
                            lvID === 4
                          ) {
                            return null;
                          }
                          // Skip paternity leave for females (lvID 4)
                          if (
                            employeeGender.toUpperCase() === "FEMALE" &&
                            lvID === 5
                          ) {
                            return null;
                          }
                          return (
                            <tr key={lvID}>
                              <td style={{ width: "90px" }}>
                                <h5 className="text-truncate font-size-14 mb-1">
                                  {lv.leaveType}
                                  {console.log(lv.leaveType)}
                                </h5>
                              </td>
                              <td style={{ width: "50px" }}>
                                <h5 className="text-truncate font-size-14 mb-1">
                                  {lv.entitled}
                                </h5>
                              </td>
                              <td style={{ width: "50px" }}>
                                <h5 className="text-truncate font-size-14 mb-1">
                                  {lv.balance}
                                </h5>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </SimpleBar>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default LeaveDetails;
