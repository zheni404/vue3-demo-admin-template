const loadPlugings = (filenames: Array<string>) => {
  const requirePlugin = require.context('@/plugins', false, /\.ts$/)
  const fileMap = new Map<string, boolean>()

  for (const filename of requirePlugin.keys()) {
    fileMap.set(filename.replace('./', ''), true)
  }

  for (const filename of filenames) {
    const filenameWithExt = `${filename}.ts`
    if (
      Object.prototype.hasOwnProperty.call(
        Object.fromEntries(fileMap),
        filenameWithExt
      )
    ) {
      requirePlugin(`./${filenameWithExt}`)
    } else {
      throw new Error(
        `No plugin found for ${filename}.
        Did you spell the plugin filename correctly?`
      )
    }
  }
}

export default loadPlugings
