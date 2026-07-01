// src/pages/admin/SportRoomsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ManagementTable from '../../components/admin/ManagementTable';
import GenericFormModal from '../../components/GenericFormModal';
import { 
    getAssignments, createAssignment, updateAssignment, deleteAssignment,
    getSports, getRooms, getUsers 
} from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css';

const SportRoomsPage = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [asignacionesFiltradas, setAsignacionesFiltradas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    
    const [sports, setSports] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [coaches, setCoaches] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);
    const [erroresFormulario, setErroresFormulario] = useState({});

    const camposAsignacion = [
        { name: 'sport_id', label: 'Deporte', type: 'select', options: sports.map(s => ({ value: s.id, label: s.name })), maxLength: 50 },
        { name: 'room_id', label: 'Sala', type: 'select', options: rooms.map(r => ({ value: r.id, label: r.name })), maxLength: 50 },
        { name: 'coach_id', label: 'Entrenador', type: 'select', options: coaches.map(c => ({ value: c.id, label: c.full_name })), maxLength: 50 },
        { name: 'observation', label: 'Observación', type: 'text', maxLength: 255 }
    ];

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [dataAsig, dataSports, dataRooms, dataUsers] = await Promise.all([
                getAssignments(), getSports(), getRooms(), getUsers()
            ]);
            const lista = dataAsig.data || dataAsig;
            setAsignaciones(lista);
            setAsignacionesFiltradas(lista);
            setSports(dataSports.data || dataSports);
            setRooms(dataRooms.data || dataRooms);
            setCoaches((dataUsers.data || dataUsers).filter(user => user.role === 'coach'));
        } catch (error) {
            Swal.fire("Error", "Problemas de conexión: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
        document.body.className = "class_body";
        return () => { document.body.className = ""; };
    }, []);

    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);
        const filtradas = asignaciones.filter(a => {
            const d = sports.find(s => s.id === a.sport_id)?.name.toLowerCase() || "";
            const s = rooms.find(r => r.id === a.room_id)?.name.toLowerCase() || "";
            const c = coaches.find(co => co.id === a.coach_id)?.full_name.toLowerCase() || "";
            return d.includes(termino) || s.includes(termino) || c.includes(termino);
        });
        setAsignacionesFiltradas(filtradas);
    };

    const handleGuardar = async (formData) => {
        let nuevosErrores = {};
        if (!formData.sport_id) nuevosErrores.sport_id = "Campo requerido";
        if (!formData.room_id) nuevosErrores.room_id = "Campo requerido";
        if (!formData.coach_id) nuevosErrores.coach_id = "Campo requerido";

        if (formData.observation && formData.observation.length > 255) {
            nuevosErrores.observation = "La observación no puede superar los 255 caracteres";
        }


        if (Object.keys(nuevosErrores).length > 0) {
            setErroresFormulario(nuevosErrores);
            return;
        }

        try {
            const dataToSave = { ...formData, sport_id: Number(formData.sport_id), room_id: Number(formData.room_id), coach_id: Number(formData.coach_id) };
            if (asignacionSeleccionada) {
                await updateAssignment(asignacionSeleccionada.id, dataToSave);
                Swal.fire("¡Actualizado!", "Asignación modificada.", "success");
            } else {
                await createAssignment(dataToSave);
                Swal.fire("¡Creado!", "Asignación registrada.", "success");
            }
            setShowModal(false);
            setAsignacionSeleccionada(null);
            cargarDatos();
        } catch (error) { Swal.fire("Error", error.message, "error"); }
    };

    const handleEliminar = async (id) => {
        const res = await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
        if (res.isConfirmed) { try { await deleteAssignment(id); cargarDatos(); } catch (e) { Swal.fire("Error", e.message, "error"); } }
    };

    const handleToggleStatus = async (asig) => {
        try { await updateAssignment(asig.id, { ...asig, status: !asig.status }); cargarDatos(); } catch (e) { Swal.fire("Error", "No se pudo actualizar", "error"); }
    };

    const instrucciones = [
        { title: "Búsqueda", text: "Filtre rápidamente por deporte, sala o nombre del entrenador." },
        { title: "Gestión", text: "Use los botones para editar detalles o eliminar asignaciones." },
        { title: "Estado", text: "Active o desactive la disponibilidad de la clase con el switch." }
    ];

    return (
        <Container as="main" className="my-4">
            <Row className="mb-4 align-items-center">
                <Col md={7}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white"><i className="fas fa-search"></i></InputGroup.Text>
                        <Form.Control type="text" placeholder="Buscar por deporte, sala o entrenador..." value={busqueda} onChange={handleBuscar} />
                    </InputGroup>
                </Col>
                <Col md={5} className="text-end">
                    <Button variant="outline-secondary" onClick={cargarDatos} className="me-2"><i className="fas fa-sync me-2"></i> Refrescar</Button>
                    <Button variant="success" onClick={() => { setAsignacionSeleccionada(null); setShowModal(true); }}>
                        <i className="fas fa-plus me-2"></i> Nueva Asignación
                    </Button>
                </Col>
            </Row>

            <ManagementTable 
                title="Gestión de Asignaciones"
                icon="fa-link"
                columns={["Deporte", "Sala", "Entrenador", "Observación", "Estado", "Acciones"]}
                data={asignacionesFiltradas}
                loading={loading}
                emptyMessage="No hay asignaciones registradas."
                instructions={instrucciones}
                renderRow={(asig) => (
                    <tr key={asig.id}>
                        <td>{sports.find(s => s.id === asig.sport_id)?.name || "N/A"}</td>
                        <td>{rooms.find(r => r.id === asig.room_id)?.name || "N/A"}</td>
                        <td>{coaches.find(c => c.id === asig.coach_id)?.full_name || "N/A"}</td>
                        <td>{asig.observation || "—"}</td>
                        <td><Form.Check type="switch" checked={asig.status} onChange={() => handleToggleStatus(asig)} /></td>
                        <td>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => { setAsignacionSeleccionada(asig); setShowModal(true); }}>
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleEliminar(asig.id)}>
                                <i className="fas fa-trash"></i>
                            </Button>
                        </td>
                    </tr>
                )}
            />

            <GenericFormModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                handleSave={handleGuardar} 
                title={asignacionSeleccionada ? "Editar Asignación" : "Nueva Asignación"}
                fields={camposAsignacion}
                initialData={asignacionSeleccionada || { sport_id: "", room_id: "", coach_id: "", observation: "" }}
                selectedItem={asignacionSeleccionada}
                errores={erroresFormulario}
            />
        </Container>
    );
};

export default SportRoomsPage;