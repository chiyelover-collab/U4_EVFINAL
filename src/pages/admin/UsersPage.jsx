// src/pages/admin/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserFormModal from '../../components/admin/UserFormModal';
import ManagementTable from '../../components/admin/ManagementTable';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/AdminServices';
import '../../assets/css/DashboardAdmin.css'; 

const UsersPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            const lista = data.data || data; 
            setUsuarios(lista);
            setUsuariosFiltrados(lista);
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la lista de usuarios: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
        document.body.className = "class_body";
        return () => { document.body.className = ""; };
    }, []);

    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);
        
        const filtrados = usuarios.filter(u => 
            u.full_name.toLowerCase().includes(termino) || 
            u.email.toLowerCase().includes(termino)
        );
        setUsuariosFiltrados(filtrados);
    };

    const abrirModalCrear = () => {
        setUsuarioSeleccionado(null);
        setShowModal(true);
    };

    const abrirModalEditar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setUsuarioSeleccionado(null);
    };

    const handleGuardar = async (formData) => {
        try {
            if (usuarioSeleccionado) {
                await updateUser(usuarioSeleccionado.id, formData);
                Swal.fire("¡Actualizado!", "Los datos del usuario han sido modificados.", "success");
            } else {
                await createUser(formData);
                Swal.fire("¡Creado!", "El nuevo usuario ha sido registrado con éxito.", "success");
            }
            cerrarModal();
            cargarUsuarios();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleEliminar = async (id, nombre) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: `Estás a punto de eliminar a ${nombre}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await deleteUser(id);
                Swal.fire("¡Eliminado!", "El usuario ha sido eliminado correctamente.", "success");
                cargarUsuarios();
            } catch (error) {
                Swal.fire("Error al eliminar", error.message, "error");
            }
        }
    };

    const getBadgeColor = (rol) => {
        const rolLower = rol?.toLowerCase() || '';
        if (rolLower === 'admin') return 'danger';
        if (rolLower === 'coach') return 'primary';
        return 'success'; 
    };

    const instrucciones = [
        { title: "Búsqueda", text: "Filtre instantáneamente por nombre o correo desde la barra superior." },
        { title: "Gestión", text: <span>Use los botones de colores para <span className="text-warning fw-bold">Editar</span> o <span className="text-danger fw-bold">Eliminar</span> registros.</span> },
        { title: "Roles", text: "Los badges identifican el nivel de acceso (Admin, Coach, User)." },
        { title: "Seguridad", text: "Al crear un usuario, asegúrese de que las contraseñas coincidan." }
    ];

    return (
        <Container as="main" className="my-4">
            <Row className="mb-4 align-items-center">
                <Col md={8}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white">
                            <i className="fas fa-search"></i>
                        </InputGroup.Text>
                        <Form.Control 
                            type="text" 
                            placeholder="Buscar usuario por nombre o correo..." 
                            value={busqueda}
                            onChange={handleBuscar}
                        />
                    </InputGroup>
                </Col>
                <Col md={4} className="text-end mt-3 mt-md-0">
                    <Button variant="success" onClick={abrirModalCrear}>
                        <i className="fas fa-user-plus me-2"></i> Nuevo Usuario
                    </Button>
                </Col>
            </Row>

            <ManagementTable 
                title="Listado de Usuarios"
                icon="fa-list"
                columns={["ID", "Nombre Completo", "Email", "Rol", "Acciones"]}
                data={usuariosFiltrados}
                loading={loading}
                emptyMessage="No se encontraron usuarios que coincidan con la búsqueda."
                instructions={instrucciones}
                renderRow={(user) => (
                    <tr key={user.id}>
                        <td>{String(user.id).padStart(3, '0')}</td>
                        <td className="text-center fw-bold">{user.full_name}</td>
                        <td className="text-center">{user.email}</td>
                        <td>
                            <Badge bg={getBadgeColor(user.role)}>
                                {user.role}
                            </Badge>
                        </td>
                        <td>
                            <Button 
                                variant="warning" 
                                size="sm" 
                                className="me-2"
                                onClick={() => abrirModalEditar(user)}
                            >
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleEliminar(user.id, user.full_name)}
                            >
                                <i className="fas fa-trash"></i>
                            </Button>
                        </td>
                    </tr>
                )}
            />

            <UserFormModal 
                show={showModal} 
                handleClose={cerrarModal} 
                handleSave={handleGuardar} 
                selectedUser={usuarioSeleccionado} 
            />
        </Container>
    );
};

export default UsersPage;