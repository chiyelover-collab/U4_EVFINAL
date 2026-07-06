import React, { useEffect, useState } from 'react';
import { getAssignments } from '../../services/AdminServices';
import '../../assets/css/Dashboard_Usuario.css';

const AvailableClasses = () => {
    const [asignaciones, setAsignaciones] = useState([]);

    const getNombreDia = (num) => {
        const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        return dias[num - 1] || "N/A";
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await getAssignments();
                if (response && response.data) setAsignaciones(response.data);
            } catch (error) { console.error("Error al cargar:", error); }
        };
        cargarDatos();
        document.body.className = "user_body";
        return () => { document.body.className = ""; };
    }, []);

    return (
        <div className="user_body">
            <main className="container pt-5 pb-5">
                <div className="row justify-content-center">
                    {asignaciones.map((a) => (
                        <div key={a.id} className="col-12 col-md-4 mb-4">
                            <article className="card user_card1 mx-auto h-100" style={{ border: 'none', borderRadius: '12px' }}>
                                
                            
                                <div className="card-header text-center py-3" style={{ 
                                    backgroundColor: '#66b3ff', 
                                    borderRadius: '12px 12px 0 0',
                                    fontFamily: 'Trebuchet MS, sans-serif'
                                }}>
                                    <h5 className="mb-0" style={{ color: '#000000'}}>
                                        {a.sport.name}
                                    </h5>
                                </div>
                                
                                <div className="card-body p-4" style={{ backgroundColor: '#ffffff' }}>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <span style={{ color: '#003366', marginRight: '8px' }}>📍</span>
                                            <span className="user_p1 m-0"><b>Sala:</b> {a.room.name}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span style={{ color: '#003366', marginRight: '8px' }}>👤</span>
                                            <span className="user_p1 m-0"><b>Coach:</b> {a.coach.full_name}</span>
                                        </div>
                                    </div>

                                    <div className="p-3 mb-3 rounded" style={{ backgroundColor: '#f0f7ff', borderLeft: '4px solid #003366' }}>
                                        <p className="user_p2 mb-1" style={{ color: '#003366' }}><i>{a.sport.objective}</i></p>
                                        <small className="text-muted">Duración: {a.sport.duration} min</small>
                                    </div>
                                    
                                    <p className="user_p1 mb-2" style={{ color: '#003366' }}><b>Horarios disponibles:</b></p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {a.schedules.length > 0 ? a.schedules.map((h, index) => (
                                            <span key={index} className="badge" style={{ 
                                                backgroundColor: '#003366', color: '#ffffff',
                                                padding: '6px 12px', fontSize: '0.75rem', borderRadius: '20px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                {getNombreDia(h.day_of_week)} {h.start_time.substring(0,5)}
                                            </span>
                                        )) : <span className="text-muted small">Sin horario activo</span>}
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AvailableClasses;