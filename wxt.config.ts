import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'Prompt3000 — Prompt Refiner',
    description: 'Turn messy thoughts into high-performing prompts.',
    permissions: ['storage', 'activeTab'],
    icons: {
      16: '/icon-16.png',
      48: '/icon-48.png',
      128: '/icon-128.png',
    },
    commands: {
      'enhance-prompt': {
        suggested_key: {
          default: 'Ctrl+Shift+E',
          mac: 'Command+Shift+E',
        },
        description: 'Enhance prompt in active text box',
      },
    },
    browser_specific_settings:
      browser === 'firefox'
        ? {
            gecko: {
              id: 'prompt3000@extension.dev',
              strict_min_version: '109.0',
            },
          }
        : undefined,
  }),
});
