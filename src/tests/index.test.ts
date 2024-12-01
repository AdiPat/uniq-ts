import { describe, expect, it } from "vitest";
import { zuniq } from "../index";
import fs from "fs";

describe("zuniq", () => {
  const testFilePath = "./test_data/test.txt";
  const countriesFilePath = "./test_data/countries.txt";

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
});
