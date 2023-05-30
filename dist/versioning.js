"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Versioning = void 0;
const child_process = __importStar(require("child_process"));
const util = __importStar(require("util"));
class Versioning {
    static async run(config = { fileVersion: 'package.json' }) {
        return new Versioning().generate(config);
    }
    async generate(config) {
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
    async snapshot(config) {
        var _a;
        const separator = '-SNAPSHOT-';
        const semver = (await this.version(config.fileVersion)).split(separator)[0];
        return `${semver}${separator}${(_a = config.hash) !== null && _a !== void 0 ? _a : (await this.shortGithash())}`;
    }
    async version(file) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, import/no-dynamic-require
        return require(file).version;
    }
    async shortGithash() {
        const exec = util.promisify(child_process.exec);
        return (await exec('git rev-parse --short HEAD')).stdout;
    }
}
exports.Versioning = Versioning;
