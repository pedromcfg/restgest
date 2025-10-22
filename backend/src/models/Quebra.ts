import mongoose, { Document, Schema } from 'mongoose';

export interface IQuebra extends Document {
  service: mongoose.Types.ObjectId;
  comidas: Array<{
    item: mongoose.Types.ObjectId;
    quantidade: number;
    usarTudo: boolean;
  }>;
  bebidas: Array<{
    item: mongoose.Types.ObjectId;
    quantidade: number;
    usarTudo: boolean;
  }>;
  materiais: Array<{
    item: mongoose.Types.ObjectId;
    quantidade: number;
    usarTudo: boolean;
  }>;
  data: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuebraSchema = new Schema<IQuebra>({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  comidas: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Comida',
      required: true
    },
    quantidade: {
      type: Number,
      required: true,
      min: 0
    },
    usarTudo: {
      type: Boolean,
      default: false
    }
  }],
  bebidas: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Bebida',
      required: true
    },
    quantidade: {
      type: Number,
      required: true,
      min: 0
    },
    usarTudo: {
      type: Boolean,
      default: false
    }
  }],
  materiais: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'MaterialSala',
      required: true
    },
    quantidade: {
      type: Number,
      required: true,
      min: 0
    },
    usarTudo: {
      type: Boolean,
      default: false
    }
  }],
  data: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuebra>('Quebra', QuebraSchema);
