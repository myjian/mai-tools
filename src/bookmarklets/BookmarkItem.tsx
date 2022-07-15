import React from 'react';

import {useLanguage} from '../common/lang-react';
import {Bookmarklet} from './bookmarklets';

export const BookmarkItem = (props: Bookmarklet) => {
  const lang = useLanguage();
  const {id, itemTitleByLang, featureByLang, howToByLang, screenshotUrl} = props;
  return (
    <div className="bookmarklet" id={id}>
      <div className="bookmarkletText">
        <h3 className="bookmarkletTitle">{itemTitleByLang[lang]}</h3>
        <ul>
          <li>{featureByLang[lang]}</li>
          <li>{typeof howToByLang === "function" ? howToByLang(lang) : howToByLang[lang]}</li>
        </ul>
      </div>
      <div className="bookmarkletImage">
        <a href={screenshotUrl}>
          <img className="screenshot" alt="screenshot" src={screenshotUrl} />
        </a>
      </div>
    </div>
  );
};
