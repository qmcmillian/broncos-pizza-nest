# README

## Getting Started

Follow these steps to set up and run the application.

### 1. Clone the Repository

```sh
git clone https://github.com/<organization-or-team>/broncos-pizza-nest.git
cd broncos-pizza-nest
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create Environment Variables

Copy the example environment file and configure it as needed:

```sh
cp .env.example .env
```

Update the `.env` file with the appropriate values for your setup.

### 4. Start PostgreSQL and Create the Database

Ensure PostgreSQL is running on your system.

#### **Option 1: Using the Command Line (`psql`)**

Run the following command to create the database:

```sh
psql -U <your-db-user> -h <your-db-host> -p <your-db-port> -c "CREATE DATABASE broncos_pizza_db;"
```

- Replace `<your-db-user>` with your PostgreSQL username (default: `postgres`).
- Replace `<your-db-host>` with your database host (`localhost` if running locally).
- Replace `<your-db-port>` with the PostgreSQL port (default: `5432`).

✅ **Example** (if using default PostgreSQL settings):

```sh
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE broncos_pizza_db;"
```

#### **Option 2: Using `psql` Interactive Mode**

1. Open a terminal and connect to PostgreSQL:
   ```sh
   psql -U postgres -h localhost -p 5432
   ```
2. Once inside, run:
   ```sql
   CREATE DATABASE broncos_pizza_db;
   ```
3. Exit the session by typing:
   ```sh
   \q
   ```

#### **Option 3: Using pgAdmin (GUI)**

1. Open **pgAdmin** and connect to your PostgreSQL server.
2. In the left panel, right-click **Databases** → Click **Create** → **Database**.
3. Enter **broncos_pizza_db** as the database name.
4. Select the correct owner (default: `postgres`).
5. Click **Save**.

### 5. Run the Application

Since the seed script runs inside `bootstrap.ts`, starting the application will automatically populate the database.

To start the application:

```sh
npm run start
```

For development mode with live reloading:

```sh
npm run start:dev
```

For production mode:

```sh
npm run start:prod
```

The API should now be running at:  
**http://localhost:3000** (unless overridden in `.env`)

### 6. Run End-to-End Tests

Execute the test suite to validate API functionality:

```sh
npm run test:e2e
```

---

## API Endpoints

### Create a Pizza

```sh
curl -X POST http://localhost:3000/pizzas \
     -H "Content-Type: application/json" \
     -d '{
           "size": "Large",
           "sauce": "Tomato",
           "toppings": ["Cheese", "Pepperoni"]
         }'
```

### Get a Pizza by ID

```sh
curl -X GET http://localhost:3000/pizzas/1
```

### Update a Pizza

```sh
curl -X PUT http://localhost:3000/pizzas/1 \
     -H "Content-Type: application/json" \
     -d '{
           "size": "Medium",
           "sauce": "Pesto",
           "toppings": ["Mushrooms", "Onions"]
         }'
```

### Delete a Pizza

```sh
curl -X DELETE http://localhost:3000/pizzas/1
```

---

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running and that your `.env` file has the correct credentials. Check the database status with:

```sh
psql -U <db-user> -h <db-host> -p <db-port> -c "\l"
```

### Seeding Issues

If the seed script doesn’t populate data, try restarting the application:

```sh
npm run start
```

The seed script is included in `bootstrap.ts` and runs automatically.

---
