import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { zuniq } from "../index";
import fs from "fs";
import { removeFile } from "./fixtures";

describe("zuniq", () => {
  const testFilePath = "./test_data/test.txt";
  const countriesFilePath = "./test_data/countries.txt";
  const outputFilePath = "./test_data/output.txt";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await removeFile(outputFilePath);
  });

  it("should be defined", () => {
    expect(zuniq).toBeDefined();
  });

  it("should accept a file path and return a unique list of string where adjacent repeated strings are removed", async () => {
    const { out } = await zuniq({ filePath: testFilePath });
    expect(out).toEqual(["line1", "line2", "line3", "line4"].join("\n"));
  });

  it("should return empty string if file is empty", async () => {
    const { out } = await zuniq({ filePath: "./test_data/empty.txt" });
    expect(out).toEqual("");
  });

  it("should throw an error if file does not exist", async () => {
    const promise = zuniq({ filePath: "./test_data/non_existent.txt" });
    await expect(promise).rejects.toThrow(
      "Error: Invalid file path './test_data/non_existent.txt'"
    );
  });

  it("should return the correct output for a large file with 200+ lines", async () => {
    const { out } = await zuniq({ filePath: countriesFilePath });
    const countriesResult = fs.readFileSync(
      "test_data/countries_result.txt",
      "utf-8"
    );
    expect(out).toEqual(countriesResult);
  });

  it("should take raw content as input and return a correct result", async () => {
    const content = "line1\nline1\nline2\nline2\nline3\nline3";
    const { out } = await zuniq({ content });
    expect(out).toEqual("line1\nline2\nline3");
  });

  it("should throw an error if both valid file path and content are provided", async () => {
    const promise = zuniq({
      filePath: testFilePath,
      content: "line1\nline2\nline3",
    });
    await expect(promise).rejects.toThrow(
      "Error: Provide either a file path or content, not both"
    );
  });

  it("use 'content' if file path is invalid and log a warning message", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn");
    const content = "line1\nline2\nline3";
    const { out } = await zuniq({ filePath: "invalid_path", content });
    expect(out).toEqual("line1\nline2\nline3");
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Warning: Invalid file path 'invalid_path'. Using provided content."
    );
  });

  it("should write to provided output file if provided", async () => {
    const outputFilePath = "./test_data/output.txt";
    await zuniq({ filePath: testFilePath, outputFilePath });
    const outputContent = fs.readFileSync(outputFilePath, "utf-8");
    expect(outputContent).toEqual(
      ["line1", "line2", "line3", "line4"].join("\n")
    );
  });

  it("should throw an error if writing to the output file failed", async () => {
    const promise = zuniq({
      filePath: testFilePath,
      outputFilePath: "/invalid_path/output.txt",
    });
    await expect(promise).rejects.toThrow(
      "Error: Invalid file path '/invalid_path/output.txt'"
    );
  });

  it("should include a 'count' of number of times a line appears in the input", async () => {
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

  it("should include a 'count' of number of times a line appears in the input for a file", async () => {
    const { out } = await zuniq({
      filePath: testFilePath,
      count: true,
    });
    expect(out).toEqual(
      ["1 line1", "2 line2", "1 line3", "1 line4"].join("\n")
    );
  });

  it("should include 'count' of number of times line appears in the input in the output file when specified", async () => {
    await zuniq({
      filePath: testFilePath,
      outputFilePath,
      count: true,
    });
    const outputContent = fs.readFileSync(outputFilePath, "utf-8");
    expect(outputContent).toEqual(
      ["1 line1", "2 line2", "1 line3", "1 line4"].join("\n")
    );
  });
});
