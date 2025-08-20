import { Schema, model, Types } from "mongoose";

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },

    // Whether property is for rent, sale, or lease
    transactionType: {
      type: String,
      enum: ["rent", "sale", "lease"],
      required: true,
    },

    // Residential, Commercial, Land
    purpose: {
      type: String,
      enum: ["residential", "commercial", "land"],
      required: true,
    },

    // More specific type of property depending on purpose
    category: {
      type: String,
      enum: [
        // Residential
        "bedsitter",
        "1br",
        "2br",
        "3br",
        "apartment",
        "house",
        "airbnb",
        "hotel",

        // Commercial
        "office",
        "stall",
        "shop",
        "warehouse",
        "empty_space",
        "building",

        // Land
        "plot",
        "agricultural",
        "industrial",
        "other",
      ],
      required: true,
    },

    price: { type: Number, required: true },

    location: {
      city: { type: String },
      estate: { type: String },
      address: { type: String },
      coordinates: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
      },
    },

    // Only relevant for residential
    bedrooms: Number,
    bathrooms: Number,

    // Useful for land/warehouses/commercial too
    size: { type: String }, // e.g. "200 sqm", "1/8 acre"

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

// Indexes for performance
PropertySchema.index({
  title: "text",
  description: "text",
  "location.city": "text",
  "location.estate": "text",
  category: "text",
});

PropertySchema.index({ status: 1, price: 1, bedrooms: 1, category: 1 });

export default model("Property", PropertySchema);
