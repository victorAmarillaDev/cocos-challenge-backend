
# Cocos Challenge Backend

API developed as a solution for the Cocos Challenge Backend. Its purpose is to manage portfolio information, asset search, and order placement in the market.

## Technologies Used

- **Express**: Web framework for handling routing and middleware in the API.
- **TypeORM**: ORM used to manage the database and model relationships.
- **Moment**: Library for date and time manipulation, simplifying time management in operations.
- **Zod**: Used for validating endpoint structure and logic, ensuring data integrity.
- **Lodash**: Provides utility functions for data handling, optimizing and cleaning up code.
- **Jest**: Testing framework to ensure the API’s correct functionality through unit and integration tests.

## How to Use

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in a `.env` file at the root of the project with the following values:

   ```plaintext
   PORT=
   DB_HOST=
   DB_PORT=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   ```

   - `PORT`: Specifies the port on which the server will run.
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Configure the credentials for connecting to the PostgreSQL database.

## Usage

Start the API:
   ```bash
   npm run start
   ```

## Project Structure

- **src/config**: Configuration files for the application settings.
- **src/controllers**: Controllers for handling API endpoint logic.
- **src/entity**: Entity definitions for database models with TypeORM.
- **src/enums**: Enum definitions used across the application.
- **src/interfaces**: TypeScript interfaces.
- **src/middlewares**: Middlewares for error handling and validations using Zod.
- **src/routes**: Route definitions for API endpoints.
- **src/schemas**: Zod schemas for data validation.
- **src/services**: Containslogic and interactions with the database.
- **src/tests**: API tests using Jest.
- **src/utils**: Utility functions for various helper tasks.

## Endpoints

- `GET /portfolio/:userId`: Retrieves the user’s portfolio.
- `GET /assets/search`: Searches for assets by ticker or name.
- `POST /orders`: Sends a buy or sell order.

## Validations

Zod is used to ensure input data adheres to the required structure. Custom errors are defined in the validation schema for improved clarity in error handling.

## Testing

The project includes Jest tests to validate service and endpoint functionality.

```bash
npm test
```

