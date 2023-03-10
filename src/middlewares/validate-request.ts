import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validator.validationResult(req);

	if (!errors.isEmpty()) {
		throw new RequestValidationError(errors.array());
	}

	next();
};
