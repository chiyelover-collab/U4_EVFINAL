import React from 'react';
import { Link } from 'react-router-dom';
import logoEmpresa from '../assets/imagenes/logo_empresa_letra_v1.png'; 
import '../assets/css/Login.css'; 

const ExitoRegister = () => {
    return (
        <div className="d-flex justify-content-center align-items-center bg-lightsteelblue" style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="card shadow-lg p-4 custom-card text-center" style={{ width: '350px', borderRadius: '20px' }}>
                <div className="mb-4">
                    <img 
                        src={logoEmpresa} 
                        alt="Logo de la empresa" 
                        className="img-fluid mb-3" 
                        style={{ width: '210px' }} 
                    />
                </div>

                <h2 className="custom-title h4 mb-3" style={{ color: 'indigo' }}>¡Registro Exitoso!</h2>
                <p className="text-muted mb-4">Vuelve atrás para iniciar sesión con tu nueva cuenta.</p>
                
                <Link to="/login" className="btn custom-btn w-100">
                    Volver a Login
                </Link>

            </div>
        </div>
    );
};

export default ExitoRegister;