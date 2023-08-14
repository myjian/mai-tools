const WIKI_URL_PREFIX = "https://maimai.fandom.com/zh/wiki/";
const WIKI_URL_SUFFIX = "?variant=zh-hant";

export function getZhWikiLink(title: string) {
  return WIKI_URL_PREFIX + encodeURIComponent(title) + WIKI_URL_SUFFIX;
}
