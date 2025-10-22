import mongoose, { Document, Schema } from 'mongoose';

export interface IBebida extends Document {
  nome: string;
  quantidade: number;
  unidade: 'L' | 'cl' | 'ml';
  dataValidade: Date;
  tipo: 'Com Álcool' | 'Sem Álcool';
  imagem?: string;
  disponivel: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BebidaSchema = new Schema<IBebida>({
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
    enum: ['L', 'cl', 'ml'],
    required: true
  },
  dataValidade: {
    type: Date,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Com Álcool', 'Sem Álcool'],
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

export default mongoose.model<IBebida>('Bebida', BebidaSchema);
