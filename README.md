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
src/
├── controllers/               # HTTP request handling logic
│   ├── meal/
│   │   ├── mealCreate.controller.ts     # Handles meal creation requests
│   │   ├── mealDelete.controller.ts     # Handles meal deletion requests
│   │   ├── mealList.controller.ts       # Handles meal listing requests
│   │   └── mealUpdate.controller.ts     # Handles meal update requests
│   └── user/
│       ├── userCreate.controller.ts     # Handles user registration
│       ├── userDelete.controller.ts     # Handles user deletion
│       └── userLogin.controller.ts      # Handles user authentication
├── errors/                    # Custom error definitions
│   ├── baseError.ts                   # Base class for custom errors
│   ├── duplicatedEmail.ts             # Error for duplicate email registrations
│   └── invalidCredentials.ts          # Error for invalid login credentials
├── handlers/                  # Business logic
│   ├── meal/
│   │   ├── mealCreate.handler.ts       # Logic for meal creation
│   │   ├── mealDelete.handler.ts       # Logic for meal deletion
│   │   ├── mealList.handler.ts         # Logic for meal listing
│   │   └── mealUpdate.handler.ts       # Logic for meal updates
│   └── user/
│       ├── userCreate.handler.ts       # Logic for user registration
│       ├── userDelete.handler.ts       # Logic for user deletion
│       └── userLogin.handler.ts        # Logic for user authentication
├── middlewares/              # Custom middlewares
│   └── auth.middleware.ts            # JWT-based authentication middleware
├── routes/                   # Route definitions
│   ├── meal/
│   │   └── index.ts                  # Meal-related routes
│   └── user/
│       └── index.ts                  # User-related routes
├── utils/                    # Utility and configuration files
│   ├── app.ts                       # Fastify application setup
│   └── server.ts                    # Server startup configuration
└── tests/                   # Automated tests
    ├── test_controllers/           # Controller unit tests
    ├── test_handlers/              # Handler unit tests
    └── test_integrations/          # Integration tests
        ├── mealCreateIntegration.spec.ts
        ├── mealDeleteIntegration.spec.ts
        ├── mealListIntegration.spec.ts
        └── mealUpdateIntegration.spec.ts
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
