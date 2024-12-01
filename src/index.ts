import fs from "fs/promises";

export async function zuniq({ filePath }: { filePath: string }): Promise<{
  out: string;
}> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const lines = fileContent.split("\n");
  const uniqueLines = lines.filter((line, index) => {
    return index === 0 || lines[index - 1] !== line;
  });
  return { out: uniqueLines.join("\n") };
}
