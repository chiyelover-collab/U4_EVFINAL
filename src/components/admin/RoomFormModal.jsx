import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const initialForm = {
    name: "",
    description: "",
    capacity: "",
    location: "",
    observation: "",
    status: true
};

const RoomFormModal = ({ show, handleClose, handleSave, selectedRoom }) => {
    const [formData, setFormData] = useState(initialForm);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (selectedRoom) {
            setFormData({
                name: selectedRoom.name || "",
                description: selectedRoom.description || "",
                capacity: selectedRoom.capacity || "",
                location: selectedRoom.location || "",
                observation: selectedRoom.observation || "",
                status: selectedRoom.status !== undefined ? selectedRoom.status : true
            });
        } else {
            setFormData(initialForm);
        }
        setErrores({});
    }, [selectedRoom, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errores[name]) setErrores({ ...errores, [name]: null });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        let nuevosErrores = {};
        let esValido = true;

        if (!formData.name.trim() || formData.name.trim().length < 3) {
            nuevosErrores.name = "El nombre debe tener al menos 3 caracteres";
            esValido = false;
        }

        if (!formData.description.trim() || formData.description.trim().length < 5) {
            nuevosErrores.description = "La descripción debe tener al menos 5 caracteres";
            esValido = false;
        }

        if (!formData.capacity || Number(formData.capacity) < 1) {
            nuevosErrores.capacity = "La capacidad debe ser mayor a 0";
            esValido = false;
        }

        if (!esValido) {
            setErrores(nuevosErrores);
            return;
        }

        handleSave({
            ...formData,
            capacity: Number(formData.capacity)
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="class_card_header">
                <Modal.Title className="class_h5">
                    {selectedRoom ? "Editar Sala" : "Crear Nueva Sala"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre de la Sala</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Ej: Cancha Fútbol 3"
                            value={formData.name}
                            onChange={handleChange}
                            className={errores.name ? 'class_input_error' : ''}
                        />
                        {errores.name && <span className="text-danger small d-block mt-1">{errores.name}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            placeholder="Describe la sala..."
                            value={formData.description}
                            onChange={handleChange}
                            className={errores.description ? 'class_input_error' : ''}
                        />
                        {errores.description && <span className="text-danger small d-block mt-1">{errores.description}</span>}
                    </Form.Group>

                    <div className="row">
                        <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Capacidad</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                placeholder="Ej: 20"
                                value={formData.capacity}
                                onChange={handleChange}
                                className={errores.capacity ? 'class_input_error' : ''}
                            />
                            {errores.capacity && <span className="text-danger small d-block mt-1">{errores.capacity}</span>}
                        </Form.Group>

                        <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                placeholder="Ej: Segundo piso"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Observación</Form.Label>
                        <Form.Control
                            type="text"
                            name="observation"
                            placeholder="Observaciones adicionales..."
                            value={formData.observation}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="class_button1 border-0">
                        {selectedRoom ? "Guardar Cambios" : "Registrar Sala"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default RoomFormModal;