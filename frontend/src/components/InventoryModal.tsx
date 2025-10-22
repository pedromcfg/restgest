import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Comida, Bebida, MaterialSala } from '../types';

interface InventoryModalProps {
  show: boolean;
  onHide: () => void;
  type: 'comida' | 'bebida' | 'material';
  item?: Comida | Bebida | MaterialSala | null;
  onSave: (data: any) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ 
  show, 
  onHide, 
  type, 
  item, 
  onSave 
}) => {
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        nome: item.nome,
        quantidade: item.quantidade,
        unidade: 'unidade' in item ? item.unidade : 'unidades',
        dataValidade: 'dataValidade' in item ? (item.dataValidade ? item.dataValidade.split('T')[0] : '') : '',
        tipo: 'tipo' in item ? item.tipo : 'categoria' in item ? item.categoria : 'Perecível',
        categoria: 'categoria' in item ? item.categoria : 'cozinha',
        imagem: null
      });
    } else {
      setFormData({
        nome: '',
        quantidade: '',
        unidade: type === 'comida' ? 'kg' : type === 'bebida' ? 'L' : 'unidades',
        dataValidade: '',
        tipo: type === 'comida' ? 'Perecível' : type === 'bebida' ? 'Sem Álcool' : 'cozinha',
        categoria: 'cozinha',
        imagem: null
      });
    }
  }, [item, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('quantidade', formData.quantidade.toString());
      formDataToSend.append('unidade', formData.unidade);
      
      if (type !== 'material') {
        formDataToSend.append('dataValidade', formData.dataValidade);
        formDataToSend.append('tipo', formData.tipo);
      } else {
        formDataToSend.append('categoria', formData.categoria);
      }
      
      if (formData.imagem) {
        formDataToSend.append('imagem', formData.imagem);
      }

      await onSave(formDataToSend);
      onHide();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao guardar item');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imagem: e.target.files[0] });
    }
  };

  const getTitle = () => {
    const action = item ? 'Editar' : 'Adicionar';
    const typeName = type === 'comida' ? 'Comida' : type === 'bebida' ? 'Bebida' : 'Material';
    return `${action} ${typeName}`;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{getTitle()}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
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
                <Form.Label>Quantidade</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) || 0 })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Unidade</Form.Label>
                {type === 'comida' ? (
                  <Form.Select
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="unidades">unidades</option>
                  </Form.Select>
                ) : type === 'bebida' ? (
                  <Form.Select
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  >
                    <option value="L">L</option>
                    <option value="cl">cl</option>
                    <option value="ml">ml</option>
                  </Form.Select>
                ) : (
                  <Form.Control
                    type="text"
                    value="unidades"
                    disabled
                  />
                )}
              </Form.Group>
            </Col>
            {type !== 'material' && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Validade</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dataValidade}
                    onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          {type !== 'material' && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  {type === 'comida' ? (
                    <Form.Select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      <option value="Perecível">Perecível</option>
                      <option value="Não Perecível">Não Perecível</option>
                    </Form.Select>
                  ) : (
                    <Form.Select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      <option value="Com Álcool">Com Álcool</option>
                      <option value="Sem Álcool">Sem Álcool</option>
                    </Form.Select>
                  )}
                </Form.Group>
              </Col>
            </Row>
          )}

          {type === 'material' && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  >
                    <option value="cozinha">Cozinha</option>
                    <option value="sala">Sala</option>
                    <option value="bar">Bar</option>
                    <option value="limpeza">Limpeza</option>
                    <option value="outros">Outros</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Imagem (Opcional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'A guardar...' : (item ? 'Guardar Alterações' : 'Adicionar')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InventoryModal;
