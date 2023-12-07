
# Django REST API with React Frontend

## Deployed App

The app is deployed and accessible at [Treasure Hunt](https://treasure-hunt-bg-a449fa748856.herokuapp.com/).


## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/baticho/treasure-hunt.git
cd treasure-hunt
```

### 2. Set up Environment Variables

Create a `.env` file in the project root and add the following configurations:

```plaintext
DJANGO_SECRET_KEY=SECRETKEY
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

Make sure to adjust the values based on your specific requirements.

### 3. Creating a New Virtual Environment and Installing Requirements

To create a new virtual environment and install the project requirements:

1. **Start a Terminal/Command Prompt**:
   Open a new terminal or command prompt within your project directory.

2. **Create a New Virtual Environment** (optional but recommended):
   Create a new virtual environment. Run the following commands based on your operating system:

   - For Windows:
     ```bash
     python -m venv myenv
     myenv\Scripts\activate
     ```

   - For macOS/Linux:
     ```bash
     python3 -m venv myenv
     source myenv/bin/activate
     ```

   Replace `myenv` with your desired virtual environment name.

3. **Install Project Requirements**:
   With the virtual environment activated, install the required Python packages using the following command:

   ```bash
   pip install -r requirements.txt
   ```

### 4. Database Setup
   In this project wi will use sqlite.
1. **To apply migrations and populate the database with initial data**:
   ```bash
   # Apply migrations
   python manage.py makemigrations
   python manage.py migrate
   
   # Populate the database with predefined data
   python manage.py populate_data
   ```

### 5. Building React Frontend

To build the React frontend:

1. **Navigate to the Frontend Directory**:
   Open a terminal or command prompt and navigate to the `frontend` directory within your project:

   ```bash
   cd frontend
   ```

2. **Create .env.local File:
   Create a .env.local file in the frontend directory and add the required environment variables. For example:
   
   ```plaintext
   REACT_APP_API_URL=http://localhost:8080/
   ```
   Replace http://localhost:8080/ with your actual API URL.
   

3. **Install Dependencies**:
   Install the required dependencies for the frontend:
   
   ```bash
   npm install
   ```

4. **Build the Frontend**:
   Run the following command to build the React frontend:

   ```bash
   npm run build
   ```

   This command will compile and build the React app into static files.

### 5. Starting Django App

To start the Django app:

1. **Activate the Virtual Environment**:
   If you haven't activated the virtual environment created in step 4, activate it using:

   - For Windows:
     ```bash
     myenv\Scripts\activate
     ```

   - For macOS/Linux:
     ```bash
     source myenv/bin/activate
     ```

   Replace `myenv` with your virtual environment name.

2. **Run the Django Development Server**:
   Run the following command to start the Django app:

   ```bash
   python manage.py runserver
    ```

## Additional Notes

- Ensure Docker is running and properly configured before starting containers.
- Modify the configurations and commands based on your project's specific setup or requirements.
- Feel free to customize settings and configurations based on your project's needs.
