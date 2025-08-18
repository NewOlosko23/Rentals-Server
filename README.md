# Kenya House Connect — Server

## Quick start

```bash
cp .env.example .env
# fill credentials
npm install
npm run dev
```

### Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/properties` (list)
- `POST /api/properties` (agent/admin) — multipart form with `images` files
- `GET /api/properties/:id`
- `PATCH /api/properties/:id`
- `PATCH /api/properties/:id/archive`
- `GET /api/search?q=...`
```
