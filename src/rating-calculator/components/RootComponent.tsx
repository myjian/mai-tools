import React from 'react';

import {ChartRecord} from '../../common/chart-record';
import {
  GameRegion,
  getGameRegionFromOrigin,
  getGameRegionFromShortString,
  isMaimaiNetOrigin,
  MAIMAI_NET_ORIGINS,
} from '../../common/game-region';
import {
  GameVersion,
  RATING_CALCULATOR_SUPPORTED_VERSIONS,
  validateGameVersion,
} from '../../common/game-version';
import {getInitialLanguage, Language, saveLanguage} from '../../common/lang';
import {LangContext} from '../../common/lang-react';
import {QueryParam} from '../../common/query-params';
import {BasicSongProps, loadSongDatabase, SongDatabase} from '../../common/song-props';
import {analyzePlayerRating} from '../rating-analyzer';
import {RatingData} from '../types';
import {LanguageChooser} from './LanguageChooser';
import {OtherTools} from './OtherTools';
import {PageFooter} from './PageFooter';
import {RatingOutput} from './RatingOutput';
import {RegionSelect} from './RegionSelect';
import {ScoreInput} from './ScoreInput';
import {VersionSelect} from './VersionSelect';

const MessagesByLang = {
  [Language.en_US]: {
    computeRating: 'Calculate Rating',
  },
  [Language.zh_TW]: {
    computeRating: '計算 Rating 值',
  },
  [Language.ko_KR]: {
    computeRating: '레이팅 계산하기',
  },
};

interface State {
  lang: Language;
  progress: string;
  region: GameRegion;
  gameVer: GameVersion;
  ratingData?: RatingData;
  playerName: string | null;
  friendIdx: string | null;
  allSongs?: ReadonlyArray<BasicSongProps>;
}

export class RootComponent extends React.PureComponent<{}, State> {
  private playerGradeIndex = 0;
  private referrer = document.referrer && new URL(document.referrer).origin;
  private date = new Date();
  private playerScores: ChartRecord[] = [];
  private songDatabase: SongDatabase;

  constructor(props: {}) {
    super(props);
    const queryParams = new URLSearchParams(location.search);
    const gameVerParam = queryParams.get(QueryParam.GameVersion);
    const gameVer = validateGameVersion(
      gameVerParam,
      RATING_CALCULATOR_SUPPORTED_VERSIONS[0],
      RATING_CALCULATOR_SUPPORTED_VERSIONS[RATING_CALCULATOR_SUPPORTED_VERSIONS.length - 1]
    );
    const region = getGameRegionFromShortString(queryParams.get(QueryParam.GameRegion));

    const friendIdx = queryParams.get(QueryParam.FriendIdx);
    const playerName = queryParams.get(QueryParam.PlayerName);
    const date = parseInt(queryParams.get(QueryParam.Date) || '');
    const lang = getInitialLanguage();
    updateDocumentTitle(lang);

    this.state = {
      lang,
      region,
      gameVer,
      friendIdx,
      playerName,
      progress: '',
    };
    if (!isNaN(date)) {
      this.date = new Date(date);
    }
    loadSongDatabase(gameVer, region).then((songDb) => {
      this.songDatabase = songDb;
      this.playerScores = readPlayerScoresFromQueryParams(queryParams, songDb);
      this.analyzeRating();
    });
    this.initWindowCommunication();
  }

  componentDidUpdate(_prevProps: {}, prevState: State) {
    if (this.state.lang != prevState.lang) {
      updateDocumentTitle(this.state.lang);
    }
  }

  render() {
    const {lang, region, gameVer, ratingData, allSongs, progress} = this.state;
    const messages = MessagesByLang[lang];
    return (
      <LangContext.Provider value={lang}>
        <table className="inputSelectTable">
          <tbody>
            <LanguageChooser activeLanguage={lang} changeLanguage={this.changeLanguage} />
            <RegionSelect gameRegion={region} handleRegionSelect={this.selectRegion} />
            <VersionSelect gameVer={gameVer} handleVersionSelect={this.selectVersion} />
          </tbody>
        </table>
        <ScoreInput />
        <div className="actionArea">
          <button className="analyzeRatingBtn" onClick={this.analyzeRating}>
            {messages.computeRating}
          </button>
        </div>
        {progress ? <p>{progress}</p> : null}
        <hr className="sectionSep" />
        {ratingData && (
          <RatingOutput
            gameRegion={region}
            gameVer={gameVer}
            songDatabase={this.songDatabase}
            ratingData={ratingData}
            playerGradeIndex={this.playerGradeIndex}
            allSongs={allSongs}
          />
        )}
        <PageFooter />
        <OtherTools gameVer={gameVer} />
      </LangContext.Provider>
    );
  }

  private changeLanguage = (lang: Language) => {
    this.setState({lang});
    saveLanguage(lang);
    this.postMessageToOpener({action: 'saveLanguage', payload: lang});
  };

  private selectVersion = async (gameVer: GameVersion) => {
    this.setState({gameVer}, this.analyzeRating);
  };

  private selectRegion = async (region: GameRegion) => {
    this.setState({region}, this.analyzeRating);
  };

