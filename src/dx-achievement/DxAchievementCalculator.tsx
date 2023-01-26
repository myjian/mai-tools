import React from 'react';
import {QueryParam} from '../common/query-params';

import {DxAchvDetails} from './DxAchvDetails';
import {calculateDxAchvFromFinaleResult} from './finaleBacktracing';

interface State {
  initialFinaleAchvInput: string;
  finaleAchv: number;
  initialTotalScoreInput: string;
  totalScore: number;
  initialBreakScoreInput: string;
  breakScore: number;
  initialBreakJudgementsInput: ReadonlyArray<string>;
  breakJudgements: ReadonlyArray<number>;
}

export class DxAchievementCalculator extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
    const queryParams = new URLSearchParams(location.search);
    const rawAchvArg = queryParams.get(QueryParam.Achievement) || queryParams.get(QueryParam.AchievementOld);
    const rawTotalScoreArg = queryParams.get(QueryParam.TotalScore);
    const rawBreakScoreArg = queryParams.get(QueryParam.BreakScore);
    const rawBreakJudgementsArg = queryParams.get(QueryParam.BreakJudgement);
    if (rawAchvArg && rawTotalScoreArg && rawBreakScoreArg && rawBreakJudgementsArg) {
      const achvArg = parseFloat(rawAchvArg);
      const totalScoreArg = parseInt(rawTotalScoreArg);
      const breakScoreArg = parseInt(rawBreakScoreArg);
      const breakJudgementTexts = rawBreakJudgementsArg.split("-");
      const breakJudgementNums = breakJudgementTexts.map((j) => parseInt(j, 10));
      if (
        achvArg > 0 &&
        totalScoreArg > 0 &&
        breakScoreArg >= 0 &&
        breakJudgementNums.length === 4
      ) {
        this.state = {
          initialFinaleAchvInput: rawAchvArg,
          finaleAchv: achvArg,
          initialTotalScoreInput: rawTotalScoreArg,
          totalScore: totalScoreArg,
          initialBreakScoreInput: rawBreakScoreArg,
          breakScore: breakScoreArg,
          initialBreakJudgementsInput: breakJudgementTexts,
          breakJudgements: breakJudgementNums,
        };
        return;
      }
    }
    this.state = {
      initialFinaleAchvInput: "",
      finaleAchv: 0,
      initialTotalScoreInput: "",
      totalScore: 0,
      initialBreakScoreInput: "",
      breakScore: 0,
      initialBreakJudgementsInput: ["", "", "", ""],
      breakJudgements: [0, 0, 0, 0],
    };
  }

  render() {
    const {
      finaleAchv,
      initialFinaleAchvInput,
      totalScore,
      initialTotalScoreInput,
      breakScore,
      initialBreakScoreInput,
      breakJudgements,
      initialBreakJudgementsInput,
    } = this.state;
    const distByAchv = calculateDxAchvFromFinaleResult(
      finaleAchv,
      totalScore,
      breakScore,
      breakJudgements
    );
    return (
      <>
        <form>
          <div>
            <button onClick={this.handleFillExample}>Fill example data</button>
            <button onClick={this.handleReset}>Reset</button>
          </div>
          <div>
            <strong>Finale Achievement:</strong>
            <br />
            <input
              onChange={this.handleChangeFinaleAchv}
              defaultValue={initialFinaleAchvInput}
            ></input>
            %
          </div>
          <div>
            <strong>Total Score:</strong>
            <br />
            <input
              name="totalScore"
              onChange={this.handleChangeTotalScore}
              defaultValue={initialTotalScoreInput}
            ></input>
          </div>
          <div>
            <strong>Break Score:</strong>
            <br />
            <input
              name="breakScore"
              defaultValue={initialBreakScoreInput}
              onChange={this.handleChangeTotalScore}
            ></input>
          </div>
          <div>
            <strong>Break Judgements:</strong>
            <br />
            <div className="judgementInputRow">
              <div className="judgementInputCol perfectJudgement">
                Perfect
                <br />
                <input
                  className="noteCount"
                  name="break_0"
                  defaultValue={initialBreakJudgementsInput[0]}
                  onChange={this.handleChangeBreakJudgement}
                ></input>
              </div>
              <div className="judgementInputCol greatJudgement">
                Great
                <br />
                <input
                  className="noteCount"
                  name="break_1"
                  defaultValue={initialBreakJudgementsInput[1]}
                  onChange={this.handleChangeBreakJudgement}
                ></input>
              </div>
              <div className="judgementInputCol goodJudgement">
                Good
                <br />
                <input
                  className="noteCount"
                  defaultValue={initialBreakJudgementsInput[2]}
                  name="break_2"
                  onChange={this.handleChangeBreakJudgement}
                ></input>
              </div>
              <div className="judgementInputCol missJudgement">
                Miss
                <br />
                <input
                  className="noteCount"
                  name="break_3"
                  defaultValue={initialBreakJudgementsInput[3]}
                  onChange={this.handleChangeBreakJudgement}
                ></input>
              </div>
            </div>
          </div>
        </form>
        {distByAchv.size ? (
          <div className="resultHeading">
            <h3>{this.getDxAchvRange(distByAchv)}</h3>
            <a href={this.getUrlForCurrentInput()}>Link to this result</a>
          </div>
        ) : null}
        {Array.from(distByAchv.entries()).map(([dxAchv, dist], index) => (
          <DxAchvDetails key={index} dxAchv={dxAchv} breakDist={dist} />
        ))}
        <button className="copyLink" type="button" onClick={this.handleCopyLink}>
          📎
        </button>
      </>
    );
  }

  private getDxAchvRange(distsByAchv: Map<string, unknown>) {
    let first, last: string;
    for (const key of distsByAchv.keys()) {
      if (!first) {
        first = key;
      }
      last = key;
    }
    if (first === last) return `DX Achievement: ${first}%`;
    return parseFloat(first) < parseFloat(last)
      ? `DX Achievement Range: ${first}% - ${last}%`
      : `DX Achievement Range: ${last}% - ${first}%`;
  }

  private getUrlForCurrentInput() {
    const {finaleAchv, totalScore, breakScore, breakJudgements} = this.state;
    return (
      "?" +
      new URLSearchParams({
        [QueryParam.Achievement]: finaleAchv.toFixed(2),
        [QueryParam.BreakScore]: breakScore.toString(),
        [QueryParam.TotalScore]: totalScore.toString(),
        [QueryParam.BreakJudgement]: breakJudgements.join("-"),
      })
    );
  }

  private handleChangeFinaleAchv = (evt: React.FormEvent<HTMLInputElement>) => {
    const achv = parseFloat(evt.currentTarget.value);
    if (achv > 0) {
      this.setState({finaleAchv: achv});
    }
  };

  private handleChangeTotalScore = (evt: React.FormEvent<HTMLInputElement>) => {
    const totalScore = parseInt(evt.currentTarget.value);
    if (totalScore > 0) {
      const name = evt.currentTarget.name as "breakScore" | "totalScore";
      const newState = {[name]: totalScore} as Pick<State, "breakScore" | "totalScore">;
      this.setState(newState);
    }
  };

  private handleChangeBreakJudgement = (evt: React.FormEvent<HTMLInputElement>) => {
    const count = parseInt(evt.currentTarget.value);
    if (count >= 0) {
      const index = parseInt(evt.currentTarget.name.substring(6));
      this.setState(({breakJudgements}) => ({
        breakJudgements: breakJudgements.map((v, idx) => (idx === index ? count : v)),
      }));
    }
  };

  private handleCopyLink = () => {
    window.location.assign(this.getUrlForCurrentInput());
  };

  private handleFillExample = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (Math.random() > 0.5) {
      // 全人類ノ非想天則 EXPERT
      location.assign("?achv=100.46&bs=170850&ts=385300&bj=65-2-0-0");
    } else {
      // Shake it! MASTER
      location.assign("?achv=99.96&bs=64050&ts=380850&bj=24-1-0-0");
    }
  };

  private handleReset = (evt: React.FormEvent) => {
    evt.preventDefault();
    location.assign("?");
  };
}
