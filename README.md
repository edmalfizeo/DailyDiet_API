# DailyDiet API

## About

The **DailyDiet API** is a robust backend solution designed for managing user dietary plans. It allows users to create, update, list, and delete meals, with seamless authentication and validation. The project is structured with modern backend development practices, ensuring maintainability, scalability, and testability.

This API implements a **CRUD** (Create, Read, Update, Delete) system for managing meals, integrates user authentication via JWT, and adheres to industry best practices for backend development.

---

## Key Features

- **User Management:**
  - User registration and login with secure password handling (hashed with bcrypt).
  - Token-based authentication using JWT for protected routes.

- **Meal Management:**
  - Full CRUD operations for meals: Create, Read (list), Update, Delete.
  - Route protection ensures only authenticated users can access or modify their own meals.

- **Validation:**
  - Input validation and error handling for improved DX (Developer Experience).
  - Custom error messages for common issues such as duplicate emails or unauthorized access.

- **Testing:**
  - Comprehensive test coverage with unit tests and integration tests for controllers, handlers, and API routes.
  - Separation of unit and integration tests for clear responsibility and functionality validation.

---

## Project Structure

The project follows the **MVC (Model-View-Controller)** architecture and uses **SOLID principles** to ensure clean code and easy maintenance.

### Directory Layout

```graphql
src/ ├── controllers/ # Handles incoming HTTP requests and responses │ ├── meal/ # Meal-specific controllers │ ├── user/ # User-specific controllers ├── handlers/ # Core business logic and interaction with the database │ ├── meal/ # Meal-specific handlers │ ├── user/ # User-specific handlers ├── middlewares/ # Authentication and request processing middleware ├── routes/ # Defines API routes for meals and users ├── utils/ # Utility functions and database connection management ├── errors/ # Custom error classes for improved error handling
```

---

## Practices and Approach

1. **Architecture:**
   - **MVC:** Separation of concerns between controllers, handlers, and routes ensures modularity and maintainability.
   - Clear distinction between request processing (controller layer) and business logic (handler layer).

2. **Principles:**
   - **Single Responsibility Principle (SRP):** Each module has a well-defined, singular responsibility.
   - **Dependency Inversion Principle (DIP):** Handlers and controllers are decoupled to allow for independent testing and modifications.

3. **Validation and Error Handling:**
   - Custom error classes (e.g., `InvalidCredentials`, `DuplicateEmail`) to handle specific scenarios.
   - Middleware for user authentication ensures protected routes are secure.

4. **Testing:**
   - **Unit Tests:** Focused on handlers and controllers, testing isolated pieces of logic with mocks.
   - **Integration Tests:** Validates the functionality of the entire API, ensuring real-world scenarios work as expected.
   - Tools used: **Vitest** and **Supertest**.

5. **Security:**
   - Passwords are hashed using bcrypt for secure storage.
   - JWT is used for token-based authentication, ensuring only authorized users access protected resources.

6. **Scalability and Maintenance:**
   - Clean project structure with modular folders for controllers, handlers, middlewares, and routes.
   - Separation of test handlers and integrations to keep unit testing and integration testing focused.

---

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **TypeScript**: Strongly typed JavaScript for enhanced developer experience.
- **Fastify**: High-performance backend framework.
- **Prisma**: ORM for database interaction.
- **JWT**: Secure token-based authentication.
- **Bcrypt**: For hashing passwords.
- **Vitest**: Testing framework for unit and integration tests.
- **Supertest**: HTTP assertions for API testing.

---

## How It Works

- **Authentication:**
  - Users register with an email and password.
  - Login generates a JWT token for subsequent requests.
  - Middleware validates the token for protected routes.

- **Meals Management:**
  - Create meals with a name and calorie count.
  - Retrieve a list of all meals for the authenticated user.
  - Update or delete meals owned by the authenticated user.

- **Error Handling:**
  - Custom errors (e.g., `ValidationError`, `UnauthorizedError`) provide meaningful feedback.
  - Handlers return standardized error messages for consistent responses.

---

## Summary

The DailyDiet API is a production-ready, scalable backend solution built with modern development principles. It serves as a great portfolio project showcasing expertise in:

- Designing APIs with **clean architecture**.
- Implementing robust **authentication and authorization**.
- Writing **comprehensive tests** for high-quality code.
- Following **best practices** in backend development.