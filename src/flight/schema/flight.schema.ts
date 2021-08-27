import { Schema } from 'mongoose';
import { PassengerModel } from 'src/common/models/models';

export const FlightSchema = new Schema(
  {
    pilot: {
      type: String,
      required: true,
    },
    airplane: { type: String, required: true },
    destinationCity: { type: String, required: true },
    flightDate: {
      type: Date,
      required: true,
    },
    passengers: [
      {
        type: Schema.Types.ObjectId,
        ref: PassengerModel.name,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
