import express from 'express';
import { body, validationResult } from 'express-validator';
import MaterialSala from '../models/MaterialSala';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Get all materials
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const materials = await MaterialSala.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get material by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const material = await MaterialSala.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create material
router.post('/', authenticateToken, upload.single('imagem'), [
  body('nome').notEmpty().withMessage('Nome is required'),
  body('quantidade').isNumeric().withMessage('Quantidade must be a number'),
  body('categoria').isIn(['cozinha', 'sala', 'bar', 'limpeza', 'outros']).withMessage('Invalid categoria')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, quantidade, categoria } = req.body;
    const imagem = req.file ? req.file.filename : undefined;

    const material = new MaterialSala({
      nome,
      quantidade: parseFloat(quantidade),
      categoria,
      imagem
    });

    await material.save();
    res.status(201).json(material);
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update material
router.put('/:id', authenticateToken, upload.single('imagem'), [
  body('nome').optional().notEmpty().withMessage('Nome cannot be empty'),
  body('quantidade').optional().isNumeric().withMessage('Quantidade must be a number'),
  body('categoria').optional().isIn(['cozinha', 'sala', 'bar', 'limpeza', 'outros']).withMessage('Invalid categoria')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, quantidade, categoria, disponivel } = req.body;
    const updateData: any = {};

    if (nome) updateData.nome = nome;
    if (quantidade !== undefined) updateData.quantidade = parseFloat(quantidade);
    if (categoria) updateData.categoria = categoria;
    if (disponivel !== undefined) updateData.disponivel = disponivel;
    if (req.file) updateData.imagem = req.file.filename;

    const material = await MaterialSala.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete material
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const material = await MaterialSala.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
