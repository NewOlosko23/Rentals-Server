import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './properties.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/search', searchRoutes);
export default router;
