// src/components/admin/SportRoomFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const initialForm = {
    sport_id: "",
    room_id: "",
    coach_id: "",
    observation: "",
    status: true
};

const SportRoomFormModal = ({ 
    show, 
    handleClose, 
    handleSave, 
    selectedAssignment, 
    sportsList, 
    roomsList, 
    coachesList 
}) => {
    const [formData, setFormData] = useState(initialForm);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (selectedAssignment) {
            setFormData({
                sport_id: selectedAssignment.sport_id || "",
                room_id: selectedAssignment.room_id || "",
                coach_id: selectedAssignment.coach_id || "",
                observation: selectedAssignment.observation || "",
                status: selectedAssignment.status !== undefined ? selectedAssignment.status : true
            });
        } else {
            setFormData(initialForm);
        }
        setErrores({});
    }, [selectedAssignment, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errores[name]) setErrores({ ...errores, [name]: null });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        let nuevosErrores = {};
        let esValido = true;

        if (!formData.sport_id) { nuevosErrores.sport_id = "Debe seleccionar un deporte"; esValido = false; }
        if (!formData.room_id) { nuevosErrores.room_id = "Debe seleccionar una sala"; esValido = false; }
        if (!formData.coach_id) { nuevosErrores.coach_id = "Debe seleccionar un entrenador"; esValido = false; }

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
                    {selectedAssignment ? "Editar Asignación" : "Crear Nueva Asignación"}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Deporte</Form.Label>
                        <Form.Select 
                            name="sport_id" 
                            value={formData.sport_id} 
                            onChange={handleChange}
                            className={errores.sport_id ? 'class_input_error' : ''}
                        >
                            <option value="" disabled>Seleccione un deporte...</option>
                            {sportsList.map(sport => (
                                <option key={sport.id} value={sport.id}>{sport.name}</option>
                            ))}
                        </Form.Select>
                        {errores.sport_id && <span className="text-danger small">{errores.sport_id}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sala</Form.Label>
                        <Form.Select 
                            name="room_id" 
                            value={formData.room_id} 
                            onChange={handleChange}
                            className={errores.room_id ? 'class_input_error' : ''}
                        >
                            <option value="" disabled>Seleccione una sala...</option>
                            {roomsList.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </Form.Select>
                        {errores.room_id && <span className="text-danger small">{errores.room_id}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Entrenador (Coach)</Form.Label>
                        <Form.Select 
                            name="coach_id" 
                            value={formData.coach_id} 
                            onChange={handleChange}
                            className={errores.coach_id ? 'class_input_error' : ''}
                        >
                            <option value="" disabled>Seleccione un entrenador...</option>
                            {coachesList.map(coach => (
                                <option key={coach.id} value={coach.id}>{coach.full_name}</option>
                            ))}
                        </Form.Select>
                        {errores.coach_id && <span className="text-danger small">{errores.coach_id}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="observation"
                            placeholder="Detalles adicionales..."
                            value={formData.observation}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" className="class_button1 border-0">
                        {selectedAssignment ? "Guardar Cambios" : "Registrar Asignación"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SportRoomFormModal;