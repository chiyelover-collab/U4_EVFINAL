import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoEmpresa from '../assets/imagenes/logo_empresa_letra_v1.png'; 
import '../assets/css/Login.css'; 
import AuthServices from '../services/AuthServices';

const Register = () => {
    const navigate = useNavigate();

    // 1. Aquí guardaremos todo lo que el usuario escriba
    const [formData, setFormData] = useState({
        email: '',
        contrasena: '',
        contrasena2: '',
        nombre: '',
        edad: '',
        nivel: '',
        deporte: '',
        objetivo: ''
    });

    // 2. Aquí guardaremos los mensajes de error de cada campo
    const [errores, setErrores] = useState({});

    // 3. Esta función se activará cada vez que el usuario escriba algo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 1. Expresiones regulares extraídas de tu código original
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_]).{8,}$/;
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // 2. Función para validar todos los campos
    const validarFormulario = () => {
        let erroresTemporales = {};
        let esValido = true;

        if (!formData.email || !emailRegex.test(formData.email)) {
            erroresTemporales.email = "Email inválido o vacío";
            esValido = false;
        }

        if (!formData.nombre || formData.nombre.length < 3) {
            erroresTemporales.nombre = "Nombre muy corto";
            esValido = false;
        } else if (!nombreRegex.test(formData.nombre)) {
            erroresTemporales.nombre = "El nombre solo puede contener letras";
            esValido = false;
        }

        if (!passRegex.test(formData.contrasena)) {
            erroresTemporales.contrasena = "Use Mayúscula, número y símbolo (mín. 8)";
            esValido = false;
        }

        if (formData.contrasena !== formData.contrasena2) {
            erroresTemporales.contrasena2 = "Las contraseñas no coinciden";
            esValido = false;
        }

        // --- ESTA ES LA VALIDACIÓN DE LA FECHA ---
        if (!formData.edad || formData.edad === '') {
            erroresTemporales.edad = "Campo obligatorio";
            esValido = false;
        }

        if (!formData.deporte) {
            erroresTemporales.deporte = "Campo obligatorio";
            esValido = false;
        }

        if (!formData.objetivo) {
            erroresTemporales.objetivo = "Campo obligatorio";
            esValido = false;
        }

        // Validación de los botones de opción (nivel)
        if (!formData.nivel) {
            erroresTemporales.nivel = "Selecciona una opción";
            esValido = false;
        }
        
        // Guardamos el objeto de errores en el estado de React
        setErrores(erroresTemporales);
        return esValido;
    };

    // 3. Función para manejar el clic en "Registrarse"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evitamos que la página se recargue

        // Si la validación pasa, procedemos a llamar a tu API
        if (validarFormulario()) {
            try {
                const userData = {
                    email: formData.email,
                    password: formData.contrasena,
                    full_name: formData.nombre,
                    birth_date: formData.edad,
                    metadata: {
                        nivel: formData.nivel || null,
                        deporte: formData.deporte,
                        objetivo: formData.objetivo
                        }
                    };

                    const response = await AuthServices.register(userData);

                if (response.ok) {
                    navigate("/exito-register");
                } else {
                    const reply = await response.json();
                    setErrores({ global: reply.mensaje || "Error en el servidor" });
                }
            } catch (error) {
                console.error("Error de conexión:", error);
                setErrores({ global: "Error de conexión con el servidor" });
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-lightsteelblue" style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="card shadow-lg p-4 custom-card" style={{ width: '400px', borderRadius: '20px' }}>
                <div className="text-center mb-4">
                    <img 
                        src={logoEmpresa} 
                        alt="Logo de la empresa" 
                        className="img-fluid mb-3" 
                        style={{ width: '210px' }} 
                    />
                    <h2 className="custom-title h4">Regístrate</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Mensaje de error general del servidor (ahora en texto rojo sutil) */}
                    {errores.global && (
                        <div className="class_men_error text-center fw-bold mb-3" style={{ height: 'auto' }}>
                            {errores.global}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label custom-label">Email:</label>
                        <input 
                            type="text" 
                            name="email"
                            className={`form-control ${errores.email ? 'class_input_error border-danger' : ''}`}
                            maxLength="40"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {/* Texto de error en rojo usando tu clase original */}
                        <span className="class_men_error" style={{ visibility: errores.email ? 'visible' : 'hidden' }}>
                            {errores.email || 'espacio'} 
                        </span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label custom-label">Contraseña:</label>
                        <input 
                            type="password" 
                            name="contrasena"
                            className={`form-control ${errores.contrasena ? 'class_input_error border-danger' : ''}`}
                            maxLength="20"
                            value={formData.contrasena}
                            onChange={handleChange}
                        />
                        <span className="class_men_error" style={{ visibility: errores.contrasena ? 'visible' : 'hidden' }}>
                            {errores.contrasena || 'espacio'}
                        </span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label custom-label">Repite Contraseña:</label>
                        <input 
                            type="password" 
                            name="contrasena2"
                            className={`form-control ${errores.contrasena2 ? 'class_input_error border-danger' : ''}`}
                            maxLength="20"
                            value={formData.contrasena2}
                            onChange={handleChange}
                        />
                        <span className="class_men_error" style={{ visibility: errores.contrasena2 ? 'visible' : 'hidden' }}>
                            {errores.contrasena2 || 'espacio'}
                        </span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label custom-label">Nombre:</label>
                        <input 
                            type="text" 
                            name="nombre"
                            className={`form-control ${errores.nombre ? 'class_input_error border-danger' : ''}`}
                            maxLength="30"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                        <span className="class_men_error" style={{ visibility: errores.nombre ? 'visible' : 'hidden' }}>
                            {errores.nombre || 'espacio'}
                        </span>
                    </div>
                    <div className="mb-3">
                        <label className="form-label custom-label">Fecha de nacimiento:</label>
                        <input 
                            type="date" 
                            name="edad"
                            className={`form-control ${errores.edad ? 'class_input_error border-danger' : ''}`}
                            value={formData.edad}
                            onChange={handleChange}
                        />
                        <span className="class_men_error" style={{ visibility: errores.edad ? 'visible' : 'hidden' }}>
                            {errores.edad || 'espacio'}
                        </span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label custom-label">¿Practicas deporte?:</label>
                        
                        {/* Si hay error, esta caja entera se pintará con el fondo rojizo y el borde rojo */}
                        <div className={`d-flex gap-3 mt-1 p-2 rounded ${errores.nivel ? 'class_input_error border-danger' : ''}`}>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="nivel" value="Si" id="radioSi" checked={formData.nivel === "Si"} onChange={handleChange} />
                                <label className="form-check-label text-secondary" htmlFor="radioSi">Sí</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="nivel" value="No" id="radioNo" checked={formData.nivel === "No"} onChange={handleChange} />
                                <label className="form-check-label text-secondary" htmlFor="radioNo">No</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="nivel" value="A_veces" id="radioAves" checked={formData.nivel === "A_veces"} onChange={handleChange} />
                                <label className="form-check-label text-secondary" htmlFor="radioAves">A veces</label>
                            </div>
                        </div>

                        {/* Tu clásico mensaje de error rojo en la parte inferior */}
                        <span className="class_men_error" style={{ visibility: errores.nivel ? 'visible' : 'hidden' }}>
                            {errores.nivel || 'espacio'}
                        </span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label custom-label">Si practicas un deporte, ¿cuál es?:</label>
                        <input 
                            type="text" 
                            name="deporte"
                            className={`form-control ${errores.deporte ? 'class_input_error border-danger' : ''}`}
                            maxLength="50"
                            value={formData.deporte}
                            onChange={handleChange}
                        />
                        <span className="class_men_error" style={{ visibility: errores.deporte ? 'visible' : 'hidden' }}>
                            {errores.deporte || 'espacio'}
                        </span>
                    </div>

                    <div className="mb-3">
                        <label className="form-label custom-label">Cuál es tu objetivo:</label>
                        <input 
                            type="text" 
                            name="objetivo"
                            className={`form-control ${errores.objetivo ? 'class_input_error border-danger' : ''}`}
                            maxLength="100"
                            value={formData.objetivo}
                            onChange={handleChange}
                        />
                        <span className="class_men_error" style={{ visibility: errores.objetivo ? 'visible' : 'hidden' }}>
                            {errores.objetivo || 'espacio'}
                        </span>
                    </div>

                    <div className="d-flex flex-column gap-3 mt-4 mx-auto" style={{ maxWidth: '250px' }}>
                        <button type="submit" className="btn custom-btn w-100">
                            Registrarse
                        </button>
                        <Link to="/login" className="btn btn-outline-secondary w-100">
                            Volver a Login
                        </Link>
                    </div>
                </form>
                
            </div>
        </div>
    );
};

export default Register;