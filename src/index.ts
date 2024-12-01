import fs from "fs/promises";

export async function zuniq({
  filePath,
  content,
}: {
  filePath?: string;
  content?: string;
}): Promise<{
  out: string;
}> {
  if (content) {
    const lines = content.split("\n");
    const uniqueLines = lines.filter((line, index) => {
      return index === 0 || lines[index - 1] !== line;
    });
    const out = uniqueLines.join("\n").trim();
    return { out };
  }

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
