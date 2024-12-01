import { describe, expect, it } from "vitest";
import { zuniq } from "../index";

describe("zuniq", () => {
  const testFilePath = "./test_data/test.txt";

  it("should be defined", () => {
    expect(zuniq).toBeDefined();
  });

  it("should accept a file path and return a unique list of string where adjacent repeated strings are removed", async () => {
    const { out } = await zuniq({ filePath: testFilePath });
    expect(out).toEqual(["line1", "line2", "line3", "line4"].join("\n"));
  });
});
