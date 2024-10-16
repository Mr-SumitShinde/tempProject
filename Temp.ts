{
  "name": "valpre-react-data-table",
  "targets": {
    "build": {
      "executor": "@nrwl/web:package",
      "options": {
        "outputPath": "dist/libs/valpre-react-data-table",
        "tsConfig": "libs/valpre-react-data-table/tsconfig.lib.json",
        "project": "libs/valpre-react-data-table/package.json",
        "entryFile": "libs/valpre-react-data-table/src/index.ts",
        "assets": [
          {
            "input": "libs/valpre-react-data-table/src",
            "glob": "**/*.css",
            "output": "."
          }
        ]
      }
    }
  }
}