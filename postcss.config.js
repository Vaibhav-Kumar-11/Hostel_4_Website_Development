import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// PostCSS resolves plugin config relative to process.cwd(), which is not
// necessarily this directory — an editor, CI job or dev-server launcher may
// start the process from somewhere else. Passing an absolute config path makes
// the build produce identical CSS regardless of where it was invoked from.
const root = dirname(fileURLToPath(import.meta.url))

export default {
  plugins: {
    tailwindcss: { config: join(root, 'tailwind.config.js') },
    autoprefixer: {},
  },
}
