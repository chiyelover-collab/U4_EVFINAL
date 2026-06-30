import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const initialForm = {
    name: "",
    objective: "",
    duration: "",
    created_at: "",
    status: true 
};

const SportsFormModal = ({ show, handleClose, handleSave, selectedSport }) => {
    const [formData, setFormData] = useState(initialForm);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (selectedSport) {
            
            let fechaParaMostrar = selectedSport.created_at || "";
            if (fechaParaMostrar.includes('-') && fechaParaMostrar.split('-')[0].length === 4) {
                const [anio, mes, dia] = fechaParaMostrar.split('-');
                fechaParaMostrar = `${dia.substring(0,2)}-${mes}-${anio}`;
            }

            setFormData({
                name: selectedSport.name || "",
                objective: selectedSport.objective || "",
                duration: selectedSport.duration || "",
                created_at: fechaParaMostrar,
                status: selectedSport.status !== undefined ? selectedSport.status : true
            });
            setErrores({});
        } else {
            setFormData(initialForm);
            setErrores({});
        }
    }, [selectedSport, show]);

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

        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

        if (!formData.name.trim()) {
            nuevosErrores.name = "El nombre es obligatorio";
            esValido = false;
        }

        if (!formData.objective.trim()) {
            nuevosErrores.objective = "El objetivo es obligatorio";
            esValido = false;
        }

        if (!formData.duration || formData.duration <= 0) {
            nuevosErrores.duration = "La duración es obligatoria y debe ser mayor a 0";
            esValido = false;
        }

        if (!formData.created_at.trim()) {
            nuevosErrores.created_at = "La fecha de creación es obligatoria";
            esValido = false;
        } else if (!dateRegex.test(formData.created_at)) {
            nuevosErrores.created_at = "El formato debe ser DD-MM-YYYY (ej: 15-07-2026)";
            esValido = false;
        }

        if (!esValido) {
            setErrores(nuevosErrores);
            return; 
        }


        const [dia, mes, anio] = formData.created_at.split('-');
        const fechaParaBackend = `${anio}-${mes}-${dia}`;


        handleSave({
            ...formData,
            created_at: fechaParaBackend
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="class_card_header">
                <Modal.Title className="class_h5">
                    {selectedSport ? "Editar Deporte" : "Crear Nuevo Deporte"}
                </Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Deporte</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Ej: Natación"
                            value={formData.name}
                            onChange={handleChange}
                            className={errores.name ? 'class_input_error' : ''}
                        />
                        {errores.name && <span className="text-danger small d-block mt-1">{errores.name}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Objetivo</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="objective"
                            placeholder="Describe el objetivo del deporte..."
                            value={formData.objective}
                            onChange={handleChange}
                            className={errores.objective ? 'class_input_error' : ''}
                        />
                        {errores.objective && <span className="text-danger small d-block mt-1">{errores.objective}</span>}
                    </Form.Group>

                    <div className="row">
                        <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Duración (minutos)</Form.Label>
                            <Form.Control
                                type="number"
                                name="duration"
                                placeholder="Ej: 60"
                                value={formData.duration}
                                onChange={handleChange}
                                className={errores.duration ? 'class_input_error' : ''}
                            />
                            {errores.duration && <span className="text-danger small d-block mt-1">{errores.duration}</span>}
                        </Form.Group>

                        <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Fecha de Creación</Form.Label>
                            <Form.Control
                                type="text"
                                name="created_at"
                                placeholder="DD-MM-YYYY"
                                value={formData.created_at}
                                onChange={handleChange}
                                className={errores.created_at ? 'class_input_error' : ''}
                            />
                            {errores.created_at && <span className="text-danger small d-block mt-1">{errores.created_at}</span>}
                        </Form.Group>
                    </div>
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="class_button1 border-0">
                        {selectedSport ? "Guardar Cambios" : "Registrar Deporte"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SportsFormModal;