class ApiResponse<T> {
	public statusCode: number;
	public data: T;
	public message: string;
	public success: boolean;

	constructor(statusCode: number, data: T, message = "Success") {
		this.statusCode = statusCode;
		this.data = data;
		this.message = message;
		this.success = true;
	}
}

export { ApiResponse };
