import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  FormGroup,
  Label,
} from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setSystemConfigSession,
  isSystemConfigSessionActive,
} from "../../auth/utils/systemConfigAuth";
import { verifyAdminPin } from "../services/adminConfigService";

const SystemConfigLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSystemConfigSessionActive()) {
      const from = (location.state as { from?: string })?.from || "/system-config";
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pin) {
      toast.error("Please enter the admin PIN");
      return;
    }

    try {
      setIsLoading(true);
      const response = await verifyAdminPin(pin);

      if (response.data.success) {
        setSystemConfigSession();
        const from = (location.state as { from?: string })?.from || "/system-config";
        navigate(from, { replace: true });
        toast.success("Admin PIN verified successfully");
      } else {
        toast.error("Invalid admin PIN");
        setPin("");
      }
    } catch (error) {
      console.error("PIN verification error:", error);
      toast.error("Failed to verify admin PIN");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="mt-5">
              <CardBody>
                <h4 className="text-center mb-4">Admin PIN Required</h4>
                <p className="text-muted text-center mb-4">
                  Please enter the admin PIN to access system configuration.
                </p>

                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="adminPin">Admin PIN</Label>
                    <Input
                      type="password"
                      id="adminPin"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter admin PIN"
                      autoFocus
                      disabled={isLoading}
                    />
                  </FormGroup>

                  <Button type="submit" color="primary" block disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Access System Config"}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SystemConfigLoginPage;
