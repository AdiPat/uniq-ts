export interface zUniqOptions {
  filePath?: string;
  content?: string;
  outputFilePath?: string;
  count?: boolean;
  repeated?: boolean;
  unique?: boolean;
}

export interface zUniqBaseOutput {
  out: string;
}
