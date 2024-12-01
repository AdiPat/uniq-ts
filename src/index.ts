import fs from "fs/promises";

export async function zuniq({ filePath }: { filePath: string }): Promise<{
  out: string;
}> {
  await assertFileExists(filePath);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const lines = fileContent.split("\n");
  const uniqueLines = lines.filter((line, index) => {
    return index === 0 || lines[index - 1] !== line;
  });
  return { out: uniqueLines.join("\n") };
}

const assertFileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`Error: Invalid file path '${filePath}'`);
  }
};
