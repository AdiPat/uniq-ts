import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { Cli } from "../cli";
import { filePaths, setProcessArgV } from "./fixtures";
import * as Zuniq from "../zuniq";
import { io } from "../io";

describe("cli", () => {
  beforeEach(() => {
    setProcessArgV(["node", "zuniq", filePaths.testFilePath]);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  describe("program", () => {
    it("should be defined", () => {
      const cli = new Cli();
      expect(cli.program).toBeDefined();
    });
  });

  describe("getOptions", () => {
    it("should be defined", () => {
      const cli = new Cli();
      expect(cli.getOptions).toBeDefined();
    });

    it("should call option with -u unique flag", () => {
      const cli = new Cli();
      const optionSpy = vi.spyOn(cli.program, "option");
      cli.getOptions();
      expect(optionSpy).toHaveBeenCalledWith(
        "-u, --unique",
        "Print only unique lines."
      );
    });

    it("sets the cli metadata correctly", () => {
      const cli = new Cli();
      const nameSpy = vi.spyOn(cli.program, "name");
      const versionSpy = vi.spyOn(cli.program, "version");
      const descriptionSpy = vi.spyOn(cli.program, "description");
      cli.getOptions();
      expect(nameSpy).toBeCalledWith("zuniq");
      expect(descriptionSpy).toBeCalledWith(
        "A CLI tool to remove adjacent duplicate lines from a file."
      );
      expect(versionSpy).toBeCalledWith("1.0.0");
    });

    it("calls the option method to set the 'filePath'", async () => {
      const cli = new Cli();
      const optionSpy = vi.spyOn(cli.program, "option");
      cli.getOptions();
      expect(optionSpy.mock.calls[4]).toEqual([
        "-f, --filePath",
        "Path to the file.",
      ]);
    });

    it("calls the option method to set the 'outputPath'", async () => {
      const cli = new Cli();
      const optionSpy = vi.spyOn(cli.program, "option");
      cli.getOptions();
      expect(optionSpy.mock.calls[1]).toEqual([
        "-o, --outputPath <outputPath>",
        "Path to the output file.",
      ]);
    });

    it("calls the option method to set the 'count' flag", async () => {
      const cli = new Cli();
      const optionSpy = vi.spyOn(cli.program, "option");
      cli.getOptions();
      expect(optionSpy.mock.calls[2]).toEqual([
        "-c, --count",
        "Print count of occurrences of each line.",
      ]);
    });

    it("calls the option method to set the 'repeated' flag", async () => {
      const cli = new Cli();
      const optionSpy = vi.spyOn(cli.program, "option");
      cli.getOptions();
      expect(optionSpy.mock.calls[3]).toEqual([
        "-d, --repeated",
        "Print only repeated lines.",
      ]);
    });

    it("calls the option method to set the file path", async () => {
      const cli = new Cli();
      const optionSpy = vi.spyOn(cli.program, "option");
      cli.getOptions();
      expect(optionSpy.mock.calls[4]).toEqual([
        "-f, --filePath",
        "Path to the file.",
      ]);
    });

    it("calls the option method to set the 'ignore-case' flag", async () => {
      const cli = new Cli();
      const optionSpy = vi.spyOn(cli.program, "option");
      cli.getOptions();
      expect(optionSpy.mock.calls[5]).toEqual([
        "-i, --ignore-case",
        "Ignore case distinctions when comparing.",
      ]);
    });

    it("calls the parse method with process.argv", async () => {
      setProcessArgV(["node", "zuniq", filePaths.testFilePath, "-c"]);
      const cli = new Cli();
      const parseSpy = vi.spyOn(cli.program, "parse");
      cli.getOptions();
      expect(parseSpy).toBeCalledWith(process.argv);
    });

    it("calls opts method", async () => {
      const cli = new Cli();
      const optsSpy = vi.spyOn(cli.program, "opts");
      cli.getOptions();
      expect(optsSpy).toBeCalled();
    });

    it("returns the options", async () => {
      setProcessArgV(["node", "zuniq", filePaths.testFilePath, "-c"]);
      const cli = new Cli();
      const options = cli.getOptions();
      expect(options).toEqual({
        filePath: filePaths.testFilePath,
        count: true,
        outputPath: undefined,
        repeated: false,
        unique: false,
      });
    });

    it("parses all the arguments correctly", async () => {
      setProcessArgV([
        "node",
        "zuniq",
        filePaths.testFilePath,
        "-c",
        "-o",
        "output.txt",
        "-d",
        "-u",
      ]);
      const cli = new Cli();
      const options = cli.getOptions();
      expect(options).toEqual({
        filePath: filePaths.testFilePath,
        count: true,
        outputPath: "output.txt",
        repeated: true,
        unique: true,
      });
    });

    it.each(["-c", "--count", "-d", "--repeated", "-u", "--unique"])(
      `not consider this arg (%s) as filePath`,
      (flag) => {
        setProcessArgV(["node", "zuniq", flag]);
        const cli = new Cli();
        const options = cli.getOptions();
        expect(options).toEqual({
          filePath: undefined,
          count: flag === "-c" || flag === "--count",
          outputPath: undefined,
          repeated: flag === "-d" || flag === "--repeated",
          unique: flag === "-u" || flag === "--unique",
        });
      }
    );
  });

  describe("run should", () => {
    it("be defined", () => {
      const cli = new Cli();
      expect(cli.run).toBeDefined();
    });

    it("should call getOptions method", async () => {
      const cli = new Cli();
      const zuniqSpy = vi.spyOn(Zuniq, "zuniq");
      zuniqSpy.mockResolvedValue({ out: "" });
      const getOptionsSpy = vi.spyOn(cli, "getOptions");
      await cli.run();
      expect(getOptionsSpy).toBeCalled();
    });

    it("should call zuniq with the correct options", async () => {
      setProcessArgV(["node", "zuniq", filePaths.testFilePath]);
      const cli = new Cli();
      const zuniqSpy = vi.spyOn(Zuniq, "zuniq");
      await cli.run();
      expect(zuniqSpy).toBeCalledWith({
        filePath: filePaths.testFilePath,
        count: false,
        outputPath: undefined,
        repeated: false,
        unique: false,
      });
    });

    it("logs the output from zuniq if output file is not set", async () => {
      const cli = new Cli();
      const zuniqSpy = vi.spyOn(Zuniq, "zuniq");
      zuniqSpy.mockResolvedValue({ out: "output" });
      const consoleLogSpy = vi.spyOn(console, "log");
      await cli.run();
      expect(consoleLogSpy).toBeCalledWith("output");
    });

    it("read the input from stdin if filePath is not provided", async () => {
      setProcessArgV(["node", "zuniq"]);
      const cli = new Cli();
      const readFromStdinSpy = vi.spyOn(cli, "readFromStdin");
      readFromStdinSpy.mockResolvedValue("line1\nline2\nline3");
      const zuniqSpy = vi.spyOn(Zuniq, "zuniq");
      await cli.run();
      expect(readFromStdinSpy).toBeCalled();
      expect(zuniqSpy).toBeCalledWith({
        filePath: undefined,
        content: "line1\nline2\nline3",
        count: false,
        outputPath: undefined,
        repeated: false,
        unique: false,
      });
    });
  });

  describe("readFromStdin should", () => {
    it("be defined", () => {
      const cli = new Cli();
      expect(cli.readFromStdin).toBeDefined();
    });

    it("creates a readline interface", async () => {
      const createInterfaceSpy = vi.spyOn(io, "createInterface");
      const questionSpy = vi.fn();
      questionSpy.mockImplementation((question, cb) => {
        cb("input from stdin");
      });
      createInterfaceSpy.mockReturnValue({
        question: questionSpy,
        close: () => {},
      } as any);
      const cli = new Cli();
      await cli.readFromStdin();
      expect(createInterfaceSpy).toBeCalled();
    });

    it("returns the input from stdin", async () => {
      const createInterfaceSpy = vi.spyOn(io, "createInterface");
      const questionSpy = vi.fn();
      questionSpy.mockImplementation((question, cb) => {
        cb("input from stdin");
      });
      createInterfaceSpy.mockReturnValue({
        question: questionSpy,
        close: () => {},
      } as any);
      const cli = new Cli();

      const input = await cli.readFromStdin();
      expect(input).toEqual("input from stdin");
    });
  });
});
