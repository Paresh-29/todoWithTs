import  express  from "express";
import dotenv from "dotenv";
import cors from 'cors';

const app = express();

dotenv.config();

import rootRouter from "./routes";

const port: any = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());


app.use('/api/v1', rootRouter);



app.listen(port, () => {
    console.log(`The port is listening on ${port}`);
})