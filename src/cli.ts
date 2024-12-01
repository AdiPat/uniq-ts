import { Command } from "commander";

class Cli {
  program: Command;

  constructor() {
    this.program = new Command();
  }

  getOptions = (): { [option: string]: any } => {
    this.setMetaData();
    this.setOptions();
    this.setArguments();
    const options = this.buildOptions();
    return options;
  };

  private setMetaData = (): void => {
    this.program
      .name("zuniq")
      .description("A CLI tool to remove adjacent duplicate lines from a file.")
      .version("1.0.0");
  };

  private buildOptions = (): { [option: string]: any } => {
    this.program.parse(process.argv);
    const options = this.program.opts();
    let { filePath, outputPath, count, repeated, unique } = options;
    filePath = Boolean(filePath) ? filePath : undefined;
    outputPath = Boolean(outputPath) ? outputPath : undefined;
    count = Boolean(count);
    repeated = Boolean(repeated);
    unique = Boolean(unique);
    return {
      filePath,
      outputPath,
      count,
      repeated,
      unique,
    };
  };

  private setOptions = (): void => {
    this.program
      .option("-u, --unique", "Print only unique lines.")
      .option("-o, --outputPath <outputPath>", "Path to the output file.")
      .option("-c, --count", "Print count of occurrences of each line.")
      .option("-d, --repeated", "Print only repeated lines.");
    //this.program.argument("<filePath>", "Path to the file.");
  };

  private setArguments = (): void => {
    this.program.argument("<filePath>", "Path to the file.");
  };
}

export { Cli };
