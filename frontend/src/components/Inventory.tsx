import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Tabs, Badge, Alert } from 'react-bootstrap';
import { Comida, Bebida, MaterialSala } from '../types';
import { comidasAPI, bebidasAPI, materialSalaAPI } from '../services/api';
import InventoryModal from './InventoryModal';

const Inventory: React.FC = () => {
  const [comidas, setComidas] = useState<Comida[]>([]);
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [materiais, setMateriais] = useState<MaterialSala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'comida' | 'bebida' | 'material'>('comida');
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [comidasRes, bebidasRes, materiaisRes] = await Promise.all([
        comidasAPI.getAll(),
        bebidasAPI.getAll(),
        materialSalaAPI.getAll()
      ]);
      setComidas(comidasRes.data);
      setBebidas(bebidasRes.data);
      setMateriais(materiaisRes.data);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (type: 'comida' | 'bebida' | 'material') => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any, type: 'comida' | 'bebida' | 'material') => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (modalType === 'comida') {
        if (editingItem) {
          const response = await comidasAPI.update(editingItem._id, formData);
          setComidas(comidas.map(c => c._id === editingItem._id ? response.data : c));
        } else {
          const response = await comidasAPI.create(formData);
          setComidas([response.data, ...comidas]);
        }
      } else if (modalType === 'bebida') {
        if (editingItem) {
          const response = await bebidasAPI.update(editingItem._id, formData);
          setBebidas(bebidas.map(b => b._id === editingItem._id ? response.data : b));
        } else {
          const response = await bebidasAPI.create(formData);
          setBebidas([response.data, ...bebidas]);
        }
      } else {
        if (editingItem) {
          const response = await materialSalaAPI.update(editingItem._id, formData);
          setMateriais(materiais.map(m => m._id === editingItem._id ? response.data : m));
        } else {
          const response = await materialSalaAPI.create(formData);
          setMateriais([response.data, ...materiais]);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id: string, type: 'comida' | 'bebida' | 'material') => {
    if (window.confirm('Tem a certeza que quer eliminar este item?')) {
      try {
        if (type === 'comida') {
          await comidasAPI.delete(id);
          setComidas(comidas.filter(c => c._id !== id));
        } else if (type === 'bebida') {
          await bebidasAPI.delete(id);
          setBebidas(bebidas.filter(b => b._id !== id));
        } else {
          await materialSalaAPI.delete(id);
          setMateriais(materiais.filter(m => m._id !== id));
        }
      } catch (err) {
        setError('Erro ao eliminar item');
      }
    }
  };

  const getStatusBadge = (item: any) => {
    if (!item.disponivel) {
      return <Badge bg="danger">Indisponível</Badge>;
    }
    if (item.dataValidade) {
      const today = new Date();
      const validade = new Date(item.dataValidade);
      const diffDays = Math.ceil((validade.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays < 0) {
        return <Badge bg="danger">Expirado</Badge>;
      } else if (diffDays <= 3) {
        return <Badge bg="warning">Expira em {diffDays} dias</Badge>;
      }
    }
    return <Badge bg="success">Disponível</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="fas fa-boxes me-2"></i>
            Gestão de Inventário
          </h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="comidas" className="mb-3">
        <Tab eventKey="comidas" title="Comidas">
          <Row className="mb-3">
            <Col>
              <Button variant="success" onClick={() => handleCreate('comida')}>
                <i className="fas fa-plus me-1"></i>
                Adicionar Comida
              </Button>
            </Col>
          </Row>
          <Row>
            {comidas.map((comida) => (
              <Col md={6} lg={4} key={comida._id} className="mb-3">
                <Card>
                  {comida.imagem && (
                    <Card.Img 
                      variant="top" 
                      src={`http://localhost:3001/uploads/${comida.imagem}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{comida.nome}</Card.Title>
                    <Card.Text>
                      <strong>Quantidade:</strong> {comida.quantidade} {comida.unidade}<br />
                      <strong>Tipo:</strong> {comida.tipo}<br />
                      <strong>Validade:</strong> {formatDate(comida.dataValidade)}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      {getStatusBadge(comida)}
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(comida, 'comida')}
                          className="me-1"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(comida._id, 'comida')}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="bebidas" title="Bebidas">
          <Row className="mb-3">
            <Col>
              <Button variant="success" onClick={() => handleCreate('bebida')}>
                <i className="fas fa-plus me-1"></i>
                Adicionar Bebida
              </Button>
            </Col>
          </Row>
          <Row>
            {bebidas.map((bebida) => (
              <Col md={6} lg={4} key={bebida._id} className="mb-3">
                <Card>
                  {bebida.imagem && (
                    <Card.Img 
                      variant="top" 
                      src={`http://localhost:3001/uploads/${bebida.imagem}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{bebida.nome}</Card.Title>
                    <Card.Text>
                      <strong>Quantidade:</strong> {bebida.quantidade} {bebida.unidade}<br />
                      <strong>Tipo:</strong> {bebida.tipo}<br />
                      <strong>Validade:</strong> {formatDate(bebida.dataValidade)}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      {getStatusBadge(bebida)}
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(bebida, 'bebida')}
                          className="me-1"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(bebida._id, 'bebida')}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="materiais" title="Materiais">
          <Row className="mb-3">
            <Col>
              <Button variant="success" onClick={() => handleCreate('material')}>
                <i className="fas fa-plus me-1"></i>
                Adicionar Material
              </Button>
            </Col>
          </Row>
          <Row>
            {materiais.map((material) => (
              <Col md={6} lg={4} key={material._id} className="mb-3">
                <Card>
                  {material.imagem && (
                    <Card.Img 
                      variant="top" 
                      src={`http://localhost:3001/uploads/${material.imagem}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{material.nome}</Card.Title>
                    <Card.Text>
                      <strong>Quantidade:</strong> {material.quantidade} unidades<br />
                      <strong>Categoria:</strong> {material.categoria}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      {getStatusBadge(material)}
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(material, 'material')}
                          className="me-1"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(material._id, 'material')}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>

      <InventoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type={modalType}
        item={editingItem}
        onSave={handleSave}
      />
    </Container>
  );
};

export default Inventory;
