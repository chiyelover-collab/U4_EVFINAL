import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2'; 
import ManagementTable from '../../components/admin/ManagementTable';
import GenericFormModal from '../../components/GenericFormModal';

import { getMyReservations, createReservation, cancelReservation } from '../../services/UserServices';
import { getAssignments } from '../../services/AdminServices';
import '../../assets/css/dashboard_usuario.css'

const ReservationManagement = () => {
    const [reservas, setReservas] = useState([]);
    const [reservasFiltradas, setReservasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    
    const [showModal, setShowModal] = useState(false);
    const [erroresFormulario, setErroresFormulario] = useState({});
    
    const [clasesDisponibles, setClasesDisponibles] = useState([]);

    const getDayName = (num) => {
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        return days[num - 1] || "N/A";
    };

    const camposReserva = [
        { 
            name: 'class_schedule_id', 
            label: 'Clase Disponible', 
            type: 'select', 
            options: clasesDisponibles 
        }
    ];

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            // 1. Traer reservas y asignaciones
            const resData = await getMyReservations();
            const rawReservas = resData.data || resData || []; 
            
            const assignData = await getAssignments();
            const asignaciones = assignData.data || assignData || [];
            
            // 2. Llenar opciones del Modal con el nombre del Coach incluido
            const opciones = [];
            asignaciones.forEach(assignment => {
                if (assignment.schedules && assignment.schedules.length > 0) {
                    const nombreCoach = assignment.coach?.full_name || assignment.coach_name || "Sin Coach";
                    assignment.schedules.forEach(schedule => {
                        opciones.push({
                            value: schedule.id, 
                            label: `${assignment.sport.name} con ${nombreCoach} | ${getDayName(schedule.day_of_week)} ${schedule.start_time.substring(0,5)} | Sala: ${assignment.room.name}`
                        });
                    });
                }
            });
            setClasesDisponibles(opciones);

            // 3. LA SOLUCIÓN: Enriquecer las reservas cruzando el ID con las asignaciones
            const reservasEnriquecidas = rawReservas.map(reserva => {
                let deporte = "—";
                let sala = "—";
                let coach = "—";
                let horario = "—";

                // Buscar la asignación que contiene el horario de esta reserva
                const asignacionMatch = asignaciones.find(a => 
                    a.schedules && a.schedules.some(s => s.id === reserva.class_schedule_id)
                );

                if (asignacionMatch) {
                    deporte = asignacionMatch.sport?.name || "—";
                    sala = asignacionMatch.room?.name || "—";
                    coach = asignacionMatch.coach?.full_name || asignacionMatch.coach_name || "Sin Coach";
                    
                    const scheduleMatch = asignacionMatch.schedules.find(s => s.id === reserva.class_schedule_id);
                    if (scheduleMatch) {
                        horario = `${getDayName(scheduleMatch.day_of_week)} ${scheduleMatch.start_time.substring(0,5)}`;
                    }
                }

                // Devolvemos la reserva original pero le inyectamos los datos visuales
                return {
                    ...reserva,
                    sport_name_display: deporte,
                    room_name_display: sala,
                    coach_name_display: coach,
                    schedule_display: horario
                };
            });

            setReservas(reservasEnriquecidas);
            setReservasFiltradas(reservasEnriquecidas);

        } catch (error) {
            Swal.fire("Error", "No se pudieron cargar los datos: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);
        // Ahora filtramos usando nuestra variable cruzada
        const filtradas = reservas.filter(r => r.sport_name_display.toLowerCase().includes(termino));
        setReservasFiltradas(filtradas);
    };

    const abrirModalCrear = () => {
        setErroresFormulario({});
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setErroresFormulario({});
    };

    const handleGuardar = async (formData) => {
        if (!formData.class_schedule_id) {
            setErroresFormulario({ class_schedule_id: "Debes seleccionar una clase disponible" });
            return;
        }
        setErroresFormulario({});

        try {
            await createReservation(formData.class_schedule_id);
            Swal.fire("¡Agendado!", "Tu reserva fue creada con éxito.", "success");
            cerrarModal();
            cargarDatos();
        } catch (error) {
            Swal.fire("Error", error.message || "No se pudo crear la reserva", "error");
        }
    };

    const handleCancelar = async (id, nombreDeporte) => {
        const confirmacion = await Swal.fire({
            title: '¿Cancelar reserva?',
            text: `Estás a punto de anular tu clase de "${nombreDeporte}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Volver'
        });

        if (confirmacion.isConfirmed) {
            try {
                await cancelReservation(id);
                Swal.fire("¡Cancelada!", "Tu reserva ha sido anulada.", "success");
                cargarDatos();
            } catch (error) {
                Swal.fire("Error al cancelar", error.message, "error");
            }
        }
    };

    const instrucciones = [
        { title: "Búsqueda", text: "Filtre instantáneamente por el nombre del deporte usando la barra superior." },
        { title: "Gestión", text: <span>Use el botón <span className="text-danger fw-bold">Cancelar</span> en la tabla para anular una clase agendada.</span> },
        { title: "Sincronización", text: "Utilice el botón Refrescar para traer el historial actualizado de sus reservas." }
    ];

    return (
        <div className="user_body pb-5">
            <Container as="main" className="pt-4">
                <Row className="mb-4 align-items-center">
                    <Col md={7}>
                        <InputGroup>
                            <InputGroup.Text className="bg-white">
                                <i className="fas fa-search"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar reserva por deporte..."
                                value={busqueda}
                                onChange={handleBuscar}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={5} className="text-end mt-3 mt-md-0 d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={cargarDatos}>
                            <i className="fas fa-sync me-2"></i> Refrescar
                        </Button>
                        <Button className="user_button1 border-0 rounded" size="sm" style={{ width: 'auto' }} onClick={abrirModalCrear}>
                            <i className="fas fa-plus me-2"></i> Nueva Reserva
                        </Button>
                    </Col>
                </Row>

                <ManagementTable 
                    title="Mis Reservas"
                    icon="fa-calendar-check"
                    columns={["Deporte", "Sala", "Coach", "Horario", "Estado", "Acciones"]}
                    data={reservasFiltradas}
                    loading={loading}
                    emptyMessage="No se encontraron reservas registradas."
                    instructions={instrucciones}
                    renderRow={(reserva) => (
                        <tr key={reserva.id}>
                            <td className="fw-bold">{reserva.sport_name_display}</td>
                            <td>{reserva.room_name_display}</td>
                            <td>{reserva.coach_name_display}</td>
                            <td>{reserva.schedule_display}</td>
                            <td>
                                <span className={`badge ${reserva.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                    {reserva.status === 'active' ? 'Activa' : 'Cancelada'}
                                </span>
                            </td>
                            <td>
                                <div className="d-flex justify-content-center gap-2">
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={() => handleCancelar(reserva.id, reserva.sport_name_display)}
                                        disabled={reserva.status === 'cancelled'}
                                    >
                                        <i className="fas fa-times"></i> Cancelar
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
                    title="Agendar Nueva Clase"
                    fields={camposReserva}
                    initialData={{ class_schedule_id: "" }}
                    errores={erroresFormulario} 
                />
            </Container>
        </div>
    );
};

export default ReservationManagement;