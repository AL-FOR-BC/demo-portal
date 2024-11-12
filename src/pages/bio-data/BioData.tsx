import { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { apiEmployees } from '../../services/CommonServices';
import { useAppSelector } from '../../store/hook';
import { Employee } from '../../@types/employee.dto';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { UserIcon, PhoneIcon, HomeIcon, HealthIcon, BriefCaseIcon } from '../../Components/common/icons/icons';
import BreadCrumbs from '../../Components/BreadCrumbs';
// import Breadcrumbs from '../../Components/common/Breadcrumbs';


function BioData() {
    const [isLoading, setIsLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);
    const { employeeNo } = useAppSelector(state => state.auth.user);
    const { companyId } = useAppSelector(state => state.auth.session);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setIsLoading(true);
                const filterQuery = `$filter=No eq '${employeeNo}'`;
                const response = await apiEmployees(companyId, filterQuery);
                if (response.data.value.length > 0) {
                    setEmployeeData(response.data.value[0]);
                }
            } catch (error) {
                toast.error('Error fetching employee data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployeeData();
    }, [companyId, employeeNo]);

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === '0001-01-01') return '-';
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) return <LoadingSpinner />;

    const InfoItem = ({ label, value }: { label: string; value: string | number | null }) => (
        <div className="mb-3">
            <p className="text-muted mb-1 font-size-13">{label}</p>
            <h6 className="mb-0">{value || '-'}</h6>
        </div>
    );

    return (
        <div className="page-content">
            <Container fluid>
                {/* Page Title */}
                <Row className="mb-4">
                    <Col>
                        <h4 className="fw-medium">Employee Bio Data</h4>
                    </Col>
                </Row>

                <BreadCrumbs 
                    title="Profile" 
                    breadcrumbItem="Bio Data" 
                    subTitle="Bio Data"
                />

                <Row>
                    {/* Basic Information */}
                    <Col lg={4}>
                        <Card>
                            <CardBody>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0 me-3">
                                        <UserIcon className="font-size-24 text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="card-title mb-0">Basic Information</h5>
                                    </div>
                                </div>
                                <InfoItem label="Employee No" value={employeeData?.No || ''} />
                                <InfoItem 
                                    label="Full Name" 
                                    value={`${employeeData?.FirstName || ''} ${employeeData?.MiddleName || ''} ${employeeData?.LastName || ''}`.trim()} 
                                />
                                <InfoItem label="Gender" value={employeeData?.Gender || ''} />
                                <InfoItem label="Date of Birth" value={formatDate(employeeData?.BirthDate || '')} />
                                <InfoItem label="Nationality" value={employeeData?.Nationality || ''} />
                                <InfoItem label="Religion" value={employeeData?.Religion || ''} />
                                <InfoItem label="NSSF Number" value={employeeData?.SocialSecurityNo || ''} />
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Contact Information */}
                    <Col lg={4}>
                        <Card>
                            <CardBody>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0 me-3">
                                        <PhoneIcon className="font-size-24 text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="card-title mb-0">Contact Information</h5>
                                    </div>
                                </div>
                                <InfoItem label="Email" value={employeeData?.Email || ''} />
                                <InfoItem label="Company Email" value={employeeData?.CompanyEMail || ''} />
                                <InfoItem label="Phone Number" value={employeeData?.PhoneNo || ''} />
                                <InfoItem label="Mobile Number" value={employeeData?.MobilePhoneNo || ''} />
                                <InfoItem label="Extension" value={employeeData?.Extension || ''} />
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Employment Details */}
                    <Col lg={4}>
                        <Card>
                            <CardBody>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0 me-3">
                                        <BriefCaseIcon className="font-size-24 text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="card-title mb-0">Employment Details</h5>
                                    </div>
                                </div>
                                <InfoItem label="Job Title" value={employeeData?.JobTitle || ''} />
                                <InfoItem label="Department" value={employeeData?.GlobalDimension1Code || ''} />
                                <InfoItem label="Position" value={employeeData?.Position || ''} />
                                <InfoItem label="Organization Unit" value={employeeData?.Org_Unit || ''} />
                                <InfoItem label="Employment Date" value={formatDate(employeeData?.EmploymentDate || '')} />
                                <InfoItem label="Status" value={employeeData?.Status || ''} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {/* Residence Information */}
                    <Col lg={6}>
                        <Card>
                            <CardBody>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0 me-3">
                                        <HomeIcon className="font-size-24 text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="card-title mb-0">Residence Information</h5>
                                    </div>
                                </div>
                                <Row>
                                    <Col md={6}>
                                        <InfoItem label="Current Address" value={employeeData?.Address || ''} />
                                        <InfoItem label="District of Residence" value={employeeData?.DistrictofResidence || ''} />
                                        <InfoItem label="County of Residence" value={employeeData?.CountyofResidence || ''} />
                                        <InfoItem label="Parish of Residence" value={employeeData?.ParishofResidence || ''} />
                                        <InfoItem label="Village of Residence" value={employeeData?.VillageofResidence || ''} />
                                    </Col>
                                    <Col md={6}>
                                        <InfoItem label="Country of Origin" value={employeeData?.CountryofOrigin || ''} />
                                        <InfoItem label="District of Origin" value={employeeData?.DistrictofOrigin || ''} />
                                        <InfoItem label="Sub-County of Origin" value={employeeData?.SubCountryofOrigin || ''} />
                                        <InfoItem label="Village of Origin" value={employeeData?.VillageofOrigin || ''} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Additional Information */}
                    <Col lg={6}>
                        <Card>
                            <CardBody>
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0 me-3">
                                        <HealthIcon className="font-size-24 text-primary" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="card-title mb-0">Additional Information</h5>
                                    </div>
                                </div>
                                <Row>
                                    <Col md={6}>
                                        <InfoItem label="Blood Group" value={employeeData?.BloodGroup || '' } />
                                        <InfoItem label="Personal Doctor" value={employeeData?.PersonalDoctor || ''} />
                                        <InfoItem label="Allergies" value={employeeData?.Allergiesifany || ''} />
                                        <InfoItem label="Chronic Ailments" value={employeeData?.ChronicAilmentsifany || ''} />
                                    </Col>
                                    <Col md={6}>
                                        <InfoItem label="Father's Name" value={employeeData?.FathersName || ''} />
                                        <InfoItem label="Father's Status" value={employeeData?.FathersStatus || ''} />
                                        <InfoItem label="Mother's Name" value={employeeData?.MothersName || ''} />
                                        <InfoItem label="Mother's Status" value={employeeData?.MothersStatus || ''} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default BioData;