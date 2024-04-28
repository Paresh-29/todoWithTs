import  express  from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const port: any = process.env.PORT || 3000;

//middleware
app.use(express.json());



app.listen(port, () => {
    console.log(`The port is listening on ${port}`);
})