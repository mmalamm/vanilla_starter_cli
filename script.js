import * as fs from "fs";
import * as process from "process";
import * as path from "path";
import { exec } from "child_process";

const cwd = process.cwd();

const dirname = process.argv[2];

try {
  fs.mkdirSync(dirname);
} catch (error) {
  console.log("alredy exist");
  console.log(error);
  process.exit(1);
}

const html = String.raw`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>wc practice</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <script src="/index.js" type="module"></script>
  </body>
</html>
`.trimStart();

const css = String.raw`
html {
  background-color: black;
}
`.trimStart();

const js = String.raw`
console.log("hello world");
`;

const gitignore = String.raw`
node_modules
`;

const eslint = String.raw`
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

const pkg_json = String.raw`
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "type": "module"
}
`;

const o = {
  "index.html": html,
  "style.css": css,
  "index.js": js,
  ".gitignore": gitignore,
  "package.json": pkg_json,
  ".eslintrc.json": eslint,
};

Object.entries(o).forEach(([fileName, dataString]) => {
  fs.writeFileSync(path.join(cwd, dirname, fileName), dataString);
});

const installCmd =
  installer === "npm" ? "npm install --save-dev" : "yarn add -D";

const devDependencies = ["eslint", "eslint-plugin-import", "vite", "vitest"];

const commands = [
  `cd ${dirname}`,
  `${installCmd} ${devDependencies.join(" ")}`,
];

exec(commands.join(" && "));
