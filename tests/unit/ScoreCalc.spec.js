import { shallowMount } from "@vue/test-utils";
import ScoreCalc from "@/views/ScoreCalc.vue";

describe("ScoreCalc.vue", () => {
  const noteTypes = ["tap", "hold", "slide", "touch", "break"];

  function noteDataMapper(source, mapFunc) {
    return noteTypes.reduce((acc, noteType) => {
      acc[noteType] = mapFunc(source[noteType]);
      return acc;
    }, {});
  }

  let wrapper = shallowMount(ScoreCalc);
  let vm = wrapper.vm;

  vm.noteCounts = {
    tap: 432,
    hold: 32,
    slide: 166,
    touch: 0,
    break: 4,
  };
  vm.playerPerformance = {
    tap: {
      critical: 183,
      perfect: 219,
      great: 29,
      good: 1,
      miss: 0,
    },
    hold: {
      critical: 16,
      perfect: 16,
      great: 0,
      good: 0,
      miss: 0,
    },
    slide: {
      critical: 158,
      perfect: 0,
      great: 6,
      good: 2,
      miss: 0,
    },
    touch: {},
    break: {
      critical: 2,
      better_perfect: 2,
      perfect: 0,
      great: 0,
      break_good: 0,
      miss: 0,
    },
  };

  it("calculate total note count", () => {
    /* Total note count */
    expect(vm.totalNoteCount).toBe(634);
  });
  it("calculate total base", () => {
    expect(vm.totalBaseScore).toBe(507000);
    expect(vm.totalBaseAchievement).toBe(100.0);
    expect(vm.totalBaseDeluxeScore).toBe(1902);
  });
  it("calculate total bonus", () => {
    expect(vm.totalBonusScore).toBe(400);
    expect(vm.totalBonusScoreDX).toBe(5070);
    expect(vm.totalBonusAchievement.toFixed(2)).toBe("0.08");
    expect(vm.totalBonusAchievementDX.toFixed(4)).toBe("1.0000");
  });
  it("calculate note base achievement", () => {
    expect(
      noteDataMapper(vm.noteBaseAchievements, (e) => e.toFixed(2))
    ).toMatchObject({
      tap: "0.10",
      hold: "0.20",
      slide: "0.30",
      touch: "0.10",
      break: "0.49",
    });
    expect(
      noteDataMapper(vm.noteBaseAchievements, (e) => e.toFixed(4))
    ).toMatchObject({
      tap: "0.0986",
      hold: "0.1972",
      slide: "0.2959",
      touch: "0.0986",
      break: "0.4931",
    });
    expect(
      noteDataMapper(vm.noteBaseDeluxeAchievements, (e) => e.toFixed(4))
    ).toMatchObject({
      tap: "0.1577",
      hold: "0.1577",
      slide: "0.1577",
      touch: "0.1577",
      break: "0.1577",
    });
  });
  it("calculate break bonus", () => {
    expect(vm.breakBonusScore).toBe(100);
    expect(vm.breakBonusScoreDX.toFixed(0)).toBe("1268");
    expect(vm.breakBonusAchievement.toFixed(2)).toBe("0.02");
    expect(vm.breakBonusAchievementDX.toFixed(4)).toBe("0.2500");
  });
  it("calculate player note counts", () => {
    expect(vm.playerNoteCounts).toMatchObject({
      tap: 432,
      hold: 32,
      slide: 166,
      touch: 0,
      break: 4,
    });
  });
  it("calculate player score", () => {
    expect(vm.playerScore).toBe(500850);
    expect(vm.playerScoreDX.toFixed(0)).toBe("504986");
    expect(vm.playerDeluxeScore).toBe(1586);
  });
  it("calculate player achievement", () => {
    expect(vm.playerAchievement.toFixed(2)).toBe("98.79");
    expect(vm.playerAchievementDX.toFixed(4)).toBe("99.6028");
    expect(vm.playerDeluxeAchievement.toFixed(4)).toBe("83.3859");
  });
  it("calculate player performance overview", () => {
    expect(vm.playerPerformanceOverview).toMatchObject({
      critical: 359,
      better_perfect: 2,
      perfect: 235,
      great: 35,
      good: 3,
      miss: 0,
    });
  });
});
