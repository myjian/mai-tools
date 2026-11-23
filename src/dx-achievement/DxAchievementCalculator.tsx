import {SyntheticEvent, useCallback, useMemo, useState} from 'react';

import {QueryParam} from '../common/query-params';
import {DxAchvDetails} from './DxAchvDetails';
import {calculateDxAchvFromFinaleResult} from './finaleBacktracing';

interface InitialState {
  initialFinaleAchvInput: string;
  finaleAchv: number;
  initialTotalScoreInput: string;
  totalScore: number;
  initialBreakScoreInput: string;
  breakScore: number;
  initialBreakJudgementsInput: ReadonlyArray<string>;
  breakJudgements: ReadonlyArray<number>;
}

export const DxAchievementCalculator = () => {
  const initialState = useMemo(
    () => getInitialStateFromQueryParams(new URLSearchParams(location.search)),
    [location.search],
  );

  const {
    initialFinaleAchvInput,
    initialTotalScoreInput,
    initialBreakScoreInput,
    initialBreakJudgementsInput,
  } = initialState;
  const [finaleAchv, setFinaleAchv] = useState(initialState.finaleAchv);
  const [totalScore, setTotalScore] = useState(initialState.totalScore);
  const [breakScore, setBreakScore] = useState(initialState.breakScore);
  const [breakJudgements, setBreakJudgements] = useState(initialState.breakJudgements);

  const distByAchv = useMemo(
    () => calculateDxAchvFromFinaleResult(finaleAchv, totalScore, breakScore, breakJudgements),
    [finaleAchv, totalScore, breakScore, breakJudgements],
  );

  const getUrlForCurrentInput = useCallback(() => {
    return (
      '?' +
      new URLSearchParams({
        [QueryParam.Achievement]: finaleAchv.toFixed(2),
        [QueryParam.BreakScore]: breakScore.toString(),
        [QueryParam.TotalScore]: totalScore.toString(),
        [QueryParam.BreakJudgement]: breakJudgements.join('-'),
      })
    );
  }, [finaleAchv, totalScore, breakScore, breakJudgements]);

  const handleChangeFinaleAchv = useCallback(
    (evt: SyntheticEvent<HTMLInputElement>) => {
      const achv = parseFloat(evt.currentTarget.value);
      if (achv > 0) {
        setFinaleAchv(achv);
      }
    },
    [setFinaleAchv],
  );

  const handleChangeTotalScore = useCallback(
    (evt: SyntheticEvent<HTMLInputElement>) => {
      const value = parseInt(evt.currentTarget.value);
      if (value > 0) {
        switch (evt.currentTarget.name) {
          case 'totalScore':
            setTotalScore(value);
            break;
          case 'breakScore':
            setBreakScore(value);
            break;
        }
      }
    },
    [setTotalScore, setBreakScore],
  );

  const handleChangeBreakJudgement = useCallback(
    (evt: SyntheticEvent<HTMLInputElement>) => {
      const count = evt.currentTarget.value.length ? parseInt(evt.currentTarget.value) : 0;
      if (count >= 0) {
        const index = parseInt(evt.currentTarget.name.substring(6));
        setBreakJudgements((prev) => prev.map((v, idx) => (idx === index ? count : v)));
      }
    },
    [setBreakJudgements],
  );

  return (
    <>
      <form>
        <div>
          <button onClick={handleFillExample}>Fill example data</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div>
          <strong>Finale Achievement:</strong>
          <br />
          <input onChange={handleChangeFinaleAchv} defaultValue={initialFinaleAchvInput}></input>%
        </div>
        <div>
          <strong>Total Score:</strong>
          <br />
          <input
            name="totalScore"
            onChange={handleChangeTotalScore}
            defaultValue={initialTotalScoreInput}
          ></input>
        </div>
        <div>
          <strong>Break Score:</strong>
          <br />
          <input
            name="breakScore"
            defaultValue={initialBreakScoreInput}
            onChange={handleChangeTotalScore}
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
                onChange={handleChangeBreakJudgement}
              ></input>
            </div>
            <div className="judgementInputCol greatJudgement">
              Great
              <br />
              <input
                className="noteCount"
                name="break_1"
                defaultValue={initialBreakJudgementsInput[1]}
                onChange={handleChangeBreakJudgement}
              ></input>
            </div>
            <div className="judgementInputCol goodJudgement">
              Good
              <br />
              <input
                className="noteCount"
                defaultValue={initialBreakJudgementsInput[2]}
                name="break_2"
                onChange={handleChangeBreakJudgement}
              ></input>
            </div>
            <div className="judgementInputCol missJudgement">
              Miss
              <br />
              <input
                className="noteCount"
                name="break_3"
                defaultValue={initialBreakJudgementsInput[3]}
                onChange={handleChangeBreakJudgement}
              ></input>
            </div>
          </div>
        </div>
      </form>
      <div className="resultHeading">
        <h3>{getDxAchvRange(distByAchv)}</h3>
        <a href={getUrlForCurrentInput()}>Link to this result</a>
      </div>
      {Array.from(distByAchv.entries()).map(([dxAchv, dist], index) => (
        <DxAchvDetails key={index} dxAchv={dxAchv} breakDist={dist} />
      ))}
    </>
  );
};

function getDxAchvRange(distsByAchv: Map<string, unknown>) {
  if (!distsByAchv.size) {
    return `DX Achievement: ?`;
  }
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

function handleFillExample(evt: SyntheticEvent) {
  evt.preventDefault();
  if (Math.random() > 0.5) {
    // 全人類ノ非想天則 EXPERT
    location.assign('?achv=100.46&bs=170850&ts=385300&bj=65-2-0-0');
  } else {
    // Shake it! MASTER
    location.assign('?achv=99.96&bs=64050&ts=380850&bj=24-1-0-0');
  }
}

function handleReset(evt: SyntheticEvent) {
  evt.preventDefault();
  location.assign('?');
}

function parsePositiveInt(text: string | null): number {
  if (!text) {
    return 0;
  }
  const val = parseInt(text);
  return isNaN(val) || val <= 0 ? 0 : val;
}

function parsePositiveFloat(text: string | null): number {
  if (!text) {
    return 0;
  }
  const val = parseFloat(text);
  return isNaN(val) || val <= 0 ? 0 : val;
}

function getInitialStateFromQueryParams(queryParams: URLSearchParams): InitialState {
  const rawAchv =
    queryParams.get(QueryParam.Achievement) || queryParams.get(QueryParam.AchievementOld) || '';
  const rawTotalScore = queryParams.get(QueryParam.TotalScore) || '';
  const rawBreakScore = queryParams.get(QueryParam.BreakScore) || '';
  const rawBreakJudgements = queryParams.get(QueryParam.BreakJudgement) || '';
  const breakJudgementTexts = rawBreakJudgements.split('-');
  // Fill missing judgements with '0' and trim extra judgements to ensure there are exactly 4 judgements.
  while (breakJudgementTexts.length < 4) {
    breakJudgementTexts.push('0');
  }
  while (breakJudgementTexts.length > 4) {
    breakJudgementTexts.pop();
  }
  const breakJudgementNums = breakJudgementTexts.map((j) => parsePositiveInt(j));
  return {
    initialFinaleAchvInput: rawAchv,
    finaleAchv: parsePositiveFloat(rawAchv),
    initialTotalScoreInput: rawTotalScore,
    totalScore: parsePositiveInt(rawTotalScore),
    initialBreakScoreInput: rawBreakScore,
    breakScore: parsePositiveInt(rawBreakScore),
    initialBreakJudgementsInput: breakJudgementTexts,
    breakJudgements: breakJudgementNums,
  };
}
