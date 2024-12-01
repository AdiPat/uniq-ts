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
