import React from 'react';

import {FullChartRecord} from '../common/chart-record';
import {
  GameRegion,
  getGameRegionFromOrigin,
  isMaimaiNetOrigin,
  MAIMAI_NET_ORIGINS,
} from '../common/game-region';
import {getInitialLanguage, Language} from '../common/lang';
import {QueryParam} from '../common/query-params';
import {PlateProgress} from './PlateProgress';
import {VersionSelect} from './VersionSelect';

interface State {
  lang: Language;
  progress: string;
  region: GameRegion;
  version: string;
  playerName: string | null;
  friendIdx: string | null;
}

export class RootComponent extends React.PureComponent<{}, State> {
  private referrer = document.referrer && new URL(document.referrer).origin;
  private playerScores: FullChartRecord[] = [];

  constructor(props: {}) {
    super(props);
    const queryParams = new URLSearchParams(location.search);
    const friendIdx = queryParams.get(QueryParam.FriendIdx);
    const playerName = queryParams.get(QueryParam.PlayerName);
    const lang = getInitialLanguage();
    updateDocumentTitle(lang);

    this.state = {
      lang,
      region: GameRegion.Jp,
      version: '0',
      friendIdx,
      playerName,
      progress: '',
    };
    if (window.opener) {
      this.initWindowCommunication();
    }
  }

  render() {
    const {playerName, region, version, progress} = this.state;
    return (
      <div>
        <h3>{progress || playerName}</h3>
        <select onChange={this.handleSelectRegion}>
          <option value="" disabled>
            == Game Region ==
          </option>
          <option value="jp">Japan</option>
          <option value="intl">International</option>
        </select>
        <br />
        <VersionSelect onChange={this.handleSelectVersion} />
        <br />
        <PlateProgress region={region} version={version} playerScores={this.playerScores} />
      </div>
    );
  }

  private handleSelectRegion = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    this.setState({region: evt.currentTarget.value === 'intl' ? GameRegion.Intl : GameRegion.Jp});
  };
  private handleSelectVersion = (evt: React.SyntheticEvent<HTMLSelectElement>) => {
    this.setState({version: evt.currentTarget.value});
  };

  private postMessageToOpener(data: {action: string; payload?: string | number}) {
    if (window.opener) {
      if (this.referrer) {
        window.opener.postMessage(data, this.referrer);
      } else {
        // Unfortunately, document.referrer is not set when mai-tools is run on localhost.
        // Send message to all maimai net origins and pray that one of them will respond.
        for (const origin of MAIMAI_NET_ORIGINS) {
          window.opener.postMessage(data, origin);
        }
      }
    }
  }

  private initWindowCommunication = () => {
    window.addEventListener('message', (evt) => {
      if (isMaimaiNetOrigin(evt.origin)) {
        this.referrer = evt.origin;
        console.log(evt.origin, evt.data);
        switch (evt.data.action) {
          case 'showProgress':
            this.setState({
              progress: evt.data.payload,
            });
            break;
          case 'setPlayerScore':
            this.playerScores = evt.data.payload;
            this.setState({
              region: getGameRegionFromOrigin(evt.origin),
            });
            break;
        }
      }
    });
    const {friendIdx, lang} = this.state;
    if (friendIdx) {
      // Analyze friend rating
      this.postMessageToOpener({action: 'getFriendRecords', payload: friendIdx});
    } else {
      // Analyze self rating
      this.postMessageToOpener({action: 'fetchFullRecords', payload: lang});
    }
  };
}

function updateDocumentTitle(lang: Language) {
  document.title = {
    [Language.en_US]: 'maimai Plate Progress',
    [Language.zh_TW]: 'maimai 名牌板進度分析',
    [Language.ko_KR]: 'maimai Plate Progress', // TODO
  }[lang];
}
