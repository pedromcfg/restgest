import express from 'express';
import { body, validationResult } from 'express-validator';
import Quebra from '../models/Quebra';
import Service from '../models/Service';
import Comida from '../models/Comida';
import Bebida from '../models/Bebida';
import MaterialSala from '../models/MaterialSala';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all quebras
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const quebras = await Quebra.find()
      .populate('service', 'nome data')
      .populate('comidas.item', 'nome quantidade unidade')
      .populate('bebidas.item', 'nome quantidade unidade')
      .populate('materiais.item', 'nome quantidade categoria')
      .sort({ data: -1 });
    res.json(quebras);
  } catch (error) {
    console.error('Get quebras error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quebra by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const quebra = await Quebra.findById(req.params.id)
      .populate('service', 'nome data')
      .populate('comidas.item', 'nome quantidade unidade')
      .populate('bebidas.item', 'nome quantidade unidade')
      .populate('materiais.item', 'nome quantidade categoria');
    if (!quebra) {
      return res.status(404).json({ message: 'Quebra not found' });
    }
    res.json(quebra);
  } catch (error) {
    console.error('Get quebra error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create quebra
router.post('/', authenticateToken, [
  body('service').isMongoId().withMessage('Invalid service ID'),
  body('comidas').optional().isArray().withMessage('Comidas must be an array'),
  body('bebidas').optional().isArray().withMessage('Bebidas must be an array'),
  body('materiais').optional().isArray().withMessage('Materiais must be an array')
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { service, comidas = [], bebidas = [], materiais = [] } = req.body;

    // Verify service exists
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(400).json({ message: 'Service not found' });
    }

    // Validate and update inventory
    const updates = [];

    // Process comidas
    for (const comidaQuebra of comidas) {
      const comida = await Comida.findById(comidaQuebra.item);
      if (!comida) {
        return res.status(400).json({ message: `Comida ${comidaQuebra.item} not found` });
      }

      if (comidaQuebra.usarTudo) {
        comida.disponivel = false;
        updates.push(comida.save());
      } else {
        if (comida.quantidade < comidaQuebra.quantidade) {
          return res.status(400).json({ 
            message: `Insufficient quantity for ${comida.nome}` 
          });
        }
        comida.quantidade -= comidaQuebra.quantidade;
        if (comida.quantidade === 0) {
          comida.disponivel = false;
        }
        updates.push(comida.save());
      }
    }

    // Process bebidas
    for (const bebidaQuebra of bebidas) {
      const bebida = await Bebida.findById(bebidaQuebra.item);
      if (!bebida) {
        return res.status(400).json({ message: `Bebida ${bebidaQuebra.item} not found` });
      }

      if (bebidaQuebra.usarTudo) {
        bebida.disponivel = false;
        updates.push(bebida.save());
      } else {
        if (bebida.quantidade < bebidaQuebra.quantidade) {
          return res.status(400).json({ 
            message: `Insufficient quantity for ${bebida.nome}` 
          });
        }
        bebida.quantidade -= bebidaQuebra.quantidade;
        if (bebida.quantidade === 0) {
          bebida.disponivel = false;
        }
        updates.push(bebida.save());
      }
    }

    // Process materiais
    for (const materialQuebra of materiais) {
      const material = await MaterialSala.findById(materialQuebra.item);
      if (!material) {
        return res.status(400).json({ message: `Material ${materialQuebra.item} not found` });
      }

      if (materialQuebra.usarTudo) {
        material.disponivel = false;
        updates.push(material.save());
      } else {
        if (material.quantidade < materialQuebra.quantidade) {
          return res.status(400).json({ 
            message: `Insufficient quantity for ${material.nome}` 
          });
        }
        material.quantidade -= materialQuebra.quantidade;
        if (material.quantidade === 0) {
          material.disponivel = false;
        }
        updates.push(material.save());
      }
    }

    // Wait for all inventory updates
    await Promise.all(updates);

    // Create quebra
    const quebra = new Quebra({
      service,
      comidas,
      bebidas,
      materiais
    });

    await quebra.save();
    
    // Populate for response
    await quebra.populate([
      { path: 'service', select: 'nome data' },
      { path: 'comidas.item', select: 'nome quantidade unidade' },
      { path: 'bebidas.item', select: 'nome quantidade unidade' },
      { path: 'materiais.item', select: 'nome quantidade categoria' }
    ]);

    res.status(201).json(quebra);
  } catch (error) {
    console.error('Create quebra error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quebra (restore inventory)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const quebra = await Quebra.findById(req.params.id);
    if (!quebra) {
      return res.status(404).json({ message: 'Quebra not found' });
    }

    // Restore inventory
    const restores = [];

    // Restore comidas
    for (const comidaQuebra of quebra.comidas) {
      const comida = await Comida.findById(comidaQuebra.item);
      if (comida) {
        if (comidaQuebra.usarTudo) {
          comida.disponivel = true;
        } else {
          comida.quantidade += comidaQuebra.quantidade;
          comida.disponivel = true;
        }
        restores.push(comida.save());
      }
    }

    // Restore bebidas
    for (const bebidaQuebra of quebra.bebidas) {
      const bebida = await Bebida.findById(bebidaQuebra.item);
      if (bebida) {
        if (bebidaQuebra.usarTudo) {
          bebida.disponivel = true;
        } else {
          bebida.quantidade += bebidaQuebra.quantidade;
          bebida.disponivel = true;
        }
        restores.push(bebida.save());
      }
    }

    // Restore materiais
    for (const materialQuebra of quebra.materiais) {
      const material = await MaterialSala.findById(materialQuebra.item);
      if (material) {
        if (materialQuebra.usarTudo) {
          material.disponivel = true;
        } else {
          material.quantidade += materialQuebra.quantidade;
          material.disponivel = true;
        }
        restores.push(material.save());
      }
    }

    // Wait for all restores
    await Promise.all(restores);

    // Delete quebra
    await Quebra.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quebra deleted and inventory restored successfully' });
  } catch (error) {
    console.error('Delete quebra error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
