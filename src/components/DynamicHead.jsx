import { useEffect } from 'react';
import { useSiteSettings } from '../data/siteContent';

export default function DynamicHead() {
  const settings = useSiteSettings();

  useEffect(() => {
    // 1. Update Browser Tab Title
    if (settings.siteTitle) {
      document.title = settings.siteTitle;
    }

    // 2. Update Browser Favicon
    if (settings.favicon) {
      // Look for existing icon links or create one
      const iconSelectors = [
        "link[rel='icon']",
        "link[rel='shortcut icon']",
        "link[rel='apple-touch-icon']",
      ];

      let found = false;
      iconSelectors.forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          el.href = settings.favicon;
          found = true;
        }
      });

      if (!found) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = settings.favicon;
        document.head.appendChild(link);
      }
    }

    // 3. Update Meta Description
    if (settings.metaDescription) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', settings.metaDescription);
    }
  }, [settings.siteTitle, settings.favicon, settings.metaDescription]);

  return null;
}
