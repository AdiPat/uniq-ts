import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { io } from "../io";

describe("io should", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  it("have 'createInterface' method", () => {
    expect(io.createInterface).toBeDefined();
  });
});
