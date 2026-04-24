# Important Changes Summary

이 문서는 최근 작업에서 중요하다고 판단되는 변경사항을 정리한 메모입니다.

## 1. 매치 이미지 업로드 기능 추가

- 매치 리스트 화면의 더보기 시트에 `이미지 등록` 항목 추가
- 이미지가 이미 있으면 `이미지 수정`으로 표시
- 웹에서는 파일 선택, 모바일에서는 사진첩 열기 방식으로 동작
- 업로드 시 브라우저에서 이미지 최적화 후 Supabase Storage에 업로드
- 업로드 후 `matches.image_url`에 공개 URL 저장

관련 파일:

- [src/app/components/MatchActionsSheet.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchActionsSheet.tsx)
- [src/app/components/MatchListScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchListScreen.tsx)
- [src/app/services/matchImages.ts](/Users/jihwang/Documents/team-bulgaemi/src/app/services/matchImages.ts)
- [src/app/services/supabaseMatches.ts](/Users/jihwang/Documents/team-bulgaemi/src/app/services/supabaseMatches.ts)

동작 요약:

- 업로드 시 최대 1600px 기준으로 리사이즈 시도
- JPEG 품질 `0.82`로 압축
- 최적화 실패 시 원본 업로드 fallback
- 허용 확장자: `jpg`, `png`, `webp`, `heic`, `heif`

## 2. Supabase Storage 설정 추가

`match-images` public bucket을 사용하도록 구성함.

추가된 내용:

- bucket 생성 SQL
- 읽기/업로드/수정/삭제 policy

관련 파일:

- [SUPABASE_APP_DATA_SCHEMA.sql](/Users/jihwang/Documents/team-bulgaemi/SUPABASE_APP_DATA_SCHEMA.sql)

중요:

- 이 SQL을 Supabase SQL Editor에서 실행해야 실제 이미지 업로드가 동작함

## 3. 메인 매치 카드에 업로드 이미지 반영

기존에는 기본 축구장 이미지만 사용했지만, 이제 매치별 `imageUrl`이 있으면 해당 이미지를 사용함.

관련 파일:

- [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx)
- [src/app/App.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/App.tsx)

## 4. 매치 카드 클릭 시 1:1 오버레이 추가

메인 페이지 매치 카드를 클릭하면 Figma 기준의 오버레이 화면이 뜸.

요구사항 반영:

- 카드 비율 1:1 고정
- 디바이스 너비 기준 `100% x 100%`
- 우측 상단 닫기 버튼
- 하단 이미지 다운로드 버튼
- 전체 배경 딤: `#000000` 90%

관련 파일:

- [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx)

## 5. 매치 카드 이미지 다운로드 기능 추가

오버레이 하단 `이미지 다운로드` 버튼으로 PNG 저장 가능.

저장 규칙:

- 해상도: `1080 x 1080`
- 포맷: `PNG`
- 브라우저 캔버스에서 별도 렌더링 후 다운로드

주의:

- 화면 DOM을 그대로 캡처하는 방식이 아니라, 캔버스에 다시 그림
- 그래서 위치/간격 보정이 필요했고 일부 수치를 조정함

다운로드 렌더링 관련 반영:

- 팀 이름과 스코어 간격 조정
- 득점자 표시를 4열 기준으로 배치
- 다운로드 버튼 border를 `#ffffff`로 고정

## 6. 이미지 등록/수정 성공 토스트 추가

이미지 업로드 성공 시 토스트 표시:

- 신규 등록: `매치 이미지가 등록되었습니다.`
- 기존 수정: `매치 이미지가 수정되었습니다.`

사용 라이브러리:

- `sonner`

관련 파일:

- [src/app/components/MatchListScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchListScreen.tsx)
- [src/app/App.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/App.tsx)

## 7. 매치 삭제 시 Storage 이미지도 함께 삭제

기존에는 매치 DB row만 삭제되고 Storage 파일은 남을 수 있었음.

