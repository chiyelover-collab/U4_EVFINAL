// src/components/Navbar_Coach.jsx
import React from 'react';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import logo from '../assets/imagenes/logo_empresa_letra_v1.png';

const Navbar_Coach = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    let tituloHeader = "Dashboard Coach";
    let subtituloHeader = "Todo lo que necesitas se encuentra aquí.";


    if (location.pathname.includes('/coach/perfil')) {
        tituloHeader = "Perfil de Entrenador";
        subtituloHeader = "Gestiona tu información personal y contraseña";
    }

        const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <header className="coach_header container-fluid py-2">
                <div className="class_div_logo row align-items-center">
                    <div className="col-4 text-start">
                        <img src={logo} alt="logo" className="class_logo class_img_logo" />
                    </div>
                    <div className="col-4 text-center">
                        <h1 className="class_h1 class_title m-0"> Dashboard Entrenador </h1>
                    </div>
                    <div className="col-4"></div> {/* Contrapeso */}
                </div>
            </header>

            <nav className="navbar navbar-expand-lg coach_navbar navbar-dark">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDashboardCoach">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarDashboardCoach">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link class_a1" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link class_a1" href="#">Clases</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link class_a1" href="#">Alumnos</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link class_a1" href="#">Horario</a>
                            </li>
                        </ul>
                        <div className="d-flex me-3 gap-2">
                            <button onClick={() => navigate("/coach/perfil")} className="btn btn-primary" type="button">
                                Editar Perfil
                            </button>
                            <button onClick={handleLogout} className="btn btn-danger" type="button">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar_Coach;