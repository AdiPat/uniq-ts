import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { filePaths, removeFile, setProcessArgV } from "./fixtures";
import { startZuniq } from "../index";
import { appCli } from "../cli";

describe("index should", () => {
  beforeEach(() => {
    setProcessArgV(["node", "zuniq", filePaths.testFilePath]);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await removeFile(filePaths.outputFilePath);
  });

  describe("startZuniq should", () => {
    it("be defined", () => {
      expect(startZuniq).toBeDefined();
    });

    it("should ", async () => {
      const runSpy = vi.spyOn(appCli, "run");
      await startZuniq();
      expect(runSpy).toHaveBeenCalled();
    });
  });
});
