import React from "react";
import {Language, saveLanguage, SUPPORTED_LANGUAGES} from "../lang";
import {useLanguage} from "../lang-react";
import {QueryParam} from "../query-params";

const UIString = {
  [Language.zh_TW]: "繁體中文",
  [Language.en_US]: "English",
  [Language.ko_KR]: "한국어",
};

export function LangSwitcher() {
  const lang = useLanguage();

  const handleClick = (evt: React.SyntheticEvent<HTMLAnchorElement>) => {
    saveLanguage(evt.currentTarget.dataset["lang"] as Language);
  };

  return <div>
    語言 (Language)：
    {SUPPORTED_LANGUAGES
      .map(otherLang => (
        otherLang === lang ? <>{UIString[otherLang]}&nbsp;</> : <React.Fragment key={otherLang}>
          <a
            href={`?${QueryParam.HostLanguage}=${otherLang}`}
            data-lang={otherLang}
            onClick={handleClick}
          >
            {UIString[otherLang]}
          </a>
          &nbsp;
        </React.Fragment>
      ))}
  </div>;
}
