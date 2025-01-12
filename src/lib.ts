import { run } from 'typed-css-modules'
import { watch } from 'node:fs'
import { dirname, resolve, relative, posix } from 'node:path'
import { NextConfig } from 'next'
export * from 'typed-css-modules'

function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null
    return (...args: Parameters<T>): void => {
        if (timeoutId !== null) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), wait)
    }
}
export type NextTypeCssModuleConfig = {
    extensions?: string[]
    debounceWait?: number
}
/**
 * Make a .d.ts file for CSS Modules
 */
export function withTypeCSSModule(
    nextConfig: NextConfig = {},
    {
        extensions = ['.module.css'],
        debounceWait = 200,
    }: NextTypeCssModuleConfig = {},
): NextConfig {
    const pattern = `**/*${extensions.map(ext => ext).join('|')}`
    const debounceModule = debounce(filePath => {
        run(
            dirname(
                `./${posix.join(relative(process.cwd(), resolve(filePath)))}`,
            ),
            {
                silent: true,
                pattern,
            },
        )
    }, debounceWait)

    // Generate types for existing files
    run('./src', {
        silent: true,
        pattern,
    })

    return {
        ...nextConfig,
        webpack(config, options) {
            watch('./src', { recursive: true }, (event, filePath) => {
                if (
                    filePath &&
                    extensions.some(ext => filePath.endsWith(ext))
                ) {
                    console.log(`CSS Module changed: ${filePath}`)
                    debounceModule(filePath)
                }
            })

            return typeof nextConfig.webpack === 'function'
                ? nextConfig.webpack(config, options)
                : config
        },
    }
}
