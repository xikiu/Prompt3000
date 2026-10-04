export default defineBackground(() => {
  console.log('[Prompt3000] Background service worker initialized across browser engines.');

  // Handle hotkeys defined in manifest commands
  browser.commands?.onCommand?.addListener(async (command) => {
    console.log('[Prompt3000] Command triggered:', command);

    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!activeTab?.id) return;

    try {
      if (command === 'enhance-prompt') {
        await browser.tabs.sendMessage(activeTab.id, {
          type: 'TRIGGER_ENHANCE',
        });
      }
    } catch {
      // Content script is only active on supported LLM websites; safely ignore if current tab is not an LLM site
    }
  });

  // Handle runtime messages
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'PING') {
      sendResponse({ status: 'ok', engine: 'Prompt3000-Core' });
    }
  });
});
