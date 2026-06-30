import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/DashboardCoach.css';
import logoEmpresa from '../../assets/imagenes/logo_empresa_letra_v1.png';
import imgXueMeng from '../../assets/imagenes/Xue.Meng.600.4090440.jpg';
import imgShiMei from '../../assets/imagenes/shi mei.jpg';
import imgYaoWenyu from '../../assets/imagenes/YaoWenyu_Infobox.jpg';
import imgHuaCheng from '../../assets/imagenes/Animehilikesgirp.256.827378.jpg';

const CoachDashboard = () => {
    const navigate = useNavigate();
    const [coachName, setCoachName] = useState("Cargando...");

    useEffect(() => {
        const datosUsuario = localStorage.getItem('user');
        if (datosUsuario) {
            const usuario = JSON.parse(datosUsuario);
            setCoachName(usuario.full_name || "Entrenador Hanxue");
        } else {
            setCoachName("Entrenador Hanxue"); 
        }

        document.body.className = "coach_body";
        return () => { document.body.className = ""; };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="coach_body">
            <main className="container pb-5">
                <section className="row">
                    <div className="col-12 col-md-6 mx-auto text-center">
                        <h5 className="class_h4 coach_title2" id="mensajeBienvenida"> ¡Bienvenido, {coachName}! </h5>
                    </div>
                </section>
                
                <section className="row justify-content-center">
                    <div className="col-12 col-md-6 col-xl-5 mb-4">
                        <article className="card coach_card1 mx-auto">
                            <div className="card-header coach_card_header" style={{ textAlign: 'center' }}>
                                <h5 className="class_h5 mb-0"> Mis Alumnos </h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item px-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div className="d-flex align-items-center mb-2 mb-sm-0">
                                                <img src={imgXueMeng} style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded-circle" alt="Foto de perfil" />
                                                <span className="coach_nombre"> Xue Meng </span>
                                            </div>
                                            <span className="coach_email d-none d-sm-block"> darlingoftheheavens@gmail.com</span>
                                            <button className="btn btn-sm coach_button1"> Progreso </button>    
                                        </div>
                                    </li>
                                    <li className="list-group-item px-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div className="d-flex align-items-center mb-2 mb-sm-0">
                                                <img src={imgShiMei} className="rounded-circle coach_img_perfil" style={{ objectFit: 'cover' }} alt="Foto de perfil" />
                                                <span className="coach_nombre"> Shi Mei </span>
                                            </div>
                                            <span className="coach_email d-none d-sm-block"> sh1tmei@gmail.com</span>
                                            <button className="btn btn-sm coach_button1"> Progreso </button>
                                        </div>
                                    </li>
                                    <li className="list-group-item px-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div className="d-flex align-items-center mb-2 mb-sm-0">
                                                <img src={imgYaoWenyu} className="rounded-circle coach_img_perfil" style={{ objectFit: 'cover' }} alt="Foto de perfil" />
                                                <span className="coach_nombre"> Yao Wenyu </span>
                                            </div>
                                            <span className="coach_email d-none d-sm-block"> yao.wenyu@gmail.com</span>
                                            <button className="btn btn-sm coach_button1"> Progreso </button>
                                        </div>
                                    </li>
                                    <li className="list-group-item px-0">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div className="d-flex align-items-center mb-2 mb-sm-0">
                                                <img src={imgHuaCheng} className="rounded-circle coach_img_perfil" style={{ objectFit: 'cover' }} alt="Foto de perfil" />
                                                <span className="coach_nombre"> Hua Cheng </span>
                                            </div>
                                            <span className="coach_email d-none d-sm-block"> gegelover@gmail.com</span>
                                            <button className="btn btn-sm coach_button1"> Progreso </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </article>
                    </div>

                    <div className="col-12 col-md-6 col-lg-7">
                        <article className="card coach_card2 mx-auto">
                            <div className="card-header coach_card_header" style={{ textAlign: 'center' }}>
                                <h5 className="class_h5 mb-0"> Horario de Clases </h5>
                            </div>
                            <div className="card-body p-2 p-md-3">
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
                                                <td> Tenis - 10:00 AM <br /><hr /> Tenis - 15:00 PM </td>
                                                <td> Tenis - 19:00 PM <br /><hr /> Tenis - 20:00 PM </td>
                                                <td> Tenis - 15:00 PM <br /><hr /> Tenis - 17:00 PM </td>
                                                <td> Tenis - 10:00 AM <br /><hr /> Tenis - 15:00 PM </td>
                                                <td>  </td>
                                                <td> Tenis - 11:00 AM </td>
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