# Setup Instruction Material Request

## Step 1: Prepare the Database

1. Open the PostgreSQL application.
2. Create the database and tables based on the `database_scheme.sql` file located in the backend folder.

---

## Step 2: Run the Backend (Server)

1. Open the project in Visual Studio Code (VS Code).
2. Open the Backend folder.
3. Edit the `main.ts` file and change the port to 3001 (to avoid conflict with port 3000 used by the frontend).
4. Edit the `app.module.ts` file and update the database password according to your PostgreSQL installation.
5. Open the Terminal in VS Code (click the Terminal menu > New Terminal).
6. Run the following command to navigate to the backend folder:

   ```bash
   cd backend
   ```
7. Install the required dependencies (make sure you have internet connection and wait until it finishes):

   ```bash
   npm install
   ```
8. Start the backend server with:

   ```bash
   npm run start:dev
   ```

---

## Step 2: Run the Frontend (Website)

1. Open a New Terminal in VS Code (click the + icon on the terminal panel).
2. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```
3. Install the frontend dependencies:

   ```bash
   npm install
   ```
4. Run the website with:

   ```bash
   npm run dev
   ```

---
