{
  "openapi": "3.0.0",
  "info": {
    "title": "API with Custom Headers",
    "version": "1.0.0",
    "description": "Example API using multiple headers."
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
        "summary": "Test GET Endpoint with Headers",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "required": true,
            "description": "Bearer token for authentication",
            "schema": {
              "type": "string",
              "example": "Bearer eyJhbGcIOIJSUzI1NilsimtpZCI6IIRIQU"
            }
          },
          {
            "name": "Correlation-ID",
            "in": "header",
            "required": true,
            "description": "Unique correlation ID for tracing requests",
            "schema": {
              "type": "string",
              "example": "7d444840-9dc0-11d1-b245-5ffdce74fad2"
            }
          },
          {
            "name": "ColleagueContext",
            "in": "header",
            "required": true,
            "description": "Colleague-specific context information",
            "schema": {
              "type": "string",
              "example": "{ \"LDAP\": \"m\", \"sourceSortCode\": \"324324\" }"
            }
          },
          {
            "name": "ChannelContext",
            "in": "header",
            "required": true,
            "description": "Channel context details",
            "schema": {
              "type": "string",
              "example": "{ \"channelid\": \"obboost\" }"
            }
          },
          {
            "name": "CustomerContext",
            "in": "header",
            "required": true,
            "description": "Customer-specific context information",
            "schema": {
              "type": "string",
              "example": "{ \"system\": \"CUSTOMER SYSTEM\", \"authLevel\": 30 }"
            }
          }
        ],
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
                      "example": "Headers received successfully."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid request"
          }
        }
      }
    }
  }
}