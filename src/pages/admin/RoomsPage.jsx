import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import RoomFormModal from '../../components/admin/RoomFormModal';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css';

const RoomsPage = () => {
    const [salas, setSalas] = useState([]);
    const [salasFiltradas, setSalasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [salaSeleccionada, setSalaSeleccionada] = useState(null);

    const cargarSalas = async () => {
        try {
            setLoading(true);
            const data = await getRooms();
            const lista = data.data || data;
            setSalas(lista);
            setSalasFiltradas(lista);
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la lista de salas: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSalas();
        document.body.className = "class_body";
        return () => { document.body.className = ""; };
    }, []);

    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);
        const filtradas = salas.filter(s =>
            s.name.toLowerCase().includes(termino)
        );
        setSalasFiltradas(filtradas);
    };

    const abrirModalCrear = () => {
        setSalaSeleccionada(null);
        setShowModal(true);
    };

    const abrirModalEditar = (sala) => {
        setSalaSeleccionada(sala);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setSalaSeleccionada(null);
    };

    const handleGuardar = async (formData) => {
        try {
            if (salaSeleccionada) {
                await updateRoom(salaSeleccionada.id, formData);
                Swal.fire("¡Actualizado!", "La sala se actualizó con éxito.", "success");
            } else {
                await createRoom(formData);
                Swal.fire("¡Creado!", "La nueva sala fue registrada.", "success");
            }
            cerrarModal();
            cargarSalas();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleEliminar = async (id, nombre) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar sala?',
            text: `Estás a punto de eliminar "${nombre}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await deleteRoom(id);
                Swal.fire("¡Eliminado!", "La sala ha sido eliminada.", "success");
                cargarSalas();
            } catch (error) {
                Swal.fire("Error al eliminar", error.message, "error");
            }
        }
    };

    const handleToggleStatus = async (sala) => {
        const nuevoEstado = !sala.status;
        try {
            const listaActualizada = salas.map(s =>
                s.id === sala.id ? { ...s, status: nuevoEstado } : s
            );
            setSalas(listaActualizada);
            setSalasFiltradas(listaActualizada.filter(s =>
                s.name.toLowerCase().includes(busqueda)
            ));
            await updateRoom(sala.id, { ...sala, status: nuevoEstado });
        } catch (error) {
            cargarSalas();
            Swal.fire("Error", "No se pudo cambiar el estado", "error");
        }
    };

    return (
        <Container as="main" className="my-4">
            <Row className="mb-4 align-items-center">
                <Col md={7}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white">
                            <i className="fas fa-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar sala por nombre..."
                            value={busqueda}
                            onChange={handleBuscar}
                        />
                    </InputGroup>
                </Col>
                <Col md={5} className="text-end mt-3 mt-md-0 d-flex justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={cargarSalas}>
                        <i className="fas fa-sync me-2"></i> Refrescar
                    </Button>
                    <Button variant="success" onClick={abrirModalCrear}>
                        <i className="fas fa-plus me-2"></i> Nueva Sala
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12}>
                    <Card className="class_card1 w-100" style={{ maxWidth: '100%' }}>
                        <Card.Header className="class_card_header">
                            <h5 className="class_h5 mb-0">
                                <i className="fas fa-door-open me-2"></i> Listado de Salas
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">Cargando salas...</p>
                                </div>
                            ) : (
                                <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <Table hover className="align-middle text-center mb-0">
                                        <thead className="class_table_head" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th>Capacidad</th>
                                                <th>Ubicación</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="class_tbody">
                                            {salasFiltradas.length > 0 ? (
                                                salasFiltradas.map((sala) => (
                                                    <tr key={sala.id}>
                                                        <td className="fw-bold">{sala.name}</td>
                                                        <td>{sala.description}</td>
                                                        <td>{sala.capacity} personas</td>
                                                        <td>{sala.location || "—"}</td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <Form.Check
                                                                    type="switch"
                                                                    id={`switch-${sala.id}`}
                                                                    label={sala.status ? "Activa" : "Inactiva"}
                                                                    checked={sala.status}
                                                                    onChange={() => handleToggleStatus(sala)}
                                                                    className={sala.status ? "text-success fw-bold m-0" : "text-secondary m-0"}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <Button variant="warning" size="sm" onClick={() => abrirModalEditar(sala)}>
                                                                    <i className="fas fa-edit"></i>
                                                                </Button>
                                                                <Button variant="danger" size="sm" onClick={() => handleEliminar(sala.id, sala.name)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        No se encontraron salas.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <RoomFormModal
                show={showModal}
                handleClose={cerrarModal}
                handleSave={handleGuardar}
                selectedRoom={salaSeleccionada}
            />
        </Container>
    );
};

export default RoomsPage;