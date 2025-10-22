import mongoose, { Document, Schema } from 'mongoose';

export interface IComida extends Document {
  nome: string;
  quantidade: number;
  unidade: 'kg' | 'g' | 'unidades';
  dataValidade: Date;
  tipo: 'Perecível' | 'Não Perecível';
  imagem?: string;
  disponivel: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ComidaSchema = new Schema<IComida>({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  quantidade: {
    type: Number,
    required: true,
    min: 0
  },
  unidade: {
    type: String,
    enum: ['kg', 'g', 'unidades'],
    required: true
  },
  dataValidade: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Perecível', 'Não Perecível'],
    required: true
  },
  imagem: {
    type: String,
    default: null
  },
  disponivel: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IComida>('Comida', ComidaSchema);
