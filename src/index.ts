import express from "express";
import "express-async-errors";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.get("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27107/auth");
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
	}

	app.listen(3000, () => {
		console.log("Auth server is running on PORT 3000");
	});
};

start();
