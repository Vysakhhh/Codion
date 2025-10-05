import dotenv from 'dotenv'
import express from 'express';
import aiRoutes from './src/routes/ai.routes.js'; 

dotenv.config()

const app = express();
app.use(express.json());
app.use('/ai',aiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started running at port: ${PORT}`);
});
