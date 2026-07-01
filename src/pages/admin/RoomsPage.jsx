// src/pages/admin/RoomsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ManagementTable from '../../components/admin/ManagementTable';
import GenericFormModal from '../../components/GenericFormModal';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css';

const RoomsPage = () => {
    // 1. Estados de la página
    const [salas, setSalas] = useState([]);
    const [salasFiltradas, setSalasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    
    // Estados del Modal
    const [showModal, setShowModal] = useState(false);
    const [salaSeleccionada, setSalaSeleccionada] = useState(null);
    const [erroresFormulario, setErroresFormulario] = useState({});

    // 2. Configuración de los campos para el Modal Genérico
    const camposSala = [
        { name: 'name', label: 'Nombre de la Sala', type: 'text', placeholder: 'Ej: Cancha Fútbol 3', maxLength: 50 },
        { name: 'description', label: 'Descripción', type: 'text', placeholder: 'Describe la sala...' },
        { name: 'capacity', label: 'Capacidad', type: 'number', placeholder: 'Ej: 20', maxLength: 30 },
        { name: 'location', label: 'Ubicación', type: 'text', placeholder: 'Ej: Segundo piso', maxlength: 35},
        { name: 'observation', label: 'Observación', type: 'text', placeholder: 'Opcional...', maxLength: 255 }
    ];

    // 3. Carga inicial de datos
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

    // 4. Funciones de manejo visual y de estado
    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);
        const filtradas = salas.filter(s => s.name.toLowerCase().includes(termino));
        setSalasFiltradas(filtradas);
    };

    const abrirModalCrear = () => {
        setSalaSeleccionada(null);
        setErroresFormulario({});
        setShowModal(true);
    };

    const abrirModalEditar = (sala) => {
        setSalaSeleccionada(sala);
        setErroresFormulario({});
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setSalaSeleccionada(null);
        setErroresFormulario({});
    };

    // 5. Función principal de guardado con las validaciones originales
    const handleGuardar = async (formData) => {
        let nuevosErrores = {};
        let esValido = true;

        const regexCompleto = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!formData.name || formData.name.trim().length < 3) {
            nuevosErrores.name = "El nombre debe tener al menos 3 caracteres";
            esValido = false;
        }
        if (!formData.description || formData.description.trim().length < 5) {
            nuevosErrores.description = "La descripción debe tener al menos 5 caracteres";
            esValido = false;
        }
        if (!formData.capacity || Number(formData.capacity) < 1) {
            nuevosErrores.capacity = "La capacidad debe ser mayor a 0";
            esValido = false;
        }
        if (!formData.location || formData.location.trim().length < 3) {
            nuevosErrores.location = "La ubicación es obligatoria (mínimo 3 letras)";
            esValido = false;
        }
        if (!regexCompleto.test(formData.location)) {
            nuevosErrores.location = "La ubicación solo puede contener letras y números";
            esValido = false;
        }

        if (formData.observation && formData.observation.length > 255) {
            nuevosErrores.observation = "La observación es muy larga (máximo 255 caracteres)";
            esValido = false;
        }
        if (!regexCompleto.test(formData.observation)) {
            nuevosErrores.observation = "La observación solo puede contener letras y números";
            esValido = false;
        }



        if (!esValido) {
            setErroresFormulario(nuevosErrores);
            return; 
        }

        setErroresFormulario({});

        try {
            const datosParaGuardar = { ...formData, capacity: Number(formData.capacity) };

            if (salaSeleccionada) {
                await updateRoom(salaSeleccionada.id, datosParaGuardar);
                Swal.fire("¡Actualizado!", "La sala se actualizó con éxito.", "success");
            } else {
                await createRoom(datosParaGuardar);
                Swal.fire("¡Creado!", "La nueva sala fue registrada.", "success");
            }
            cerrarModal();
            cargarSalas();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    // 6. Eliminar y Cambiar Estado
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
            const listaActualizada = salas.map(s => s.id === sala.id ? { ...s, status: nuevoEstado } : s);
            setSalas(listaActualizada);
            setSalasFiltradas(listaActualizada.filter(s => s.name.toLowerCase().includes(busqueda)));
            await updateRoom(sala.id, { ...sala, status: nuevoEstado });
        } catch (error) {
            cargarSalas();
            Swal.fire("Error", "No se pudo cambiar el estado", "error");
        }
    };

    // 7. Configuración de instrucciones
    const instrucciones = [
        { title: "Búsqueda", text: "Filtre instantáneamente por nombre de la sala usando la barra superior." },
        { title: "Gestión", text: <span>Use los botones de colores para <span className="text-warning fw-bold">Editar</span> o <span className="text-danger fw-bold">Eliminar</span> las salas.</span> },
        { title: "Estado", text: "Utilice el interruptor (Switch) para marcar una sala como Activa o Inactiva según su disponibilidad." },
        { title: "Sincronización", text: "Utilice el botón Refrescar para traer los últimos datos actualizados de las salas." }
    ];

    // 8. Renderizado (HTML)
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

            <GenericFormModal
                show={showModal}
                handleClose={cerrarModal}
                handleSave={handleGuardar}
                title={salaSeleccionada ? "Editar Sala" : "Nueva Sala"}
                fields={camposSala}
                initialData={{ name: "", description: "", capacity: "", location: "", observation: "" }}
                selectedItem={salaSeleccionada}
                errores={erroresFormulario} 
            />
        </Container>
    );
};

export default RoomsPage;