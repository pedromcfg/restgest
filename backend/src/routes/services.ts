import express from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service';
import Student from '../models/Student';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all services
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const services = await Service.find()
      .populate('alunos', 'nome numero email turma')
      .sort({ data: -1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('alunos', 'nome numero email turma');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service
router.post('/', authenticateToken, [
  body('nome').notEmpty().withMessage('Nome is required'),
  body('data').isISO8601().withMessage('Invalid date format'),
  body('alunos').isArray().withMessage('Alunos must be an array'),
  body('alunos.*').isMongoId().withMessage('Invalid student ID')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, data, alunos, descricao } = req.body;

    // Verify all students exist
    const existingStudents = await Student.find({ _id: { $in: alunos } });
    if (existingStudents.length !== alunos.length) {
      return res.status(400).json({ message: 'One or more students not found' });
    }

    const service = new Service({
      nome,
      data: new Date(data),
      alunos,
      descricao
    });

    await service.save();
    
    // Populate students for response
    await service.populate('alunos', 'nome numero email turma');
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service
router.put('/:id', authenticateToken, [
  body('nome').optional().notEmpty().withMessage('Nome cannot be empty'),
  body('data').optional().isISO8601().withMessage('Invalid date format'),
  body('alunos').optional().isArray().withMessage('Alunos must be an array'),
  body('alunos.*').optional().isMongoId().withMessage('Invalid student ID')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, data, alunos, descricao } = req.body;
    const updateData: any = {};

    if (nome) updateData.nome = nome;
    if (data) updateData.data = new Date(data);
    if (alunos) {
      // Verify all students exist
      const existingStudents = await Student.find({ _id: { $in: alunos } });
      if (existingStudents.length !== alunos.length) {
        return res.status(400).json({ message: 'One or more students not found' });
      }
      updateData.alunos = alunos;
    }
    if (descricao !== undefined) updateData.descricao = descricao;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('alunos', 'nome numero email turma');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
