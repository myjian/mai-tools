(function(){
  const inputElem = document.getElementsByClassName("input")[0];
  const convertBtn = document.getElementById("convert");

  const WIKI_URL_PREFIX = "https://maimai.fandom.com/zh/wiki/";
  const WIKI_URL_SUFFIX = "?variant=zh-hant";

  const STD_NOTE_TYPES = ["tap", "hold", "slide", "break"];
  const DX_NOTE_TYPES = ["tap", "hold", "slide", "touch", "break"];
  const JUDGEMENT_RESULTS = [
    "criticalPerfect",
    "perfect",
    "great",
    "good",
    "miss"
  ];
  const ZERO_JUDGEMENT = [0, 0, 0, 0, 0];

  const BASE_SCORE_PER_TYPE = {
    tap: 500,
    hold: 1000,
    touch: 500,
    slide: 1500,
    break: 2500
  };
  const REGULAR_BASE_SCORE_MULTIPLIER = [1, 1, 0.8, 0.5, 0];

  const BREAK_BASE_SCORE_MULTIPLIER = new Map([
    [2600, 1],
    [2550, 1],
    [2500, 1],
    [2000, 0.8],
    [1500, 0.6],
    [1250, 0.5],
    [1000, 0.4],
    [0, 0]
  ]);
  const BREAK_BONUS_MULTIPLIER = new Map([
    [2600, 1],
    [2550, 0.75],
    [2500, 0.5],
    [2000, 0.4],
    [1500, 0.4],
    [1250, 0.4],
    [1000, 0.3],
    [0, 0]
  ]);

  /*
   * @param breakDistribution Map<number, number>
   * @return number bestAchievement of this break judgement
   */
  function walkBreakDistributions(
    validBreakDistributions,
    breakDistribution,
    breakJudgements,
    remainingAchievement,
    basePercentagePerBreak
  ) {
    let noteCount = breakJudgements[0];
    let isBestAchievementSet = false;
    let bestAchievement = 0;
    switch (breakJudgements.length) {
      case 5: // Critical Perfect
        breakDistribution.set(2600, noteCount);
        return walkBreakDistributions(
          validBreakDistributions,
          breakDistribution,
          breakJudgements.slice(1),
          remainingAchievement,
          basePercentagePerBreak
        );
      case 4: // Perfect
        const c2600lowerBound = breakDistribution.get(2600) || 0;
        noteCount += c2600lowerBound;
        const c2600upperBound = breakDistribution.get(2600) || noteCount;
        for (let i = c2600upperBound; i >= c2600lowerBound; i--) {
          breakDistribution.set(2600, i);
          for (let j = noteCount - i; j >= 0; j--) {
            breakDistribution.set(2550, j);
            breakDistribution.set(2500, noteCount - i - j);
            const playerAchievement = walkBreakDistributions(
              validBreakDistributions,
              breakDistribution,
              breakJudgements.slice(1),
              remainingAchievement,
              basePercentagePerBreak
            );
            if (!isBestAchievementSet) {
              bestAchievement = playerAchievement;
              isBestAchievementSet = true;
            }
            if (playerAchievement < remainingAchievement) {
              // playerAchievement will not get better for smaller j. Try next i.
              break;
            }
          }
        }
        return bestAchievement;
      case 3: // Great
        for (let i = noteCount; i >= 0; i--) {
          breakDistribution.set(2000, i);
          for (let j = noteCount - i; j >= 0; j--) {
            breakDistribution.set(1500, j);
            breakDistribution.set(1250, noteCount - i - j);
            const playerAchievement = walkBreakDistributions(
              validBreakDistributions,
              breakDistribution,
              breakJudgements.slice(1),
              remainingAchievement,
              basePercentagePerBreak
            );
            if (!isBestAchievementSet) {
              bestAchievement = playerAchievement;
              isBestAchievementSet = true;
            }
            if (playerAchievement < remainingAchievement) {
              // playerAchievement will not get better for smaller j. Try next i.
              break;
            }
          }
        }
        return bestAchievement;
      case 2: // Good
        breakDistribution.set(1000, noteCount);
        return walkBreakDistributions(
          validBreakDistributions,
          breakDistribution,
          breakJudgements.slice(1),
          remainingAchievement,
          basePercentagePerBreak
        );
      case 1: // Miss
        breakDistribution.set(0, noteCount);
        return walkBreakDistributions(
          validBreakDistributions,
          breakDistribution,
          breakJudgements.slice(1),
          remainingAchievement,
          basePercentagePerBreak
        );
      case 0: // Validate
        let totalCount = 0;
        let bonusAchievementSum = 0.0;
        let playerAchievement = 0;
        breakDistribution.forEach((count, judgement) => {
          totalCount += count;
          playerAchievement +=
            count *
            BREAK_BASE_SCORE_MULTIPLIER.get(judgement) *
            basePercentagePerBreak;
          bonusAchievementSum += count * BREAK_BONUS_MULTIPLIER.get(judgement);
        });
        playerAchievement += bonusAchievementSum / totalCount;
        remainingAchievement -= playerAchievement;
        if (Math.abs(remainingAchievement) < 0.0001) {
          validBreakDistributions.push(new Map(breakDistribution));
        }
        return playerAchievement;
    }
  }

  /**
   * Given judgements per note type and player achievement (percentage from DX),
   * figure out its maimai FiNALE score and break distribution.
   * @param judgementsPerType Map<string, number[]>
   * @param playerAchievement number
   * @return [number, number, Map<number, number>] player finale score, max finale score, break distribution
   */
  function calculateFinaleScore(
    judgementsPerType,
    playerAchievement
  ) {
    let totalBaseScore = 0;
    let playerRegularNoteScore = 0;
    judgementsPerType.forEach((judgements, noteType) => {
      const noteBaseScore = BASE_SCORE_PER_TYPE[noteType];
      const count = judgements.reduce((acc, n) => acc + n, 0);
      totalBaseScore += count * noteBaseScore;
      // We'll deal with breaks later.
      if (noteType !== "break") {
        const scoreMultiplier =
          judgements.length === 4
            ? REGULAR_BASE_SCORE_MULTIPLIER.slice(1)
            : REGULAR_BASE_SCORE_MULTIPLIER;
        const playerNoteScore = judgements.reduce(
          (acc, j, idx) => acc + j * noteBaseScore * scoreMultiplier[idx],
          0
        );
        playerRegularNoteScore += playerNoteScore;
      }
    });

    const playerRegularNotePercentage =
      (100.0 * playerRegularNoteScore) / totalBaseScore;
    const remainingAchievement = playerAchievement - playerRegularNotePercentage;
    const basePercentagePerBreak =
      (100.0 * BASE_SCORE_PER_TYPE.break) / totalBaseScore;

    const validBreakDistributions = [];
    const breakJudgements = judgementsPerType.get("break");
    walkBreakDistributions(
      validBreakDistributions,
      new Map(),
      breakJudgements,
      remainingAchievement,
      basePercentagePerBreak
    );
    console.log(validBreakDistributions);

    let breakDistribution = validBreakDistributions[0];
    if (!breakDistribution) {
      console.log(
        "Could not find a valid break distribution! Please report the issue to the developer."
      );
      // Assume the worst case
      breakDistribution = new Map([
        [2600, 0],
        [2550, 0],
        [2500, 0],
        [2000, 0],
        [1500, 0],
        [1250, 0],
        [1000, 0],
        [0, 0]
      ]);
      let offset = 0;
      if (breakJudgements.length === 5) {
        breakDistribution.set(2600, breakJudgements[0]);
        offset = 1;
      }
      breakDistribution.set(2500, breakJudgements[offset]);
      breakDistribution.set(1250, breakJudgements[offset + 1]);
      breakDistribution.set(1000, breakJudgements[offset + 2]);
      breakDistribution.set(0, breakJudgements[offset + 3]);
    }
    let totalBreakCount = 0;
    let playerBreakNoteScore = 0;
    breakDistribution.forEach((count, judgement) => {
      totalBreakCount += count;
      playerBreakNoteScore += count * judgement;
    });
    const finaleAchievement =
      (100.0 * (playerBreakNoteScore + playerRegularNoteScore)) / totalBaseScore;
    const finaleMaxAchievement =
      (100.0 * (totalBaseScore + 100 * totalBreakCount)) / totalBaseScore;
    return [
      Math.floor(finaleAchievement * 100) / 100,
      Math.floor(finaleMaxAchievement * 100) / 100,
      breakDistribution,
    ];
  }

  function parseNumArrayFromText(line, fallback) {
    const textArr = line.match(/\d+/g);
    return textArr ? textArr.map((num) => parseInt(num, 10)) : fallback;
  }

  function performConversion(inputText) {
    const lines = inputText.split("\n");
    if (lines < 6) {
      return;
    }
    let songTitle;
    let achievement;
    let judgements = [];
    // Parse from the last line
    for (
      let currentLine = lines.pop();
      currentLine != undefined;
      currentLine = lines.pop()
    ) {
      const judgementsOfLine = currentLine.match(/\d+/g);
      // 4 = Perfect, Great, Good, Miss; 5 = Critical Perfect, ...
      if (
        judgementsOfLine &&
        judgementsOfLine.length >= 4 &&
        judgementsOfLine.length <= 5
      ) {
        const breakJ = parseNumArrayFromText(currentLine, undefined);
        // zeroJ is a placeholder for non-existent note types
        const zeroJ = ZERO_JUDGEMENT.slice(0, breakJ.length);

        const touchJ = parseNumArrayFromText(lines.pop(), undefined);
        const slideJ = parseNumArrayFromText(lines.pop(), zeroJ);
        const holdJ = parseNumArrayFromText(lines.pop(), zeroJ);
        const tapJ = parseNumArrayFromText(lines.pop(), zeroJ);
        judgements = [tapJ, holdJ, slideJ, breakJ];
        if (touchJ) {
          judgements.splice(3, 0, touchJ);
        }
      }
      const achievementText = currentLine.match(/(\d+\.\d+)%/);
      if (achievementText) {
        achievement = parseFloat(achievementText[1]);
        songTitle = lines.pop();
        break;
      }
    }

    if (!isNaN(achievement) && judgements.length >= 4) {
      const songTitleElem = document.getElementById("songTitle");
      songTitleElem.innerText = songTitle || "";
      songTitleElem.href = WIKI_URL_PREFIX + encodeURIComponent(songTitle) + WIKI_URL_SUFFIX;
      const noteTypes = judgements.length === 4 ? STD_NOTE_TYPES : DX_NOTE_TYPES;
      const judgementsPerType = new Map();
      judgements.forEach((j, idx) => {
        judgementsPerType.set(noteTypes[idx], j);
      });

      // update UI (part 1)
      document.getElementById("dxScore").innerText = achievement.toFixed(4);
      const totalNoteCount = DX_NOTE_TYPES.reduce((combo, noteType) => {
        const playerJ = judgementsPerType.get(noteType) || [];
        const noteCount = playerJ.reduce((acc, c) => acc + c, 0);
        if (noteType === "touch") {
          document.querySelector(`th.${noteType}`).style.display = noteCount === 0 ? "none" : "";
          document.querySelector(`td.${noteType}Count`).style.display = noteCount === 0 ? "none" : "";
        }
        document.querySelector(`td.${noteType}Count`).innerText = noteCount;
        return combo + noteCount;
      }, 0);
      document.getElementById("totalNoteCount").innerText = totalNoteCount;

      // do some math
      const [finaleAchievement, maxFinaleScore, breakDistribution] = calculateFinaleScore(
        judgementsPerType,
        achievement
      );

      // update UI (part 2)
      document.getElementById("finaleScore").innerText = finaleAchievement.toFixed(2);
      document.querySelectorAll(".maxFinaleScore").forEach((elem) => {
        elem.innerText = maxFinaleScore.toFixed(2);
      });
      judgementsPerType.forEach((playerJ, noteType) => {
        if (noteType === "break") {
          return;
        }
        const hasCP = playerJ.length === 5;
        JUDGEMENT_RESULTS.forEach((judgement, index) => {
          const tableCell = document.querySelector(`td.${noteType}.${judgement}`);
          if (judgement === "criticalPerfect") {
            tableCell.innerText = hasCP ? playerJ[index] : "";
          } else {
            tableCell.innerText = hasCP ? playerJ[index] : playerJ[index-1];
          }
        });
      });
      breakDistribution.forEach((count, score) => {
        const tableCell = document.querySelector(`span.break${score}`);
        tableCell.innerText = count;
      });
    }
  }

  convertBtn.addEventListener("click", (evt) => {
    performConversion(inputElem.value);
  });

  // Handle parameters from URL
  const searchParams = new URLSearchParams(document.location.search);
  if (searchParams.get("st") && searchParams.get("ac") && searchParams.get("nd")) {
    const songTitle = searchParams.get("st");
    const achievement = searchParams.get("ac");
    const noteDetail = searchParams.get("nd");
    if (songTitle && achievement && noteDetail) {
      document.getElementById("inputContainer").style.display = "none";
    }
    const inputText = `${songTitle}\n${achievement}\n${noteDetail}\n`;
    performConversion(inputText);
    inputElem.value = inputText;
  }
})();
