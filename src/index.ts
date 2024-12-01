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
  if (filePath && content) return processFilePathAndContent(filePath, content);

  if (content) {
    return {
      out: processContent(content),
    };
  }

  await assertFileExists(filePath);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const out = processContent(fileContent);
  return { out };
}

const processFilePathAndContent = async (
  filePath: string,
  content: string
): Promise<{ out: string }> => {
  const fileExists = await assertFileExists(filePath)
    .then(() => true)
    .catch(() => false);

  if (fileExists) {
    throw new Error("Error: Provide either a file path or content, not both");
  }

  console.warn(
    `Warning: Invalid file path '${filePath}'. Using provided content.`
  );
  return {
    out: processContent(content),
  };
};

const processContent = (content: string) => {
  const lines = content.split("\n");
  const uniqueLines = lines.filter((line, index) => {
    return index === 0 || lines[index - 1] !== line;
  });
  return uniqueLines.join("\n").trim();
};

const assertFileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`Error: Invalid file path '${filePath}'`);
  }
};
