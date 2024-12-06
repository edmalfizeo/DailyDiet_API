import { AppError } from "./baseError";

export class InvalidCredentialsError extends AppError {
    constructor() {
        super("Invalid credentials", 401); // 401 é o código HTTP para não autorizado
    }
}