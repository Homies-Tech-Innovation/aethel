import { ApiError } from "@/utils/errors/ApiError";

export class BadRequestError extends ApiError {
	constructor(message: string = "Bad Request", errors: string[] = []) {
		super(400, message, errors);
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string = "Unauthorized", errors: string[] = []) {
		super(401, message, errors);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message: string = "Forbidden", errors: string[] = []) {
		super(403, message, errors);
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string = "Not Found", errors: string[] = []) {
		super(404, message, errors);
	}
}

export class ConflictError extends ApiError {
	constructor(message: string = "Conflict", errors: string[] = []) {
		super(409, message, errors);
	}
}

export class InternalServerError extends ApiError {
	constructor(message: string = "Internal Server Error", errors: string[] = []) {
		super(500, message, errors);
	}
}
