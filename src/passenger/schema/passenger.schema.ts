import { Schema } from 'mongoose';

export const PassengerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

PassengerSchema.index({ email: 1 }, { unique: true });
