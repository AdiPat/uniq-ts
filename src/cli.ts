import { Command } from "commander";
import { CliOptions, zUniqOptions } from "./types";
import { zuniq } from "./zuniq";
import readline from "readline";
import { io } from "./io";

class Cli {
  program: Command;

  constructor() {
    this.program = new Command();
  }

  async run(): Promise<void> {
    const options: CliOptions = this.getOptions();
    let content = "";
    if (!options.filePath) {
      content = await this.readFromStdin();
    }

    const zUniqOptions: zUniqOptions = {
      ...(content && { content }),
      filePath: options.filePath,
      outputFilePath: options.outputPath,
      count: options.count,
      repeated: options.repeated,
      unique: options.unique,
    };
    const { out } = await zuniq(zUniqOptions);
    console.log(out);
  }

  async readFromStdin(): Promise<string> {
    const rl = io.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const input = await new Promise<string>((resolve) => {
      rl.question("Enter input: ", (answer) => {
        resolve(answer);
        rl.close();
      });
    });

    return input;
  }

  getOptions = (): CliOptions => {
    this.setMetaData();
    this.setOptions();
    return this.buildOptions();
  };

  private setMetaData = (): void => {
    this.program
      .name("zuniq")
      .description("A CLI tool to remove adjacent duplicate lines from a file.")
      .version("1.0.0");
  };

  private buildOptions = (): CliOptions => {
    this.program.parse(process.argv);
    const options = this.program.opts();
    const filePath = this.program.args[0];
    return this.sanitizeOptions({ ...options, filePath });
  };

  private sanitizeOptions = (options: CliOptions): CliOptions => {
    return {
      filePath: Boolean(options.filePath) ? options.filePath : undefined,
      outputPath: Boolean(options.outputPath) ? options.outputPath : undefined,
      count: Boolean(options.count),
      repeated: Boolean(options.repeated),
      unique: Boolean(options.unique),
    };
  };

  private setOptions = (): void => {
    this.program
      .option("-u, --unique", "Print only unique lines.")
      .option("-o, --outputPath <outputPath>", "Path to the output file.")
      .option("-c, --count", "Print count of occurrences of each line.")
      .option("-d, --repeated", "Print only repeated lines.")
      .option("-f, --filePath", "Path to the file.");
  };
}

const appCli = new Cli();

export { Cli, appCli };
