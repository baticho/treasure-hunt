
# Django REST API with React Frontend and PostgreSQL using Docker Compose

This repository contains a Docker Compose configuration for 
a Django REST API with PostgreSQL. Below are the steps to start 
the PostgreSQL container and create a new Django app.

## Prerequisites

- Docker installed on your machine ([Install Docker](https://docs.docker.com/get-docker/))
- Basic understanding of Docker, Django, and Docker Compose

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
POSTGRES_DB=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Make sure to adjust the values based on your specific requirements.

### 3. Starting PostgreSQL Container

To start only the PostgreSQL container:

1. **Navigate to the Project Directory**:
   Open a terminal/command prompt and navigate to the directory containing your `docker-compose.yml` file.

2. **Build and Start the PostgreSQL Container**:
   Run the following command to build and start the services using the specified configuration:

```bash
docker-compose -f docker-compose.local.yml up --build -d
```
This command will build the containers and start the services specified in 
the local.yml file in detached mode (-d), running them in the background.
### 4. Creating a New Virtual Environment and Installing Requirements

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

### 5. Building React Frontend

To build the React frontend:

1. **Navigate to the Frontend Directory**:
   Open a terminal or command prompt and navigate to the `frontend` directory within your project:

   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   Install the required dependencies for the frontend:

   ```bash
   npm install
   ```

3. **Build the Frontend**:
   Run the following command to build the React frontend:

   ```bash
   npm run build
   ```

   This command will compile and build the React app into static files.

### 6. Starting Django App

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
