import express from 'express';
import { body, validationResult } from 'express-validator';
import Bebida from '../models/Bebida';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Get all bebidas
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const bebidas = await Bebida.find().sort({ createdAt: -1 });
    res.json(bebidas);
  } catch (error) {
    console.error('Get bebidas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bebida by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const bebida = await Bebida.findById(req.params.id);
    if (!bebida) {
      return res.status(404).json({ message: 'Bebida not found' });
    }
    res.json(bebida);
  } catch (error) {
    console.error('Get bebida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create bebida
router.post('/', authenticateToken, upload.single('imagem'), [
  body('nome').notEmpty().withMessage('Nome is required'),
  body('quantidade').isNumeric().withMessage('Quantidade must be a number'),
  body('unidade').isIn(['L', 'cl', 'ml']).withMessage('Invalid unidade'),
  body('dataValidade').isISO8601().withMessage('Invalid date format'),
  body('tipo').isIn(['Com Álcool', 'Sem Álcool']).withMessage('Invalid tipo')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, quantidade, unidade, dataValidade, tipo } = req.body;
    const imagem = req.file ? req.file.filename : undefined;

    const bebida = new Bebida({
      nome,
      quantidade: parseFloat(quantidade),
      unidade,
      dataValidade: new Date(dataValidade),
      tipo,
      imagem
    });

    await bebida.save();
    res.status(201).json(bebida);
  } catch (error) {
    console.error('Create bebida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bebida
router.put('/:id', authenticateToken, upload.single('imagem'), [
  body('nome').optional().notEmpty().withMessage('Nome cannot be empty'),
  body('quantidade').optional().isNumeric().withMessage('Quantidade must be a number'),
  body('unidade').optional().isIn(['L', 'cl', 'ml']).withMessage('Invalid unidade'),
  body('dataValidade').optional().isISO8601().withMessage('Invalid date format'),
  body('tipo').optional().isIn(['Com Álcool', 'Sem Álcool']).withMessage('Invalid tipo')
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

    const bebida = await Bebida.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!bebida) {
      return res.status(404).json({ message: 'Bebida not found' });
    }

    res.json(bebida);
  } catch (error) {
    console.error('Update bebida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete bebida
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const bebida = await Bebida.findByIdAndDelete(req.params.id);
    if (!bebida) {
      return res.status(404).json({ message: 'Bebida not found' });
    }
    res.json({ message: 'Bebida deleted successfully' });
  } catch (error) {
    console.error('Delete bebida error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
