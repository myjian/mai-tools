<template>
  <div class="ScoreCalc">
    <header>
      <h1>maimai Score Calculator</h1>
    </header>
    <main>
      <table>
        <thead>
          <tr>
            <th rowspan="2">Note Type</th>
            <th rowspan="2">Note Count</th>
            <th colspan="2">maimai</th>
            <th colspan="2">maimai DX</th>
          </tr>
          <tr>
            <th>Unit Score (+Bonus)</th>
            <th>Unit Achievement (+Bonus)</th>
            <th>Unit Score (+Bonus)</th>
            <th>Unit Achievement (+Bonus)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="noteType in noteTypes" :key="noteType">
            <th name="note-type">
              {{ noteType.toUpperCase() }}
            </th>
            <td name="note-count">
              <input type="number" :min="noteType === 'break' ? 1 : 0" v-model.number="noteCounts[noteType]">
              <vue-slider
                v-model="noteCounts[noteType]"
                :min="noteType === 'break' ? 1 : 0" :max="1000" :interval="1"
                :drag-on-click="true"
              ></vue-slider>
            </td>
            <td name="maimai-score">
              {{ noteBaseScore[noteType] }}
              <template v-if="noteType === 'break'">
                (+{{ breakBonusScore }})
              </template>
            </td>
            <td name="maimai-achievement">
              <b>{{ notePercentages[noteType].toFixed(2) }}%</b>
              <template v-if="noteType === 'break'">
                <b>&nbsp;(+{{ breakBonusPercentage.toFixed(2) }}%)</b>
              </template>
              <progress-bar :val="100.0 * notePercentages[noteType]" :max="100"></progress-bar>
              <template v-if="noteType === 'break'">
                <progress-bar :val="100.0 * breakBonusPercentage" :max="100" bar-color="yellow" bg-color="darkgray"></progress-bar>
              </template>
            </td>
            <td name="maimaidx-score">
              {{ noteBaseScore[noteType] }}
              <template v-if="noteType === 'break'">
                <b>(<i>+{{ breakBonusScoreDX.toFixed(0) }}</i>)</b>
              </template>
            </td>
            <td name="maimaidx-achievement">
              <b>{{ notePercentages[noteType].toFixed(4) }}%</b>
              <template v-if="noteType === 'break'">
                <b>&nbsp;(+{{ breakBonusPercentageDX.toFixed(4) }}%)</b>
              </template>
              <progress-bar :val="100.0 * notePercentages[noteType]" :max="100"></progress-bar>
              <template v-if="noteType === 'break'">
                <progress-bar :val="100.0 * breakBonusPercentageDX" :max="100" bar-color="yellow" bg-color="darkgray"></progress-bar>
              </template>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>TOTAL</th>
            <td><b>{{ totalNoteCount }}</b></td>
            <td><b>{{ totalBaseScore }} (+{{ totalBonusScore }})</b></td>
            <td>{{ (100.0).toFixed(2) }}% <b>(+{{ totalBonusPercentage.toFixed(2) }}%)</b></td>
            <td><b>{{ totalBaseScore }} (+{{ totalBonusScoreDX }})</b></td>
            <td>{{ (100.0).toFixed(4) }}% (+{{ totalBonusPercentageDX.toFixed(4) }}%)</td>
          </tr>
        </tfoot>
      </table>
      <br>
      * Bonus are counted separately.<br>
      <br>
      <table>
        <thead>
          <tr>
            <th rowspan="2">Note Type</th>
            <th rowspan="2">Note Count</th>
            <th colspan="5">Player Performance</th>
            <th colspan="3">Player Result</th>
          </tr>
          <tr>
            <th>CRITICAL PERFECT<br>100% (+100% bonus)</th>
            <th>PERFECT<br>100% (+75%/50% bonus)</th>
            <th>GREAT<br>80% (+40% bonus)</th>
            <th>GOOD<br>50% (+25% bonus)</th>
            <th>MISS<br>0% (+0% bonus)</th>
            <th>Score (maimai)</th>
            <th>Score (maimai DX)</th>
            <th>Deluxe Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="noteType in noteTypes" :key="noteType">
            <th name="note-type">
              {{ noteType.toUpperCase() }}
            </th>
            <td name="note-count" :class="playerNoteCounts[noteType] !== noteCounts[noteType] && 'note-count-mismatched'">
              <b>{{ playerNoteCounts[noteType] }}</b> / <input type="number" v-model.number="noteCounts[noteType]" disabled>
            </td>
            <td name="performance-critical">
              <template v-if="noteType === 'break'">
                <i>2600pt:&nbsp;</i>
              </template>
              <input type="number" :min="0" v-model.number="playerPerformance[noteType].critical">
            </td>
            <td name="performance-perfect">
              <template v-if="noteType === 'break'">
                <i>2550pt:&nbsp;</i> <input type="number" :min="0" v-model.number="playerPerformance.break.better_perfect">
                <br>
                <i>2500pt:&nbsp;</i> <input type="number" :min="0" v-model.number="playerPerformance.break.perfect">
              </template>
              <template v-else>
                <input type="number" :min="0" v-model.number="playerPerformance[noteType].perfect">
              </template>
            </td>
            <td name="performance-great">
              <input type="number" :min="0" v-model.number="playerPerformance[noteType].great">
            </td>
            <td name="performance-good">
              <input type="number" :min="0" v-model.number="playerPerformance[noteType].good">
            </td>
            <td name="performance-miss">
              <input type="number" :min="0" v-model.number="playerPerformance[noteType].miss">
            </td>
            <td name="maimai-score-result">
              <b>{{ playerScoring[noteType].toFixed(0) }}</b><br>
              <b>({{ (100.0 * playerScoring[noteType] / noteScoreSubtotals[noteType]).toFixed(2) }}%)</b><br>
              <progress-bar :val="(100.0 * playerScoring[noteType] / noteScoreSubtotals[noteType])" :max="100"></progress-bar>
            </td>
            <td name="maimaidx-score-result">
              <b>{{ playerScoringDX[noteType].toFixed(0) }}</b><br>
              <b>({{ (100.0 * playerScoringDX[noteType] / noteScoreSubtotalsDX[noteType]).toFixed(4) }}%)</b><br>
              <progress-bar :val="(100.0 * playerScoringDX[noteType] / noteScoreSubtotalsDX[noteType])" :max="100"></progress-bar>
            </td>
            <td name="maimaidx-dxscore-result">
              <b>{{ playerDeluxeScoringDX[noteType] }}</b><br>
              <b>({{ (100.0 * playerDeluxeScoringDX[noteType] / noteDeluxeScoreSubtotalsDX[noteType]).toFixed(4) }}%)</b><br>
              <progress-bar :val="(100.0 * playerDeluxeScoringDX[noteType] / noteDeluxeScoreSubtotalsDX[noteType])" :max="100"></progress-bar>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>TOTAL</th>
            <td><b>{{ totalNoteCount }}</b></td>
            <td><b>{{ playerPerformanceOverview.critical }}</b></td>
            <td>
              <b>{{ playerPerformanceOverview.better_perfect }}</b> +
              <b>{{ playerPerformanceOverview.perfect }}</b>
            </td>
            <td><b>{{ playerPerformanceOverview.great }}</b></td>
            <td><b>{{ playerPerformanceOverview.good }}</b></td>
            <td><b>{{ playerPerformanceOverview.miss }}</b></td>
            <td>
              <b>{{ playerTotalScoring.toFixed(0) }}</b><br>
              <b>({{ (100.0 * playerTotalScoring / totalBaseScore).toFixed(2) }}%)</b>
            </td>
            <td>
              <b>{{ playerTotalScoringDX.toFixed(0) }}</b><br>
              <b>({{ (100.0 * playerTotalScoringDX / totalBaseScore).toFixed(4) }}%)</b>
            </td>
            <td>
              <b>{{ playerTotalDeluxeScoringDX }}</b><br>
              <b>({{ (100.0 * playerTotalDeluxeScoringDX / totalDeluxeScore).toFixed(4) }}%)</b>
            </td>
          </tr>
        </tfoot>
      </table>
    </main>
    <footer>
      <!-- <b>maimai Score Calculator</b> is made by <a href="https://github.com/zetaraku/">Raku Zeta</a> -->
    </footer>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import ProgressBar from 'vue-simple-progress'
