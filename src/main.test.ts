import {Versioning} from './versioning';
import {expect, test} from '@jest/globals';

test('snapshot', async () => {
  const version = await Versioning.run({
    fileVersion: './package-stub.json',
    hash: 'hash',
  });
  expect(version).toEqual('1.0.0-SNAPSHOT-hash');
});
