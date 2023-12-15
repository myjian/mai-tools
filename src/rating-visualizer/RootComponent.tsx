import React from 'react';

import {LangSwitcher} from '../common/components/LangSwitcher';
import {getInitialLanguage, Language} from '../common/lang';
import {LangContext} from '../common/lang-react';
import {LevelDef} from '../common/level-helper';
import {getRankDefinitions} from '../common/rank-functions';
import {loadUserPreference, saveUserPreference, UserPreference} from '../common/user-preference';
import {DX_LEVELS, getLvIndex} from './levels';
import {MultiplierTable} from './MultiplierTable';
import {OptionsInput} from './OptionsInput';
import {DisplayValue, RatingTable} from './RatingTable';
import {RatingVisualizer} from './RatingVisualizer';
import {RecommendedLevels} from './RecommendedLevels';

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
    const savedHeightUnit = parseInt(loadUserPreference(UserPreference.HeightUnit));
    const heightUnit = isNaN(savedHeightUnit) ? 0 : savedHeightUnit; // Hide visualizer by default
    const maxLv = 15;
    const lang = getInitialLanguage();
    updateDocumentTitle(lang);
    this.state = {
      lang,
      minLv: loadUserPreference(UserPreference.MinLv) || '10',
      minRank: loadUserPreference(UserPreference.MinRank) || 'SS',
      maxLv: loadUserPreference(UserPreference.MaxLv) || '14',
      width: 30,
      heightUnit,
      maxRating: calculateMaxRating(maxLv),
      tableDisplay:
        (loadUserPreference(UserPreference.TableDisplay) as DisplayValue) || DisplayValue.RANGE,
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
    const {
      lang,
      heightUnit,
      maxRating,
      axisLabelStep,
      minLv,
      minRank,
      maxLv,
      tableDisplay,
      topPadding,
    } = this.state;
    const canZoomIn = maxLv !== minLv;
    const levels = this.getLevels();
    const allRanks = getRankDefinitions();
    const ranksEndIndex = allRanks.findIndex((rank) => rank.title == minRank);
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
            <RecommendedLevels />
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
    saveUserPreference(UserPreference.HeightUnit, unit.toFixed(0));
    this.setState({heightUnit: unit});
  };

  private handleSetRange = (minLv: string, maxLv: string) => {
    const maxLvDef = DX_LEVELS.find((lv) => lv.title === maxLv);
    saveUserPreference(UserPreference.MinLv, minLv);
    saveUserPreference(UserPreference.MaxLv, maxLv);
    this.setState({
      minLv,
      maxLv,
      maxRating: calculateMaxRating(maxLvDef.maxLv),
    });
  };

  private handleSetMinRank = (minRank: string) => {
    saveUserPreference(UserPreference.MinRank, minRank);
    this.setState({minRank});
  };

  private handleSetTableDisplay = (tableDisplay: DisplayValue) => {
    saveUserPreference(UserPreference.TableDisplay, tableDisplay);
    this.setState({tableDisplay});
  };
}

function calculateMaxRating(maxLv: number) {
  const maxRank = getRankDefinitions()[0];
  return Math.floor((maxRank.minAchv * maxRank.factor * maxLv) / 100);
}

function updateDocumentTitle(lang: Language) {
  document.title = {
    [Language.en_US]: 'maimai DX Rating Lookup Table & Visualization',
    [Language.zh_TW]: 'maimai DX R值圖表',
    [Language.ko_KR]: 'maimai DX 레이팅 상수 표 & 시각화',
  }[lang];
}
