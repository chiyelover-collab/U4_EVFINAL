
const API_URL = "http://localhost:3000/api/users";
const API_URL_RESERVATIONS = "http://localhost:3000/api/reservations";

export const getCurrentUser = () => {
    try {
        const sessionData = localStorage.getItem('user');
        if (!sessionData) return null;

        const usuario = JSON.parse(sessionData);


        return {
            full_name: usuario.full_name || "Usuario",
            email: usuario.email || "sin-correo@correo.com",
            edad: usuario.age || usuario.edad || "25",
            objetivos: Array.isArray(usuario.objectives) 
                ? usuario.objectives 
                : (usuario.objectives ? usuario.objectives.split(',') : ["Perder peso", "Ganar músculo", "Mejorar resistencia"]),
            avatar_url: usuario.avatar_url || usuario.foto || null
        };
    } catch (error) {
        console.error("Error leyendo los datos del usuario:", error);
        return null;
    }
};

const getToken = () => localStorage.getItem('token'); 

export const getMyReservations = async () => {
    try {
        const response = await fetch(`${API_URL_RESERVATIONS}/my-reservations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error("Error al obtener las reservas");
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo reservas:", error);
        return null;
    }
};

export const createReservation = async (class_schedule_id) => {
    try {
        const response = await fetch(API_URL_RESERVATIONS, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ class_schedule_id })
        });
        if (!response.ok) throw new Error("Error al crear la reserva");
        return await response.json();
    } catch (error) {
        console.error("Error creando reserva:", error);
        return null;
    }
};

export const cancelReservation = async (id) => {
    try {
        const response = await fetch(`${API_URL_RESERVATIONS}/${id}/cancel`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error("Error al cancelar la reserva");
        return await response.json();
    } catch (error) {
        console.error("Error cancelando reserva:", error);
        return null;
    }
};