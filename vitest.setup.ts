import '@testing-library/jest-dom/vitest';
import 'reflect-metadata';
import 'zone.js';
import 'zone.js/plugins/async-test';
import 'zone.js/plugins/fake-async-test';
import 'zone.js/plugins/proxy';
import 'zone.js/plugins/sync-test';
const zoneGlobal = (globalThis as { Zone?: any }).Zone;
if (zoneGlobal && zoneGlobal.ProxyZoneSpec && zoneGlobal.SyncTestZoneSpec && !zoneGlobal.__vitest_zone_patch__) {
  zoneGlobal.__vitest_zone_patch__ = true;
  const rootZone = zoneGlobal.current;
  const syncZone = rootZone.fork(new zoneGlobal.SyncTestZoneSpec('vitest.describe'));

  const wrapArguments = (
    args: IArguments,
    syncWrapper: (fn: (...fnArgs: unknown[]) => unknown) => (...fnArgs: unknown[]) => unknown,
    asyncWrapper?: (fn: (...fnArgs: unknown[]) => unknown) => (...fnArgs: unknown[]) => unknown,
  ): unknown[] => {
    const arrayArgs = Array.from(args);
    for (let index = 0; index < arrayArgs.length; index += 1) {
      const arg = arrayArgs[index];
      if (typeof arg === 'function') {
        const wrapped = arg.length > 0 && asyncWrapper ? asyncWrapper(arg) : syncWrapper(arg);
        wrapped.toString = () => arg.toString();
        arrayArgs[index] = wrapped;
      }
    }

    return arrayArgs;
  };

  const wrapDescribe = (args: IArguments): unknown[] => {
    const syncWrapper = (fn: (...fnArgs: unknown[]) => unknown) => {
      return function (...fnArgs: unknown[]) {
        return syncZone.run(fn, this, fnArgs);
      };
    };

    return wrapArguments(args, syncWrapper);
  };

  const wrapInProxyZone = (fn: (...fnArgs: unknown[]) => unknown) => {
    return function (...fnArgs: unknown[]) {
      const zone = rootZone.fork(new zoneGlobal.ProxyZoneSpec());
      return zone.run(fn, this, fnArgs);
    };
  };

  const wrapTest = (args: IArguments): unknown[] => {
    const syncWrapper = (fn: (...fnArgs: unknown[]) => unknown) => wrapInProxyZone(fn);
    const asyncWrapper = (fn: (...fnArgs: unknown[]) => unknown) => wrapInProxyZone(fn);
    return wrapArguments(args, syncWrapper, asyncWrapper);
  };

  const original = {
    describe: globalThis.describe,
    it: globalThis.it,
    test: globalThis.test,
    beforeEach: globalThis.beforeEach,
    afterEach: globalThis.afterEach,
    beforeAll: globalThis.beforeAll,
    afterAll: globalThis.afterAll,
  };

  globalThis.describe = function (...args: Parameters<typeof describe>): ReturnType<typeof describe> {
    return original.describe.apply(this, wrapDescribe(arguments) as Parameters<typeof describe>);
  } as typeof describe;
  globalThis.describe.skip = function (...args: Parameters<typeof describe.skip>): ReturnType<typeof describe.skip> {
    return original.describe.skip.apply(this, wrapDescribe(arguments) as Parameters<typeof describe.skip>);
  };
  if (original.describe.only) {
    globalThis.describe.only = function (...args: Parameters<NonNullable<typeof describe.only>>): ReturnType<NonNullable<typeof describe.only>> {
      return original.describe.only!.apply(this, wrapDescribe(arguments) as Parameters<NonNullable<typeof describe.only>>);
    };
  }

  const patchTestLike = <T extends Function>(target: T, fallback: T) => {
    return function patched(this: unknown): unknown {
      return (target || fallback).apply(this, wrapTest(arguments));
    } as unknown as T;
  };

  globalThis.it = patchTestLike(original.it, original.test);
  globalThis.test = patchTestLike(original.test, original.it);
  globalThis.it.skip = patchTestLike(original.it?.skip, original.test?.skip ?? original.it?.skip);
  globalThis.test.skip = patchTestLike(original.test?.skip, original.it?.skip ?? original.test?.skip);
  if (original.it?.only) {
    globalThis.it.only = patchTestLike(original.it.only, original.test?.only ?? original.it.only);
  }
  if (original.test?.only) {
    globalThis.test.only = patchTestLike(original.test.only, original.it?.only ?? original.test.only);
  }

  const patchHook = (hook?: typeof beforeEach) => {
    if (!hook) {
      return undefined;
    }

    return function patchedHook(this: unknown): unknown {
      return hook.apply(this, wrapTest(arguments) as Parameters<typeof hook>);
    };
  };

  globalThis.beforeEach = patchHook(original.beforeEach) as typeof beforeEach;
  globalThis.afterEach = patchHook(original.afterEach) as typeof afterEach;
  globalThis.beforeAll = patchHook(original.beforeAll) as typeof beforeAll;
  globalThis.afterAll = patchHook(original.afterAll) as typeof afterAll;

  const proxyZoneStub = {
    resetDelegate: () => {},
    setDelegate: () => {},
    getDelegate: () => null,
  };
  zoneGlobal.ProxyZoneSpec.isLoaded = () => true;
  zoneGlobal.ProxyZoneSpec.get = () => proxyZoneStub;
  zoneGlobal.ProxyZoneSpec.assertPresent = () => proxyZoneStub;
}
(globalThis as { jasmine?: unknown }).jasmine = undefined;
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

let isAngularTestBedInitialized = false;

beforeAll(() => {
  if (isAngularTestBedInitialized) {
    return;
  }

  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
      teardown: { destroyAfterEach: true },
    },
  );

  isAngularTestBedInitialized = true;
});

afterEach(() => {
  if (!isAngularTestBedInitialized) {
    return;
  }

  getTestBed().resetTestingModule();
});

afterAll(() => {
  if (!isAngularTestBedInitialized) {
    return;
  }

  getTestBed().resetTestEnvironment();
  isAngularTestBedInitialized = false;
});
