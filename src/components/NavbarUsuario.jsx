// src/components/Navbar.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/imagenes/logo_empresa_letra_v1.png'; // Ajusta la ruta a tu carpeta de imágenes

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <header className="user_header container-fluid">
                <div className="class_div_logo row align-items-center">
                    <div className="col-md-4">
                        <img src={logo} alt="logo" className="class_logo class_img_logo" />
                    </div>
                    <div className="col-md-4 text-center">
                        <h1 className="class_h1"> Dashboard Usuario </h1>
                    </div>
                </div>
            </header>

            <nav className="navbar navbar-expand-lg user_navbar navbar-dark">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDashboardUser">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarDashboardUser">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link class_a1" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link class_a1" href="#">Clases</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link class_a1" href="#">Reservas</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link class_a1" href="#">Asistencia Mensual</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link class_a1" href="#">Horario</a>
                            </li>
                        </ul>
                        <div className="d-flex me-3 gap-2">
                            <button onClick={() => navigate("/edit-profile")} className="btn btn-primary" type="button">
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

export default Navbar;