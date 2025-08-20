import { Schema, model, trusted } from "mongoose";

const UserSchema = new Schema(
  {
    userType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },

    // Common fields
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    avatarUrl: String,
    location: String,
    address: String,
    username: { type: String, unique: true, sparse: true },

    // Individual-specific
    individual: {
      fullName: { type: String, unique: true, sparse: true },
    },

    // Company-specific
    company: {
      officialName: { type: String, unique: true, sparse: true },
      contactPerson: { type: String },
      website: { type: String, unique: true },
    },

    // Other fields
    role: { type: String, enum: ["buyer", "agent", "admin"], default: "buyer" },
    isVerified: { type: Boolean, default: false },
    subscribed: { type: Boolean, default: false },

    // Email verification
    emailVerification: {
      code: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
