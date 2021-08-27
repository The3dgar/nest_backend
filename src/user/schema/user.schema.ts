import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
