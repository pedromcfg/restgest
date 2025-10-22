import express from 'express';
import { body, validationResult } from 'express-validator';
import Student from '../models/Student';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all students
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const students = await Student.find().sort({ nome: 1 });
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students by turma
router.get('/turma/:turma', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { turma } = req.params;
    if (!['R1', 'R2', 'R3'].includes(turma)) {
      return res.status(400).json({ message: 'Invalid turma' });
    }
    
    const students = await Student.find({ turma }).sort({ nome: 1 });
    res.json(students);
  } catch (error) {
    console.error('Get students by turma error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student
router.post('/', authenticateToken, [
  body('nome').notEmpty().withMessage('Nome is required'),
  body('numero').notEmpty().withMessage('Numero is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('turma').isIn(['R1', 'R2', 'R3']).withMessage('Invalid turma')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, numero, email, turma } = req.body;

    // Check if student number already exists
    const existingStudent = await Student.findOne({ numero });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student number already exists' });
    }

    const student = new Student({
      nome,
      numero,
      email,
      turma
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', authenticateToken, [
  body('nome').optional().notEmpty().withMessage('Nome cannot be empty'),
  body('numero').optional().notEmpty().withMessage('Numero cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('turma').optional().isIn(['R1', 'R2', 'R3']).withMessage('Invalid turma')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, numero, email, turma } = req.body;
    const updateData: any = {};

    if (nome) updateData.nome = nome;
    if (numero) updateData.numero = numero;
    if (email) updateData.email = email;
    if (turma) updateData.turma = turma;

    // Check if new numero already exists (excluding current student)
    if (numero) {
      const existingStudent = await Student.findOne({ 
        numero, 
        _id: { $ne: req.params.id } 
      });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student number already exists' });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
