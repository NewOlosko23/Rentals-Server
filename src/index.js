import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './app.js';

const { MONGODB_URI, PORT = 8080 } = process.env;

mongoose.connect(MONGODB_URI, { autoIndex: true })
  .then(()=>{
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log('API listening on port', PORT));
  })
  .catch(err=>{
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
