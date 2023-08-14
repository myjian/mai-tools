import React, {useCallback} from 'react';

import {Language, SUPPORTED_LANGUAGES} from '../../common/lang';

const LangText = {
  [Language.zh_TW]: '繁體中文',
  [Language.en_US]: 'English',
  [Language.ko_KR]: '한국어',
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
    <tr>
      <td>
        <label htmlFor="languageSelect">🌐 介面語言 (Language)：</label>
      </td>
      <td>
        <select id="languageSelect" onChange={handleChange} value={activeLanguage}>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const langText = LangText[lang];
            return (
              <option key={lang} value={lang}>
                {langText}
              </option>
            );
          })}
        </select>
      </td>
    </tr>
  );
};
