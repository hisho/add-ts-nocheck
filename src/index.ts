import fs from 'fs'
import { glob } from 'glob'
import minimist from 'minimist'
import path from 'path'
import { z } from 'zod'

const argvInputSchema = z
  .object({
    patterns: z.string(),
  })
  .catch({
    patterns: '',
  })

const TS_NOCHECK_STRING = '// @ts-nocheck\n\n'

export const main = (args: string[]) => {
  const argv = minimist<z.infer<typeof argvInputSchema>>(args, {
    string: ['patterns'],
  })

  /**
   * glob patterns
   */
  const patterns = argvInputSchema
    .parse(argv)
    .patterns.split(',')
    .map((pattern) => pattern.trim())
    .filter(Boolean)

  /**
   * ['path/to/file.ts', 'path/to/file2.ts']
   */
  const files = patterns.flatMap((pattern) =>
    glob.sync(path.resolve(process.cwd(), pattern))
  )

  const addTsNoCheck = async (file: string) => {
    const resolvedFilePath = path.resolve(process.cwd(), file)

    const content = fs.readFileSync(resolvedFilePath).toString()

    if (content.includes(TS_NOCHECK_STRING)) {
      console.log(
        JSON.stringify(TS_NOCHECK_STRING),
        'is already in',
        resolvedFilePath
      )
    } else {
      fs.writeFileSync(resolvedFilePath, TS_NOCHECK_STRING + content)
      console.log(
        JSON.stringify(TS_NOCHECK_STRING),
        'added into',
        resolvedFilePath
      )
    }
  }

  Promise.allSettled(files.map(addTsNoCheck)).then((results) => {
    let hasErrors = false

    results.forEach((result) => {
      if (result.status === 'rejected') {
        hasErrors = true
        console.error(result.reason)
      }
    })

    if (hasErrors) {
      process.exit(1)
    }
  })
}
