export const ALLOWED_ORIGINS = ["https://cdpn.io", "https://myjian.github.io"];

export function handleError(msg: string) {
  alert(msg);
}

export async function fetchPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

export async function fetchGameVersion(dom: Document | HTMLElement): Promise<string> {
  const gameVer = dom.querySelector(
    "select[name=version] option:last-of-type"
  ) as HTMLOptionElement;
  if (gameVer) {
    return gameVer.value;
  }
  dom = await fetchPage("/maimai-mobile/record/musicVersion/");
  return fetchGameVersion(dom);
}

export function getPostMessageFunc(w: WindowProxy, origin: string) {
  return (action: string, text: string) => {
    const obj = {action: action, payload: text};
    w.postMessage(obj, origin);
  };
}
