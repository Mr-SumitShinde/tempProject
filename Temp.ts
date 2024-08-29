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

# Debug: Output the variables to ensure they are correct
echo "BITBUCKET_API_URL: $BITBUCKET_API_URL"
echo "REPO_NAME: $REPO_NAME"
echo "REPO_DESCRIPTION: $REPO_DESCRIPTION"

response=$(curl -s -o response.txt -w "%{http_code}" -X POST "$BITBUCKET_API_URL" \
    -H "Authorization: Bearer $BITBUCKET_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "scm": "git",
        "is_private": true,
        "description": "'"${REPO_DESCRIPTION}"'"
    }')

# Output the HTTP status code
echo "HTTP Status Code: $response"

# Output the response body for more detailed error messages
echo "Response body:"
cat response.txt

# Check if the repository was created successfully
if [ "$response" -eq 201 ]; then
    echo "Repository '${REPO_NAME}' created successfully."
else
    echo "Failed to create repository."
    exit 1
fi