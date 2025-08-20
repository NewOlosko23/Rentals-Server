import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Property from "../models/Property.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const upload = multer({ storage: multer.memoryStorage() });
export const mediaUploadMw = upload.array("images", 10);

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "khc/properties",
        transformation: [
          { width: 1600, crop: "limit" },
          {
            overlay: process.env.CLOUDINARY_LOGO_PUBLIC_ID,
            gravity: "center",
            opacity: 60,
          },
          { fetch_format: "auto", quality: "auto" },
        ],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(upload);
  });
}

// CREATE property
export const createProperty = asyncHandler(async (req, res) => {
  const body = req.body;
  const media = [];

  if (req.files?.length) {
    for (const f of req.files) {
      const r = await uploadBuffer(f.buffer);
      media.push({
        url: r.secure_url,
        publicId: r.public_id,
        width: r.width,
        height: r.height,
      });
    }
  }

  const doc = await Property.create({
    title: body.title,
    transactionType: body.transactionType, // rent | sale | lease
    purpose: body.purpose, // residential | commercial | land
    category: body.category, // e.g. "2br", "office", "plot"
    price: body.price,
    location: {
      city: body.city,
      estate: body.estate,
      address: body.address,
      coordinates:
        body.lng && body.lat
          ? {
              type: "Point",
              coordinates: [parseFloat(body.lng), parseFloat(body.lat)],
            }
          : undefined,
    },
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    size: body.size,
    amenities: body.amenities
      ? body.amenities.split(",").map((a) => a.trim())
      : [],
    description: body.description,
    lister: req.user.id,
    media,
  });

  res.status(201).json({ property: doc });
});

// LIST properties with filters
export const listProperties = asyncHandler(async (req, res) => {
  const {
    status = "live",
    purpose,
    transactionType,
    category,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (purpose) filter.purpose = purpose;
  if (transactionType) filter.transactionType = transactionType;
  if (category) filter.category = category;
  if (city) filter["location.city"] = city;
  if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// GET single property (+ increment views)
export const getProperty = asyncHandler(async (req, res) => {
  const p = await Property.findByIdAndUpdate(
    req.params.id,
    { $inc: { "stats.views": 1 } },
    { new: true }
  ).populate(
    "lister",
    "userType username email phone company officialName avatarUrl"
  );

  if (!p) return res.status(404).json({ message: "Not found" });
  res.json({ property: p });
});

// UPDATE property
export const updateProperty = asyncHandler(async (req, res) => {
  const updates = req.body;

  const p = await Property.findOneAndUpdate(
    { _id: req.params.id, lister: req.user.id },
    updates,
    { new: true }
  );

  if (!p) return res.status(404).json({ message: "Not found or not owner" });
  res.json({ property: p });
});

// ARCHIVE property
export const archiveProperty = asyncHandler(async (req, res) => {
  const p = await Property.findOneAndUpdate(
    { _id: req.params.id, lister: req.user.id },
    { status: "archived" },
    { new: true }
  );

  if (!p) return res.status(404).json({ message: "Not found or not owner" });
  res.json({ property: p });
});

// DELETE property
export const deleteProperty = asyncHandler(async (req, res) => {
  const p = await Property.findOneAndDelete({
    _id: req.params.id,
    lister: req.user.id,
  });

  if (!p) return res.status(404).json({ message: "Not found or not owner" });
  res.json({ message: "Property deleted" });
});
