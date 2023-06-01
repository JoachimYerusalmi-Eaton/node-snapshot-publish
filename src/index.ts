import * as core from '@actions/core';
import * as path from 'path';
import {Versioning} from './versioning';

async function run(): Promise<void> {
  try {
    const fileVersion = core.getInput('fileVersion');
    const snapshot = await Versioning.run({
      fileVersion: path.join(
        process.env.GITHUB_WORKSPACE ?? '',
        fileVersion ?? 'package.json',
      ),
    });
    core.setOutput('snapshot', snapshot);
    core.debug(snapshot);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