보완한 내용:

- 매치 삭제 시 `match-images/matches/{matchId}/cover.*` 삭제 시도
- 이미지 수정 시 이전 확장자 파일도 함께 정리

관련 파일:

- [src/app/services/matchImages.ts](/Users/jihwang/Documents/team-bulgaemi/src/app/services/matchImages.ts)
- [src/app/components/MatchListScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchListScreen.tsx)

예상 효과:

- `cover.png`, `cover.heic`, `cover.jpg` 같은 이전 파일 찌꺼기 감소
- 매치 삭제 후 Storage 누적 방지

## 8. CTA 하단 여백 48px -> 24px 조정

요청에 따라 주요 하단 CTA 영역의 bottom padding을 줄임.

대상 예시:

- 매치 등록
- 이전 / 다음
- 없어요
- 용병 선수 추가
- 쿼터 점수 등록 완료
- 이미지 다운로드 버튼 영역

함께 조정한 것:

- 스크롤 하단 예약 공간
- 일부 리스트 하단 마진
- 용병 모달 높이

관련 파일:

- [src/app/components/MatchRegistrationStep1.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchRegistrationStep1.tsx)
- [src/app/components/MatchRegistrationStep2.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchRegistrationStep2.tsx)
- [src/app/components/MatchRegistrationStep3.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchRegistrationStep3.tsx)
- [src/app/components/ScoreTracking.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/ScoreTracking.tsx)
- [src/app/components/MercenaryManagement.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MercenaryManagement.tsx)
- [src/app/components/MercenaryModal.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MercenaryModal.tsx)
- [src/app/components/MatchListScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MatchListScreen.tsx)
- [src/app/App.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/App.tsx)
- [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx)

## 9. Vercel 배포 완료

실제 폰 테스트 가능하도록 Vercel Production 배포 완료.

대표 주소:

- `https://team-bulgaemi.vercel.app`

추가 작업:

- Vercel 로그인 완료
- 프로젝트 링크 완료
- Production env 등록 완료
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

참고:

- GitHub 자동 연결은 실패했지만 CLI 배포는 정상 완료
- `.vercel`은 로컬 설정 디렉토리이므로 `.gitignore`에 추가함

## 10. Git 반영 완료

로컬 변경사항을 커밋하고 원격 브랜치에 push 완료.

브랜치:

- `chore/supabase-migration-setup`

커밋:

- `dd468e6 Add match image management and card export`

## 11. 보안 관련 현재 상태

확인된 사항:

- `service_role` 키는 프론트 코드에 없음
- `.env.local`은 `.gitignore`로 보호됨
- Vercel에는 공개용 `VITE_` env만 등록됨

주의사항:

- 현재 Supabase RLS/Storage 정책은 public 쓰기 허용이 많아서 데이터 수정/삭제 장난은 가능
- 다만 현재 프로젝트 성격상 사용자가 허용한 범위로 판단

최소 권장:

- GitHub 2FA
- Vercel 2FA
- `service_role` 절대 프론트/공개 env에 넣지 않기

## 12. 확인/검증 메모

여러 단계에서 확인한 것:

- `npm run build` 반복 통과
- 카드 클릭 오버레이 표시 확인
- 다운로드 버튼 표시 및 닫기 동작 확인
- PNG 다운로드 이벤트 확인
- Vercel 배포 후 URL 응답 확인

## 13. 지금 기억하면 좋은 운영 메모

- 이미지 업로드가 안 되면 먼저 Supabase bucket/policy SQL 적용 여부 확인
- 이미지가 이상하게 보이면:
  - 화면 오버레이와 다운로드 PNG는 렌더링 방식이 다름
  - 다운로드는 캔버스 재렌더링이라 간격 수정이 필요할 수 있음
- Vercel 배포는 GitHub push 없이도 가능하지만, 코드 이력 관리는 push까지 해두는 게 안전함

