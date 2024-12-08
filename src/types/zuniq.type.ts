export interface zUniqBaseOptions {
  filePath?: string;
  outputPath?: string;
  count?: boolean;
  repeated?: boolean;
  unique?: boolean;
  ignoreCase?: boolean;
}

export interface zUniqOptions extends zUniqBaseOptions {
  content?: string;
}

export interface CliOptions extends zUniqBaseOptions {}

export interface zUniqBaseOutput {
  out: string;
}

export interface LineCount {
  [line: string]: number;
}
