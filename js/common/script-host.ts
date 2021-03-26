export function getScriptHost(scriptName: string) {
  const scripts = Array.from(document.querySelectorAll("script"));
  for (const script of scripts) {
    if (script.src.includes(scriptName)) {
      const url = new URL(script.src);
      const path = url.pathname;
      return url.origin + path.substring(0, path.lastIndexOf("/scripts"));
    }
  }
  return "https://myjian.github.io/mai-tools";
}
