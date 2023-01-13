import express, { Request, Response } from "express";
import * as validator from "express-validator";

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
	(req: Request, res: Response) => {
		const errors = validator.validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).send(errors.array());
		}

		const { email, password } = req.body;

		res.send({ Message: "User created" });
	}
);

export { router as signUpRouter };
