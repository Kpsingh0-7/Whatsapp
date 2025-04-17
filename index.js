import express from 'express';
import cors from 'cors';
import { createTables } from './models/campaignModel.js';
import router from './routes/controllerRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

createTables();  //This function creates Table in MySQL database
app.use('/',router);

app.listen(3000,()=>{
    console.log("Server ie running on http://localhost:3000");
});