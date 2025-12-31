#!/bin/bash
set -e

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set defaults or retrieve from AWS CLI
AWS_REGION=${AWS_REGION:-"us-east-1"}
ECR_REPO_NAME=${ECR_REPO_NAME:-"backend-ecs-repo"}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "Error: Could not determine AWS Account ID. Please ensure aws cli is configured."
    exit 1
fi

REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "Checking ECR Repository: ${ECR_REPO_NAME} in ${AWS_REGION}..."
aws ecr describe-repositories --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION} > /dev/null 2>&1 || \
    (echo "Repository not found, creating..." && \
    aws ecr create-repository --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION})

echo "Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

echo "Building Docker Image..."
# Using linux/amd64 for compatibility with Fargate
docker build --platform linux/amd64 -t ${ECR_REPO_NAME}:latest .

echo "Tagging and Pushing Image to $REPO_URI..."
docker tag ${ECR_REPO_NAME}:latest $REPO_URI:latest
docker push $REPO_URI:latest

echo "Successfully pushed to: $REPO_URI:latest"
