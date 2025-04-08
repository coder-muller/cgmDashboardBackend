import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import companyRouter from "./routes/company";
import salesDataRouter from "./routes/salesData";
import usersRouter from "./routes/users";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.status(404)
});

app.get("/api-test", (req: Request, res: Response) => {
    res.send('API Funcionando!')
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/company", companyRouter);
app.use("/salesData", salesDataRouter);

app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
