// src/components/CardWelcome.tsx

import React from "react";
import { Row, Col, Card } from "reactstrap";
import { Link } from "react-router-dom";
import profileImg from "../../../assets/images/profile-img.png";
interface CardWelcomeProps {
}
interface NavLinkItem {
  to: string;
  label: string;
}

// Array of navigation links
const navLinks: NavLinkItem[] = [
  { to: "/leave-plans", label: "Submit Leave Plan" },
  { to: "/leave-calendar", label: "View Leave Calendar" },
  { to: "/leave-requests", label: "Apply for Leave" },
  { to: "/disciplinary-cases", label: "Raise D&G cases" },
  { to: "/training-plans", label: "Request for a Training" },
];

// Functional Component
const CardWelcome: React.FC<CardWelcomeProps> = () => {
  return (
    <Card className="bg-primary bg-soft">
      <div>
        <Row>
          <Col xs="7">
            <div className="text-primary p-3">
              <h5 className="text-primary">You can now:</h5>
              <ul className="ps-3 mb-0">
                {navLinks.map((link) => (
                  <li className="py-1" key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs="5" className="align-self-end">
            <img src={profileImg} alt="Profile" className="img-fluid" />
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default CardWelcome;
