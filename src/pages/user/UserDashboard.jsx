import React, { useEffect, useState } from 'react';
// Importamos los servicios necesarios para perfil y reservas
import { getPerfil, getMyReservations } from '../../services/UserServices';
import { getAssignments } from '../../services/AdminServices';

import '../../assets/css/Dashboard_Usuario.css'; 
import avatarPorDefecto from '../../assets/imagenes/XiaoChiye_Infobox_MulingMerch.webp'; 

const UserDashboard = () => {

    const [userData, setUserData] = useState({
        full_name: "Cargando...",
        email: "...",
        formattedDate: "--/--/----",
        visualGoals: [],
        avatar_url: avatarPorDefecto,
        membresia: {
            estado: "Activo",
            plan: "Plan Premium Mensual",
            vencimiento: "15 de Agosto, 2026"
        }
    });


    const [scheduleRows, setScheduleRows] = useState([]);
    const [loadingSchedule, setLoadingSchedule] = useState(true);

    useEffect(() => {
        cargarDatosDelPanel();
    }, []);

    const cargarDatosDelPanel = async () => {
        try {

            const resProfile = await getPerfil();
            const dataPerfil = resProfile.data || resProfile;
            
            let cleanDate = "--/--/----";
            let goalsArray = [];

            if (dataPerfil.birth_date) {
                const dateParts = dataPerfil.birth_date.split('-'); 
                cleanDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }

            if (dataPerfil.metadata && dataPerfil.metadata.objetivo) {
                goalsArray = dataPerfil.metadata.objetivo.split('\n').map(line => line.trim()).filter(line => line !== "");
            }

            setUserData(prevState => ({
                ...prevState,
                full_name: dataPerfil.full_name || "Usuario",
                email: dataPerfil.email || "",
                formattedDate: cleanDate,
                visualGoals: goalsArray,
                avatar_url: dataPerfil.avatar_url || avatarPorDefecto
            }));

            const resReservas = await getMyReservations();
            const rawReservas = resReservas.data || resReservas || []; 
            
            const assignData = await getAssignments();
            const asignaciones = assignData.data || assignData || [];

            const scheduleMap = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

            rawReservas.forEach(reserva => {
                if (reserva.status === 'active') {
                    const asignacionMatch = asignaciones.find(a => 
                        a.schedules && a.schedules.some(s => s.id === reserva.class_schedule_id)
                    );

                    if (asignacionMatch) {
                        const scheduleMatch = asignacionMatch.schedules.find(s => s.id === reserva.class_schedule_id);
                        if (scheduleMatch && scheduleMap[scheduleMatch.day_of_week]) {
                            const hora = scheduleMatch.start_time.substring(0,5);
                            const deporte = asignacionMatch.sport?.name || "Clase";
                            scheduleMap[scheduleMatch.day_of_week].push(`${deporte} - ${hora}`);
                        }
                    }
                }
            });


            let maxRows = 1; 
            Object.values(scheduleMap).forEach(dayArr => {
                if (dayArr.length > maxRows) maxRows = dayArr.length;
            });

            const rows = [];
            for (let i = 0; i < maxRows; i++) {
                rows.push({
                    lun: scheduleMap[1][i] || "",
                    mar: scheduleMap[2][i] || "",
                    mie: scheduleMap[3][i] || "",
                    jue: scheduleMap[4][i] || "",
                    vie: scheduleMap[5][i] || "",
                    sab: scheduleMap[6][i] || ""
                });
            }

            setScheduleRows(rows);

        } catch (error) {
            console.error("Error cargando datos del dashboard:", error);
        } finally {
            setLoadingSchedule(false);
        }
    };

    return (
        <div className="user_body pb-5">
            <main className="container-fluid mb-5 pt-4">
                <section className="row mx-auto mb-4">
                    <div className="col-12 col-md-6 mx-auto text-center">
                        <h4 className="class_h4" id="mensajeBienvenida"> ¡Bienvenido/a, {userData.full_name}! </h4>
                    </div>
                </section>
                
                <section className="row align-items-start">
                    {/* TARJETA 1: PERFIL REAL */}
                    <div className="col-12 col-md-4 col-xxl-4 mb-4 mb-md-0">
                        <article className="card user_card1 mx-auto w-100">
                            <div className="card-header user_card_header" style={{ textAlign: 'center' }}>
                                <h5 className="class_h5 mb-0"> Perfil </h5>
                            </div>
                            <div className="card-body" style={{ textAlign: 'center' }}>
                                <img 
                                    src={userData.avatar_url} 
                                    alt="avatar" 
                                    className="rounded-circle user_img_perfil" 
                                    style={{ maxWidth: '150px', width: '100%', height: '150px', objectFit: 'cover' }} 
                                />
                                <p className="user_p1 mt-3"> <b>Nombre:</b> {userData.full_name} </p>
                                <p className="user_p1 mb-1"> <b>Email:</b> {userData.email} </p>
                                <p className="user_p1 mb-3"> <b>Nacimiento:</b> {userData.formattedDate} </p>
                                
                                <b><u><p className="user_p1 mt-3"> Objetivos Personales:</p></u></b>
                                {userData.visualGoals.length > 0 ? (
                                    userData.visualGoals.map((objetivo, index) => (
                                        <p className="user_p1 mb-1" key={index}> ✰ {objetivo} </p>
                                    ))
                                ) : (
                                    <p className="user_p1 text-muted">Sin objetivos registrados</p>
                                )}
                            </div>
                        </article>
                    </div>
                    
                    <div className="col-12 col-md-8 col-xxl-8">
                        <section className="row">
                            <div className="col-12 col-md-6 col-xxl-6 mb-4 mb-md-0">
                                <article className="card user_card2 h-100 mx-auto w-100">
                                    <div className="card-header user_card_header" style={{ textAlign: 'center' }}>
                                        <h5 className="class_h5 mb-0"> Asistencia Mensual </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="progress">
                                            <div className="progress-bar bg-primary" style={{ width: '60%' }}>60%</div>
                                        </div>
                                        <p className="mt-3">Completado</p>
                                        <i><p className="user_p2 text-muted mt-4"> *Puedes encontrar más estadísticas sobre tu progreso en la sección de "Asistencia Mensual"</p></i>
                                    </div>
                                </article>
                            </div>
                            
                            <div className="col-12 col-md-6 col-xxl-6">
                                <article className="card user_card2 h-100 mx-auto w-100">
                                    <div className="card-header user_card_header" style={{ textAlign: 'center' }}>
                                        <h5 className="class_h5 mb-0"> Estado de Membresía </h5>
                                    </div>
                                    <div className="card-body d-flex flex-column justify-content-center">
                                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                            <span>Estado:</span>
                                            <span className="badge bg-success px-3 py-2">{userData.membresia.estado}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                            <span>Plan Actual:</span>
                                            <span className="text-muted">{userData.membresia.plan}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <span>Próximo Pago:</span>
                                            <span className="text-muted">{userData.membresia.vencimiento}</span>
                                        </div>
                                        <div className="text-center mt-auto">
                                            <button className="btn user_button1 w-100">Gestionar Plan</button>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </section>


                        <section className="row mt-1">
                            <div className="col-12">
                                <article className="card user_card4 mx-auto w-100">
                                    <div className="card-header user_card_header" style={{ textAlign: 'center' }}>
                                        <h5 className="class_h5 mb-0"> Mi Horario de Clases </h5>
                                    </div>
                                    <div className="card-body">
                                        {loadingSchedule ? (
                                            <p className="text-center my-3">Cargando horario...</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-bordered text-center mb-0 align-middle">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th style={{ width: '16%' }}>Lunes</th>
                                                            <th style={{ width: '16%' }}>Martes</th>
                                                            <th style={{ width: '16%' }}>Miércoles</th>
                                                            <th style={{ width: '16%' }}>Jueves</th>
                                                            <th style={{ width: '16%' }}>Viernes</th>
                                                            <th style={{ width: '16%' }}>Sábado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {scheduleRows.length > 0 ? (
                                                            scheduleRows.map((row, index) => (
                                                                <tr key={index}>
                                                                    <td className="p-3">{row.lun}</td>
                                                                    <td className="p-3">{row.mar}</td>
                                                                    <td className="p-3">{row.mie}</td>
                                                                    <td className="p-3">{row.jue}</td>
                                                                    <td className="p-3">{row.vie}</td>
                                                                    <td className="p-3">{row.sab}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6" className="py-4 text-muted">
                                                                    No tienes clases agendadas actualmente. <br /> ¡Ve al módulo de reservas para inscribirte!
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;