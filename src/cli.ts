import { Command } from "commander";
import { CliOptions } from "./types";

class Cli {
  program: Command;

  constructor() {
    this.program = new Command();
  }

  getOptions = (): CliOptions => {
    this.setMetaData();
    this.setOptions();
    this.setArguments();
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
      .option("-d, --repeated", "Print only repeated lines.");
  };

  private setArguments = (): void => {
    this.program.argument("<filePath>", "Path to the file.");
  };
}

export { Cli };
