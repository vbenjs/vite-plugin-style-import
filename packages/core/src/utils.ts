import path from 'pathe'
import { normalizePath } from 'vite'
import fs from 'fs-extra'
import { createRequire } from 'module'

export function resolveNodeModules(libName: string, ...dir: string[]) {
  const esRequire = createRequire(import.meta.url)
  let modulePath = ''
  try {
    modulePath = normalizePath(esRequire.resolve(libName))
  } catch (error) {
    modulePath = normalizePath(require.resolve(libName))
  }
  const lastIndex = modulePath.lastIndexOf(libName)
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

export function fileExists(f: string) {
  try {
    fs.accessSync(f, fs.constants.W_OK)
    return true
  } catch (error) {
    return false
  }
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return (
    value != null &&
    Object.prototype.toString.call(value) === '[object Function]'
  )
}
