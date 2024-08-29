# Replace these with your Bitbucket workspace and app password
BITBUCKET_TOKEN="your_access_token"
BITBUCKET_WORKSPACE="your_workspace"

# Create a new Bitbucket repository using the input project name
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer $BITBUCKET_TOKEN" \
https://api.bitbucket.org/2.0/repositories/$BITBUCKET_WORKSPACE/$PROJECT_NAME \
-d '{"scm": "git", "is_private": "true"}'




#!/bin/bash

BITBUCKET_TOKEN="your-bitbucket-token"
BITBUCKET_TEAM="your-bitbucket-team"
BITBUCKET_USER="your-bitbucket-username"
REPO_DESCRIPTION="A new repository created via Jenkins"

REPO_NAME="${REPO_NAME}"

if [ -z "$REPO_NAME" ]; then
    echo "Error: No repository name provided."
    exit 1
fi

BITBUCKET_API_URL="https://api.bitbucket.org/2.0/repositories/${BITBUCKET_TEAM}/${REPO_NAME}"

response=$(curl -s -X POST "$BITBUCKET_API_URL" \
    -H "Authorization: Bearer $BITBUCKET_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "scm": "git",
        "is_private": true,
        "description": "'"${REPO_DESCRIPTION}"'"
    }')

if echo "$response" | grep -q '"uuid"'; then
    echo "Repository '${REPO_NAME}' created successfully."
else
    echo "Failed to create repository. Response: $response"
    exit 1
fi


#!/bin/bash

BITBUCKET_TOKEN="your-bitbucket-token"
BITBUCKET_USER="your-bitbucket-username"
REPO_DESCRIPTION="A new repository created via Jenkins"

REPO_NAME="${REPO_NAME}"

if [ -z "$REPO_NAME" ]; then
    echo "Error: No repository name provided."
    exit 1
fi

BITBUCKET_API_URL="https://api.bitbucket.org/2.0/repositories/${BITBUCKET_USER}/${REPO_NAME}"

response=$(curl -s -X POST "$BITBUCKET_API_URL" \
    -H "Authorization: Bearer $BITBUCKET_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "scm": "git",
        "is_private": true,
        "description": "'"${REPO_DESCRIPTION}"'"
    }')

if echo "$response" | grep -q '"uuid"'; then
    echo "Repository '${REPO_NAME}' created successfully."
else
    echo "Failed to create repository. Response: $response"
    exit 1
fi