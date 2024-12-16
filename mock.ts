{
  "openapi": "3.0.0",
  "info": {
    "title": "Simple GET API",
    "version": "1.0.0",
    "description": "A simple Swagger UI setup to test a GET API call on localhost."
  },
  "servers": [
    {
      "url": "http://localhost:5000",
      "description": "Local server"
    }
  ],
  "paths": {
    "/test": {
      "get": {
        "summary": "Test GET Endpoint",
        "description": "Returns a sample response from the server.",
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Hello, world!"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Endpoint not found"
          }
        }
      }
    }
  }
}