// src/components/admin/ManagementTable.jsx
import React from 'react';
import { Card, Table, Spinner, Row, Col } from 'react-bootstrap';
import '../../assets/css/DashboardAdmin.css';

const ManagementTable = ({ 
    title, 
    icon, 
    columns, 
    data, 
    loading, 
    renderRow, 
    emptyMessage = "No se encontraron registros.",
    instructions = [] 
}) => {
    return (
        <>
            <Row className="mb-4">
                <Col xs={12}>
                    <Card as="article" className="class_card1 w-100" style={{ maxWidth: '100%' }}>
                        <Card.Header className="class_card_header">
                            <h5 className="class_h5 mb-0">
                                <i className={`fas ${icon} me-2`}></i> {title}
                            </h5>
                        </Card.Header>
                        
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">Cargando datos...</p>
                                </div>
                            ) : (
                                <div className="table-responsive class_table-responsive m-0" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <Table hover className="align-middle text-center mb-0">
                                        <thead className="class_table_head" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr>
                                                {columns.map((col, index) => (
                                                    <th key={index}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="class_tbody">
                                            {data && data.length > 0 ? (
                                                data.map((item, index) => renderRow(item, index))
                                            ) : (
                                                <tr>
                                                    <td colSpan={columns.length} className="text-center py-4">
                                                        {emptyMessage}
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
            
            {instructions.length > 0 && (
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
                                    {instructions.map((inst, index) => (
                                        <li 
                                            key={index} 
                                            className={`list-group-item bg-transparent px-0 border-0 ${index === 0 ? 'pt-0' : ''} ${index === instructions.length - 1 ? 'pb-0' : ''}`}
                                        >
                                            <strong>{index + 1}. {inst.title}:</strong> {inst.text}
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ManagementTable;