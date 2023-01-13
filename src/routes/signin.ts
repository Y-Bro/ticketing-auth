import express, { Request, Response } from "express";
import * as validator from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		validator.body("email").isEmail().withMessage("Please enter a valid email"),
		validator
			.body("password")
			.trim()
			.notEmpty()
			.withMessage("Please enter your password")
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			throw new BadRequestError("Invalid Credentials");
		}

		const passwordCheck = await Password.comparePass(
			existingUser.password,
			password
		);

		if (!passwordCheck) {
			throw new BadRequestError("Invalid Credentials");
		}

		console.log(passwordCheck, "here");

		const jwtToken = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: jwtToken
		};

		res.status(200).send({ message: "Succesfully logged in" });
	}
);

export { router as signInRouter };
