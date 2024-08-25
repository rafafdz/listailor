FROM python:3.12-alpine

# Set environment variables for Poetry
ENV POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

# Install dependencies
RUN apk add --no-cache bash curl gcc musl-dev libffi-dev

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    export PATH="$PATH:/root/.local/bin"

# Set the working directory
WORKDIR /app

# Copy only the pyproject.toml and poetry.lock to the container
COPY pyproject.toml poetry.lock ./

# Install dependencies via Poetry
RUN /root/.local/bin/poetry install --no-root --no-dev

# Copy the application code
COPY . .

# Expose port 8000 and define the command to run the app
EXPOSE 8000

# Start the FastAPI application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "20"]
