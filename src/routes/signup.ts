import express, { Request, Response } from "express";
import * as validator from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
	"/api/users/signup",
	[
		validator.body("email").isEmail().withMessage("Email Must be valid"),
		validator
			.body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Enter proper password")
	],
	async (req: Request, res: Response) => {
		const errors = validator.validationResult(req);

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError("Email in use");
		}

		const user = User.build({ email, password });
		await user.save();

		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email
			},
			process.env.JWT_KEY!
		);

		console.log(user.id, user.email);

		req.session = {
			jwt: userJwt
		};

		res.status(201).send(user);
	}
);

export { router as signUpRouter };
