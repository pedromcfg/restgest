import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  nome: string;
  numero: string;
  email: string;
  turma: 'R1' | 'R2' | 'R3';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  numero: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  turma: {
    type: String,
    enum: ['R1', 'R2', 'R3'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IStudent>('Student', StudentSchema);
