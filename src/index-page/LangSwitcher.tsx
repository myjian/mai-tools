import React from "react";
import { Language, SUPPORTED_LANGUAGES } from "../common/lang";
import { useLanguage } from "../common/lang-react";

const UIString = {
  [Language.zh_TW]: "切換為繁體中文",
  [Language.en_US]: "View in English",
};


export function LangSwitcher() {
  const lang = useLanguage();

  return <div>
    <br />
    {SUPPORTED_LANGUAGES
      .filter(otherLang => otherLang !== lang)
      .map(otherLang => (
        <React.Fragment key={otherLang}>
          <a href={`?hl=${otherLang}`}>
            {UIString[otherLang]}
          </a>
          <br />
        </React.Fragment>
      ))}
  </div>;
}
