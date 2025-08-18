import { Schema, model, Types } from "mongoose";

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["rent", "sale", "lease"], required: true },
    category: {
      type: String,
      enum: [
        "bedsitter",
        "1br",
        "2br",
        "3br",
        "airbnb",
        "hotel",
        "office",
        "stall",
      ],
    },
    price: { type: Number, required: true },
    location: {
      city: { type: String },
      estate: { type: String },
      coordinates: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },
    },
    bedrooms: Number,
    bathrooms: Number,
    size: String,
    amenities: [String],
    media: [{ url: String, publicId: String, width: Number, height: Number }],
    description: String,
    lister: { type: Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "live", "archived", "rejected"],
      default: "pending",
    },
    stats: {
      views: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
      inquiries: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

PropertySchema.index({ "location.coordinates": "2dsphere" });
PropertySchema.index({
  title: "text",
  description: "text",
  "location.city": "text",
  "location.estate": "text",
});
PropertySchema.index({ status: 1, price: 1, bedrooms: 1, category: 1 });

export default model("Property", PropertySchema);
