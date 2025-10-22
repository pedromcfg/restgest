import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Tab, Tabs, Table, Badge } from 'react-bootstrap';
import { Service, Comida, Bebida, MaterialSala } from '../types';
import { comidasAPI, bebidasAPI, materialSalaAPI, quebrasAPI } from '../services/api';

interface QuebrasModalProps {
  show: boolean;
  onHide: () => void;
  service: Service;
  onQuebraCreated: () => void;
}

const QuebrasModal: React.FC<QuebrasModalProps> = ({ 
  show, 
  onHide, 
  service, 
  onQuebraCreated 
}) => {
  const [comidas, setComidas] = useState<Comida[]>([]);
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [materiais, setMateriais] = useState<MaterialSala[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState<{
    comidas: Array<{ item: string; quantidade: number; usarTudo: boolean }>;
    bebidas: Array<{ item: string; quantidade: number; usarTudo: boolean }>;
    materiais: Array<{ item: string; quantidade: number; usarTudo: boolean }>;
  }>({
    comidas: [],
    bebidas: [],
    materiais: []
  });

  useEffect(() => {
    if (show) {
      loadInventory();
    }
  }, [show]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const [comidasRes, bebidasRes, materiaisRes] = await Promise.all([
        comidasAPI.getAll(),
        bebidasAPI.getAll(),
        materialSalaAPI.getAll()
      ]);
      setComidas(comidasRes.data.filter((c: Comida) => c.disponivel));
      setBebidas(bebidasRes.data.filter((b: Bebida) => b.disponivel));
      setMateriais(materiaisRes.data.filter((m: MaterialSala) => m.disponivel));
    } catch (err) {
      setError('Erro ao carregar inventário');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (type: 'comidas' | 'bebidas' | 'materiais', itemId: string) => {
    setSelectedItems(prev => {
      const currentItems = prev[type];
      const existingIndex = currentItems.findIndex(item => item.item === itemId);
      
      if (existingIndex >= 0) {
        // Remove item
        return {
          ...prev,
          [type]: currentItems.filter(item => item.item !== itemId)
        };
      } else {
        // Add item
        return {
          ...prev,
          [type]: [...currentItems, { item: itemId, quantidade: 1, usarTudo: false }]
        };
      }
    });
  };

  const updateQuantity = (type: 'comidas' | 'bebidas' | 'materiais', itemId: string, quantidade: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.item === itemId ? { ...item, quantidade } : item
      )
    }));
  };

  const toggleUsarTudo = (type: 'comidas' | 'bebidas' | 'materiais', itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.item === itemId ? { ...item, usarTudo: !item.usarTudo } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const quebraData = {
        service: service._id,
        comidas: selectedItems.comidas,
        bebidas: selectedItems.bebidas,
        materiais: selectedItems.materiais
      };

      await quebrasAPI.create(quebraData);
      onQuebraCreated();
      onHide();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar quebra');
    } finally {
      setLoading(false);
    }
  };

  // Funções auxiliares removidas - não utilizadas no componente atual

  const renderItemsTable = (type: 'comidas' | 'bebidas' | 'materiais', items: (Comida | Bebida | MaterialSala)[]) => {
    return (
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Selecionar</th>
            <th>Nome</th>
            <th>Disponível</th>
            <th>Quantidade</th>
            <th>Usar Tudo</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const selectedItem = selectedItems[type].find(si => si.item === item._id);
            return (
              <tr key={item._id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={!!selectedItem}
                    onChange={() => toggleItem(type, item._id)}
                  />
                </td>
                <td>{item.nome}</td>
                <td>
                  <Badge bg="success">
                    {item.quantidade} {'unidade' in item ? item.unidade : 'unidades'}
                  </Badge>
                </td>
                <td>
                  {selectedItem && (
                    <Form.Control
                      type="number"
                      min="1"
                      max={item.quantidade}
                      value={selectedItem.quantidade}
                      onChange={(e) => updateQuantity(type, item._id, parseInt(e.target.value) || 1)}
                      disabled={selectedItem.usarTudo}
                    />
                  )}
                </td>
                <td>
                  {selectedItem && (
                    <Form.Check
                      type="checkbox"
                      checked={selectedItem.usarTudo}
                      onChange={() => toggleUsarTudo(type, item._id)}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-utensils me-2"></i>
          Registar Quebras - {service.nome}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Tabs defaultActiveKey="comidas" className="mb-3">
            <Tab eventKey="comidas" title="Comidas">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                renderItemsTable('comidas', comidas)
              )}
            </Tab>
            
            <Tab eventKey="bebidas" title="Bebidas">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                renderItemsTable('bebidas', bebidas)
              )}
            </Tab>
            
            <Tab eventKey="materiais" title="Materiais">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                renderItemsTable('materiais', materiais)
              )}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'A registar...' : 'Registar Quebras'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default QuebrasModal;
