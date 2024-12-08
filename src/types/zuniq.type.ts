export interface zUniqOptions {
  filePath?: string;
  content?: string;
  outputFilePath?: string;
  count?: boolean;
  repeated?: boolean;
  unique?: boolean;
}

export interface CliOptions {
  filePath?: string;
  outputPath?: string;
  count?: boolean;
  repeated?: boolean;
  unique?: boolean;
  ignoreCase?: boolean;
}

export interface zUniqBaseOutput {
  out: string;
}

export interface LineCount {
  [line: string]: number;
}
