import * as child_process from 'child_process';
import * as util from 'util';

export interface IConfigVersioning {
  hash?: string;
  fileVersion: string;
}

export class Versioning {
  static async run(
    config: IConfigVersioning = {fileVersion: 'package.json'},
  ): Promise<string> {
    return new Versioning().generate(config);
  }

  async generate(config: IConfigVersioning): Promise<string> {
    const version = await this.snapshot(config);
    if (!version) {
      throw new Error('empty version, no version generated');
    }
    return version;
  }

  // TODO: move to action
  // private async write(snapshotVersion: string): Promise<string> {
  //   // eslint-disable-next-line no-console
  //   console.log('snapshot version', snapshotVersion);

  //   const exec = util.promisify(child_process.exec);
  //   await exec(`npm pkg set version=${snapshotVersion}`);
  //   return snapshotVersion;
  // }

  private async snapshot(config: IConfigVersioning): Promise<string> {
    const separator = '-SNAPSHOT-';
    const semver = (await this.version(config.fileVersion)).split(separator)[0];

    return `${semver}${separator}${config.hash ?? (await this.shortGithash())}`;
  }

  private async version(file: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, import/no-dynamic-require
    return require(file).version;
  }

  private async shortGithash(): Promise<string> {
    const exec = util.promisify(child_process.exec);
    return (await exec('git rev-parse --short HEAD')).stdout;
  }
}
