import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/Login.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import logoEmpresa from '../assets/imagenes/logo_empresa_letra_v1.png'; 
import AuthServices from '../services/AuthServices'; 

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (correo === "" || clave === "") {
            setMensajeError("Por favor, completa todos los campos");
            return;
        }

        try {
            const response = await AuthServices.login(correo, clave);
            const reply = response.data;

            if (response.ok) {
                const token = reply.token || (reply.data && reply.data.token);
                
                if (token) {
                    localStorage.setItem("token", token);
                }

                if (reply.data && reply.data.user) {
                    localStorage.setItem("user", JSON.stringify(reply.data.user));
                    const rol = reply.data.user.role.toLowerCase().trim();

                    
                    if (rol === "admin") {
                        navigate("/admin/dashboard");
                    } else if (rol === "coach") {
                        navigate("/coach/dashboard");
                    } else {
                        navigate("/user/dashboard");
                    }
                } 
            } else {
                setMensajeError(reply.mensaje || "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            setMensajeError("Error de conexión con el servidor");
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-lightsteelblue">
            <div className="card shadow-lg p-4 custom-card" style={{ width: '350px', borderRadius: '20px' }}>
                
                <div className="text-center mb-4">
                    <img 
                        src= {logoEmpresa} 
                        alt="Logo de la empresa" 
                        className="img-fluid mb-3" 
                        style={{ width: '210px' }} 
                    />
                    <h2 className="custom-title h5">¡Bienvenido al Sportsclub!</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label custom-label">Email:</label>
                        <input 
                            type="email" 
                            className="form-control"
                            id="email" 
                            placeholder="Ingresa tu correo" 
                            maxLength="40"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)} 
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="contrasena" className="form-label custom-label">Contraseña:</label>
                        <input 
                            type="password" 
                            className="form-control"
                            id="contrasena" 
                            placeholder="Ingresa tu contraseña" 
                            maxLength="20"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)} 
                        />
                    </div>

                    <div className="d-grid mb-3 mt-4">
                        <button type="submit" className="btn custom-btn">
                            Ingresar
                        </button>
                    </div>

                    {mensajeError && (
                        <div className="text-danger text-center small mb-3 fw-bold">
                            {mensajeError}
                        </div>
                    )}

                    <hr />

                    <div className="text-center mt-3 d-flex flex-column gap-2">
                        <Link to="/recover" className="custom-link text-decoration-none">
                            ¿Olvidaste tu contraseña?
                        </Link>
                        <Link to="/register" className="custom-link text-decoration-none">
                            Regístrate
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;