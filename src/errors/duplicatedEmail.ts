import { AppError } from "./baseError";

export class DuplicateEmailError extends AppError {
    constructor() {
        super("Email already exists", 409); // 409 é o código HTTP para conflito
    }
}