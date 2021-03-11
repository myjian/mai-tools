import React from 'react';

import {isMobile} from '../common/browser';
import {LANG} from '../common/lang';
import {Bookmarklet} from './bookmarklets';

const COPY_LINK = {
  en: "Copy link",
  zh: "複製連結",
}[LANG];

export class BookmarkItem extends React.PureComponent<Bookmarklet> {
  private inputRef = React.createRef<HTMLInputElement>();

  render() {
    const {itemTitle, feature, howTo, screenshotUrl, scriptUrl} = this.props;
    return (
      <div className="bookmarklet">
        <div className="bookmarkletText">
          <h3 className="bookmarkletTitle">
            {isMobile() ? (
              <>
                {itemTitle}
                <a
                  className="bookmarkletCopy"
                  href={scriptUrl}
                  onTouchStart={this.setPageTitle}
                  onContextMenu={this.setPageTitle}
                  onClick={this.copyLink}
                >
                  {COPY_LINK}
                </a>
              </>
            ) : (
              <a
                href={scriptUrl}
                onClick={this.copyLink}
                onTouchStart={this.setPageTitle}
                onContextMenu={this.setPageTitle}
              >
                {itemTitle}
              </a>
            )}
          </h3>
          <input className="bookmarkletScript" ref={this.inputRef} value={scriptUrl} readOnly />
          <ul>
            <li>{feature}</li>
            <li>{typeof howTo === "string" ? howTo : howTo()}</li>
          </ul>
        </div>
        <div className="bookmarkletImage">
          <a href={screenshotUrl}>
            <img className="screenshot" alt="screenshot" src={screenshotUrl} />
          </a>
        </div>
      </div>
    );
  }

  private setPageTitle = () => {
    document.title = this.props.itemTitle;
  };

  private copyLink = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (this.inputRef.current) {
      const t = this.inputRef.current;
      t.select();
      document.execCommand("copy");
    }
  };
}
