# Start with a base image
FROM python:3.8

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install build dependencies (gcc and others) for uWSGI
RUN apt-get update && \
    apt-get install -y gcc && \
    apt-get clean

# Install the dependencies from requirements.txt
RUN pip install -r requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the application
CMD ["python", "app.py"]
