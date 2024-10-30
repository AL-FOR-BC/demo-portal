import React from "react";
import { Col, Card, CardBody,  } from "reactstrap";
import SimpleBar from "simplebar-react";
const birthday_wishes = [
    "May your day be filled with joy and laughter!",
    "Wishing you a fantastic birthday!",
    "Cheers to another year!",
    "Enjoy your special day to the fullest!",
    "Celebrating you today!",
    "Wishing you a day full of sweet surprises!",
    "Here’s to a year of great adventures!",
    "Enjoy every moment of your special day!",
    "Wishing you a fantastic year ahead!",
    "Happy birthday! Keep shining!",
    "Another year, another blessing!",
    "Wishing you all the best today!",
    "Hope this year brings more joy!",
    "Have a fabulous birthday!",
    "Celebrate big today!",
    "Wishing you love and laughter!"
];
const birthdayEmojis = ['🎉', '🎂'];

const Notifications = ({ birthdayIndividuals }) => {
    return (
        <React.Fragment>
            <Col xl="4">
                {/* <Card>
                    <CardBody>
                        <h5 className="card-title mb-4">Contracts</h5>
                        <SimpleBar style={{ maxHeight: "370px" }}>
                            <ul className="list-group">
                                {props.contracts && props.contracts.map((b, k) => (
                                    <li key={k}>{b.ContractText}</li>
                                ))}
                            </ul>
                        </SimpleBar>
                    </CardBody>
                </Card> */}
                <Card>
                    <CardBody>
                        <h5 className="card-title mb-4">BirthDays</h5>
                        <SimpleBar style={{ maxHeight: "270px" }}>
                            <ul className="list-group">
                                {birthdayIndividuals && birthdayIndividuals.length > 0 ? (
                                    birthdayIndividuals.map((b, k) => (
                                        <li key={k} className="list-group-item" style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>{b}</span>
                                            <span role="img" aria-label="birthday celebration" style={{ marginRight: '8px' }}>
                                                {birthdayEmojis[Math.floor(Math.random() * birthdayEmojis.length)]}
                                            </span>
                                            <span style={{ color: '#6c757d' }}>
                                                {birthday_wishes[Math.floor(Math.random() * birthday_wishes.length)]}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item" style={{ textAlign: 'center', color: '#6c757d' }}>
                                        No birthdays today!
                                    </li>
                                )}
                            </ul>
                        </SimpleBar>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default Notifications;
