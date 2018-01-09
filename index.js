#!/usr/bin/env node

const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const chalk = require("chalk");
const program = require("commander");
const pkg = require(path.join(__dirname, "package.json"));
const Mustache = require("mustache");
const INDEX_JS = fs.readFileSync("./templates/index_template.js", "utf8");
const CONNECTED_INDEX_JS = fs.readFileSync(
  "./templates/connected_index_template.js",
  "utf8"
);
const PROPS_JS = fs.readFileSync("./templates/props_template.js", "utf8");
const STORY_JS = fs.readFileSync("./templates/story_template.js", "utf8");
const COMPONENT_JS = fs.readFileSync(
  "./templates/component_template.js",
  "utf8"
);
const STYLE_CSS = fs.readFileSync("./templates/style_template.css", "utf8");
let componentName;

program
  .arguments("<component-name>")
  .version(pkg && pkg.version)
  .usage(`${chalk.green("<component-name>")} [options]`)
  .action(name => {
    componentName = name;
  })
  .option("-d, --dir <dir>", "directory to create the component template in")
  .option("-v, --verbose", "print additional logs")
  .option("-u, --unconnected", "create unconnect component in index.js")
  .option("-s, --story", "create story.js file")
  .option("-t, --style", "create style.css file")
  .parse(process.argv);

if (typeof componentName === "undefined") {
  console.error("Please specify the component name:");
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
  );
  console.log();
  console.log("For example:");
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green("Button")}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

createComponentStructure(componentName, program.verbose, program.dir);

function createComponentStructure(name, verbose, loc) {
  let dir;
  if (typeof loc !== "undefined") {
    dir = path.resolve(loc);
  } else {
    dir = `${path.resolve()}/src/views`;
  }

  const componentDir = `${dir}/${name}`;
  if (fs.existsSync(componentDir)) {
    console.error(`A component with name: '${name}' already exists:`);
    console.log("Please choose a different name");
    process.exit(1);
  }
  if (verbose) {
    console.log(`Creating ${chalk.green(name)} at ${dir}`);
  }

  mkdirp(componentDir, err => {
    if (err) console.error("ERROR: file was not created.");
    scaffold(componentDir);
  });
}

function scaffold(componentDir) {
  if (program.story) {
    fs.writeFileSync(
      `${componentDir}/story.js`,
      Mustache.render(STORY_JS, { componentName })
    );
  }

  // NdOTE: flipping this, connected by default
  if (program.unconnected) {
    fs.writeFileSync(
      `${componentDir}/index.js`,
      Mustache.render(INDEX_JS, { componentName })
    );
  } else {
    fs.writeFileSync(
      `${componentDir}/index.js`,
      Mustache.render(CONNECTED_INDEX_JS, { componentName })
    );
  }

  if (program.style) {
    fs.writeFileSync(
      `${componentDir}/style.css`,
      Mustache.render(STYLE_CSS, { componentName })
    );
  }

  fs.writeFileSync(
    `${componentDir}/component.js`,
    Mustache.render(COMPONENT_JS, { componentName })
  );
  fs.writeFileSync(
    `${componentDir}/props.js`,
    Mustache.render(PROPS_JS, { componentName })
  );
}
