// src/pages/admin/ClassSchedulePages.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ManagementTable from '../../components/admin/ManagementTable';
import GenericFormModal from '../../components/GenericFormModal';
import { 
    getSchedules, createSchedule, updateSchedule, deleteSchedule, 
    getAssignments, getSports, getRooms, getUsers 
} from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css';

const ClassSchedulePages = () => {
    const [horarios, setHorarios] = useState([]);
    const [horariosFiltrados, setHorariosFiltrados] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    
    const [asignaciones, setAsignaciones] = useState([]);
    const [sports, setSports] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [coaches, setCoaches] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
    const [erroresFormulario, setErroresFormulario] = useState({});

    // Función para obtener etiquetas legibles
    const getAsignacionLabel = (id) => {
        const asig = asignaciones.find(a => a.id === id);
        if (!asig) return "Asignación no encontrada";
        const sport = sports.find(s => s.id === asig.sport_id)?.name || "Sin Deporte";
        const room = rooms.find(r => r.id === asig.room_id)?.name || "Sin Sala";
        return `${sport} - ${room}`;
    };

    const camposHorario = [
        { 
            name: 'sport_room_id', 
            label: 'Asignación (Deporte - Sala - Entrenador)', 
            type: 'select', 
            // Esto muestra al usuario la tríada completa para que elijan bien
            options: asignaciones.map(a => {
                const sport = sports.find(s => s.id === a.sport_id)?.name || "N/A";
                const room = rooms.find(r => r.id === a.room_id)?.name || "N/A";
                const coach = coaches.find(c => c.id === a.coach_id)?.full_name || "N/A";
                return { value: a.id, label: `${sport} - ${room} | Coach: ${coach}` };
            })
        },
        { 
            name: 'day_of_week', 
            label: 'Día de la Semana', 
            type: 'select',
            options: [
                { value: '1', label: 'Lunes' }, { value: '2', label: 'Martes' }, { value: '3', label: 'Miércoles' },
                { value: '4', label: 'Jueves' }, { value: '5', label: 'Viernes' }, { value: '6', label: 'Sábado' }, { value: '7', label: 'Domingo' }
            ]
        },
        { name: 'start_time', label: 'Hora de Inicio', type: 'time' },
        { name: 'end_time', label: 'Hora de Fin', type: 'time' }
    ];
    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [dataH, dataA, dataS, dataR, dataU] = await Promise.all([
                getSchedules(), getAssignments(), getSports(), getRooms(), getUsers()
            ]);
            const lista = dataH.data || dataH;
            setHorarios(lista);
            setHorariosFiltrados(lista);
            setAsignaciones(dataA.data || dataA);
            setSports(dataS.data || dataS);
            setRooms(dataR.data || dataR);
            setCoaches((dataU.data || dataU).filter(u => u.role === 'coach'));
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
        const filtrados = horarios.filter(h => getAsignacionLabel(h.sport_room_id).toLowerCase().includes(termino));
        setHorariosFiltrados(filtrados);
    };

    const handleGuardar = async (formData) => {
        let nuevosErrores = {};
        if (!formData.sport_room_id) nuevosErrores.sport_room_id = "Seleccione una asignación";
        if (!formData.day_of_week) nuevosErrores.day_of_week = "Seleccione un día";
        if (!formData.start_time || !formData.end_time) nuevosErrores.start_time = "Defina el rango horario";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresFormulario(nuevosErrores);
            return;
        }

        try {
            if (horarioSeleccionado) {
                await updateSchedule(horarioSeleccionado.id, formData);
                Swal.fire("¡Actualizado!", "Horario modificado.", "success");
            } else {
                await createSchedule(formData);
                Swal.fire("¡Creado!", "Horario registrado.", "success");
            }
            setShowModal(false);
            setHorarioSeleccionado(null);
            cargarDatos();
        } catch (error) { Swal.fire("Error", error.message, "error"); }
    };

    const handleEliminar = async (id) => {
        const res = await Swal.fire({ title: '¿Eliminar horario?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
        if (res.isConfirmed) { try { await deleteSchedule(id); cargarDatos(); } catch (e) { Swal.fire("Error", e.message, "error"); } }
    };

    const instrucciones = [
        { title: "Gestión", text: "Programe bloques horarios para cada asignación (Deporte/Sala)." },
        { title: "Búsqueda", text: "Filtre por nombre de deporte o sala." }
    ];

    return (
        <Container as="main" className="my-4">
            <Row className="mb-4 align-items-center">
                <Col md={7}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white"><i className="fas fa-search"></i></InputGroup.Text>
                        <Form.Control type="text" placeholder="Buscar horario..." value={busqueda} onChange={handleBuscar} />
                    </InputGroup>
                </Col>
                <Col md={5} className="text-end">
                    <Button variant="outline-secondary" onClick={cargarDatos} className="me-2"><i className="fas fa-sync me-2"></i> Refrescar</Button>
                    <Button variant="success" onClick={() => { setHorarioSeleccionado(null); setShowModal(true); }}>
                        <i className="fas fa-plus me-2"></i> Nuevo Horario
                    </Button>
                </Col>
            </Row>

            <ManagementTable 
                title="Gestión de Horarios"
                icon="fa-clock"
                columns={["Clase", "Sala", "Entrenador", "Día", "Inicio", "Fin", "Acciones"]}
                data={horariosFiltrados}
                loading={loading}
                emptyMessage="No hay horarios registrados."
                instructions={[
                    { title: "Gestión", text: "Programe bloques horarios para cada asignación (Deporte/Sala)." },
                    { title: "Búsqueda", text: "Filtre por nombre de deporte o sala." },
                    { title: "Detalle", text: "La tabla muestra el entrenador asignado a cada clase." }
                ]}
                renderRow={(h) => {
                    const asig = asignaciones.find(a => a.id === h.sport_room_id);
                    const sportName = sports.find(s => s.id === asig?.sport_id)?.name || "N/A";
                    const roomName = rooms.find(r => r.id === asig?.room_id)?.name || "N/A";
                    const coachName = coaches.find(c => c.id === asig?.coach_id)?.full_name || "N/A";
                    
                    return (
                        <tr key={h.id}>
                            <td>{sportName}</td>
                            <td>{roomName}</td>
                            <td>{coachName}</td>
                            <td>{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][h.day_of_week - 1]}</td>
                            <td>{h.start_time}</td>
                            <td>{h.end_time}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => { setHorarioSeleccionado(h); setShowModal(true); }}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleEliminar(h.id)}>
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    );
                }}
            />  

            <GenericFormModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                handleSave={handleGuardar} 
                title={horarioSeleccionado ? "Editar Horario" : "Nuevo Horario"}
                fields={camposHorario}
                initialData={horarioSeleccionado || { sport_room_id: "", day_of_week: "", start_time: "", end_time: "" }}
                selectedItem={horarioSeleccionado}
                errores={erroresFormulario}
            />
        </Container>
    );
};

export default ClassSchedulePages;