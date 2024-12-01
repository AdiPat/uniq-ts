import fs from "fs/promises";

export async function zuniq({
  filePath,
  content,
  outputFilePath,
  count,
  repeated,
}: {
  filePath?: string;
  content?: string;
  outputFilePath?: string;
  count?: boolean;
  repeated?: boolean;
}): Promise<{
  out: string;
}> {
  if (repeated) {
    return processRepeatedLines(filePath, content);
  }

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

  if (count) {
    let rawContent = await getRawContent(filePath, content);
    const linesCount = buildLinesCount(rawContent);
    result.out = await getOutputWithCount(result.out, linesCount);
  }

  if (!outputFilePath) {
    return result;
  }

  await writeToOutputFile(outputFilePath, result.out);

  return result;
}

const processRepeatedLines = async (
  filePath: string,
  content: string
): Promise<{ out: string }> => {
  const rawContent = await getRawContent(filePath, content);
  const lines = rawContent.split("\n");
  const linesCount = buildLinesCount(rawContent);
  const repeatedLines = lines.filter((line) => linesCount[line] > 1);
  const repeatedLinesUnique = Array.from(new Set(repeatedLines));
  const out = repeatedLinesUnique.join("\n");
  return { out };
};

const getRawContent = async (
  filePath: string,
  content: string
): Promise<string> => {
  let rawContent = "";
  const fileExists = await assertFileExists(filePath)
    .then(() => true)
    .catch(() => false);
  if (fileExists && !content) {
    rawContent = await fs.readFile(filePath, "utf-8");
  } else if (!fileExists && content) {
    console.warn(
      `Warning: Invalid file path '${filePath}'. Using provided content.`
    );
    rawContent = content;
  } else if (fileExists && content) {
    throw new Error("Error: Provide either a file path or content, not both");
  }

  return rawContent;
};

const buildLinesCount = (
  rawContent: string
): {
  [key: string]: number;
} => {
  const lines = rawContent.split("\n");
  const linesCount: {
    [key: string]: number;
  } = {};

  lines.forEach((line) => {
    linesCount[line] = (linesCount[line] || 0) + 1;
  });

  return linesCount;
};

const getOutputWithCount = async (
  rawContent: string,
  linesCount: { [line: string]: number }
): Promise<string> => {
  const outputLines = rawContent.split("\n");
  const outputWithCount = outputLines.map((line) => {
    const count = linesCount[line];
    return `${count} ${line}`;
  });
  return outputWithCount.join("\n");
};

const writeToOutputFile = async (outputFilePath: string, content: string) => {
  const outputFileExists = await assertFileExists(outputFilePath)
    .then(() => true)
    .catch(() => false);

  if (!outputFileExists) {
    const fileCreated = await fs
      .writeFile(outputFilePath, "")
      .then(() => true)
      .catch((): any => null);
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
