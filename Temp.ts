# Replace these with your Bitbucket workspace and app password
BITBUCKET_TOKEN="your_access_token"
BITBUCKET_WORKSPACE="your_workspace"

# Create a new Bitbucket repository using the input project name
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer $BITBUCKET_TOKEN" \
https://api.bitbucket.org/2.0/repositories/$BITBUCKET_WORKSPACE/$PROJECT_NAME \
-d '{"scm": "git", "is_private": "true"}'




#!/bin/bash

# Set variables
BITBUCKET_TOKEN="your-bitbucket-token"  # Replace with the Jenkins credentials ID or hardcode the token directly
BITBUCKET_TEAM="your-bitbucket-team"  # Replace with your Bitbucket team or workspace name
BITBUCKET_USER="your-bitbucket-username"  # Replace with your Bitbucket username
REPO_DESCRIPTION="A new repository created via Jenkins"  # Replace with your repository description

# The repository name provided by the user
REPO_NAME="${REPO_NAME}"

# Check if the repository name was provided
if [ -z "$REPO_NAME" ]; then
    echo "Error: No repository name provided."
    exit 1
fi

# Bitbucket API URL
BITBUCKET_API_URL="https://api.bitbucket.org/2.0/repositories/${BITBUCKET_TEAM}/${REPO_NAME}"

# Create a new repository
response=$(curl -s -X POST "$BITBUCKET_API_URL" \
    -H "Authorization: Bearer $BITBUCKET_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "scm": "git",
        "is_private": true,
        "description": "'"${REPO_DESCRIPTION}"'"
    }')

# Check if the repository was created successfully
if echo "$response" | grep -q '"uuid"'; then
    echo "Repository '${REPO_NAME}' created successfully."
else
    echo "Failed to create repository. Response: $response"
    exit 1
fi