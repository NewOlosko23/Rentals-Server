import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { allowRoles } from '../middleware/rbac.js';
import { mediaUploadMw, createProperty, listProperties, getProperty, updateProperty, archiveProperty } from '../controllers/property.controller.js';

const r = Router();

r.get('/', listProperties);
r.get('/:id', getProperty);
r.post('/', auth, allowRoles('agent','admin'), mediaUploadMw, createProperty);
r.patch('/:id', auth, allowRoles('agent','admin'), updateProperty);
r.patch('/:id/archive', auth, allowRoles('agent','admin'), archiveProperty);

export default r;
