<template>
  <div class="ScoreCalc">
    <header>
      <h1>maimai Score Calculator</h1>
    </header>
    <main>
      <p>
        <button @click="resetForm">Reset Form</button>
        &nbsp;
        <button @click="applyTestcase">Apply Test Data</button>
      </p>
      <div>
        <table>
          <thead>
            <tr>
              <th rowspan="2" class="note-type">Note Type</th>
              <th rowspan="2" class="note-count">Note Count</th>
              <th colspan="2">maimai</th>
              <th colspan="2">maimai DX</th>
              <th colspan="2" class="unit-score">Deluxe Score</th>
            </tr>
            <tr>
              <th class="unit-score">
                Unit Score
                <br />(+Bonus)
              </th>
              <th class="unit-achievement">
                Unit Achievement
                <br />(+Bonus)
              </th>
              <th class="unit-score">
                Unit Score
                <br />(+Bonus)
              </th>
              <th class="unit-achievement">
                Unit Achievement
                <br />(+Bonus)
              </th>
              <th class="unit-score">Unit Score</th>
              <th class="unit-achievement">Unit Achievement</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="noteType in noteTypes" :key="noteType">
              <th name="note-type">{{ noteType.toUpperCase() }}</th>
              <td
                name="note-count"
                :class="(noteType === 'break' && noteCounts[noteType] < 1) && 'invalid-note-count'"
              >
                <input
                  type="number"
                  :min="noteType === 'break' ? 1 : 0"
                  v-model.number="noteCounts[noteType]"
                />
                <vue-slider
                  :min="noteType === 'break' ? 1 : 0"
                  :max="1000"
                  :drag-on-click="true"
                  v-model="noteCounts[noteType]"
                ></vue-slider>
              </td>
              <td name="maimai-score">
                {{ noteBaseScores[noteType] }}
                <template
                  v-if="noteType === 'break'"
                >(+{{ breakBonusScore }})</template>
              </td>
              <td name="maimai-achievement">
                <span name="text">
                  <b>{{ noteBaseAchievements[noteType].toFixed(2) }}%</b>
                  <template v-if="noteType === 'break'">
                    <b>&nbsp;(+{{ breakBonusAchievement.toFixed(2) }}%)</b>
                  </template>
                </span>
                <span name="bar">
                  <progress-bar :max="100" :val="100.0 * noteBaseAchievements[noteType]"></progress-bar>
                  <template v-if="noteType === 'break'">
                    <progress-bar
                      :max="100"
                      bar-color="yellow"
                      bg-color="darkgray"
                      :val="100.0 * breakBonusAchievement"
                    ></progress-bar>
                  </template>
                </span>
              </td>
              <td name="maimaidx-score">
                {{ noteBaseScores[noteType] }}
                <template v-if="noteType === 'break'">
                  <b>(+{{ breakBonusScoreDX.toFixed(0) }})</b>
                </template>
              </td>
              <td name="maimaidx-achievement">
                <span name="text">
                  <b>{{ noteBaseAchievements[noteType].toFixed(4) }}%</b>
                  <template v-if="noteType === 'break'">
                    <b>&nbsp;(+{{ breakBonusAchievementDX.toFixed(4) }}%)</b>
                  </template>
                </span>
                <span name="bar">
                  <progress-bar :max="100" :val="100.0 * noteBaseAchievements[noteType]"></progress-bar>
                  <template v-if="noteType === 'break'">
                    <progress-bar
                      :max="100"
                      bar-color="yellow"
                      bg-color="darkgray"
                      :val="100.0 * breakBonusAchievementDX"
                    ></progress-bar>
                  </template>
                </span>
              </td>
              <td name="maimaidx-deluxe-score">{{ noteBaseDeluxeScores[noteType] }}</td>
              <td name="maimaidx-deluxe-achievement">
                <span name="text">
                  <b>{{ noteBaseDeluxeAchievements[noteType].toFixed(4) }}%</b>
                </span>
                <span name="bar">
                  <progress-bar :max="100" :val="100.0 * noteBaseDeluxeAchievements[noteType]"></progress-bar>
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>TOTAL</th>
              <td>
                <b>{{ totalNoteCount }}</b>
              </td>
              <td>
                <b>{{ totalBaseScore }} (+{{ totalBonusScore }})</b>
              </td>
              <td>
                {{ (100.0).toFixed(2) }}%
                <b>(+{{ totalBonusAchievement.toFixed(2) }}%)</b>
              </td>
              <td>
                <b>{{ totalBaseScore }} (+{{ totalBonusScoreDX }})</b>
              </td>
              <td>{{ (100.0).toFixed(4) }}% (+{{ totalBonusAchievementDX.toFixed(4) }}%)</td>
              <td>
                <b>{{ totalBaseDeluxeScore }}</b>
              </td>
              <td>{{ (100.0).toFixed(4) }}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p>* Bonus in the above table are counted separately.</p>
      <div>
        <table>
          <thead>
            <tr>
              <th rowspan="2" class="note-type">Note Type</th>
              <th rowspan="2" class="note-count">Note Count</th>
              <th colspan="5">Player Performance</th>
              <th colspan="3">Player Result</th>
            </tr>
            <tr>
              <th class="judgement-type">
                CRITICAL
                <br />PERFECT [3]
                <br />
                <small>100% (+100% bonus)</small>
              </th>
              <th class="judgement-type">
                PERFECT [2]
                <br />
                <small>
                  100%
                  <br />(+75%/50% bonus)
                </small>
              </th>
              <th class="judgement-type">
                GREAT [1]
                <br />
                <small>
                  80%
                  <br />(+40% bonus)
                </small>
              </th>
              <th class="judgement-type">
                GOOD [0]
                <br />
                <small>
                  50%
                  <br />(+30% bonus)
                </small>
              </th>
              <th class="judgement-type">
                MISS [0]
                <br />
                <small>
                  0%
                  <br />(+0% bonus)
                </small>
              </th>
              <th class="player-score">
                Score
                <br />(maimai)
              </th>
              <th class="player-score">
                Score
                <br />(maimai DX)
              </th>
              <th class="player-score">
                Deluxe
                <br />Score
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="noteType in noteTypes" :key="noteType">
              <th name="note-type">{{ noteType.toUpperCase() }}</th>
              <td
                name="note-count"
                :class="isPlayerNoteCountMismatched(noteType) && 'invalid-note-count'"
              >
                <b>{{ playerNoteCounts[noteType] }}</b>
                /
                <input
                  type="number"
                  v-model.number="noteCounts[noteType]"
                  disabled
                />
              </td>
              <td name="performance-critical">
                <template v-if="noteType === 'break'">
                  <small>
                    <i>2600pt:&nbsp;</i>
                  </small>
                </template>
                <input type="number" :min="0" v-model.number="playerPerformance[noteType].critical" />
              </td>
              <td name="performance-perfect">
                <template v-if="noteType === 'break'">
                  <small>
                    <i>2550pt:&nbsp;</i>
                  </small>
                  <input
                    type="number"
                    :min="0"
                    v-model.number="playerPerformance.break.better_perfect"
                  />
                  <br />
                  <small>
                    <i>2500pt:&nbsp;</i>
                  </small>
                  <input type="number" :min="0" v-model.number="playerPerformance.break.perfect" />
                </template>
                <template v-else>
                  <input
                    type="number"
                    :min="0"
                    v-model.number="playerPerformance[noteType].perfect"
                  />
                </template>
              </td>
              <td name="performance-great">
                <template v-if="noteType === 'break'">
                  <small>
                    <i>2000pt:&nbsp;</i>
                  </small>
                  <input type="number" :min="0" v-model.number="playerPerformance.break.great" />
                  <br />
                  <small>
                    <i>1500pt:&nbsp;</i>
                  </small>
                  <input
                    type="number"
                    :min="0"
                    v-model.number="playerPerformance.break.worse_great"
                  />
                  <br />
                  <small>
                    <i>1250pt:&nbsp;</i>
                  </small>
                  <input
                    type="number"
                    :min="0"
                    v-model.number="playerPerformance.break.worst_great"
                  />
                </template>
                <template v-else>
                  <input type="number" :min="0" v-model.number="playerPerformance[noteType].great" />
                </template>
              </td>
              <td name="performance-good">
                <template v-if="noteType === 'break'">
                  <input type="number" :min="0" v-model.number="playerPerformance.break.break_good" />
                </template>
                <template v-else>
                  <input type="number" :min="0" v-model.number="playerPerformance[noteType].good" />
                </template>
              </td>
              <td name="performance-miss">
                <input type="number" :min="0" v-model.number="playerPerformance[noteType].miss" />
              </td>
              <td name="maimai-score-result">
                <b>{{ playerScoreSubtotals[noteType].toFixed(0) }}</b>
                <br />
                <b>({{ playerScoreSubtotalPercentages(noteType).toFixed(2) }}%)</b>
                <br />
                <progress-bar :max="100" :val="playerScoreSubtotalPercentages(noteType)"></progress-bar>
              </td>
              <td name="maimaidx-score-result">
                <b>{{ playerScoreSubtotalsDX[noteType].toFixed(0) }}</b>
                <br />
                <b>({{ playerScoreSubtotalPercentagesDX(noteType).toFixed(4) }}%)</b>
                <br />
                <progress-bar :max="100" :val="playerScoreSubtotalPercentagesDX(noteType)"></progress-bar>
              </td>
              <td name="maimaidx-deluxe-score-result">
                <b>{{ playerDeluxeScoreSubtotals[noteType] }}</b>
                <br />
                <b>({{ playerDeluxeScoreSubtotalPercentages(noteType).toFixed(4) }}%)</b>
                <br />
                <progress-bar :max="100" :val="playerDeluxeScoreSubtotalPercentages(noteType)"></progress-bar>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>TOTAL</th>
              <td>
                <b>{{ totalNoteCount }}</b>
              </td>
              <td>
                <b>{{ playerPerformanceOverview.critical }}</b>
              </td>
              <td>
                <b>{{ playerPerformanceOverview.better_perfect + playerPerformanceOverview.perfect }}</b>
              </td>
              <td>
                <b>{{ playerPerformanceOverview.great + playerPerformanceOverview.worse_great + playerPerformanceOverview.worse_great }}</b>
              </td>
              <td>
                <b>{{ playerPerformanceOverview.good + playerPerformanceOverview.break_good }}</b>
              </td>
              <td>
                <b>{{ playerPerformanceOverview.miss }}</b>
              </td>
              <td class="player-result">
                <b>{{ playerScore.toFixed(0) }}</b>
                <br />
                <b>({{ playerAchievement.toFixed(2) }}%)</b>
              </td>
              <td class="player-result">
                <b>{{ playerScoreDX.toFixed(0) }}</b>
                <br />
                <b>({{ playerAchievementDX.toFixed(4) }}%)</b>
              </td>
              <td class="player-result">
                <b>{{ playerDeluxeScore }}</b>
                <br />
                <b>({{ playerDeluxeAchievement.toFixed(4) }}%)</b>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
    <footer>
      <b>maimai Score Calculator</b> is made by
      <a href="https://github.com/zetaraku/" target="_blank" rel="noopener">Raku Zeta</a>
    </footer>
  </div>
