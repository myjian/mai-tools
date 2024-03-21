import React, {useState} from 'react';

import {RecommendedLevelRow} from '../common/components/RecommendedLevelRow';
import {Language} from '../common/lang';
import {useLanguage} from '../common/lang-react';
import {
  calcRecommendedLevels,
  getRankDefinitions,
  getRankIndexByAchievement,
} from '../common/rank-functions';
import {loadUserPreference, saveUserPreference, UserPreference} from '../common/user-preference';
import {CommonMessages} from '../rating-calculator/common-messages';
import {NUM_TOP_NEW_CHARTS, NUM_TOP_OLD_CHARTS} from '../rating-calculator/rating-analyzer';
import {QueryParam} from "../common/query-params";

const MIN_ACHIEVEMENT = 99;
const DEFAULT_TARGET_RATING = 12000;

const MessagesByLang = {
  [Language.en_US]: {
    target: 'Target',
  },
  [Language.ko_KR]: {
    target: '과녁',
  },
  [Language.zh_TW]: {
    target: '目標',
  },
};

export const RecommendedLevels = () => {
  const queryParams = new URLSearchParams(location.search);
  const [targetRating, setTargetRating] = useState(
    () => parseInt(queryParams.get(QueryParam.TargetRating)) ||
        parseInt(loadUserPreference(UserPreference.TargetRating)) ||
        DEFAULT_TARGET_RATING
  );
  const handleTargetRatingChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const rating = parseInt(e.currentTarget.value);
    if (isNaN(rating) || rating <= 0) {
      return;
    }
    saveUserPreference(UserPreference.TargetRating, rating.toFixed(0));
    setTargetRating(rating);
  };
  const lang = useLanguage();
  const messages = MessagesByLang[lang];
  const commonMessages = CommonMessages[lang];

  const targetRatingPerSong = Math.ceil(targetRating / (NUM_TOP_NEW_CHARTS + NUM_TOP_OLD_CHARTS));
  const ranks = getRankDefinitions().slice(0, getRankIndexByAchievement(MIN_ACHIEVEMENT) + 1);
  const recLvsByRank = calcRecommendedLevels(targetRatingPerSong, ranks);
  return (
    <div className="suggestLvByRating">
      <label className="targetRatingLabel">
        {messages.target}:{' '}
        <input
          className="targetRating"
          onChange={handleTargetRatingChange}
          type="number"
          value={targetRating}
        ></input>
      </label>
      <table className="lookupTable recLvTable">
        <thead className="lookupTableHead">
          <tr>
            <th>{commonMessages.level}</th>
            <th>{commonMessages.rank}</th>
            <th>{commonMessages.achievementAbbr}</th>
            <th>{commonMessages.rating}</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((rank) =>
            recLvsByRank[rank.title].map((recLv, idx) => (
              <RecommendedLevelRow key={idx} rankTitle={rank.title} recLv={recLv} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
