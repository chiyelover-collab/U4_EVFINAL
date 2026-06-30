import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, InputGroup, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserFormModal from '../../components/admin/UserFormModal';
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

            <Row className="mb-4">
                <Col xs={12}>
                    <Card as="article" className="class_card1 w-100" style={{ maxWidth: '100%' }}>
                        <Card.Header className="class_card_header">
                            <h5 className="class_h5 mb-0">
                                <i className="fas fa-list me-2"></i> Listado de Usuarios
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">Cargando usuarios...</p>
                                </div>
                            ) : (
                                <div 
                                    className="table-responsive class_table-responsive m-0"
                                    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
                                >
                                    <Table hover className="align-middle text-center mb-0">
                                        <thead className="class_table_head" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre Completo</th>
                                                <th>Email</th>
                                                <th>Rol</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="class_tbody">
                                            {usuariosFiltrados.length > 0 ? (
                                                usuariosFiltrados.map((user) => (
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
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-4">
                                                        No se encontraron usuarios que coincidan con la búsqueda.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col xs={12}>
                    <Card as="aside" className="class_card1 w-100" style={{ maxWidth: '100%' }}>
                        <Card.Header className="class_card_header">
                            <h5 className="class_h5 mb-0">
                                <i className="fas fa-info-circle me-2"></i> Instrucciones de Uso
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-group list-group-flush class_list1">
                                <li className="list-group-item bg-transparent px-0 border-0 pt-0">
                                    <strong>1. Búsqueda:</strong> Filtre instantáneamente por nombre o correo desde la barra superior.
                                </li>
                                <li className="list-group-item bg-transparent px-0 border-0">
                                    <strong>2. Gestión:</strong> Use los botones de colores para <span className="text-warning fw-bold">Editar</span> o <span class="text-danger fw-bold">Eliminar</span> registros.
                                </li>
                                <li className="list-group-item bg-transparent px-0 border-0">
                                    <strong>3. Roles:</strong> Los badges identifican el nivel de acceso (Admin, Coach, User).
                                </li>
                                <li className="list-group-item bg-transparent px-0 border-0 pb-0">
                                    <strong>4. Seguridad:</strong> Al crear un usuario, asegúrese de que las contraseñas coincidan.
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


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