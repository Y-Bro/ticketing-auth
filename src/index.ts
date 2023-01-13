import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("No JWT_KEY");
	}
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
