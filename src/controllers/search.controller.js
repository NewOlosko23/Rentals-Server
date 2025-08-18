import Property from '../models/Property.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function parseQuickQuery(q=''){
  q = q.toLowerCase();
  const tokens = q.split(/\s+/);
  const out = { category: undefined, bedrooms: undefined, estate: undefined };
  const map = { '1br':1, '1':1, 'one':1, '2br':2, '2':2, 'two':2, '3br':3, '3':3, 'three':3 };
  for (const t of tokens){ if (map[t] && !out.bedrooms) out.bedrooms = map[t]; }
  out.estate = tokens[tokens.length-1];
  if (out.bedrooms === 1) out.category = '1br';
  return out;
}

export const search = asyncHandler(async (req, res) => {
  const { q, city, estate, minPrice, maxPrice, bedrooms, category, type, page=1, limit=20 } = req.query;
  const filter = { status: 'live' };
  if (q){
    const parsed = parseQuickQuery(q);
    if (parsed.category) filter.category = parsed.category;
    if (parsed.bedrooms) filter.bedrooms = parsed.bedrooms;
    if (parsed.estate) filter['location.estate'] = new RegExp(parsed.estate, 'i');
    filter.$text = { $search: q };
  }
  if (city) filter['location.city'] = new RegExp(`^${city}$`, 'i');
  if (estate) filter['location.estate'] = new RegExp(estate, 'i');
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (bedrooms) filter.bedrooms = Number(bedrooms);
  if (minPrice || maxPrice) filter.price = { ...(minPrice?{$gte:+minPrice}:{}) , ...(maxPrice?{$lte:+maxPrice}:{}) };
  const skip = (Number(page)-1)*Number(limit);
  const [items, total] = await Promise.all([
    Property.find(filter).sort({ 'stats.views': -1, createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Property.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total/Number(limit)) });
});
