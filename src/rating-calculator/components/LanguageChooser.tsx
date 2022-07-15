import React, {useCallback} from 'react';

import {Language, SUPPORTED_LANGUAGES} from '../../common/lang';

const LangText = {
  [Language.zh_TW]: "繁體中文",
  [Language.en_US]: "English",
};

interface Props {
  activeLanguage: Language;
  changeLanguage: (lang: Language) => void;
}

export const LanguageChooser = ({activeLanguage, changeLanguage}: Props) => {
  const handleChange = useCallback(
    (evt: React.FormEvent<HTMLSelectElement>) => {
      changeLanguage(evt.currentTarget.value as Language);
    },
    [changeLanguage]
  );
  return (
    <label>
      介面語言 (Language)：
      <select className="language" onChange={handleChange}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const langText = LangText[lang];
          return (
            <option key={lang} value={lang} selected={lang === activeLanguage}>
              {langText}
            </option>
          );
        })}
      </select>
    </label>
  );
};
