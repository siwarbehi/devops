#!/bin/bash

# Nom de l'image Docker
IMAGE_NAME="projetdocker_image"

# Nom du conteneur Docker
CONTAINER_NAME="projetdocker_container"

# Port d'hôte à utiliser
HOST_PORT=56733

# Construire l'image Docker à partir du Dockerfile
echo "Building Docker image $IMAGE_NAME..."
docker build -t $IMAGE_NAME .
if [ $? -ne 0 ]; then
  echo "Échec de la construction de l'image Docker."
  exit 1
fi

# Vérifier si un conteneur avec le même nom est déjà en cours d'exécution, et le supprimer si nécessaire
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "Arrêt et suppression du conteneur existant $CONTAINER_NAME..."
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
fi

# Lancer le conteneur Docker
echo "Starting Docker container $CONTAINER_NAME on port $HOST_PORT..."
docker run -d -p $HOST_PORT:80 --name $CONTAINER_NAME $IMAGE_NAME
if [ $? -ne 0 ]; then
  echo "Échec du démarrage du conteneur Docker."
  exit 1
fi

echo "Conteneur Docker démarré avec succès sur le port $HOST_PORT."
