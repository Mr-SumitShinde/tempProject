{
  "root": "apps/my-app",
  "sourceRoot": "apps/my-app/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nrwl/web:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/my-app",
        "index": "apps/my-app/src/index.html",
        "main": "apps/my-app/src/main.tsx",
        "tsConfig": "apps/my-app/tsconfig.app.json",
        "assets": ["apps/my-app/src/favicon.ico", "apps/my-app/src/assets"],
        "styles": ["apps/my-app/src/styles.css"],
        "scripts": []
      }
    }
  }
}