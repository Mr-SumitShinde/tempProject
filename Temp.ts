sonar.projectKey=your_project_key
sonar.organization=your_organization_key
sonar.projectName=Your Project Name
sonar.projectVersion=1.0

sonar.sources=apps,@barclays/libs
sonar.language=ts
sonar.typescript.tsconfigPath=tsconfig.base.json
sonar.exclusions=**/node_modules/**, **/dist/**

sonar.tests=apps,@barclays/libs
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts

sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.projectBaseDir=.
sonar.sourceEncoding=UTF-8


In an Nx monorepo, when the jest.config.ts file is created, it typically exports a function from @nx/jest. This function is not explicitly imported anywhere within your application code, but it's used internally by Nx to set up Jest for the particular project.

The configuration file (jest.config.ts) is automatically consumed when you run nx test <project-name>. Nx uses the Jest configuration when running your tests and applies any custom settings or configurations specified in that file.
