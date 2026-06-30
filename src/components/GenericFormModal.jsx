// src/components/admin/GenericFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const GenericFormModal = ({ show, handleClose, handleSave, title, fields, initialData, selectedItem }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(selectedItem ? { ...selectedItem } : initialData);
    }, [selectedItem, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="class_card_header">
                <Modal.Title className="class_h5">{title}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
                <Modal.Body>
                    {fields.map((field) => (
                        <Form.Group key={field.name} className="mb-3">
                            <Form.Label>{field.label}</Form.Label>
                            {field.type === 'select' ? (
                                <Form.Select name={field.name} value={formData[field.name]} onChange={handleChange}>
                                    <option value="">Seleccione...</option>
                                    {field.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <Form.Control 
                                    type={field.type} 
                                    name={field.name} 
                                    value={formData[field.name]} 
                                    onChange={handleChange} 
                                    placeholder={field.placeholder}
                                />
                            )}
                        </Form.Group>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" className="class_button1">Guardar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default GenericFormModal;