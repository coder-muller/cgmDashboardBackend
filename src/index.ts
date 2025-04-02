import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth";
import salesDataRouter from "./routes/salesData";
import companyRouter from "./routes/company";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the CGM Dashboard API");
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/company", companyRouter);
app.use("/salesData", salesDataRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
