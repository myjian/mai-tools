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
  const BREAK_BONUS_POINTS = 100;
  const MAX_BREAK_POINTS = BASE_SCORE_PER_TYPE.break + BREAK_BONUS_POINTS;
  const REGULAR_BASE_SCORE_MULTIPLIER = [1, 1, 0.8, 0.5, 0];

  const BREAK_BASE_SCORE_MULTIPLIER = new Map([
    [MAX_BREAK_POINTS, 1],
    [2550, 1],
    [2500, 1],
    [2000, 0.8],
    [1500, 0.6],
    [1250, 0.5],
    [1000, 0.4],
    [0, 0]
  ]);
  const BREAK_BONUS_MULTIPLIER = new Map([
    [MAX_BREAK_POINTS, 1],
    [2550, 0.75],
    [2500, 0.5],
    [2000, 0.4],
    [1500, 0.4],
    [1250, 0.4],
    [1000, 0.3],
    [0, 0]
  ]);
  
  const EPSILON = 0.00011;

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
        breakDistribution.set(MAX_BREAK_POINTS, noteCount);
        return walkBreakDistributions(
          validBreakDistributions,
          breakDistribution,
          breakJudgements.slice(1),
          remainingAchievement,
          basePercentagePerBreak
        );
      case 4: // Perfect
        const c2600lowerBound = breakDistribution.get(MAX_BREAK_POINTS) || 0;
        noteCount += c2600lowerBound;
        const c2600upperBound = breakDistribution.get(MAX_BREAK_POINTS) || noteCount;
        for (let i = c2600upperBound; i >= c2600lowerBound; i--) {
          breakDistribution.set(MAX_BREAK_POINTS, i);
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
  
  function roundFloat(num, method, unit) {
    return Math[method](unit * num) / unit;
  }

  function calculateBorder(totalBaseScore, breakCount, achievement, playerNoteScore) {
    if (achievement === "AP+") {
      return totalBaseScore + breakCount * BREAK_BONUS_POINTS - playerNoteScore;
    }
    const rawBorder = totalBaseScore * achievement - playerNoteScore;
    if (rawBorder < 0) {
      return -1;
    }
    console.log(achievement, playerNoteScore, rawBorder);
    return roundFloat(rawBorder, "ceil", 1/50);
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
    const lostScorePerType = {};
    judgementsPerType.forEach((judgements, noteType) => {
      const noteBaseScore = BASE_SCORE_PER_TYPE[noteType];
      const count = judgements.reduce((acc, n) => acc + n, 0);
      const totalNoteScore = count * noteBaseScore;
      totalBaseScore += totalNoteScore;
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
        lostScorePerType[noteType] = totalNoteScore - playerNoteScore;
        playerRegularNoteScore += playerNoteScore;
      }
    });

    // Figure out break distribution
    const playerRegularNotePercentage = (100.0 * playerRegularNoteScore) / totalBaseScore;
    const remainingAchievement = playerAchievement - playerRegularNotePercentage;
    const basePercentagePerBreak = (100.0 * BASE_SCORE_PER_TYPE.break) / totalBaseScore;
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
        [MAX_BREAK_POINTS, 0],
        [2550, 0],
        [2500, 0],
        [2000, 0],
        [1500, 0],
        [1250, 0],
        [1000, 0],
        [0, 0]
      ]);
      let offset = 0;
      if (breakJudgements.length === JUDGEMENT_RESULTS.length) {
        breakDistribution.set(MAX_BREAK_POINTS, breakJudgements[0]);
        offset = 1;
      }
      breakDistribution.set(2500, breakJudgements[offset]);
      breakDistribution.set(1250, breakJudgements[offset + 1]);
      breakDistribution.set(1000, breakJudgements[offset + 2]);
      breakDistribution.set(0, breakJudgements[offset + 3]);
    }
    
    // Figure out FiNALE achievement
    let totalBreakCount = 0;
    let playerBreakNoteScore = 0;
    breakDistribution.forEach((count, judgement) => {
      totalBreakCount += count;
      playerBreakNoteScore += count * judgement;
    });
    const playerNoteScore = playerBreakNoteScore + playerRegularNoteScore;
    const maxNoteScore = totalBaseScore + BREAK_BONUS_POINTS * totalBreakCount;
    const finaleAchievement = roundFloat((100.0 * playerNoteScore) / totalBaseScore, "floor", 100);
    const finaleMaxAchievement = roundFloat((100.0 * maxNoteScore) / totalBaseScore, "floor", 100);
    
    // Figure out achievement loss per note type
    let dxAchievementLoss = 101 - playerAchievement;
    let finaleAchievementLoss = finaleMaxAchievement - finaleAchievement;
    console.log(`achLoss ${dxAchievementLoss} ${finaleAchievementLoss}`);
    const achievementLossPerType = {
      dx: new Map([["total", dxAchievementLoss && dxAchievementLoss.toFixed(4)]]),
      finale: new Map([
        [
          "total",
          finaleAchievementLoss && finaleAchievementLoss.toFixed(2)
        ]
      ]),
    };
    DX_NOTE_TYPES.forEach((noteType) => {
      if (noteType === "break") {
        return;
      }
      const loss = 100.0 * (lostScorePerType[noteType] || 0) / totalBaseScore;
      let dxLoss = dxAchievementLoss - loss <= EPSILON ? dxAchievementLoss : loss;
      dxLoss = roundFloat(dxLoss, "round", 10000);
      dxAchievementLoss -= dxLoss;
      achievementLossPerType.dx.set(noteType, dxLoss && dxLoss.toFixed(4));
      let finaleLoss = finaleAchievementLoss - loss <= EPSILON ? finaleAchievementLoss : loss;
      finaleLoss = roundFloat(finaleLoss, "round", 100);
      finaleAchievementLoss -= finaleLoss;
      achievementLossPerType.finale.set(noteType, finaleLoss && finaleLoss.toFixed(2));
      console.log(`${noteType} ${dxLoss} ${finaleLoss}`);
    });
    console.log(`break ${dxAchievementLoss} ${finaleAchievementLoss}`);
    achievementLossPerType.dx.set("break", dxAchievementLoss && dxAchievementLoss.toFixed(4));
    achievementLossPerType.finale.set("break", finaleAchievementLoss && finaleAchievementLoss.toFixed(2));

    // Figure out score diff vs. higher ranks
    console.log(`totalBaseScore ${totalBaseScore}`);
    console.log(`totalBreakCount ${totalBreakCount}`);
    const border = new Map([
      ["S", calculateBorder(totalBaseScore, totalBreakCount, 0.97, playerNoteScore)],
      ["S+", calculateBorder(totalBaseScore, totalBreakCount, 0.98, playerNoteScore)],
      ["SS", calculateBorder(totalBaseScore, totalBreakCount, 0.99, playerNoteScore)],
      ["SS+", calculateBorder(totalBaseScore, totalBreakCount, 0.995, playerNoteScore)],
      ["SSS", calculateBorder(totalBaseScore, totalBreakCount, 1, playerNoteScore)],
      ["AP+", calculateBorder(totalBaseScore, totalBreakCount, "AP+", playerNoteScore)],
    ]);
    
    return [
      finaleAchievement,
      finaleMaxAchievement,
      breakDistribution,
      achievementLossPerType,
      border,
    ];
  }

  function parseNumArrayFromText(line, fallback) {
    const textArr = line.match(/\d+/g);
    return textArr ? textArr.map((num) => parseInt(num, 10)) : fallback;
  }

  function performConversion(songTitle, achievement, judgements) {
    if (!isNaN(achievement) && judgements.length >= 4) {
      // update song title UI
      const songTitleElem = document.getElementById("songTitle");
      songTitleElem.innerText = songTitle || "";
      songTitleElem.href = WIKI_URL_PREFIX + encodeURIComponent(songTitle) + WIKI_URL_SUFFIX;
      
      const noteTypes = judgements.length === 4 ? STD_NOTE_TYPES : DX_NOTE_TYPES;
      const judgementsPerType = new Map();
      judgements.forEach((j, idx) => {
        judgementsPerType.set(noteTypes[idx], j);
      });

      // Update chart info UI
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

      // Do some crazy math
      const [
        finaleAchievement,
        maxFinaleScore,
        breakDistribution,
        achievementLossPerType,
        border,
      ] = calculateFinaleScore(
        judgementsPerType,
        achievement
      );
      
      // Update player score table UI
      document.getElementById("finaleScore").innerText = finaleAchievement.toFixed(2);
      document.querySelectorAll(".maxFinaleScore").forEach((elem) => {
        elem.innerText = maxFinaleScore.toFixed(2);
      });
      judgementsPerType.forEach((playerJ, noteType) => {
        if (noteType === "break") {
          return;
        }
        const hasCP = playerJ.length === JUDGEMENT_RESULTS.length;
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
      
      // Update achievement loss UI
      achievementLossPerType.dx.forEach((loss, noteType) => {
        const lossElem = document.querySelector(`td.achievementLoss.dx .${noteType}`);
        lossElem.innerText = loss;
      })
      achievementLossPerType.finale.forEach((loss, noteType) => {
        const lossElem = document.querySelector(`td.achievementLoss.finale .${noteType}`);
        lossElem.innerText = loss;
      })

      // Update border info UI
      const scoreDiffContainer = document.querySelector(".scoreDiffContainer");
      const scoreDiffTable = document.querySelector("#scoreDiffTable tbody");
      scoreDiffTable.innerHTML = "";
      border.forEach((score, rank) => {
        if (score > 0) {
          const tr = document.createElement("tr");
          const th = document.createElement("th");
          const td = document.createElement("td");
          th.innerText = rank;
          td.innerText = score;
          tr.append(th, td);
          scoreDiffTable.append(tr);
        }
      });
      if (scoreDiffTable.innerHTML.length) {
        scoreDiffContainer.classList.remove("hidden");
      } else {
        scoreDiffContainer.classList.add("hidden");
      }
    }
  }
  
  function parseJudgement(jTextLines) {
    const breakJ = parseNumArrayFromText(jTextLines.pop(), undefined);
    // zeroJ is a placeholder for non-existent note types
    const zeroJ = ZERO_JUDGEMENT.slice(0, breakJ.length);

    const touchJ = parseNumArrayFromText(jTextLines.pop(), undefined);
    const slideJ = parseNumArrayFromText(jTextLines.pop(), zeroJ);
    const holdJ = parseNumArrayFromText(jTextLines.pop(), zeroJ);
    const tapJ = parseNumArrayFromText(jTextLines.pop(), zeroJ);
    const judgements = [tapJ, holdJ, slideJ, breakJ];
    if (touchJ) {
      judgements.splice(3, 0, touchJ);
    }
    return judgements;
  }

  convertBtn.addEventListener("click", (evt) => {
    const lines = inputElem.value.split("\n");
    if (lines < 6) {
      return;
    }
    let songTitle;
    let achievementText;
    let noteDetails = [];
    // Parse from the last line
    while (lines.length) {
      currentLine = lines.pop();
      const judgements = currentLine.match(/\d+/g);
      if (
        judgements &&
        judgements.length >= JUDGEMENT_RESULTS.length - 1 &&
        judgements.length <= JUDGEMENT_RESULTS.length
      ) {
        noteDetails.unshift(currentLine);
        for (let i = 0; i < DX_NOTE_TYPES.length - 1; i++) {
          noteDetails.unshift(lines.pop());
        }
      }
      const achievementMatch = currentLine.match(/(\d+\.\d+)%/);
      if (achievementMatch) {
        achievementText = achievementMatch[1];
        songTitle = lines.pop();
        break;
      }
    }
    if (songTitle && achievementText && noteDetails.length) {
      const baseUrl = document.location.href.substring(
        0,
        document.location.href.indexOf(document.location.pathname) + document.location.pathname.length
      );
      const query = new URLSearchParams();
      query.set("st", songTitle);
      query.set("ac", achievementText);
      query.set("nd", noteDetails.join("\n"));
      const newUrl = baseUrl + "?" + query;
      console.log(newUrl);
      window.location.assign(newUrl);
    }
  });

  // Handle parameters from URL
  const searchParams = new URLSearchParams(document.location.search);
  if (searchParams.get("st") && searchParams.get("ac") && searchParams.get("nd")) {
    const songTitle = searchParams.get("st");
    const achievementText = searchParams.get("ac");
    const noteDetail = searchParams.get("nd");
    if (songTitle && achievementText && noteDetail) {
      document.getElementById("inputContainer").style.display = "none";
      document.title = `${songTitle} - ${document.title}`;
      const achievement = parseFloat(achievementText);
      const judgements = parseJudgement(noteDetail.split("\n"));
      performConversion(songTitle, achievement, judgements);
    }
  }
})();
