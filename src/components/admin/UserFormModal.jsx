import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const initialForm = {
    full_name: "",
    email: "",
    role: "",
    password: "",
    confirm: ""
};

const UserFormModal = ({ show, handleClose, handleSave, selectedUser }) => {
    const [formData, setFormData] = useState(initialForm);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                full_name: selectedUser.full_name || "",
                email: selectedUser.email || "",
                role: selectedUser.role || "",
                password: "",
                confirm: ""
            });
            setErrores({});
        } else {
            setFormData(initialForm);
            setErrores({});
        }
    }, [selectedUser, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errores[name]) {
            setErrores({ ...errores, [name]: null });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        let nuevosErrores = {};
        let esValido = true;

        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_]).{8,}$/;

        if (formData.full_name.trim().length < 3) {
            nuevosErrores.full_name = "El nombre debe tener al menos 3 caracteres";
            esValido = false;
        } else if (!nombreRegex.test(formData.full_name)) {
            nuevosErrores.full_name = "El nombre solo puede contener letras";
            esValido = false;
        }

        if (!emailRegex.test(formData.email)) {
            nuevosErrores.email = "Ingrese un correo electrónico válido";
            esValido = false;
        }

        if (!formData.role) {
            nuevosErrores.role = "Debe seleccionar un rol";
            esValido = false;
        }

        if (!selectedUser) {
            if (!passRegex.test(formData.password)) {
                nuevosErrores.password = "Mínimo 8 caracteres, incluya Mayúscula, número y símbolo (!@#*)";
                esValido = false;
            }
            if (formData.password !== formData.confirm) {
                nuevosErrores.confirm = "Las contraseñas no coinciden";
                esValido = false;
            }
        }

        if (!esValido) {
            setErrores(nuevosErrores);
            return;
        }

        handleSave(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="class_card_header">
                <Modal.Title className="class_h5">
                    {selectedUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
                </Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                            type="text"
                            name="full_name"
                            maxLength="30"
                            placeholder="Ej: Xiao Chiye"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={errores.full_name ? 'class_input_error' : ''}
                        />
                        {errores.full_name && <span className="text-danger small d-block mt-1">{errores.full_name}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            maxLength="30"
                            placeholder="usuario@correo.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errores.email ? 'class_input_error' : ''}
                        />
                        {errores.email && <span className="text-danger small d-block mt-1">{errores.email}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange}
                            className={errores.role ? 'class_input_error' : ''}
                        >
                            <option value="" disabled>Seleccionar rol...</option>
                            <option value="admin">Administrador</option>
                            <option value="coach">Entrenador</option>
                            <option value="user">Usuario Estándar</option>
                        </Form.Select>
                        {errores.role && <span className="text-danger small d-block mt-1">{errores.role}</span>}
                    </Form.Group>

                    {!selectedUser && (
                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    maxLength="20"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={errores.password ? 'class_input_error' : ''}
                                />
                                {errores.password && <span className="text-danger small d-block mt-1">{errores.password}</span>}
                            </Form.Group>

                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Confirmar Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirm"
                                    maxLength="20"
                                    value={formData.confirm}
                                    onChange={handleChange}
                                    className={errores.confirm ? 'class_input_error' : ''}
                                />
                                {errores.confirm && <span className="text-danger small d-block mt-1">{errores.confirm}</span>}
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="class_button1 border-0">
                        {selectedUser ? "Guardar Cambios" : "Registrar Usuario"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UserFormModal;