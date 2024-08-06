{
  "npmScope": "workspace",
  "defaultProject": "myapp",
  "projects": {
    "myapp": {
      "projectType": "application",
      "root": "apps/myapp",
      "sourceRoot": "apps/myapp/src",
      "prefix": "app",
      "targets": {
        "build": {
          "executor": "@nrwl/web:build",
          "options": {
            "outputPath": "dist/apps/myapp",
            "index": "apps/myapp/src/index.html",
            "main": "apps/myapp/src/main.tsx",
            "polyfills": "apps/myapp/src/polyfills.ts",
            "tsConfig": "apps/myapp/tsconfig.app.json",
            "assets": ["apps/myapp/src/favicon.ico", "apps/myapp/src/assets"],
            "styles": ["apps/myapp/src/styles.scss"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "apps/myapp/src/environments/environment.ts",
                  "with": "apps/myapp/src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }
        },
        "serve": {
          "executor": "@nrwl/web:dev-server",
          "options": {
            "buildTarget": "myapp:build"
          },
          "configurations": {
            "production": {
              "buildTarget": "myapp:build:production"
            }
          }
        }
      }
    }
  }
}