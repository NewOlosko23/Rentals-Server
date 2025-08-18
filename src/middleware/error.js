export function notFound(req, res, next){
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

export function errorHandler(err, req, res, _next){
  const status = err.status || 500;
  const message = err.message || 'Server error';
  if (status >= 500) console.error(err);
  res.status(status).json({ message, stack: process.env.NODE_ENV==='development' ? err.stack : undefined });
}
