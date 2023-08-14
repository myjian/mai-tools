import React from 'react';

import {useLanguage} from '../common/lang-react';
import {Bookmarklet} from './all-bookmarklets';

export const BookmarkItem = (props: Bookmarklet) => {
  const lang = useLanguage();
  const {id, itemTitleByLang, featureByLang, howToByLang, screenshotUrl} = props;
  return (
    <div className="bookmarklet" id={id}>
      <div className="bookmarkletText">
        <h3 className="bookmarkletTitle">{itemTitleByLang[lang]}</h3>
        <ul>
          <li>{featureByLang[lang]}</li>
          <li>{howToByLang[lang]}</li>
        </ul>
      </div>
      <div className="bookmarkletImage">
        <img className="screenshot" alt="screenshot" src={screenshotUrl} />
      </div>
    </div>
  );
};
