import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import SportsFormModal from '../../components/admin/SportsFormModal'; 
import { getSports, updateSports, createSports, deleteSports } from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css'; 

const SportManagment = () => {
    const [deportes, setDeportes] = useState([]);
    const [deportesFiltrados, setDeportesFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [deporteSeleccionado, setDeporteSeleccionado] = useState(null);


    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        const partes = fecha.split('-'); 
        if (partes.length >= 3) {

            if (partes[0].length === 4) {
                const dia = parseInt(partes[2].substring(0, 2), 10);
                const mes = meses[parseInt(partes[1], 10) - 1];
                const anio = partes[0];
                return `${dia} de ${mes} de ${anio}`;
            } else {
                const dia = parseInt(partes[0], 10);
                const mes = meses[parseInt(partes[1], 10) - 1];
                const anio = partes[2].substring(0, 4);
                return `${dia} de ${mes} de ${anio}`;
            }
        }
        return fecha;
    };

    const cargarDeportes = async () => {
        try {
            setLoading(true);
            const data = await getSports();
            const lista = data.data || data; 
            setDeportes(lista);
            setDeportesFiltrados(lista);
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la lista de deportes: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDeportes();
        document.body.className = "class_body";
        return () => { document.body.className = ""; };
    }, []);

    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);
        
        const filtrados = deportes.filter(d => 
            d.name.toLowerCase().includes(termino)
        );
        setDeportesFiltrados(filtrados);
    };

    const abrirModalCrear = () => {
        setDeporteSeleccionado(null);
        setShowModal(true);
    };

    const abrirModalEditar = (deporte) => {
        setDeporteSeleccionado(deporte);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setDeporteSeleccionado(null);
    };

    const handleGuardar = async (formData) => {
        try {
            if (deporteSeleccionado) {
                await updateSports(deporteSeleccionado.id, formData);
                Swal.fire("¡Actualizado!", "El deporte se actualizó con éxito.", "success");
            } else {
                await createSports(formData);
                Swal.fire("¡Creado!", "El nuevo deporte fue registrado.", "success");
            }
            cerrarModal();
            cargarDeportes();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleEliminar = async (id, nombre) => {
        const confirmacion = await Swal.fire({
            title: '¿Está seguro de eliminar este deporte?',
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
                await deleteSports(id);
                Swal.fire("¡Eliminado!", "El deporte ha sido eliminado.", "success");
                cargarDeportes();
            } catch (error) {
                Swal.fire("Error al eliminar", error.message, "error");
            }
        }
    };

    const handleToggleStatus = async (deporte) => {
        const nuevoEstado = !deporte.status;
        try {

            const listActualizada = deportes.map(d => d.id === deporte.id ? { ...d, status: nuevoEstado } : d);
            setDeportes(listActualizada);
            setDeportesFiltrados(listActualizada.filter(d => d.name.toLowerCase().includes(busqueda)));
            
            await updateSports(deporte.id, { ...deporte, status: nuevoEstado });
        } catch (error) {
            cargarDeportes(); 
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
                            placeholder="Buscar deporte por nombre..." 
                            value={busqueda}
                            onChange={handleBuscar}
                        />
                    </InputGroup>
                </Col>
                <Col md={5} className="text-end mt-3 mt-md-0 d-flex justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={cargarDeportes}>
                        <i className="fas fa-sync me-2"></i> Refrescar
                    </Button>
                    <Button variant="success" onClick={abrirModalCrear}>
                        <i className="fas fa-plus me-2"></i> Nuevo Deporte
                    </Button>
                </Col>
            </Row>


            <Row className="mb-4">
                <Col xs={12}>
                    <Card as="article" className="class_card1 w-100" style={{ maxWidth: '100%' }}>
                        <Card.Header className="class_card_header">
                            <h5 className="class_h5 mb-0">
                                <i className="fas fa-list me-2"></i> Listado de Deportes
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">Cargando deportes...</p>
                                </div>
                            ) : (
                                <div 
                                    className="table-responsive class_table-responsive m-0"
                                    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
                                >
                                    <Table hover className="align-middle text-center mb-0">
                                        <thead className="class_table_head" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Objetivo</th>
                                                <th>Duración</th>
                                                <th>Creación</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="class_tbody">
                                            {deportesFiltrados.length > 0 ? (
                                                deportesFiltrados.map((deporte) => (
                                                    <tr key={deporte.id}>
                                                        <td className="fw-bold">{deporte.name}</td>
                                                        <td>{deporte.objective}</td>
                                                        <td>{deporte.duration} min</td>
                                                        <td>{formatearFecha(deporte.created_at)}</td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <Form.Check 
                                                                    type="switch"
                                                                    id={`switch-${deporte.id}`}
                                                                    label={deporte.status ? "Activo" : "Inactivo"}
                                                                    checked={deporte.status}
                                                                    onChange={() => handleToggleStatus(deporte)}
                                                                    className={deporte.status ? "text-success fw-bold m-0" : "text-secondary m-0"}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {/* Contenedor Flexbox para alinear horizontalmente */}
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <Button variant="warning" size="sm" onClick={() => abrirModalEditar(deporte)}>
                                                                    <i className="fas fa-edit"></i>
                                                                </Button>
                                                                <Button variant="danger" size="sm" onClick={() => handleEliminar(deporte.id, deporte.name)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        No se encontraron deportes que coincidan con la búsqueda.
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

            {/* Tarjeta de Instrucciones (Diseño idéntico a Usuarios) */}
            <Row className="mb-5">
                <Col xs={12}>
                    <Card as="aside" className="class_card1 w-100" style={{ maxWidth: '100%' }}>
                        <Card.Header className="class_card_header">
                            <h5 className="class_h5 mb-0">
                                <i className="fas fa-info-circle me-2"></i> Instrucciones de Uso
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-group list-group-flush class_list1">
                                <li className="list-group-item bg-transparent px-0 border-0 pt-0">
                                    <strong>1. Búsqueda:</strong> Filtre instantáneamente por nombre del deporte usando la barra superior.
                                </li>
                                <li className="list-group-item bg-transparent px-0 border-0">
                                    <strong>2. Gestión:</strong> Use los botones de colores para <span className="text-warning fw-bold">Editar</span> o <span className="text-danger fw-bold">Eliminar</span> registros.
                                </li>
                                <li className="list-group-item bg-transparent px-0 border-0">
                                    <strong>3. Estado:</strong> Utilice el interruptor (Switch) en la tabla para activar o desactivar rápidamente un deporte.
                                </li>
                                <li className="list-group-item bg-transparent px-0 border-0 pb-0">
                                    <strong>4. Sincronización:</strong> Utilice el botón Refrescar para traer los últimos datos del servidor.
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <SportsFormModal 
                show={showModal} 
                handleClose={cerrarModal} 
                handleSave={handleGuardar} 
                selectedSport={deporteSeleccionado} 
            />
        </Container>
    );
};

export default SportManagment;