import * as fs from "fs";
import * as process from "process";
import * as path from "path";
import { exec } from "child_process";

const cwd = process.cwd();

const projectName = process.argv[2];
const installer = process.argv[3];

try {
  fs.mkdirSync(projectName);
} catch (error) {
  console.log("alredy exist");
  console.log(error);
  process.exit(1);
}

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${projectName}</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <script src="/index.js" type="module"></script>
  </body>
</html>
`.trimStart();

const css = `
html {
  background-color: black;
}
`;

const js = `
console.log("hello world");
`;

const gitignore = `
node_modules
`.trimStart();

const eslint = `
{
  "rules": {
    "no-undef": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "always"
      }
    ]
  },
  "plugins": ["import"],
  "env": {
    "browser": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  }
}
`.trimStart();

const pkg_json = `
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "type": "module"
}
`.trimStart();

const o = {
  "index.html": html,
  "style.css": css,
  "index.js": js,
  ".gitignore": gitignore,
  "package.json": pkg_json,
  ".eslintrc.json": eslint,
};

Object.entries(o).forEach(([fileName, dataString]) => {
  fs.writeFileSync(path.join(cwd, projectName, fileName), dataString);
});

const installCmd =
  installer === "npm" ? "npm install --save-dev" : "yarn add -D";

const devDependencies = ["eslint", "eslint-plugin-import", "vite", "vitest"];

const commands = [
  `cd ${projectName}`,
  `${installCmd} ${devDependencies.join(" ")}`,
  `git init`,
];

exec(commands.join(" && "));
