import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Importamos el logo procesado por Vite
import logoEmpresa from '../../assets/imagenes/logo_empresa_letra_v1.png';

const NavbarAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();


    let tituloHeader = "Dashboard Administrador";
    let subtituloHeader = "Bienvenido al panel de control.";


    if (location.pathname.includes('/admin/gestion')) {
        tituloHeader = "Gestión de Usuarios";
        subtituloHeader = "Administra los usuarios en sistema.";
    }

        if (location.pathname.includes('/admin/deportes')) {
        tituloHeader = "Gestión de Deportes";
        subtituloHeader = "Administra los deportes en el sistema.";
    }


    const handleCerrarSesion = () => {
        localStorage.clear(); 
        navigate('/login');
    };

    return (
        <>
            {/* HEADER SUPERIOR MORADO */}
            <header className="class_header container-fluid">
                <div className="class_div_logo row align-items-center">
                    <div className="col-md-3 text-center text-md-start">
                        <img src={logoEmpresa} alt="logo" className="class_logo class_img_logo" />
                    </div>
                    <div className="col-md-6 text-center">
                        <h1 className="class_h1 mb-1"> {tituloHeader} </h1>
                        <h6 className="mb-2">{subtituloHeader}</h6>
                    </div>
                </div>
            </header>

            {/* NAVBAR COMPLETO RESTAURADO Y ADAPTADO A REACT */}
            <nav className="navbar navbar-expand-lg class_navbar">
                <div className="container-fluid">
                    <button className="navbar-toggler navbar-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navUsers">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navUsers">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link class_a1" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                {/* Se activa dinámicamente si la URL es la de gestión */}
                                <Link 
                                    className={`nav-link class_a1 ${location.pathname.includes('/admin/gestion') ? 'active fw-bold' : ''}`} 
                                    to="/admin/gestion"
                                >
                                    Usuarios
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link class_a1" to="/admin/deportes">Deportes</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link class_a1" to="/admin/salas">Salas</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link class_a1" to="#">Configuración</Link>
                            </li>
                        </ul>
                        
                        {/* Botones de Acción de la Derecha */}
                        <div className="d-flex align-items-center">
                            <Link to="/admin/dashboard">
                                <button className="btn me-2 btn-primary" type="button">Dashboard</button>
                            </Link>
                            <button 
                                className="btn me-2 btn-danger" 
                                type="button"
                                onClick={handleCerrarSesion}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavbarAdmin;