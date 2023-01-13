import express from "express";
import { currentUserRouter } from "./routes/current-user";

const app = express();
app.use(express.json());

app.use("/", currentUserRouter);

app.listen(3000, () => {
	console.log("Auth server is running on PORT 3000");
});
