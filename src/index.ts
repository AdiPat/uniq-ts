import { appCli } from "./cli";

export async function startZuniq(): Promise<void> {
  await appCli.run();
}

if (require.main === module) {
  startZuniq();
}
