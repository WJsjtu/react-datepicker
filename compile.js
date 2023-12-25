const TSNode = require("ts-node");
const fs = require("fs");
const yargs = require("yargs/yargs")

function compile(filename) {
  return TSNode.create({
    compilerOptions: {
      "target": "es5",
      "module": "commonjs",
      "allowSyntheticDefaultImports": true,
      "types": [
        "node",
        "webpack-env",
      ],
    },
  }).compile(fs.readFileSync(filename, "utf-8"), filename);
}

const argv = yargs(process.argv.slice(2)).options({
  ts: { type: "string" },
  o: { type: "string" },
}).parseSync();

if (argv.ts && argv.o) {
  fs.writeFileSync(argv.o, compile(argv.ts), "utf-8");
}