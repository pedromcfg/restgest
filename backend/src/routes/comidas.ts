import express from 'express';
import { body, validationResult } from 'express-validator';
import Comida from '../models/Comida';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Get all comidas
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const comidas = await Comida.find().sort({ createdAt: -1 });
    res.json(comidas);
  } catch (error) {
    console.error('Get comidas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comida by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const comida = await Comida.findById(req.params.id);
    if (!comida) {
      return res.status(404).json({ message: 'Comida not found' });
    }
    res.json(comida);
  } catch (error) {
    console.error('Get comida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comida
router.post('/', authenticateToken, upload.single('imagem'), [
  body('nome').notEmpty().withMessage('Nome is required'),
  body('quantidade').isNumeric().withMessage('Quantidade must be a number'),
  body('unidade').isIn(['kg', 'g', 'unidades']).withMessage('Invalid unidade'),
  body('dataValidade').isISO8601().withMessage('Invalid date format'),
  body('tipo').isIn(['Perecível', 'Não Perecível']).withMessage('Invalid tipo')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, quantidade, unidade, dataValidade, tipo } = req.body;
    const imagem = req.file ? req.file.filename : undefined;

    const comida = new Comida({
      nome,
      quantidade: parseFloat(quantidade),
      unidade,
      dataValidade: new Date(dataValidade),
      tipo,
      imagem
    });

    await comida.save();
    res.status(201).json(comida);
  } catch (error) {
    console.error('Create comida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comida
router.put('/:id', authenticateToken, upload.single('imagem'), [
  body('nome').optional().notEmpty().withMessage('Nome cannot be empty'),
  body('quantidade').optional().isNumeric().withMessage('Quantidade must be a number'),
  body('unidade').optional().isIn(['kg', 'g', 'unidades']).withMessage('Invalid unidade'),
  body('dataValidade').optional().isISO8601().withMessage('Invalid date format'),
  body('tipo').optional().isIn(['Perecível', 'Não Perecível']).withMessage('Invalid tipo')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, quantidade, unidade, dataValidade, tipo, disponivel } = req.body;
    const updateData: any = {};

    if (nome) updateData.nome = nome;
    if (quantidade !== undefined) updateData.quantidade = parseFloat(quantidade);
    if (unidade) updateData.unidade = unidade;
    if (dataValidade) updateData.dataValidade = new Date(dataValidade);
    if (tipo) updateData.tipo = tipo;
    if (disponivel !== undefined) updateData.disponivel = disponivel;
    if (req.file) updateData.imagem = req.file.filename;

    const comida = await Comida.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!comida) {
      return res.status(404).json({ message: 'Comida not found' });
    }

    res.json(comida);
  } catch (error) {
    console.error('Update comida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comida
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const comida = await Comida.findByIdAndDelete(req.params.id);
    if (!comida) {
      return res.status(404).json({ message: 'Comida not found' });
    }
    res.json({ message: 'Comida deleted successfully' });
  } catch (error) {
    console.error('Delete comida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
