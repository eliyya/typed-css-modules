# withTypeCSSModule

A Next.js plugin that wraps the [`typed-css-modules`](https://www.npmjs.com/package/typed-css-modules) library, enabling automatic generation of `.d.ts` files for CSS Modules in TypeScript projects. This plugin integrates seamlessly with your Next.js project and simplifies the usage of `typed-css-modules` by:

1. Running it automatically for all CSS Module files in your project.
2. Watching for changes in your CSS Module files and regenerating the `.d.ts` files when necessary.
3. Exporting all the functionalities of `typed-css-modules` so you can use it directly if the plugin is not required.

## Features

-   **Automatic Type Generation:** No need to run `typed-css-modules` manually.
-   **File Watching:** Watches your CSS Module files and regenerates `.d.ts` files on change.
-   **Customizable Extensions:** Supports `.module.css`, `.module.scss`, and other extensions.
-   **Debounce Support:** Prevents excessive executions during rapid file changes.
-   **Direct Access to `typed-css-modules`:** Exposes the original API for advanced use cases.

---

## Installation

Install the package using npm or yarn:

```bash
npm install typed-css-modules
```

Include the plugin in your `next.config.mjs` file:

```javascript
import { withTypeCSSModule } from '@eliya/typed-css-modules'

const nextjsConfig = {
    // your nextjs config
}

export default withTypeCSSModule(nextjsConfig)
```

---

## Usage

### Plugin Mode

By default, the plugin automatically generates `.d.ts` files for all CSS Module files in your Next.js project.

Example `next.config.mjs`:

```javascript
import { withTypeCSSModule } from '@eliya/typed-css-modules'

const nextjsConfig = {
    // your nextjs config
}

export default withTypeCSSModule(nextjsConfig, {
    extensions: ['.module.css', '.module.scss'], // optona;
    debounceWait: 300, // optona;
})
```

-   `extensions`: Specifies the file extensions to watch and process. Default: `['.module.css']`.
-   `debounceWait`: Time in milliseconds to wait before regenerating types after a file change. Default: `200`.

---

### Direct API Usage

If you prefer to use `typed-css-modules` directly, the plugin exports all its functionalities. For example:

```javascript
import { run } from '@eliya/typed-css-modules'

run('./src', {
    silent: true,
    pattern: '**/*.module.css',
})
```

This works the same way as calling `run` from the `typed-css-modules` package itself.

---

## Example Project Structure

```
project-root/
├── src/
│   ├── components/
│   │   ├── Button.module.css
│   │   └── Button.module.css.d.ts <-- generated
│   └── pages/
├── next.config.mjs
└── package.json
```

---

## How It Works

1. **Initial Run:** When you include the plugin, it automatically generates `.d.ts` files for all CSS Modules matching the specified extensions.
2. **File Watching:** Uses `fs.watch` to monitor changes in the `src` directory and regenerates `.d.ts` files for modified CSS Module files.
3. **Debounced Updates:** Uses a debounce mechanism to reduce redundant type generation during rapid file modifications.

---

## Notes

-   Ensure your CSS Modules follow the naming convention (e.g., `*.module.css`).
-   If using custom extensions like `.module.scss`, you need to configure the `extensions` option.
-   The plugin does not interfere with other Next.js configurations.

---

## License

This plugin is licensed under the MIT License.
