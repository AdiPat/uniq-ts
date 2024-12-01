import fs from "fs/promises";

export async function zuniq({
  filePath,
  content,
  outputFilePath,
}: {
  filePath?: string;
  content?: string;
  outputFilePath?: string;
}): Promise<{
  out: string;
}> {
  let result = null;
  if (filePath && content) {
    result = await processFilePathAndContent(filePath, content);
  } else if (content) {
    result = { out: await processContent(content) };
  } else {
    await assertFileExists(filePath);
    const fileContent = await fs.readFile(filePath, "utf-8");
    result = { out: await processContent(fileContent) };
  }

  if (!outputFilePath) {
    return result;
  }

  await writeToOutputFile(outputFilePath, result.out);

  return result;
}

const writeToOutputFile = async (outputFilePath: string, content: string) => {
  const outputFileExists = await assertFileExists(outputFilePath)
    .then(() => true)
    .catch(() => false);

  if (!outputFileExists) {
    const fileCreated = await fs
      .writeFile(outputFilePath, "")
      .then(() => true)
      .catch((err) => null);
    if (!fileCreated) {
      throw new Error(`Error: Invalid file path '${outputFilePath}'`);
    }
  }

  await fs.writeFile(outputFilePath, content);
};

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
