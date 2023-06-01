Data
====

chart-levels Schema
----

Each JSON file in this folder represents data specific to the version.

- Chart type: Either "dx" or "standard"
  - Song name
    - Levels: An array of chart levels (BASIC, ADVANCED, EXPERT, MASTER, and Re:MASTER). If you don't know the exact level, please use negative number. For example, if you know a chart is 12.9, use 12.9. If you only know a chart is 12+, use -12.7. If you only know a chart is 12, use -12.

song-info Schema
----

Each JSON file in this folder represents data specific to the region.

- Chart type: Either "dx" or "standard"
  - Debut version: The version when the song was added. Please refer to src/common/game-version.ts for the version numbers.
    - Song names: An array of song names

Instructions
----

Case 1: If a song belongs to a newer Japan version but is added to International version sooner, please update both chart-levels and song-info/intl.json. Examples:

- INTERNET OVERDOSE is debuted at FESTiVAL (intl), FESTiVAL PLUS (Jp)

Case 2: If a song belongs to a older Japan version but is eventually added to International version, please update only song-info/intl.json. Examples:

- 自傷無色 is debuted at Festival (intl), SPLASH (Jp)
- 劣等上等 is debuted at Festival (intl), SPLASH (Jp)

Case 3: If a song is deleted from Japan but still exists in International version, please update chart-levels, song-info/intl.json and src/common/removed-songs.ts. Examples:

- 全世界共通リズム感テスト is deleted in Japan, so chart levels are necessary.

Case 4: If you know the internal levels (also referred to as chart constant) of a song, please update chart-levels.
