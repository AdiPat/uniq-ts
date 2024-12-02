import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { Cli } from "../cli";
import { setProcessArgV } from "./fixtures";

describe("cli", () => {
  beforeEach(() => {
    setProcessArgV(["node", "zuniq", "test.txt"]);
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

    it("calls the parse method with process.argv", async () => {
      setProcessArgV(["node", "zuniq", "test.txt", "-c"]);
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
      setProcessArgV(["node", "zuniq", "test.txt", "-c"]);
      const cli = new Cli();
      const options = cli.getOptions();
      expect(options).toEqual({
        filePath: "test.txt",
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
        "test.txt",
        "-c",
        "-o",
        "output.txt",
        "-d",
        "-u",
      ]);
      const cli = new Cli();
      const options = cli.getOptions();
      expect(options).toEqual({
        filePath: "test.txt",
        count: true,
        outputPath: "output.txt",
        repeated: true,
        unique: true,
      });
    });

    it.each(["-c", "--count", "-d", "--repeated", "-u", "--unique"])(
      `should not consider this arg (%s) as filePath`,
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
});