import 'vue-slider-component/theme/default.css';

export default {
  name: 'ScoreCalc',
  components: {
    VueSlider,
    ProgressBar,
  },
  computed: {
    totalNoteCount() {
      return this.noteTypes
        .map(noteType => this.noteCounts[noteType])
        .reduce((acc, e) => acc + e, 0);
    },
    totalBaseScore() {
      return this.noteTypes
        .map(noteType => this.noteBaseScore[noteType] * this.noteCounts[noteType])
        .reduce((acc, e) => acc + e, 0);
    },
    totalDeluxeScore() {
      return this.noteTypes
        .map(noteType => this.baseJudgementsDeluxeScore.critical * this.noteCounts[noteType])
        .reduce((acc, e) => acc + e, 0);
    },
    totalBonusScore() {
      return 100 * this.noteCounts.break;
    },
    totalBonusScoreDX() {
      return this.totalBaseScore * 1.0 / 100.0;
    },
    totalBonusPercentage() {
      return 100.0 * this.totalBonusScore / this.totalBaseScore;
    },
    totalBonusPercentageDX() {
      return 1.0;
    },
    noteScoreSubtotals() {
      return this.noteTypes.reduce((acc, noteType) => {
        let baseUnitScore = this.noteBaseScore[noteType];
        let bonusUnitScore = noteType === 'break' ? this.breakBonusScore : 0;
        let unitCount = this.noteCounts[noteType];
        acc[noteType] = (baseUnitScore + bonusUnitScore) * unitCount;
        return acc;
      }, {});
    },
    noteScoreSubtotalsDX() {
      return this.noteTypes.reduce((acc, noteType) => {
        let baseUnitScore = this.noteBaseScore[noteType];
        let bonusUnitScore = noteType === 'break' ? this.breakBonusScoreDX : 0;
        let unitCount = this.noteCounts[noteType];
        acc[noteType] = (baseUnitScore + bonusUnitScore) * unitCount;
        return acc;
      }, {});
    },
    noteDeluxeScoreSubtotalsDX() {
      return this.noteTypes.reduce((acc, noteType) => {
        let baseUnitScore = this.baseJudgementsDeluxeScore.critical;
        let unitCount = this.noteCounts[noteType];
        acc[noteType] = baseUnitScore * unitCount;
        return acc;
      }, {});
    },
    notePercentages() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = 100.0 * this.noteBaseScore[noteType] / this.totalBaseScore;
        return acc;
      }, {});
    },
    breakBonusScore() {
      return 100;
    },
    breakBonusScoreDX() {
      return this.totalBonusScoreDX / this.noteCounts.break;
    },
    breakBonusPercentage() {
      return 100.0 * 100 / this.totalBaseScore;
    },
    breakBonusPercentageDX() {
      return 1.0 / this.noteCounts.break;
    },
    playerNoteCounts() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = this.judgementTypes.map(judgementType =>
          this.playerPerformance[noteType][judgementType]
        ).reduce((acc, e) => acc + e, 0);
        return acc;
      }, {});
    },
    playerScoring() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = this.judgementTypes.map(judgementType => {
          let baseUnitScore = this.noteBaseScore[noteType] * this.baseJudgementsPercentage[judgementType];
          let bonusUnitScore = noteType === 'break' ? this.breakBonusScore * this.bonusJudgementPercentage[judgementType] : 0;
          let unitCount = this.playerPerformance[noteType][judgementType];
          return (baseUnitScore + bonusUnitScore) * unitCount;
        }).reduce((acc, e) => acc + e, 0);
        return acc;
      }, {});
    },
    playerScoringDX() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = this.judgementTypes.map(judgementType => {
          let baseUnitScore = this.noteBaseScore[noteType] * this.baseJudgementsPercentage[judgementType];
          let bonusUnitScore = noteType === 'break' ? this.breakBonusScoreDX * this.bonusJudgementPercentageDX[judgementType] : 0;
          let unitCount = this.playerPerformance[noteType][judgementType];
          return (baseUnitScore + bonusUnitScore) * unitCount;
        }).reduce((acc, e) => acc + e, 0);
        return acc;
      }, {});
    },
    playerDeluxeScoringDX() {
      return this.noteTypes.reduce((acc, noteType) => {
        acc[noteType] = this.judgementTypes.map(judgementType => {
          let baseUnitScore = this.baseJudgementsDeluxeScore[judgementType];
          let unitCount = this.playerPerformance[noteType][judgementType];
          return baseUnitScore * unitCount;
        }).reduce((acc, e) => acc + e, 0);
        return acc;
      }, {});
    },
    playerTotalScoring() {
      return this.noteTypes.reduce((acc, noteType) => acc + this.playerScoring[noteType], 0);
    },
    playerTotalScoringDX() {
      return this.noteTypes.reduce((acc, noteType) => acc + this.playerScoringDX[noteType], 0);
    },
    playerTotalDeluxeScoringDX() {
      return this.noteTypes.reduce((acc, noteType) => acc + this.playerDeluxeScoringDX[noteType], 0);
    },
    playerPerformanceOverview() {
      return this.judgementTypes.reduce((acc, judgementType) => {
        acc[judgementType] = this.noteTypes.map(noteType =>
          this.playerPerformance[noteType][judgementType]
        ).reduce((acc, e) => acc + e, 0);
        return acc;
      }, {});
    },
  },
  data() {
    return {
      noteTypes: [
        'tap', 'hold', 'slide', 'touch', 'break',
      ],
      judgementTypes: [
        'critical', 'better_perfect', 'perfect', 'great', 'good', 'miss',
      ],
      noteBaseScore: {
        tap: 500,
        hold: 1000,
        slide: 1500,
        touch: 500,
        break: 2500,
      },
      baseJudgementsPercentage: {
        critical: 1.0,
        better_perfect: 1.0,
        perfect: 1.0,
        great: 0.8,
        good: 0.5,
        miss: 0,
      },
      bonusJudgementPercentage: {
        critical: 1.0,
        better_perfect: 0.5,
        perfect: 0,
        great: 0,
        good: 0,
        miss: 0,
      },
      bonusJudgementPercentageDX: {
        critical: 1.0,
        better_perfect: 0.75,
        perfect: 0.5,
        great: 0.4,
        good: 0.25,
        miss: 0,
      },
      baseJudgementsDeluxeScore: {
        critical: 3,
        better_perfect: 2,
        perfect: 2,
        great: 1,
        good: 0,
        miss: 0,
      },
      noteCounts: {
        tap: 1,
        hold: 1,
        slide: 1,
        touch: 1,
        break: 1,
        // tap: 432,
        // hold: 32,
        // slide: 166,
        // touch: 0,
        // break: 4,
      },
      playerPerformance: {
        tap: { critical: 1, better_perfect: 0, perfect: 0, great: 0, good: 0, miss: 0 },
        hold: { critical: 1, better_perfect: 0, perfect: 0, great: 0, good: 0, miss: 0 },
        slide: { critical: 1, better_perfect: 0, perfect: 0, great: 0, good: 0, miss: 0 },
        touch: { critical: 1, better_perfect: 0, perfect: 0, great: 0, good: 0, miss: 0 },
        break: { critical: 1, better_perfect: 0, perfect: 0, great: 0, good: 0, miss: 0 },
        // tap: { critical: 183, better_perfect: 0, perfect: 219, great: 29, good: 1, miss: 0 },
        // hold: { critical: 16, better_perfect: 0, perfect: 16, great: 0, good: 0, miss: 0 },
        // slide: { critical: 158, better_perfect: 0, perfect: 0, great: 6, good: 2, miss: 0 },
        // touch: { critical: 0, better_perfect: 0, perfect: 0, great: 0, good: 0, miss: 0 },
        // break: { critical: 2, better_perfect: 2, perfect: 0, great: 0, good: 0, miss: 0 },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
table {
  background-color: lightgray;
  border: 1px darkgray solid;
  margin: 0 auto;

  th, td {
    border: 1px darkgray solid;
    padding: 10px;
  }
  thead {
    background-color: sandybrown;
  }
  tbody {
    th {
      background-color: wheat;
    }
    td {
      background-color: lightgray;

      &.note-count-mismatched {
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
    }
  }
  input[type=number] {
    text-align: center;
    width: 100px;
    font-size: 16px;
  }
}
footer {
  padding: 25px;
}
</style>
