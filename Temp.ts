# Replace these with your Bitbucket workspace and app password
BITBUCKET_TOKEN="your_access_token"
BITBUCKET_WORKSPACE="your_workspace"

# Create a new Bitbucket repository using the input project name
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer $BITBUCKET_TOKEN" \
https://api.bitbucket.org/2.0/repositories/$BITBUCKET_WORKSPACE/$PROJECT_NAME \
-d '{"scm": "git", "is_private": "true"}'