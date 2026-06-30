import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar, ListGroup, Button } from 'react-bootstrap';
import '../../assets/css/DashboardAdmin.css'; 

const AdminDashboard = () => {
    const [nombreUsuario, setNombreUsuario] = useState("Administrador");

    useEffect(() => {
        const datosUsuario = localStorage.getItem('user');
        if (datosUsuario) {
            const usuario = JSON.parse(datosUsuario);
            setNombreUsuario(usuario.full_name || "Administrador");
        }
        
        document.body.className = "class_body";
        return () => { document.body.className = ""; };
    }, []);

    return (
        <Container as="main" fluid className="px-4">
            <Row as="section" className="my-4">
                <Col className="col-12 text-center">
                    <h4 className="class_h4" id="mensajeBienvenida"> ¡Bienvenido, {nombreUsuario}! </h4>
                </Col>
            </Row>

            <Row as="section">
                
            <Col xs={12} md={4} xxl={4} className="mb-4">
                <Card as="article" className="class_card1 h-100 shadow-sm">
                    <Card.Header className="class_card_header text-center">
                        <h5 className="class_h5 mb-0"> Alertas y Aprobaciones </h5>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column p-0 pt-3">
                        <div className="table-responsive px-3" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                            <Table bordered responsive className="text-center align-middle mb-0">
                                <thead className="class_table_header" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th className="w-25">Prioridad</th>
                                        <th className="w-50">Detalle</th>
                                        <th className="w-25">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="class_tbody">
                                    <tr>
                                        <td><span className="text-danger fw-bold">Alta</span> <br /> Pago Fallido</td>
                                        <td>Xiao Chiye <br /> Plan VIP</td>
                                        <td className="px-2"> 
                                            <Button className="class_button1 w-100 text-nowrap" variant="light">Revisar</Button> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span className="text-warning fw-bold">Media</span> <br /> Registro</td>
                                        <td>Mei Hanxue <br /> Certificado</td>
                                        <td className="px-2"> 
                                            <Button className="class_button1 w-100 text-nowrap" variant="light">Validar</Button> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span className="text-warning fw-bold">Media</span> <br /> Soporte</td>
                                        <td>Yao Wenyu <br /> Error Reserva</td>
                                        <td className="px-2"> 
                                            <Button className="class_button1 w-100 text-nowrap" variant="light">Revisar</Button> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span className="text-info fw-bold">Baja</span> <br /> Registro</td>
                                        <td>Xie Lian <br /> Solicitud</td>
                                        <td className="px-2"> 
                                            <Button className="class_button1 w-100 text-nowrap" variant="light">Validar</Button> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span className="text-info fw-bold">Baja</span> <br /> Inventario</td>
                                        <td>Salón Boxeo <br /> Guantes</td>
                                        <td className="px-2"> 
                                            <Button className="class_button1 w-100 text-nowrap" variant="light">Revisar</Button> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span className="text-info fw-bold">Baja</span> <br /> Inventario</td>
                                        <td>Salón Yoga <br /> Mats</td>
                                        <td className="px-2"> 
                                            <Button className="class_button1 w-100 text-nowrap" variant="light">Revisar</Button> 
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>


                    </Card.Body>
                </Card>
            </Col>

                <Col xs={12} md={4} xxl={4} className="mb-4">
                    <Card as="article" className="class_card1 h-100 shadow-sm">
                        <Card.Header className="class_card_header text-center">
                            <h5 className="class_h5 mb-0"> Estadísticas Mensuales </h5>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="class_list1 bg-transparent border-0 pb-1 pt-0"> Asistencia a Clases: </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 pt-0 pb-3">
                                    <ProgressBar variant="primary" now={70} label="70%" style={{ height: '18px' }} />
                                </ListGroup.Item>

                                <ListGroup.Item className="class_list1 bg-transparent border-0 pb-1 pt-0"> Satisfacción del Usuario: </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 pt-0 pb-3">
                                    <ProgressBar variant="success" now={85} label="85%" style={{ height: '18px' }} />
                                </ListGroup.Item>

                                <ListGroup.Item className="class_list1 bg-transparent border-0 pb-1 pt-0"> Retención de Usuarios: </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 pt-0 pb-3">
                                    <ProgressBar variant="warning" now={90} label="90%" style={{ height: '18px' }} />
                                </ListGroup.Item>

                                <ListGroup.Item className="class_list1 bg-transparent border-0 pb-1 pt-0"> Crecimiento Mensual: </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 pt-0 pb-3">
                                    <ProgressBar variant="danger" now={75} label="75%" style={{ height: '18px' }} />
                                </ListGroup.Item>

                                <ListGroup.Item className="class_list1 bg-transparent border-0 pb-1 pt-0"> Clase más Popular: </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 pt-0 pb-2">
                                    <ProgressBar variant="info" now={40} label="Tenis (40%)" style={{ height: '18px' }} />
                                </ListGroup.Item>
                            </ListGroup>
                            
                            <hr className="my-3" />
                            
                            <ListGroup variant="flush">
                                <ListGroup.Item className="class_list1 bg-transparent d-flex justify-content-between align-items-center py-1 border-0">
                                    <span>Miembros Actuales:</span> <span className="fw-bold text-dark">800</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="class_list1 bg-transparent d-flex justify-content-between align-items-center py-1 border-0">
                                    <span>Miembros Nuevos este Mes:</span> <span className="fw-bold text-success">+35</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="class_list1 bg-transparent d-flex justify-content-between align-items-center py-1 border-0">
                                    <span>Retirados este Mes:</span> <span className="fw-bold text-danger">-9</span>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} md={4} xxl={4} className="mb-4">
                    <Card as="article" className="class_card1 h-100 shadow-sm">
                        <Card.Header className="class_card_header text-center">
                            <h5 className="class_h5 mb-0"> Clases del Día </h5>
                        </Card.Header>
                        <Card.Body className="p-0 pt-3">
                            <div className="table-responsive px-3" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                                <Table bordered responsive className="text-center align-middle mb-0">
                                    <thead className="class_table_header" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th>Clase</th>
                                            <th>Hora</th>
                                            <th>Instructor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="class_tbody">
                                        <tr><td>Tenis</td><td>10:00 AM</td><td>Mei Hanxue</td></tr>
                                        <tr><td>Yoga</td><td>12:00 PM</td><td>Chi Muyao</td></tr>
                                        <tr><td>Boxeo</td><td>12:00 PM</td><td>Shen Lanzhou</td></tr>
                                        <tr><td>Basketball</td><td>02:00 PM</td><td>Qiao Tanya</td></tr>
                                        <tr><td>Tenis</td><td>03:00 PM</td><td>Mei Hanxue</td></tr>
                                        <tr><td>Natación</td><td>04:00 PM</td><td>Li Yu</td></tr>
                                        <tr><td>Pilates</td><td>04:00 PM</td><td>Xie Lian</td></tr>
                                        <tr><td>Fútbol</td><td>06:00 PM</td><td>Wen Ren E</td></tr>
                                        <tr><td>Tenis</td><td>06:00 PM</td><td>Mei Hanxue</td></tr>
                                        <tr><td>Natacion</td><td>07:00 PM</td><td>Li Yu</td></tr>
                                        <tr><td>Tenis</td><td>08:00 PM</td><td>Qi Hualian</td></tr>
                                        <tr><td>Esgrima</td><td>09:00PM</td><td>Fang Linyuan</td></tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
};

export default AdminDashboard;