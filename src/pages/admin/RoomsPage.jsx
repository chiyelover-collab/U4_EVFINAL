// src/pages/admin/RoomsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import RoomFormModal from '../../components/admin/RoomFormModal';
import ManagementTable from '../../components/admin/ManagementTable';
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

    const instrucciones = [
        { title: "Búsqueda", text: "Filtre instantáneamente por nombre de la sala usando la barra superior." },
        { title: "Gestión", text: <span>Use los botones de colores para <span className="text-warning fw-bold">Editar</span> o <span className="text-danger fw-bold">Eliminar</span> las salas.</span> },
        { title: "Estado", text: "Utilice el interruptor (Switch) para marcar una sala como Activa o Inactiva según su disponibilidad." },
        { title: "Sincronización", text: "Utilice el botón Refrescar para traer los últimos datos actualizados de las salas." }
    ];

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

            <ManagementTable 
                title="Listado de Salas"
                icon="fa-door-open"
                columns={["Nombre", "Descripción", "Capacidad", "Ubicación", "Estado", "Acciones"]}
                data={salasFiltradas}
                loading={loading}
                emptyMessage="No se encontraron salas."
                instructions={instrucciones}
                renderRow={(sala) => (
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
                )}
            />

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