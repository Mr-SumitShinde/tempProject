sonar.projectKey=your_project_key
sonar.organization=your_organization_key
sonar.projectName=Your Project Name
sonar.projectVersion=1.0

sonar.sources=apps,your-libraries-folder
sonar.language=ts
sonar.typescript.tsconfigPath=tsconfig.base.json
sonar.exclusions=**/node_modules/**, **/dist/**

sonar.tests=apps,your-libraries-folder
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts

sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.projectBaseDir=.
sonar.sourceEncoding=UTF-8