  private analyzeRating = async (evt?: React.SyntheticEvent) => {
    if (evt) {
      evt.preventDefault();
    }
    const {gameVer, region, playerName} = this.state;
    if (
      !this.songDatabase ||
      this.songDatabase.gameVer !== gameVer ||
      this.songDatabase.region !== region
    ) {
      this.songDatabase = await loadSongDatabase(gameVer, region);
    }
    // TODO: support overrides by user
    console.log('Song database:', this.songDatabase);
    const playerScoresFromInput = readPlayerScoresFromManualInput();
    const playerScores = playerScoresFromInput.length ? playerScoresFromInput : this.playerScores;
    console.log('Player scores:', playerScores);
    if (!playerScores.length) {
      this.setState({ratingData: undefined});
      return;
    }
    const ratingData = analyzePlayerRating(
      this.songDatabase,
      this.date,
      playerName,
      playerScores,
      gameVer,
      region
    );
    console.log('Rating Data:', ratingData);
    this.setState({ratingData}, () =>
      setTimeout(() => {
        location.assign('#ratingOutput');
      }, 0)
    );
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

  private initWindowCommunication() {
    window.addEventListener('message', (evt) => {
      if (!isMaimaiNetOrigin(evt.origin) && evt.origin !== window.origin) {
        return;
      }
      this.referrer = evt.origin;
      console.log(evt.origin, evt.data);
      if (typeof evt.data !== 'object') {
        return;
      }
      let payloadAsInt;
      switch (evt.data.action) {
        case 'gameVersion':
          this.setState(
            {
              region: getGameRegionFromOrigin(evt.origin),
              gameVer: validateGameVersion(
                evt.data.payload,
                RATING_CALCULATOR_SUPPORTED_VERSIONS[0],
                RATING_CALCULATOR_SUPPORTED_VERSIONS[
                  RATING_CALCULATOR_SUPPORTED_VERSIONS.length - 1
                ]
              ),
            },
            this.analyzeRating
          );
          break;
        case 'playerGrade':
          payloadAsInt = parseInt(evt.data.payload);
          if (payloadAsInt) {
            this.playerGradeIndex = payloadAsInt;
          }
          break;
        case 'showProgress':
          this.setState({progress: evt.data.payload});
          break;
        case 'setPlayerScore':
          this.playerScores = evt.data.payload;
          this.analyzeRating();
          break;
        case 'allSongs':
          this.setState({allSongs: evt.data.payload});
          break;
      }
    });
    const {friendIdx, lang} = this.state;
    if (friendIdx) {
      // Analyze friend rating
      this.postMessageToOpener({action: 'getFriendRecords', payload: friendIdx});
    } else {
      // Analyze self rating
      this.postMessageToOpener({action: 'ready', payload: lang});
    }
  }
}

function updateDocumentTitle(lang: Language) {
  switch (lang) {
    case Language.en_US:
      document.title = 'maimai DX Rating Analyzer';
      break;
    case Language.zh_TW:
      document.title = 'maimai DX R 值分析工具';
      break;
  }
}

function readPlayerScoresFromManualInput(): ChartRecord[] {
  const textarea = document.getElementById('playerScoresTextarea');
  const rawText = textarea instanceof HTMLTextAreaElement ? textarea.value : '';
  return rawText ? JSON.parse(rawText) : [];
}

function readPlayerScoresFromQueryParams(qp: URLSearchParams, songDb: SongDatabase): ChartRecord[] {
  // Query params must exist
  const rawImages = qp.get(QueryParam.SongImage);
  const rawChartTypes = qp.get(QueryParam.ChartType);
  const rawDifficulties = qp.get(QueryParam.Difficulty);
  const rawAchievements = qp.get(QueryParam.Achievement);
  if (!rawImages || !rawChartTypes || !rawDifficulties || !rawAchievements) {
    return [];
  }

  // Query params must have valid values
  const images = rawImages.split('_');
  const chartTypes = Array.from(rawChartTypes)
    .map((ct) => parseInt(ct))
    .filter((ct) => !isNaN(ct));
  const difficulties = Array.from(rawDifficulties)
    .map((df) => parseInt(df))
    .filter((df) => !isNaN(df));
  const achievements = rawAchievements
    .split('_')
    .map((ac) => parseFloat(ac))
    .filter((ac) => !isNaN(ac));
  if (
    images.length !== chartTypes.length ||
    images.length !== difficulties.length ||
    images.length !== achievements.length
  ) {
    return [];
  }

  // All records must exist in SongDatabase
  let failed = false;
  const records = images.map<ChartRecord>((ico, i) => {
    const chartType = chartTypes[i];
    const difficulty = difficulties[i];
    const achievement = achievements[i];
    const props = songDb.getSongPropsByIco(ico, chartType);
    if (!props) {
      console.warn('Could not find song for ', ico, chartType, difficulty, achievement);
      failed = true;
      return;
    }
    const lv = props.lv[difficulty];
    return {
      songName: props.name,
      genre: props.nickname === 'Link (nico)' ? 'niconico' : '',
      difficulty,
      chartType,
      level: lv,
      levelIsPrecise: lv > 0,
      achievement,
    };
  });
  return failed ? [] : records;
}
