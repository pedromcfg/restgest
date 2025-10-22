import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Tabs, Table, Modal, Form, Alert } from 'react-bootstrap';
import { Student } from '../types';
import { studentsAPI } from '../services/api';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    numero: '',
    email: '',
    turma: 'R1' as 'R1' | 'R2' | 'R3'
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (err) {
      setError('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setFormData({
      nome: '',
      numero: '',
      email: '',
      turma: 'R1'
    });
    setShowModal(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nome: student.nome,
      numero: student.numero,
      email: student.email,
      turma: student.turma
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que quer eliminar este aluno?')) {
      try {
        await studentsAPI.delete(id);
        setStudents(students.filter(s => s._id !== id));
      } catch (err) {
        setError('Erro ao eliminar aluno');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent._id, formData);
        const updatedStudents = students.map(s => 
          s._id === editingStudent._id ? { ...s, ...formData } : s
        );
        setStudents(updatedStudents);
      } else {
        const response = await studentsAPI.create(formData);
        setStudents([...students, response.data]);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao guardar aluno');
    }
  };

  const getStudentsByTurma = (turma: string) => {
    return students.filter(s => s.turma === turma).sort((a, b) => a.nome.localeCompare(b.nome));
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
            <i className="fas fa-users me-2"></i>
            Gestão de Alunos
          </h2>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={handleCreate}>
            <i className="fas fa-plus me-1"></i>
            Adicionar Aluno
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="R1" className="mb-3">
        {['R1', 'R2', 'R3'].map(turma => (
          <Tab key={turma} eventKey={turma} title={`Turma ${turma}`}>
            <Card>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Número</th>
                      <th>Email</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getStudentsByTurma(turma).map(student => (
                      <tr key={student._id}>
                        <td>{student.nome}</td>
                        <td>{student.numero}</td>
                        <td>{student.email}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(student)}
                            className="me-1"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(student._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {getStudentsByTurma(turma).length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          Nenhum aluno nesta turma
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        ))}
      </Tabs>

      {/* Modal for create/edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingStudent ? 'Editar Aluno' : 'Adicionar Aluno'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
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
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Turma</Form.Label>
                  <Form.Select
                    value={formData.turma}
                    onChange={(e) => setFormData({ ...formData, turma: e.target.value as 'R1' | 'R2' | 'R3' })}
                  >
                    <option value="R1">R1</option>
                    <option value="R2">R2</option>
                    <option value="R3">R3</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingStudent ? 'Guardar Alterações' : 'Adicionar Aluno'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Students;
