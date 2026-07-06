import React from 'react';
import { Navbar, Nav, Container, Row, Col, Carousel } from 'react-bootstrap';

import '../assets/css/LandingStyle.css'; 
import logoEmpresa from '../assets/imagenes/logo_empresa_letra_v1.png';
import heroBg from '../assets/imagenes/GettyImages-949190756.jpg';
import imgFutbolLateral from '../assets/imagenes/491588.png';
import imgBasketLateral from '../assets/imagenes/13797439.png';
import carrusel1 from '../assets/imagenes/1.png';
import carrusel2 from '../assets/imagenes/2.png';
import carrusel3 from '../assets/imagenes/3.png';

const LandingPage = () => {
    return (
        <div className="class_bodyqjj">
            
            
            <Navbar expand="lg" className="bg-light bg-opacity-20">
                <Container>
                    <Navbar.Brand href="#">
                        <img src={logoEmpresa} alt="Sportclub Logo" width="100" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarText" />
                    <Navbar.Collapse id="navbarText">
                        <Nav className="ms-auto mb-2 mb-lg-0">
                            <Nav.Link href="/login" className="active">Login</Nav.Link>
                            <Nav.Link href="#">Cursos</Nav.Link>
                            <Nav.Link href="#">Precios</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>


            <div 
                className="hero-image class_sombra" 
                style={{ 
                    backgroundImage: `url(${heroBg})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'bottom', 
                    height: '100vh' 
                }}
            >
                <Container className="bg-opacity-0">
                    <Row>
                        <Col md={6} className="text-light" style={{ marginTop: '25vh' }}>
                            <h1 className="display-1">¡Bienvenido a Sportclub!</h1>
                            <p className="lead">Tu mejor versión comienza hoy</p>
                        </Col>
                    </Row>
                </Container>
            </div>


            <div className="container-sm class_sombra" style={{ backgroundColor: '#f2b705', padding: '50px 0', marginTop: '30px' }}>
                <Row>
                    <Col md={12}>
                        <h2 className="display-4 text-center">Sobre nosotros</h2>
                        <p className="lead text-center">
                            En SportClub creemos que el deporte no solo transforma el cuerpo, sino también la mente y el estilo de vida. Nuestro objetivo es acompañar a cada persona en su proceso, sin importar su nivel o experiencia.
                        </p>
                    </Col>
                </Row>
            </div>

            <Container style={{ marginTop: '30px' }}>
                <Row className="align-items-center g-3">
                    <Col xs={2}>
                        <img src={imgFutbolLateral} className="img-fluid rounded" alt="futbol" />
                    </Col>
                    
                    <Col xs={8}>
                        <Carousel className="class_sombra" indicators={true}>
                            <Carousel.Item>
                                <img src={carrusel1} className="d-block w-100" alt="futbol" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={carrusel2} className="d-block w-100" alt="basquet" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={carrusel3} className="d-block w-100" alt="tenis" />
                            </Carousel.Item>
                        </Carousel>
                    </Col>

                    <Col xs={2}>
                        <img src={imgBasketLateral} className="img-fluid rounded" alt="basket" />
                    </Col>
                </Row>
            </Container>        


            <div className="container-sm class_sombra class_contstyle1">
                <Row>
                    <Col md={12}>
                        <h2 className="display-4 text-center">Nuestra visión</h2>
                        <p className="lead text-center">
                            Queremos ser el club deportivo referente en la formación integral de personas, combinando tecnología, entrenamiento y comunidad para mejorar la calidad de vida de nuestros usuarios.
                        </p>
                    </Col>
                </Row>
            </div>

            <footer>
                <h5 className="text-center" style={{ marginTop: '30px' }}>
                    © 2026 Sportclub. Todos los derechos reservados.
                </h5>
            </footer>

        </div>
    );
};

export default LandingPage;