##############################
# Stage 1: Build the React app
##############################
FROM node:16 AS react-build
WORKDIR /app/web-client
# Copy package files and install dependencies
COPY web-client/package*.json ./
RUN npm install
# Copy the rest of the React app code
COPY web-client/ ./
# Build the production app (output typically goes to "dist")
RUN npm run build

##############################
# Stage 2: Build the Django app
##############################
FROM python:3.10-slim
# Prevent Python from writing .pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Copy the requirements file into the container and install Python dependencies
COPY server/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy your Django project code
COPY server/ ./

# Copy the React build output into a directory (e.g., "static")
# Ensure your Django settings are set to serve these files at the "/" URL,
# perhaps via a catch‑all view or via Whitenoise.
RUN mkdir -p static
COPY --from=react-build /app/web-client/dist/ static/

# Optionally, run Django's collectstatic if you use it
# RUN python manage.py collectstatic --noinput

# Expose the port Daphne will use
EXPOSE 8000

# Use Daphne as the ASGI server to serve the Django app
CMD ["daphne", "literature.asgi:application", "--bind", "0.0.0.0", "--port", "8000"]