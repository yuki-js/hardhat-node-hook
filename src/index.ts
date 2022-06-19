import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { TASK_NODE } from "hardhat/builtin-tasks/task-names";

type Hook = (hre: HardhatRuntimeEnvironment) => Promise<void>;
const hooks = {
  initialized: [] as Hook[],
};

export function onNetworkInitialized(hook: Hook) {
  hooks.initialized.push(hook);
}

task(TASK_NODE)
  .addFlag("ignoreHook", "Ignore the network initialized hook")
  .setAction(async ({ ignoreHook }: { ignoreHook: boolean }, hre, runSuper) => {
    if (!ignoreHook) {
      for (const initHook of hooks.initialized) {
        await initHook(hre);
      }
    }
    await runSuper();
  });
