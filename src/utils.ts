import path from 'path'
import { normalizePath } from 'vite'
import fs from 'fs'

export function resolveNodeModules(libName: string, ...dir: string[]) {
  const modulePath = normalizePath(require.resolve(libName))
  const lastIndex = modulePath.indexOf(libName)

  return normalizePath(path.resolve(modulePath.substring(0, lastIndex), ...dir))
}

export function resolvePnp(module: string) {
  try {
    return normalizePath(require.resolve(module))
  } catch (error) {
    return ''
  }
}

export const isPnp = !!process.versions.pnp

export function isRegExp(value: unknown) {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}

// export function judgeResultFun(arr1: readonly string[], arr2: string[]) {
//   let flag = true;
//   if (arr1.length !== arr2.length) {
//     flag = false;
//   } else {
//     arr1.forEach((item) => {
//       if (arr2.indexOf(item) === -1) {
//         flag = false;
//       }
//     });
//   }
//   return flag;
// }

export function fileExists(f: string) {
  try {
    fs.accessSync(f, fs.constants.W_OK)
    return true
  } catch (error) {
    return false
  }
}

export const patchPnpm = (str: string): string => {
  const PNPM_REG = /\.pnpm\//gi
  if (PNPM_REG.test(str)) {
    str = str.replace(PNPM_REG, '')
  }
  return str
}
