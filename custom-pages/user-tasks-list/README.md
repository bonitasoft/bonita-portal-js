# Build explanations

This project is built from bonita-portal-js sources. At the end of the build you will get a .zip file in the target file
The build process starts by several maven tasks. First, the maven build process install node.js, npm and nodes_modules.

In a second time the build continues with gulp tasks. In this phase, the build will execute the following tasks:
- delete the directory named dist
- copy files which are in the src directory to the dist directory
- install portal js bower dependencies
- compile templates html files of the task list directory into a templates.js file
- compile less files used in the task list to task-list.css
- inject needed css and js into index.html
- inject task list html code in destination index.html

After of gulp tasks, a maven assembly will package the task list in a .zip file named bonita-task-list-page-[VERSION].zip
