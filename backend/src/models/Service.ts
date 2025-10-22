import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  nome: string;
  data: Date;
  alunos: mongoose.Types.ObjectId[];
  descricao?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  data: {
    type: Date,
    required: true
  },
  alunos: [{
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }],
  descricao: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.model<IService>('Service', ServiceSchema);
