import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignments, getSchedules, getSports, getRooms } from '../../services/AdminServices';
import '../../assets/css/DashboardCoach.css';

const CoachDashboard = () => {
    const navigate = useNavigate();
    const [coachData, setCoachData] = useState({ id: null, full_name: "Entrenador" });
    const [asignaciones, setAsignaciones] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [sports, setSports] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [stats, setStats] = useState({ clases: 0, horas: 0 });

    useEffect(() => {
        const datosUsuario = localStorage.getItem('user');
        if (datosUsuario) setCoachData(JSON.parse(datosUsuario));
        document.body.className = "coach_body";
        return () => { document.body.className = ""; };
    }, []);

    useEffect(() => {
        if (coachData.id) cargarDatos();
    }, [coachData.id]);

    const cargarDatos = async () => {
        try {
            const [asigs, scheds, sps, rms] = await Promise.all([
                getAssignments(), getSchedules(), getSports(), getRooms()
            ]);
            
            const dataAsigs = (asigs.data || asigs).filter(a => Number(a.coach_id) === Number(coachData.id));
            const dataHorarios = (scheds.data || scheds).filter(h => dataAsigs.some(a => a.id === h.sport_room_id));

            setAsignaciones(dataAsigs);
            setHorarios(dataHorarios);
            setSports(sps.data || sps);
            setRooms(rms.data || rms);

            const totalHoras = dataHorarios.reduce((acc, h) => {
                const inicio = parseInt(h.start_time.split(':')[0]);
                const fin = parseInt(h.end_time.split(':')[0]);
                return acc + (fin - inicio);
            }, 0);
            
            setStats({ clases: dataAsigs.length, horas: totalHoras });
        } catch (error) { console.error("Error cargando datos:", error); }
    };

    return (
        <div className="coach_body">
            <main className="container pb-5">
                <section className="row mb-4"><div className="col-12 text-center"><h5 className="class_h4 coach_title2"> ¡Bienvenido, {coachData.full_name}! </h5></div></section>
                
                <section className="row mb-4 justify-content-center">
                    <div className="col-12 col-md-5 mb-3"><div className= " card shadow-sm p-3 text-center h-100" style={{ border: '4px groove #fcd769' }}><h6>Mis Asignaciones</h6><h3>{stats.clases}</h3></div></div>
                    <div className="col-12 col-md-5 mb-3"><div className=" card shadow-sm p-3 text-center h-100" style={{ border: '4px groove #fcd769' }}><h6>Horas de Clase Semanal</h6><h3>{stats.horas} hrs</h3></div></div>
                </section>
                
                <section className="row justify-content-center">
                    <div className="col-12 col-md-5 mb-4">
                        <article className="card coach_card1 mx-auto h-100">
                            <div className="card-header coach_card_header text-center"><h5 className="class_h5 mb-0"> Mis Clases </h5></div>
                            <div className="card-body">
                                <div className="alert alert-primary p-2 mb-3 text-center border-0" style={{backgroundColor: '#e7f1ff'}}>
                                    <small className="d-block text-uppercase text-muted" style={{fontSize: '0.7rem'}}>Próxima Clase</small>
                                    <h6 className="mb-0">
                                        {(() => {
                                            const ahora = new Date();
                                            const diaActual = ahora.getDay(); 
                                            const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
                                            const diaAjustado = diaActual === 0 ? 7 : diaActual;
                                            const proxima = horarios
                                                .filter(h => h.day_of_week > diaAjustado || (h.day_of_week == diaAjustado && parseInt(h.start_time.split(':')[0]) * 60 + parseInt(h.start_time.split(':')[1]) >= horaActual))
                                                .sort((a, b) => a.day_of_week - b.day_of_week || parseInt(a.start_time) - parseInt(b.start_time))[0];
                                            if (!proxima) return "Sin clases próximas";
                                            const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                                            const nombreDia = nombresDias[proxima.day_of_week - 1];
                                            const dep = sports.find(s => s.id === asignaciones.find(a => a.id === proxima.sport_room_id)?.sport_id)?.name || "Clase";
                                            return `${nombreDia} | ${dep} - ${proxima.start_time.substring(0, 5)}`;
                                        })()}
                                    </h6>
                                </div>
                                <ul className="list-group list-group-flush">
                                    {asignaciones.map(a => (
                                        <li key={a.id} className="list-group-item px-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="coach_nombre fw-bold">{sports.find(s => s.id === a.sport_id)?.name || "Deporte"}</span>
                                                <span className="badge bg-light text-dark border">Sala: {rooms.find(r => r.id === a.room_id)?.name || "N/A"}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    </div>

                    <div className="col-12 col-md-5 mb-4">
                        <article className="card coach_card2 mx-auto h-100">
                            <div className="card-header coach_card_header text-center"><h5 className="class_h5 mb-0"> Mi Horario de Clases </h5></div>
                            <div className="card-body p-2 p-md-3">
                                <div className="table-responsive">
                                    <table className="table table-bordered text-center mb-0">
                                        <thead><tr>{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <th key={d}>{d}</th>)}</tr></thead>
                                        <tbody>
                                            <tr>
                                                {[1, 2, 3, 4, 5, 6, 7].map(dia => (
                                                    <td key={dia}>
                                                        {horarios.filter(h => h.day_of_week == dia).map(h => (
                                                            <div key={h.id} className="small border-bottom py-1">
                                                                {h.start_time.substring(0, 5)} <br /> 
                                                                <span className="text-muted">-</span> <br /> 
                                                                {h.end_time.substring(0, 5)}
                                                            </div>
                                                        ))}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CoachDashboard;