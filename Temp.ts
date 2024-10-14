# Required metadata
sonar.projectKey=your_project_key
sonar.organization=your_organization_key
sonar.projectName=Your Project Name
sonar.projectVersion=1.0

# Path to your source code
sonar.sources=apps,your-libraries-folder

# Language settings (assuming you are using TypeScript)
sonar.language=ts
sonar.typescript.tsconfigPath=tsconfig.base.json

# Exclude certain files if needed (optional)
sonar.exclusions=**/node_modules/**, **/dist/**

# Specify test directories (optional, if you want to track test coverage)
sonar.tests=apps,your-libraries-folder
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts

# Include coverage reports (optional, if you are using Jest with coverage)
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Optional settings for code analysis in monorepo setups
sonar.projectBaseDir=.
sonar.sourceEncoding=UTF-8