import React from 'react';

import {DxVersion} from '../common/game-version';
import {getInitialLanguage, Language} from '../common/lang';
import {LangContext} from '../common/lang-react';
import {getRankDefinitions} from '../common/rank-functions';
import {DX_LEVELS, getLvIndex, LevelDef} from './levels';
import {MultiplierTable} from './MultiplierTable';
import {OptionsInput} from './OptionsInput';
import {RatingTable} from './RatingTable';
import {RatingVisualizer} from './RatingVisualizer';

const gameVer = DxVersion.UNIVERSE;

interface State {
  lang: Language;
  width: number;
  heightUnit: number;
  maxRating: number;
  minLv: string;
  maxLv: string;
  topPadding: number;
  axisLabelStep: number;
}

export class RootComponent extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
    const heightUnit = 0; // Hide visualizer by default
    const maxLv = 15;
    const lang = getInitialLanguage();
    updateDocumentTitle(lang);
    this.state = {
      lang,
      minLv: "10",
      maxLv: "14",
      width: 30,
      heightUnit,
      maxRating: calculateMaxRating(maxLv, gameVer),
      topPadding: heightUnit * 2 + 50,
      axisLabelStep: 5,
    };
  }

  componentDidUpdate(_: Readonly<{}>, prevState: Readonly<State>): void {
    if (this.state.lang !== prevState.lang) {
      updateDocumentTitle(this.state.lang);
    }
  }

  render() {
    const {lang, heightUnit, maxRating, axisLabelStep, minLv, maxLv, topPadding} =
      this.state;
    const canZoomIn = maxLv !== minLv;
    const levels = this.getLevels();
    // Only include SSS+ - A
    const ranks = getRankDefinitions(gameVer).slice(0, 9);
    return (
      <LangContext.Provider value={lang}>
        <div className="ratingVisualizer">
          <OptionsInput
            heightUnit={heightUnit}
            onChangeUnit={this.handleChangeHeightUnit}
            onSetRange={this.handleSetRange}
            minLv={minLv}
            maxLv={maxLv}
            // onBlur={this.removeHighlightInterval}
            // onFocus={this.cancelRemoveHighlightInterval}
          />
          <RatingVisualizer
            canZoomIn={canZoomIn}
            heightUnit={heightUnit}
            maxRating={maxRating}
            levels={levels}
            topPadding={topPadding}
            axisLabelStep={axisLabelStep}
            ranks={ranks}
            handleSetRange={this.handleSetRange}
          />
          <div className="container">
            <RatingTable ranks={ranks} levels={levels} />
            <hr className="sectionSep" />
            <MultiplierTable gameVer={gameVer} />
            <footer className="footer">
              <hr className="sectionSep" />
              <span>Made by </span>
              <a className="authorLink" href="https://github.com/myjian" target="_blank">
                myjian
              </a>
              <span>.</span>
            </footer>
          </div>
        </div>
      </LangContext.Provider>
    );
  }

  private getDetailLevels(startIdx: number, endIdx: number): LevelDef[] {
    const lvs = [];
    const maxLv = DX_LEVELS[endIdx].maxLv;
    let currentLv = DX_LEVELS[startIdx].minLv;
    while (currentLv <= maxLv) {
      lvs.push({
        title: currentLv.toFixed(1),
        minLv: currentLv,
        maxLv: currentLv,
      });
      currentLv += 0.1;
    }
    return lvs;
  }

  private getLevels() {
    const {minLv, maxLv} = this.state;
    const startIdx = getLvIndex(minLv);
    const endIdx = getLvIndex(maxLv);
    if (endIdx - startIdx < 2) {
      return this.getDetailLevels(startIdx, endIdx).reverse();
    }
    return DX_LEVELS.slice(startIdx, endIdx + 1).reverse();
  }

  private handleChangeHeightUnit = (unit: number) => {
    this.setState({heightUnit: unit});
    if (unit === 0) {
      // this.removeHighlightInterval();
    }
  };

  private handleSetRange = (minLv: string, maxLv: string) => {
    const maxLvDef = DX_LEVELS.find((lv) => lv.title === maxLv);
    this.setState({
      minLv,
      maxLv,
      maxRating: calculateMaxRating(maxLvDef.maxLv, gameVer),
    });
  };
}

function calculateMaxRating(maxLv: number, gameVer: DxVersion) {
  const maxRank = getRankDefinitions(gameVer)[0];
  return Math.floor((maxRank.minAchv * maxRank.factor * maxLv) / 100);
}

function updateDocumentTitle(lang: Language) {
  switch (lang) {
    case Language.en_US:
      document.title = "maimai DX Rating Lookup Table & Visualization";
      break;
    case Language.zh_TW:
      document.title = "maimai DX R值圖表";
      break;
  }
}
