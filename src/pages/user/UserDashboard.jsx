import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/UserServices';
import '../../assets/css/Dashboard_Usuario.css'; 
import avatarPorDefecto from '../../assets/imagenes/XiaoChiye_Infobox_MulingMerch.webp'; 

const UserDashboard = () => {
    const [userData, setUserData] = useState({
        full_name: "Cargando...",
        email: "...",
        edad: "...",
        objetivos: [],
        avatar_url: avatarPorDefecto
    });

    useEffect(() => {
        const usuarioActual = getCurrentUser();
        if (usuarioActual) {
            if (!usuarioActual.avatar_url) {
                usuarioActual.avatar_url = avatarPorDefecto; 
            }
            setUserData(usuarioActual);
        }
        
        document.body.className = "user_body";
        return () => { document.body.className = ""; };
    }, []);

    return (
        <div className="user_body">
            <main className="container-fluid mb-5 pt-4">
                <section className="row mx-auto mb-4">
                    <div className="col-12 col-md-6 mx-auto text-center">
                        <h4 className="class_h4" id="mensajeBienvenida"> ¡Bienvenido/a, {(userData.full_name)}! </h4>
                    </div>
                </section>
                
                <section className="row align-items-start">
                    <div className="col-12 col-md-4 col-xxl-4 mb-4 mb-md-0">
                        <article className="card user_card1 mx-auto">
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
                                <p className="user_p1"> <b>Email:</b> {userData.email} </p>
                                <p className="user_p1"> <b>Edad:</b> {userData.edad} años </p>
                                
                                <b><u><p className="user_p1 mt-3"> Objetivos Personales:</p></u></b>
                                {(userData.objetivos || []).map((objetivo, index) => (
                                    <p className="user_p1 mb-1" key={index}> ✰ {objetivo.trim()} </p>
                                ))}
                            </div>
                        </article>
                    </div>
                    
                    <div className="col-12 col-md-8 col-xxl-8">
                        <section className="row">
                            <div className="col-12 col-md-6 col-xxl-6 mb-4 mb-md-0">
                                <article className="card user_card2 h-100 mx-auto">
                                    <div className="card-header user_card_header" style={{ textAlign: 'center' }}>
                                        <h5 className="class_h5 mb-0"> Asistencia Mensual </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="progress">
                                            <div className="progress-bar bg-primary" style={{ width: '60%' }}>60%</div>
                                        </div>
                                        <p className="mt-3">Completado</p>
                                        <i><p className="user_p2"> *Puedes encontrar mas estadisticas sobre tu asistencia progreso en la sección de "Asistencia Mensual "</p></i>
                                    </div>
                                </article>
                            </div>
                            
                            <div className="col-12 col-md-6 col-xxl-6">
                                <article className="card user_card2 h-100 mx-auto">
                                    <div className="card-header user_card_header" style={{ textAlign: 'center' }}>
                                        <h5 className="class_h5 mb-0"> Reserva una Clase de Hoy : </h5>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>Tenis 15:00 - 16:00</span>
                                                    <button className="btn btn-sm user_button1"> Reservar </button>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>Boxeo 16:00 - 17:00</span>
                                                    <button className="btn btn-sm user_button1"> Reservar </button>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>Basketball 18:00 - 19:00</span>
                                                    <button className="btn btn-sm user_button1"> Reservar </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </article>
                            </div>
                        </section>

                        <section className="row mt-4">
                            <div className="col-12">
                                <article className="card user_card4 mx-auto w-100">
                                    <div className="card-header user_card_header" style={{ textAlign: 'center' }}>
                                        <h5 className="class_h5 mb-0"> Horario de Clases </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered text-center mb-0">
                                                <thead>
                                                    <tr>
                                                        <th> Lunes </th>
                                                        <th> Martes </th>
                                                        <th> Miércoles </th>
                                                        <th> Jueves </th>
                                                        <th> Viernes </th>
                                                        <th> Sábado </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td> Tenis - 10:00 AM </td>
                                                        <td> </td>
                                                        <td> Boxeo - 4:00 PM </td>
                                                        <td> Tenis - 10:00 AM </td>
                                                        <td>  </td>
                                                        <td> Boxeo - 4:00 PM </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
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