# JJFC Result Card Work Summary

## Goal

JJFC 경기 결과 데이터를 기반으로 인스타그램 업로드용 1080x1080 결과 카드 이미지를 만들 수 있도록 구현했다.

## Preview URL

Local dev server:

```txt
http://127.0.0.1:4177/
```

Standalone preview route:

```txt
http://127.0.0.1:4177/result-card-preview
```

Match card capture route:

```txt
http://127.0.0.1:4177/matchcard
```

## Main Files Changed

- `src/app/components/JjfcMatchResultCard.tsx`
- `src/app/components/MatchCardScreen.tsx`
- `src/app/components/MainScreen.tsx`
- `src/app/App.tsx`
- `src/app/utils/jjfcResultCardData.ts`
- `src/assets/jjfc-location-icon.svg`
- `src/styles/theme.css`
- `package.json`
- `package-lock.json`

## Result Card Component

Implemented `JjfcMatchResultCard` as a reusable React + Tailwind component based on the Figma node:

```txt
https://www.figma.com/design/GkC6uSdyodynrDYWqPEJyt/JJFC?node-id=462-125
```

The component is fixed at `1080x1080px` and accepts data through `JjfcMatchResultCardData`.

Major sections:

- Header: logo, date, `FULL TIME`
- Location bar
- Quarter summary list
- Main score board
- MOM row
- Participant name rows

## Figma-Based Layout Details

Applied layout and visual rules from Figma:

- Header date font size changed to `108px`
- Location text wrapper padding removed
- Location bar uses `items-center`
- Header bottom border, location bottom border, left summary right border use `#002D61`
- Border thickness restored to Figma value `1.5px`
- Location icon frame line moved from SVG path to actual `border-right`
- Quarter goal text line-height set to `100%`
- Quarter title line-height set to `100%`
- MOM text line-height set to `100%`
- Participant name line-height set to `100%`
- Goal and participant name font weight changed to `600`
- Quarter section internal gap changed to `12px`

## CSS Fix

Removed this global rule from `src/styles/theme.css`:

```css
* {
  border-color: var(--color-border);
}
```

Reason:

It was overriding/weakening component border colors such as `border-[#002d61]`.

## 10+ Goal Handling

Added compact quarter list behavior for high-score games.

Compact quarter list activates when:

- `data.ourScore >= 10`, or
- `quarterSummaries.length > 4`, or
- total goal events in `quarterSummaries` is `>= 10`

Compact quarter list is based on Figma node:

```txt
https://www.figma.com/design/GkC6uSdyodynrDYWqPEJyt/JJFC?node-id=462-508
```

Compact rules:

- Quarter list gap: `24px`
- Quarter title font size: `28px`
- Goal line font size: `18px`
- In compact mode, all goal lines are shown instead of slicing to 3 per quarter
- The quarter list renders all provided quarters, not only 1Q-4Q

Score number rules:

- If either team score is `>= 10`:
  - font size: `264px`
  - line-height: `352px`
- Otherwise:
  - font size: `352px`
  - line-height: `352px`

## Participant Layout Rules

Participant rows now use a count-based layout up to 21 registered players.

Examples:

- 1: `[1]`
- 6: `[3, 3]`
- 7: `[3, 4]`
- 8: `[4, 4]`
- 9: `[5, 4]`
- 10: `[5, 5]`
- 11: `[4, 3, 4]`
- 16: `[5, 6, 5]`
- 21: `[7, 7, 7]`

Font size, row gap, item gap, and divider styling remain unchanged.

## Participant Filtering Rule

Participant names shown in the card must include only registered team players.

Excluded:

- `isMercenary === true`
- `playerId` starting with `mercenary_`
- `playerNumber === "GUEST"`
- `playerName === "용병없음"`
- `playerId === "nomercenary"`

Then names are checked against registered team player names.

The component accepts:

- `participants`
- `participantNames`
- `registeredPlayerNames`

If raw `participants` are provided, they are preferred because they preserve mercenary metadata.

## Main Screen Integration

On the JJFC main screen:

1. User clicks a completed match card.
2. The overlay displays the original photo-style match artwork.
3. Clicking `이미지 다운로드` uses the original match artwork PNG export flow.

## Match Card Capture Route

Added `/matchcard` as a dedicated result card capture route.

Behavior:

- Shows the list of completed matches from the existing cached/local match data
- Selecting a match opens a full-screen black overlay
- The tuned `JjfcMatchResultCard` is rendered as a `1080x1080` design and scaled to fit the viewport square
- This route is intended for manual browser/screen capture instead of in-app PNG generation

The selected match data is converted into `JjfcMatchResultCardData` using:

- registered match data
- participants
- MOM records
- goal events
- local/team player list

## PNG Export

The in-app result-card PNG export was removed from the main screen. The current approach is to open `/matchcard`, select a match, and capture the rendered browser view directly.

## Build Verification

Verified with:

```bash
npm run build:jjfc
```

Build passed.

## Notes

- `npm install html2canvas` reported 3 audit issues from npm output: 1 moderate, 2 high.
- `html2canvas` was later removed after switching to the manual capture route.
- `HANDOFF_2026-04-27.md` already existed as an untracked file and was not modified.
