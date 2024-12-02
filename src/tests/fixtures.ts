import fs from "fs";

export const removeFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {}
};

export const setProcessArgV = (argv: string[]) => {
  Object.defineProperty(process, "argv", {
    get: () => argv,
    set: () => {},
  });
};

const testFilePath = "./test_data/test.txt";
const testFilePathWithNewlineEnd = "./test_data/test_empty_line.txt";
const countriesFilePath = "./test_data/countries.txt";
const outputFilePath = "./test_data/output.txt";
const warningInvalidPathValidContent = `Warning: Invalid file path 'invalid_path'. Using provided content.`;
const errorBothFileAndContent =
  "Error: Provide either a file path or content, not both";

export const filePaths = {
  testFilePath,
  testFilePathWithNewlineEnd,
  countriesFilePath,
  outputFilePath,
  warningInvalidPathValidContent,
  errorBothFileAndContent,
};
