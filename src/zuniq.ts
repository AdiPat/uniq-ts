import fs from "fs/promises";
import { LineCount, zUniqBaseOutput, zUniqOptions } from "./types";

const trailingNewlinesRegex = /(\n+|\r\n+)$/;

export async function zuniq(opts: zUniqOptions): Promise<{
  out: string;
}> {
  if (opts.repeated && opts.unique) {
    console.warn("Warning: Provide either 'repeated' or 'unique', not both.");
    return { out: "" };
  }

  if (opts.repeated) {
    return processRepeatedLines(
      opts.filePath,
      opts.content,
      opts.count,
      opts.ignoreCase
    );
  }

  let result = null;
  if (opts.filePath && opts.content) {
    result = await processFilePathAndContent(
      opts.filePath,
      opts.content,
      opts.ignoreCase
    );
  } else if (opts.content) {
    result = { out: await processContent(opts.content, opts.ignoreCase) };
  } else {
    await assertFileExists(opts.filePath);
    const fileContent = await fs.readFile(opts.filePath, "utf-8");
    result = { out: await processContent(fileContent, opts.ignoreCase) };
  }

  if (opts.count) {
    let rawContent = await getRawContent(opts.filePath, opts.content);
    const linesCount = buildLinesCount(rawContent);
    result.out = await getOutputWithCount(result.out, linesCount);
  }

  if (!opts.outputPath) {
    return result;
  }

  await writeToOutputFile(opts.outputPath, result.out);
  return result;
}

const lineFilter = (linesCount: LineCount) => (line: string) =>
  linesCount[line] > 1;

const processRepeatedLinesWithIgnoreCase = async (
  rawContent: string,
  countEnabled: boolean
) => {
  const ignoreCase = true;
  const lineCountWithNoCase = buildLinesCount(rawContent, ignoreCase);
  const lines = Object.keys(lineCountWithNoCase);
  const repeatedLines = lines.filter(lineFilter(lineCountWithNoCase));
  const out = Array.from(new Set(repeatedLines)).join("\n");

  if (countEnabled) {
    return {
      out: await getOutputWithCount(out, lineCountWithNoCase),
    };
  }

  return { out };
};

const processRepeatedLinesWitoutIgnoreCase = async (
  rawContent: string,
  countEnabled: boolean
) => {
  const linesCount = buildLinesCount(rawContent);

  const repeatedLines = Object.keys(linesCount).filter(lineFilter(linesCount));
  const out = Array.from(new Set(repeatedLines)).join("\n");

  if (countEnabled) {
    return {
      out: await getOutputWithCount(out, linesCount),
    };
  }

  return { out };
};

const processRepeatedLines = async (
  filePath: string,
  content: string,
  count: boolean,
  ignoreCase: boolean
): Promise<zUniqBaseOutput> => {
  const rawContent = await getRawContent(filePath, content);

  if (ignoreCase) {
    return processRepeatedLinesWithIgnoreCase(rawContent, count);
  }

  return processRepeatedLinesWitoutIgnoreCase(rawContent, count);
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

const findLineKey = (caseInsensitiveLinesCount: LineCount, line: string) => {
  let lineKey = "";
  Object.keys(caseInsensitiveLinesCount).forEach((key) => {
    if (key.toLowerCase() === line.toLowerCase()) {
      lineKey = key;
    }
  });
  return lineKey;
};

const updateLinesCount = (line: string, lineCount: LineCount) => {
  const lowerCaseLine = line.toLowerCase();
  let lineKey = findLineKey(lineCount, lowerCaseLine);

  if (lineKey) {
    lineCount[lineKey] += 1;
  } else {
    lineCount[line] = 1;
  }
};

const buildCaseInsensitiveLinesCount = (rawContent: string): LineCount => {
  const lines = rawContent.split("\n");
  let caseInsensitiveLinesCount: LineCount = {};
  lines.forEach((line) => updateLinesCount(line, caseInsensitiveLinesCount));
  return caseInsensitiveLinesCount;
};

const buildCaseSensitiveLineCount = (rawContent: string): LineCount => {
  const lines = rawContent.split("\n");
  const linesCount: LineCount = {};

  lines.forEach((line) => {
    linesCount[line] = (linesCount[line] || 0) + 1;
  });

  return linesCount;
};

const buildLinesCount = (
  rawContent: string,
  caseSensitive = false
): LineCount => {
  if (caseSensitive) {
    return buildCaseInsensitiveLinesCount(rawContent);
  }

  return buildCaseSensitiveLineCount(rawContent);
};

const getOutputWithCount = async (
  rawContent: string,
  linesCount: LineCount
): Promise<string> => {
  const outputLines = rawContent.split("\n");
  const outputWithCount = outputLines.map((line) => {
    const key = findLineKey(linesCount, line);
    const count = linesCount[key];
    return `${count} ${line}`;
  });
  return outputWithCount.join("\n");
};

const writeToOutputFile = async (
  outputFilePath: string,
  content: string
): Promise<void> => {
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
  content: string,
  ignoreCase: boolean
): Promise<zUniqBaseOutput> => {
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
    out: processContent(content, ignoreCase),
  };
};

const getTrailingNewlinesCount = (content: string): number => {
  const trailingNewlinesMatch = content.match(trailingNewlinesRegex);
  return trailingNewlinesMatch ? trailingNewlinesMatch[0].length : 0;
};

const updateTrailingNewlines = (
  content: string,
  trailingNewlinesCount: number
): string => {
  content = content.replace(/\n+/g, "\n");
  if (trailingNewlinesCount >= 1) {
    return content.replace(trailingNewlinesRegex, "\n");
  } else {
    return content.trimEnd();
  }
};

const compareLineWithPreviousLine = (
  line: string,
  index: number,
  lines: string[],
  ignoreCase: boolean
) => {
  if (ignoreCase) {
    return index === 0 || lines[index - 1].toLowerCase() !== line.toLowerCase();
  }

  return index === 0 || lines[index - 1] !== line;
};

const processContent = (content: string, ignoreCase: boolean): string => {
  const lines = content.split("\n");
  const uniqueLines = lines.filter((line, index) => {
    line = line.replace(/\r/g, "");

    if (line == "") {
      return true; // keep empty lines
    }

    return compareLineWithPreviousLine(line, index, lines, ignoreCase);
  });

  const outWithDuplicateNewslines = uniqueLines.join("\n");
  const trailingNewlinesCount = getTrailingNewlinesCount(content);
  const out = updateTrailingNewlines(
    outWithDuplicateNewslines,
    trailingNewlinesCount
  );
  return out;
};

const assertFileExists = async (filePath: string): Promise<void> => {
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`Error: Invalid file path '${filePath}'`);
  }
};
