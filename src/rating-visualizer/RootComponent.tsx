import React from 'react';
import {LangSwitcher} from '../common/components/LangSwitcher';

import {getInitialLanguage, Language} from '../common/lang';
import {LangContext} from '../common/lang-react';
import {getRankDefinitions} from '../common/rank-functions';
import {DX_LEVELS, getLvIndex, LevelDef} from './levels';
import {MultiplierTable} from './MultiplierTable';
import {OptionsInput} from './OptionsInput';
import {DisplayValue, RatingTable} from './RatingTable';
import {RatingVisualizer} from './RatingVisualizer';

interface State {
  lang: Language;
  width: number;
  heightUnit: number;
  maxRating: number;
  minLv: string;
  minRank: string;
  maxLv: string;
  tableDisplay: DisplayValue;
  topPadding: number;
  axisLabelStep: number;
}

export class RootComponent extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
    const savedHeightUnit = parseInt(window.localStorage.getItem("visualizerHeightUnit"));
    const heightUnit = isNaN(savedHeightUnit) ? 0 : savedHeightUnit; // Hide visualizer by default
    const maxLv = 15;
    const lang = getInitialLanguage();
    updateDocumentTitle(lang);
    this.state = {
      lang,
      minLv: window.localStorage.getItem("visualizerMinLv") || "10",
      minRank: window.localStorage.getItem("visualizerMinRank") || "SS",
      maxLv: window.localStorage.getItem("visualizerMaxLv") || "14",
      width: 30,
      heightUnit,
      maxRating: calculateMaxRating(maxLv),
      tableDisplay: window.localStorage.getItem("visualizerTableDisplay") as DisplayValue || DisplayValue.RANGE,
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
    const {lang, heightUnit, maxRating, axisLabelStep, minLv, minRank, maxLv, tableDisplay, topPadding} =
      this.state;
    const canZoomIn = maxLv !== minLv;
    const levels = this.getLevels();
    const allRanks = getRankDefinitions();
    const ranksEndIndex = allRanks.findIndex(rank => rank.title == minRank);
    const ranks = allRanks.slice(0, ranksEndIndex + 1);
    return (
      <LangContext.Provider value={lang}>
        <div className="ratingVisualizer">
          <OptionsInput
            heightUnit={heightUnit}
            maxLv={maxLv}
            minLv={minLv}
            minRank={minRank}
            tableDisplay={tableDisplay}
            onChangeUnit={this.handleChangeHeightUnit}
            onSetMinRank={this.handleSetMinRank}
            onSetRange={this.handleSetRange}
            onSetTableDisplay={this.handleSetTableDisplay}
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
            <RatingTable ranks={ranks} levels={levels} displayValue={tableDisplay} />
            <hr className="sectionSep" />
            <MultiplierTable />
            <footer className="footer">
              <hr className="sectionSep" />
              <LangSwitcher />
              <br />
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
      return this.getDetailLevels(startIdx, endIdx);
    }
    return DX_LEVELS.slice(startIdx, endIdx + 1);
  }

  private handleChangeHeightUnit = (unit: number) => {
    window.localStorage.setItem("visualizerHeightUnit", unit.toFixed(0));
    this.setState({heightUnit: unit});
  };

  private handleSetRange = (minLv: string, maxLv: string) => {
    const maxLvDef = DX_LEVELS.find((lv) => lv.title === maxLv);
    window.localStorage.setItem("visualizerMinLv", minLv);
    window.localStorage.setItem("visualizerMaxLv", maxLv);
    this.setState({
      minLv,
      maxLv,
      maxRating: calculateMaxRating(maxLvDef.maxLv),
    });
  };

  private handleSetMinRank = (minRank: string) => {
    window.localStorage.setItem("visualizerMinRank", minRank);
    this.setState({minRank});
  }

  private handleSetTableDisplay = (tableDisplay: DisplayValue) => {
    window.localStorage.setItem("visualizerTableDisplay", tableDisplay);
    this.setState({tableDisplay});
  }
}

function calculateMaxRating(maxLv: number) {
  const maxRank = getRankDefinitions()[0];
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
    case Language.ko_KR:
      document.title = "maimai DX 레이팅 상수 표 & 시각화";
      break;
  }
}
