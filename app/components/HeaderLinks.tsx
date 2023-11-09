import { useEffect } from 'react';
import { getEnv } from '~/env'

global.ENV = getEnv()

export default function HeaderLinks() {

  useEffect(() => {
    // Code for hiding or disabling the links
    const headerLinks = document.querySelectorAll('.header-link');

    // Get the base URL and path of the current page
    const currentBaseUrl = window.location.origin; // Base URL
    const currentPath = window.location.pathname; // Path

    headerLinks.forEach((link: Element) => {
      const anchorLink = link as HTMLAnchorElement; // Explicitly cast to HTMLAnchorElement
    
      const linkUrl = anchorLink.getAttribute('href'); // Get the link's URL

      if (linkUrl !== null) {
        let linkBaseUrl: string; // Base URL

        if (linkUrl.startsWith('https://') || linkUrl.startsWith('http://') || linkUrl.startsWith('//')) {
          // Full URL path
          const url = new URL(linkUrl);
          linkBaseUrl = url.origin;
        } else if (linkUrl.startsWith('/')) {
          // Root relative path
          linkBaseUrl = currentBaseUrl;
        } else {
          // Other relative paths
          const url = new URL(linkUrl, currentBaseUrl);
          url.search = ''; // Remove query parameters
          linkBaseUrl = url.href;
        }

        // Extract the path from the link URL
        const linkPath = new URL(linkUrl, currentBaseUrl).pathname; // Path

        // Compare the base URL and path of the link with the current page
        if (linkBaseUrl === currentBaseUrl && linkPath === currentPath) {
          // Hide or disable the link
          // anchorLink.style.display = 'none'; // or link.disabled = true; for disabling
          anchorLink.classList.add('current-link');
          anchorLink.addEventListener('click', (event) => event.preventDefault());
        }
      }
    });
  }, []);
  
  return (
    // JSX for rendering the header links
    <div className="header-links">
      <a className='header-link' href={ENV.PROFILE_URL}>Profiles</a>
      <a className='header-link' href={ENV.CONTENT_URL}>Contents</a>
    </div>
);
};