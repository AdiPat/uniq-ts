import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { zuniq } from "../zuniq";
import fs from "fs";
import { filePaths, removeFile } from "./fixtures";

describe("zuniq", () => {
  const {
    countriesFilePath,
    errorBothFileAndContent,
    outputPath,
    testFilePath,
    testFilePathWithNewlineEnd,
    warningInvalidPathValidContent,
  } = filePaths;
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await removeFile(outputPath);
  });

  describe("basic functionality should", () => {
    it("be defined", () => {
      expect(zuniq).toBeDefined();
    });

    it("accept a file path and return a unique list of string where adjacent repeated strings are removed", async () => {
      const { out } = await zuniq({ filePath: testFilePath });
      expect(out).toEqual(["line1", "line2", "line3", "line4"].join("\n"));
    });

    it("return empty string if file is empty", async () => {
      const { out } = await zuniq({ filePath: "./test_data/empty.txt" });
      expect(out).toEqual("");
    });

    it("throw an error if file does not exist", async () => {
      const promise = zuniq({ filePath: "./test_data/non_existent.txt" });
      await expect(promise).rejects.toThrow(
        "Error: Invalid file path './test_data/non_existent.txt'"
      );
    });

    it("return the correct output for a large file with 200+ lines", async () => {
      const { out } = await zuniq({ filePath: countriesFilePath });
      const countriesResult = fs.readFileSync(
        "test_data/countries_result.txt",
        "utf-8"
      );
      expect(out).toEqual(countriesResult);
    });

    it("take raw content as input and return a correct result", async () => {
      const content = "line1\nline1\nline2\nline2\nline3\nline3";
      const { out } = await zuniq({ content });
      expect(out).toEqual("line1\nline2\nline3");
    });

    it("throw an error if both valid file path and content are provided", async () => {
      const promise = zuniq({
        filePath: testFilePath,
        content: "line1\nline2\nline3",
      });
      await expect(promise).rejects.toThrow(errorBothFileAndContent);
    });

    it("use 'content' if file path is invalid and log a warning message", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn");
      const content = "line1\nline2\nline3";
      const { out } = await zuniq({ filePath: "invalid_path", content });
      expect(out).toEqual("line1\nline2\nline3");
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        warningInvalidPathValidContent
      );
    });
  });

  describe("when 'outputFilePath' is provided", () => {
    it("write to provided output file if provided", async () => {
      const outputPath = "./test_data/output-2.txt";
      await zuniq({ filePath: testFilePath, outputPath });
      const outputContent = fs.readFileSync(outputPath, "utf-8");
      expect(outputContent).toEqual(
        ["line1", "line2", "line3", "line4"].join("\n")
      );
      await removeFile(outputPath);
    });

    it("throw an error if writing to the output file failed", async () => {
      const promise = zuniq({
        filePath: testFilePath,
        outputPath: "/invalid_path/output.txt",
      });
      await expect(promise).rejects.toThrow(
        "Error: Invalid file path '/invalid_path/output.txt'"
      );
    });
  });

  describe("when 'count' is true should", () => {
    it("include a 'count' of number of times a line appears in the input", async () => {
      const input = [
          "line1",
          "line1",
          "line2",
          "line3",
          "line3",
          "line3",
          "line4",
        ].join("\n"),
        { out } = await zuniq({ content: input, count: true });
      expect(out).toEqual(
        ["2 line1", "1 line2", "3 line3", "1 line4"].join("\n")
      );
    });

    it("include a 'count' of number of times a line appears in the input for a file", async () => {
      const { out } = await zuniq({
        filePath: testFilePath,
        count: true,
      });
      expect(out).toEqual(
        ["1 line1", "2 line2", "1 line3", "1 line4"].join("\n")
      );
    });

    it("include 'count' of number of times line appears in the input in the output file when specified", async () => {
      await zuniq({
        filePath: testFilePath,
        outputPath,
        count: true,
      });
      const outputContent = fs.readFileSync(outputPath, "utf-8");
      expect(outputContent).toEqual(
        ["1 line1", "2 line2", "1 line3", "1 line4"].join("\n")
      );
    });
  });

  describe("when 'repeated' is true", () => {
    it("includes only repeated lines", async () => {
      const input = [
        "line1",
        "line1",
        "line2",
        "line3",
        "line3",
        "line3",
        "line4",
      ].join("\n");
      const { out } = await zuniq({ content: input, repeated: true });
      expect(out).toEqual(["line1", "line3"].join("\n"));
    });

    it("should log warning message if 'filePath' is invalid and 'content' is provided", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn");
      const content = [
        "line1",
        "line1",
        "line2",
        "line3",
        "line3",
        "line3",
        "line4",
      ].join("\n");

      const { out } = await zuniq({
        filePath: "invalid_path",
        content,
        repeated: true,
      });
      expect(out).toEqual(["line1", "line3"].join("\n"));
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        warningInvalidPathValidContent
      );
    });

    it("should throw an error if both valid file path and content are provided", async () => {
      const promise = zuniq({
        filePath: testFilePath,
        content: "line1\nline2\nline3",
        repeated: true,
      });
      await expect(promise).rejects.toThrow(errorBothFileAndContent);
    });

    it("'count' should return the correct number of repeated values", async () => {
      const input = [
        "line1",
        "line1",
        "line2",
        "line3",
        "line3",
        "line3",
        "line4",
      ].join("\n");
      const { out } = await zuniq({
        content: input,
        repeated: true,
        count: true,
      });
      expect(out).toEqual(["2 line1", "3 line3"].join("\n"));
    });
  });

  describe("'unique' arg should", () => {
    it("log warning message if 'repeated' is true and 'unique' is true that both used together will give empty result", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn");
      const { out } = await zuniq({
        filePath: testFilePath,
        unique: true,
        repeated: true,
      });
      expect(out).toEqual("");
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Warning: Provide either 'repeated' or 'unique', not both."
      );
    });

    it("assume 'unique' as true if 'repeated' is not provided", async () => {
      const { out } = await zuniq({ filePath: testFilePath, unique: true });
      expect(out).toEqual(["line1", "line2", "line3", "line4"].join("\n"));
    });

    it("assume 'unique' as true if 'repeated' is false", async () => {
      const { out } = await zuniq({
        filePath: testFilePath,
        repeated: false,
        unique: true,
      });
      expect(out).toEqual(["line1", "line2", "line3", "line4"].join("\n"));
    });
  });

  describe("when 'ignoreCase' is true", () => {
    it("should ignore case when comparing lines", async () => {
      const content = "line1\nLine1\nline2\nLine2\nline3\nLine3";
      const { out } = await zuniq({ content, ignoreCase: true });
      expect(out).toEqual("line1\nline2\nline3");
    });

    it("should ignore case when comparing lines and when 'repeated' is true", async () => {
      const content = "line1\nLine1\nline2\nLine2\nline3\nLine3";
      const { out } = await zuniq({
        content,
        ignoreCase: true,
        repeated: true,
      });
      expect(out).toEqual("line1\nline2\nline3");
    });

    it("should use the first instance of the line when 'repeated' is true", async () => {
      const content = "liNe1\nLine1\nline2\nLine2\nLinE3\nLine3";
      const { out } = await zuniq({
        content,
        ignoreCase: true,
        repeated: true,
      });
      expect(out).toEqual("liNe1\nline2\nLinE3");
    });

    it("should include the count of lines when 'count' is true and 'repeated' is true", async () => {
      const content = "line1\nLine1\nline2\nLine2\nline3\nLine3";
      const { out } = await zuniq({
        content,
        ignoreCase: true,
        count: true,
        repeated: true,
      });
      expect(out).toEqual("2 line1\n2 line2\n2 line3");
    });
  });

  describe("input format variations should", () => {
    it("handle mixed line endings", async () => {
      const content = "line1\nline1\r\nline2\nline2\r\nline3\nline3\r\n";
      const { out } = await zuniq({ content });
      expect(out).toEqual("line1\nline2\nline3\n");
    });

    it("handle lines with special characters", async () => {
      const content = "line1\nline1\nline@2\nline@2\nline#3\nline#3";
      const { out } = await zuniq({ content });
      expect(out).toEqual("line1\nline@2\nline#3");
    });

    it("handle very large input", async () => {
      const largeContent = new Array(10)
        .fill(0)
        .map((_i, i) =>
          new Array(100000).fill(`line${i}\nline${i}\nline${i}`).join("\n")
        )
        .join("\n");

      const { out } = await zuniq({ content: largeContent });
      expect(out).toEqual(
        "line0\nline1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9"
      );
    });

    it("handle input with only repeated lines", async () => {
      const content = "line1\nline1\nline1\nline1\nline1";
      const { out } = await zuniq({ content });
      expect(out).toEqual("line1");
    });

    it("handle input with empty lines", async () => {
      const content = "\n\nline1\n\nline2\n\nline3\n\n";
      const { out } = await zuniq({ content });
      expect(out).toEqual("\nline1\nline2\nline3\n");
    });

    it("correctly return the output if there is a single newline at the end", async () => {
      const { out } = await zuniq({ filePath: testFilePathWithNewlineEnd });
      expect(out).toEqual(
        ["line1", "line2", "line3", "line4"].join("\n") + "\n"
      );
    });

    it("should not include whitespace when considering duplicates", async () => {
      const content = "line1\n line1\nline1\nline 1\nline1\nline1";
      const { out } = await zuniq({ content });
      expect(out).toEqual("line1\n line1\nline1\nline 1\nline1");
    });
  });
});
