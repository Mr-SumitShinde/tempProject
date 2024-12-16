import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const ApiDemo = () => {
  return (
    <SwaggerUI url="/swagger.json" />
  );
};

export default ApiDemo;



{
  "openapi": "3.0.0",
  "info": {
    "title": "Picture Upload API",
    "version": "1.0.0",
    "description": "API for uploading and fetching pictures."
  },
  "paths": {
    "/pictures": {
      "post": {
        "summary": "Upload a Picture",
        "description": "Uploads a picture to the server.",
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "The picture to upload."
                  }
                },
                "required": ["file"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Picture uploaded successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "The ID of the uploaded picture."
                    },
                    "url": {
                      "type": "string",
                      "description": "The URL of the uploaded picture."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid request."
          }
        }
      }
    },
    "/pictures/{id}": {
      "get": {
        "summary": "Fetch a Picture",
        "description": "Fetches a picture by its ID.",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "The ID of the picture.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Picture fetched successfully.",
            "content": {
              "image/jpeg": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "404": {
            "description": "Picture not found."
          }
        }
      }
    }
  },
  "components": {}
}