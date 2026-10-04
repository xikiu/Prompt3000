import './style.css';
import ReactDOM from 'react-dom/client';
import { FloatingCapsule } from './FloatingCapsule';

import { LLM_SITE_MATCHES } from '../../src/constants/llmSites';

export default defineContentScript({
  matches: LLM_SITE_MATCHES,
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'prompt3000-capsule-root',
      position: 'overlay',
      anchor: 'body',
      append: 'last',
      zIndex: 2147483647,
      onMount: (container) => {
        const app = document.createElement('div');
        container.append(app);
        const root = ReactDOM.createRoot(app);
        root.render(<FloatingCapsule />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