</template>

<script type="module">
import VueSlider from "vue-slider-component";
import ProgressBar from "vue-simple-progress";

const NOTE_TYPES = ["tap", "hold", "slide", "touch", "break"];
const JUDGEMENT_TYPES = [
  "critical", // Tap: 500 (1.0x), Break: 2600
  "better_perfect", // Tap: 500 (1.0x), Break: 2550
  "perfect", // Tap: 500 (1.0x), Break: 2500
  "great", // Tap: 400 (0.8x), Break: 2000 (0.8x)
  "worse_great", // Tap: 400 (0.8x), Break: 1500 (0.6x)
  "worst_great", // Tap: 400 (0.8x), Break: 1250 (0.5x)
  "good", // Tap: 250 (0.5x), Break: not used
  "break_good", // Tap: not used, Break: 1000 (0.4x)
  "miss"
];
const EMPTY_COUNT_PER_JUDGEMENT = JUDGEMENT_TYPES.reduce(
  (countPerJudgement, judgement) => {
    countPerJudgement[judgement] = 0;
    return countPerJudgement;
  },
  {}
);

function getEmptyNoteCount() {
  return NOTE_TYPES.reduce((countPerType, noteType) => {
    countPerType[noteType] = 0;
    return countPerType;
  }, {});
}

