import {createContext, useContext} from 'react';

import {getInitialLanguage, Language} from './lang';

export const LangContext = createContext(getInitialLanguage());

export function useLanguage(): Language {
  return useContext(LangContext);
}
