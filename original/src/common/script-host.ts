import {isMaimaiNetOrigin} from './game-region';

const fallbackMaiToolsBaseUrl = "https://myjian.github.io/mai-tools";
// const fallbackMaiToolsBaseUrl = "http://localhost:8080";

/**
 * Find where the scripts are loaded from. This function is usually used
 * by scripts running on maimai NET.
 */
export function getScriptHost(scriptName: string): string {
  const scripts = Array.from(document.querySelectorAll("script"));
  while (scripts.length) {
    const script = scripts.pop();
    if (script.src.includes(scriptName)) {
      const url = new URL(script.src);
      const path = url.pathname;
      return url.origin + path.substring(0, path.lastIndexOf("/scripts"));
    }
  }
  return fallbackMaiToolsBaseUrl;
}

/**
 * Find the root url of mai-tools (this website).
 * Can be used by scripts running on maimai NET or scripts on mai-tools itself.
 */
export function getMaiToolsBaseUrl(): string {
  if (isMaimaiNetOrigin(window.location.origin)) {
    return fallbackMaiToolsBaseUrl;
  }
  if (window.location.pathname.startsWith("/mai-tools")) {
    return window.location.origin + "/mai-tools";
  }
  return window.location.origin;
}