function getEmptyPlayerPerformance() {
  return NOTE_TYPES.reduce((judgementPerType, noteType) => {
    judgementPerType[noteType] = Object.assign({}, EMPTY_COUNT_PER_JUDGEMENT);
    return judgementPerType;
  }, {});
}

export default {
  name: "ScoreCalc",
  components: {
    VueSlider,
    ProgressBar
  },
  created() {
    this.initializeForm();
  },

  computed: {
    /* Total note count */

    totalNoteCount() {
      return this.noteTypes
        .map(noteType => this.noteCounts[noteType])
        .reduce((acc, e) => acc + e, 0);
    },

    /* Total base */

    totalBaseScore() {
      return this.noteTypes
        .map(
          noteType => this.noteBaseScores[noteType] * this.noteCounts[noteType]
        )
        .reduce((acc, e) => acc + e, 0);
    },
    totalBaseAchievement() {
      return 100.0;
    },
    totalBaseDeluxeScore() {
      return this.noteTypes
        .map(
          noteType =>
            this.noteBaseDeluxeScores[noteType] * this.noteCounts[noteType]
        )
        .reduce((acc, e) => acc + e, 0);
    },

    /* Total bonus */

    totalBonusScore() {
      return 100 * this.noteCounts.break;
    },
    totalBonusScoreDX() {
      return this.totalBaseScore / 100.0;
    },
    totalBonusAchievement() {
      return (100.0 * this.totalBonusScore) / this.totalBaseScore;
    },
    totalBonusAchievementDX() {
      return 1.0;
    },

    /* Note base */

    // noteBaseScores() is in data section
    noteBaseAchievements() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] =
          (100.0 * this.noteBaseScores[noteType]) / this.totalBaseScore;
        return acc;
      }, {});
    },
    noteBaseDeluxeAchievements() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] =
          (100.0 * this.noteBaseDeluxeScores[noteType]) /
          this.totalBaseDeluxeScore;
        return acc;
      }, {});
    },

    /* Break bonus */

    breakBonusScore() {
      return 100;
    },
    breakBonusScoreDX() {
      return this.totalBonusScoreDX / this.noteCounts.break;
    },
    breakBonusAchievement() {
      return (100.0 * 100) / this.totalBaseScore;
    },
    breakBonusAchievementDX() {
      return 1.0 / this.noteCounts.break;
    },

    /* Note subtotal */

    noteScoreSubtotals() {
      return this.calcNoteScoreSubtotals(
        noteType => this.noteBaseScores[noteType],
        noteType => (noteType === "break" ? this.breakBonusScore : 0)
      );
    },
    noteScoreSubtotalsDX() {
      return this.calcNoteScoreSubtotals(
        noteType => this.noteBaseScores[noteType],
        noteType => (noteType === "break" ? this.breakBonusScoreDX : 0)
      );
    },
    noteDeluxeScoreSubtotals() {
      return this.calcNoteScoreSubtotals(
        noteType => this.noteBaseDeluxeScores[noteType],
        () => 0
      );
    },

    /* Player note counts */

    playerNoteCounts() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = this.judgementTypes
          .map(judgementType => this.playerPerformance[noteType][judgementType])
          .reduce((acc, e) => (e ? acc + e : acc), 0);
        return acc;
      }, {});
    },

    /* Player score subtotals */

    playerScoreSubtotals() {
      return this.calcPlayerNoteScoreSubtotals(
        (noteType, judgementType) =>
          this.noteBaseScores[noteType] *
          this.baseJudgementsPercentage[judgementType],
        (noteType, judgementType) =>
          noteType === "break"
            ? this.breakBonusScore *
              this.bonusJudgementPercentage[judgementType]
            : 0
      );
    },
    playerScoreSubtotalsDX() {
      return this.calcPlayerNoteScoreSubtotals(
        (noteType, judgementType) =>
          this.noteBaseScores[noteType] *
          this.baseJudgementsPercentage[judgementType],
        (noteType, judgementType) =>
          noteType === "break"
            ? this.breakBonusScoreDX *
              this.bonusJudgementPercentageDX[judgementType]
            : 0
      );
    },
    playerDeluxeScoreSubtotals() {
      return this.calcPlayerNoteScoreSubtotals(
        (noteType, judgementType) =>
          this.baseJudgementsDeluxeScore[judgementType],
        () => 0
      );
    },

    /* Player score */

    playerScore() {
      return this.noteTypes.reduce(
        (acc, noteType) => acc + this.playerScoreSubtotals[noteType],
        0
      );
    },
    playerScoreDX() {
      return this.noteTypes.reduce(
        (acc, noteType) => acc + this.playerScoreSubtotalsDX[noteType],
        0
      );
    },
    playerDeluxeScore() {
      return this.noteTypes.reduce(
        (acc, noteType) => acc + this.playerDeluxeScoreSubtotals[noteType],
        0
      );
    },

    /* Player achievement */

    playerAchievement() {
      return (100.0 * this.playerScore) / this.totalBaseScore;
    },
    playerAchievementDX() {
      return (100.0 * this.playerScoreDX) / this.totalBaseScore;
    },
    playerDeluxeAchievement() {
      return (100.0 * this.playerDeluxeScore) / this.totalBaseDeluxeScore;
    },

    /* Player performance */

    playerPerformanceOverview() {
      return this.judgementTypes.reduce((acc, judgementType) => {
        acc[judgementType] = this.noteTypes
          .map(noteType => this.playerPerformance[noteType][judgementType])
          .reduce((acc, e) => (e ? acc + e : acc), 0);
        return acc;
      }, {});
    }
  },

  methods: {
    /* Player score subtotal percentages */

    playerScoreSubtotalPercentages(noteType) {
      const typeScoreSubtotal = this.noteScoreSubtotals[noteType];
      return (
        typeScoreSubtotal &&
        (100.0 * this.playerScoreSubtotals[noteType]) / typeScoreSubtotal
      );
    },
    playerScoreSubtotalPercentagesDX(noteType) {
      const typeScoreSubtotal = this.noteScoreSubtotalsDX[noteType];
      return (
        typeScoreSubtotal &&
        (100.0 * this.playerScoreSubtotalsDX[noteType]) / typeScoreSubtotal
      );
    },
    playerDeluxeScoreSubtotalPercentages(noteType) {
      const typeScoreSubtotal = this.noteDeluxeScoreSubtotals[noteType];
      return (
        typeScoreSubtotal &&
        (100.0 * this.playerDeluxeScoreSubtotals[noteType]) / typeScoreSubtotal
      );
    },

    /* Actions */
    initializeForm() {
      // TODO: parse query parameters
      this.applyTestcase();
    },

    applyTestcase() {
      this.noteCounts = {
        tap: 432,
        hold: 32,
        slide: 166,
        touch: 0,
        break: 4
      };

      this.playerPerformance = getEmptyPlayerPerformance();
      this.playerPerformance.tap.critical = 183;
      this.playerPerformance.tap.perfect = 219;
      this.playerPerformance.tap.great = 29;
      this.playerPerformance.tap.good = 1;
      this.playerPerformance.hold.critical = 16;
      this.playerPerformance.hold.perfect = 16;
      this.playerPerformance.slide.critical = 158;
      this.playerPerformance.slide.great = 6;
      this.playerPerformance.slide.good = 2;
      this.playerPerformance.break.critical = 2;
      this.playerPerformance.break.better_perfect = 2;
    },

    resetForm() {
      this.noteCounts = getEmptyNoteCount();
      this.playerPerformance = getEmptyPlayerPerformance();
    },

    /* Helper functions */

    isPlayerNoteCountMismatched(noteType) {
      return this.playerNoteCounts[noteType] !== this.noteCounts[noteType];
    },

    calcNoteScoreSubtotals(baseUnitScoreFunc, bonusUnitScoreFunc) {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = (() => {
          let baseUnitScore = baseUnitScoreFunc(noteType);
          let bonusUnitScore = bonusUnitScoreFunc(noteType);
          let unitCount = this.noteCounts[noteType];
          return (baseUnitScore + bonusUnitScore) * unitCount;
        })();
        return acc;
      }, {});
    },
    calcPlayerNoteScoreSubtotals(baseUnitScoreFunc, bonusUnitScoreFunc) {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = this.judgementTypes
          .map(judgementType => {
            let baseUnitScore = baseUnitScoreFunc(noteType, judgementType);
            let bonusUnitScore = bonusUnitScoreFunc(noteType, judgementType);
            let unitCount =
              this.playerPerformance[noteType][judgementType] || 0;
            return (baseUnitScore + bonusUnitScore) * unitCount;
          })
          .reduce((acc, e) => acc + e, 0);
        return acc;
      }, {});
    }
  },

  data() {
    return {
      /* Constant keys */

      noteTypes: NOTE_TYPES,
      judgementTypes: JUDGEMENT_TYPES,

      /* Constant data */

      noteBaseScores: {
        tap: 500,
        hold: 1000,
        slide: 1500,
        touch: 500,
        break: 2500
      },
      noteBaseDeluxeScores: {
        tap: 3,
        hold: 3,
        slide: 3,
        touch: 3,
        break: 3
      },

      // Data source: https://maimai.gamerch.com/%E9%81%94%E6%88%90%E7%8E%87%E3%81%AE%E8%A8%88%E7%AE%97
      baseJudgementsPercentage: {
        critical: 1.0,
        better_perfect: 1.0,
        perfect: 1.0,
        great: 0.8,
        worse_great: 0.6,
        worst_great: 0.5,
        good: 0.5,
        break_good: 0.4,
        miss: 0
      },
      bonusJudgementPercentage: {
        critical: 1.0,
        better_perfect: 0.5,
        perfect: 0,
        great: 0,
        worse_great: 0,
        worst_great: 0,
        good: 0,
        break_good: 0,
        miss: 0
      },
      bonusJudgementPercentageDX: {
        critical: 1.0,
        better_perfect: 0.75,
        perfect: 0.5,
        great: 0.4,
        worse_great: 0.4,
        worst_great: 0.4,
        good: 0.3,
        break_good: 0.3,
        miss: 0
      },
      baseJudgementsDeluxeScore: {
        critical: 3,
        better_perfect: 2,
        perfect: 2,
        great: 1,
        worse_great: 1,
        worst_great: 1,
        good: 0,
        break_good: 0,
        miss: 0
      },

      /* Dynamic data */

      noteCounts: getEmptyNoteCount(),
      playerPerformance: getEmptyPlayerPerformance()
    };
  }
};
</script>

<style src='vue-slider-component/theme/default.css'></style>
<style lang="scss" scoped>
// @import 'vue-slider-component/theme/default.css';

table {
  background-color: lightgray;
  border: 1px darkgray solid;
  margin: 0 auto;

  th,
  td {
    border: 1px darkgray solid;
    padding: 10px;
  }
  thead {
    background-color: sandybrown;

    th {
      &.note-type {
        width: 80px;
      }
      &.note-count {
        width: 140px;
      }
      &.unit-score {
        width: 140px;
      }
      &.unit-achievement {
        width: 200px;
      }
      &.judgement-type {
        width: 125px;
      }
      &.player-score {
        width: 120px;
      }
    }
  }
  tbody {
    th {
      background-color: wheat;
    }
    td {
      background-color: lightgray;

      &.invalid-note-count {
        background-color: red;
      }
    }
  }
  tfoot {
    th {
      background-color: gold;
    }
    td {
      background-color: gold;

      &.player-result {
        background-color: yellow;
      }
    }
  }
  input[type="number"] {
    text-align: center;
    width: 80px;
    font-size: 16px;
  }
}
footer {
  padding: 20px;
}
button {
  font-size: 20px;
}
</style>
