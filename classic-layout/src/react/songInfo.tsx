import React from 'react';

const WIKI_URL_PREFIX = "https://maimai.fandom.com/zh/wiki/";
const WIKI_URL_SUFFIX = "?variant=zh-hant";

interface SongInfoProps {
  songTitle: string;
  track: string;
  difficulty: string;
}
export class SongInfo extends React.PureComponent<SongInfoProps> {
  render() {
    const {songTitle, track, difficulty} = this.props;
    const href = WIKI_URL_PREFIX + encodeURIComponent(songTitle) + WIKI_URL_SUFFIX;
    const difficultyClass = difficulty.toLowerCase().replace(":", "");
    return (
      <div className="songInfoContainer">
        <div>
          <span className="track" id="track">{track}</span>
          <span className={"difficulty " + difficultyClass}>
            【<span id="difficulty">{difficulty}</span>】
          </span>
          </div>
        <h2 className="songTitle" id="songTitle">
          <a className="songWikiLink" href={href}>{songTitle}</a>
        </h2>
      </div>
    );
  }
}
