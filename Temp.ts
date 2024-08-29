# Replace these with your Bitbucket credentials and workspace details
BITBUCKET_USER="your_username"
BITBUCKET_PASSWORD="your_password"
BITBUCKET_WORKSPACE="your_workspace"

# Create a new Bitbucket repository using the input project name
curl -u $BITBUCKET_USER:$BITBUCKET_PASSWORD -X POST -H "Content-Type: application/json" \
https://api.bitbucket.org/2.0/repositories/$BITBUCKET_WORKSPACE/$PROJECT_NAME \
-d '{"scm": "git", "is_private": "true"}'