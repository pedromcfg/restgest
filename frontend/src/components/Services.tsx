import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Service, Student } from '../types';
import { servicesAPI, studentsAPI } from '../services/api';
import QuebrasModal from './QuebrasModal';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQuebrasModal, setShowQuebrasModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    descricao: '',
    alunos: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, studentsRes] = await Promise.all([
        servicesAPI.getAll(),
        studentsAPI.getAll()
      ]);
      setServices(servicesRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      nome: '',
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      alunos: []
    });
    setShowModal(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      nome: service.nome,
      data: service.data.split('T')[0],
      descricao: service.descricao || '',
      alunos: service.alunos.map(a => a._id)
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que quer eliminar este serviço?')) {
      try {
        await servicesAPI.delete(id);
        setServices(services.filter(s => s._id !== id));
      } catch (err) {
        setError('Erro ao eliminar serviço');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const response = await servicesAPI.update(editingService._id, formData);
        const updatedServices = services.map(s => 
          s._id === editingService._id ? response.data : s
        );
        setServices(updatedServices);
      } else {
        const response = await servicesAPI.create(formData);
        setServices([response.data, ...services]);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao guardar serviço');
    }
  };

  const toggleStudent = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      alunos: prev.alunos.includes(studentId)
        ? prev.alunos.filter(id => id !== studentId)
        : [...prev.alunos, studentId]
    }));
  };

  const handleQuebras = (service: Service) => {
    setSelectedService(service);
    setShowQuebrasModal(true);
  };

  const handleQuebraCreated = () => {
    // Recarregar dados se necessário
    loadData();
  };

  const getStudentsByTurma = (turma: string) => {
    return students.filter(s => s.turma === turma).sort((a, b) => a.nome.localeCompare(b.nome));
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
            <i className="fas fa-calendar-alt me-2"></i>
            Gestão de Serviços
          </h2>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={handleCreate}>
            <i className="fas fa-plus me-1"></i>
            Criar Serviço
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {services.map(service => (
          <Col md={6} lg={4} key={service._id} className="mb-3">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{service.nome}</h5>
                <div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleQuebras(service)}
                    className="me-1"
                  >
                    <i className="fas fa-utensils"></i> Quebras
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="me-1"
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(service._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="mb-2">
                  <i className="fas fa-calendar me-1"></i>
                  <strong>Data:</strong> {formatDate(service.data)}
                </p>
                <p className="mb-2">
                  <i className="fas fa-users me-1"></i>
                  <strong>Alunos:</strong> {service.alunos.length}
                </p>
                {service.descricao && (
                  <p className="mb-2">
                    <i className="fas fa-info-circle me-1"></i>
                    <strong>Descrição:</strong> {service.descricao}
                  </p>
                )}
                <div className="mb-2">
                  <strong>Alunos Participantes:</strong>
                  <div className="mt-1">
                    {service.alunos.map(aluno => (
                      <Badge key={aluno._id} bg="secondary" className="me-1 mb-1">
                        {aluno.nome} ({aluno.turma})
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {services.length === 0 && (
          <Col>
            <Card>
              <Card.Body className="text-center text-muted">
                <i className="fas fa-calendar-alt fa-3x mb-3"></i>
                <p>Nenhum serviço criado ainda</p>
                <Button variant="success" onClick={handleCreate}>
                  Criar Primeiro Serviço
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Modal for create/edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingService ? 'Editar Serviço' : 'Criar Serviço'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Serviço</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descrição (Opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Selecionar Alunos</Form.Label>
              <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {['R1', 'R2', 'R3'].map(turma => (
                  <div key={turma} className="mb-3">
                    <h6 className="text-muted">Turma {turma}</h6>
                    {getStudentsByTurma(turma).map(student => (
                      <Form.Check
                        key={student._id}
                        type="checkbox"
                        id={`student-${student._id}`}
                        label={`${student.nome} (${student.numero})`}
                        checked={formData.alunos.includes(student._id)}
                        onChange={() => toggleStudent(student._id)}
                        className="ms-3"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingService ? 'Guardar Alterações' : 'Criar Serviço'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {selectedService && (
        <QuebrasModal
          show={showQuebrasModal}
          onHide={() => setShowQuebrasModal(false)}
          service={selectedService}
          onQuebraCreated={handleQuebraCreated}
        />
      )}
    </Container>
  );
};

export default Services;
