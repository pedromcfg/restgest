import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterialSala extends Document {
  nome: string;
  quantidade: number;
  categoria: 'cozinha' | 'sala' | 'bar' | 'limpeza' | 'outros';
  imagem?: string;
  disponivel: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSalaSchema = new Schema<IMaterialSala>({
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
  categoria: {
    type: String,
    enum: ['cozinha', 'sala', 'bar', 'limpeza', 'outros'],
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

export default mongoose.model<IMaterialSala>('MaterialSala', MaterialSalaSchema);
