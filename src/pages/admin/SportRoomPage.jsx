// src/pages/admin/SportRoomsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ManagementTable from '../../components/admin/ManagementTable';
import SportRoomModal from '../../components/admin/SportRoomModal';
import { 
    getAssignments, createAssignment, updateAssignment, deleteAssignment,
    getSports, getRooms, getUsers 
} from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css';


const SportRoomsPage = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para poblar los selects del Modal
    const [sports, setSports] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [coaches, setCoaches] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [asignacionSeleccionada, setAsignacionSeleccionada] = useState(null);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            // Promisify all calls para cargar todo en paralelo
            const [dataAsig, dataSports, dataRooms, dataUsers] = await Promise.all([
                getAssignments(), getSports(), getRooms(), getUsers()
            ]);

            setAsignaciones(dataAsig.data || dataAsig);
            setSports(dataSports.data || dataSports);
            setRooms(dataRooms.data || dataRooms);
            
            // Filtramos solo los usuarios que sean coaches
            const allUsers = dataUsers.data || dataUsers;
            setCoaches(allUsers.filter(user => user.role === 'coach'));
        } catch (error) {
            Swal.fire("Error", "Problemas de conexión: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {
        // Llamamos a tu función para traer los datos
        cargarDatos();
        
        // Le aplicamos la clase al body para pintar el fondo
        document.body.className = "class_body";
        
        // Cuando el usuario cambie a otra página, limpiamos el body
        return () => { 
            document.body.className = ""; 
        };
    }, []);

 const handleGuardar = async (formData) => {
        // VALIDACIÓN DE NEGOCIO: Evitar asignaciones duplicadas
        const idActual = asignacionSeleccionada ? asignacionSeleccionada.id : null;
        
        const existeAsignacion = asignaciones.some(asig => 
            asig.id !== idActual && 
            Number(asig.sport_id) === Number(formData.sport_id) && 
            Number(asig.room_id) === Number(formData.room_id) && 
            Number(asig.coach_id) === Number(formData.coach_id)
        );

        if (existeAsignacion) {
            Swal.fire({
                icon: "warning",
                title: "Asignación Duplicada",
                text: "Este entrenador ya está asignado a este deporte en esta misma sala."
            });
            return;
        }

        try {
            if (asignacionSeleccionada) {
                await updateAssignment(asignacionSeleccionada.id, formData);
                Swal.fire("¡Actualizado!", "La asignación se actualizó con éxito.", "success");
            } else {
                await createAssignment(formData);
                Swal.fire("¡Creado!", "La nueva asignación fue registrada.", "success");
            }
            setShowModal(false);
            cargarDatos();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar asignación?',
            text: `Esta acción romperá el vínculo entre el deporte, la sala y el coach.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await deleteAssignment(id);
                Swal.fire("¡Eliminado!", "La asignación ha sido eliminada.", "success");
                cargarDatos();
            } catch (error) {
                Swal.fire("Error al eliminar", error.message, "error");
            }
        }
    };

    const handleToggleStatus = async (asig) => {
        const nuevoEstado = !asig.status;
        try {
            const listaActualizada = asignaciones.map(a =>
                a.id === asig.id ? { ...a, status: nuevoEstado } : a
            );
            setAsignaciones(listaActualizada);
            await updateAssignment(asig.id, { ...asig, status: nuevoEstado });
        } catch (error) {
            cargarDatos();
            Swal.fire("Error", "No se pudo cambiar el estado", "error");
        }
    };

    const instrucciones = [
        { title: "Creación", text: "Asigne un Deporte a una Sala específica y defina al Entrenador responsable." },
        { title: "Integridad", text: "Debe asegurarse de tener Deportes, Salas y Coaches creados previamente en sus respectivos módulos." }
    ];

    // Función auxiliar para buscar el nombre basado en el ID (por si el backend solo devuelve IDs)
    const getSportName = (id) => sports.find(s => s.id === id)?.name || "N/A";
    const getRoomName = (id) => rooms.find(r => r.id === id)?.name || "N/A";
    const getCoachName = (id) => coaches.find(c => c.id === id)?.full_name || "N/A";

    return (
        <Container as="main" className="my-4">
            <Row className="mb-4">
                <Col className="text-end">
                    <Button variant="outline-secondary" onClick={cargarDatos} className="me-2">
                        <i className="fas fa-sync me-2"></i> Refrescar
                    </Button>
                    <Button variant="success" onClick={() => { setAsignacionSeleccionada(null); setShowModal(true); }}>
                        <i className="fas fa-plus me-2"></i> Nueva Asignación
                    </Button>
                </Col>
            </Row>

            <ManagementTable 
                title="Gestión de Asignaciones"
                icon="fa-link"
                columns={["Deporte", "Sala", "Entrenador", "Observación", "Estado", "Acciones"]}
                data={asignaciones}
                loading={loading}
                emptyMessage="No hay asignaciones registradas."
                instructions={instrucciones}
                renderRow={(asig) => (
                    <tr key={asig.id}>
                        <td className="fw-bold">{getSportName(asig.sport_id)}</td>
                        <td>{getRoomName(asig.room_id)}</td>
                        <td>{getCoachName(asig.coach_id)}</td>
                        <td>{asig.observation || "—"}</td>
                        <td>
                            <Form.Check 
                                type="switch"
                                checked={asig.status}
                                onChange={() => handleToggleStatus(asig)}
                            />
                        </td>
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

            <SportRoomModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                handleSave={handleGuardar} 
                selectedAssignment={asignacionSeleccionada}
                sportsList={sports}
                roomsList={rooms}
                coachesList={coaches}
            />
        </Container>
    );
};

export default SportRoomsPage;