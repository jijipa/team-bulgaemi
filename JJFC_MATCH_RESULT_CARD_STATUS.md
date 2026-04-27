# JJFC Match Result Card Status

## 목표

- JJFC 전용으로, 홈 화면의 완료된 매치 카드를 눌렀을 때
  - 기존 매치 카드 확대 대신
  - Figma 결과 카드 디자인 기반의 `1080 x 1080` 결과 이미지를 보여주고
  - 같은 이미지를 그대로 다운로드하게 만드는 것

관련 Figma:

- 메인 결과 카드: `501:1608`
- 헤더: `501:1610`
- 위치 바: `501:1626`
- 어시스트 텍스트: `501:1638`
- 가운데 대시: `501:1677`
- 우리팀 점수: `501:1676`

## 현재까지 적용한 것

### 1. JJFC 전용 분기 추가

- 홈 화면 매치 카드 클릭 시 JJFC인 경우 별도 결과 카드 경로를 타도록 분기 추가
- MOM이 저장된 완료 매치에서만 JJFC 결과 카드 데이터를 만들도록 연결

주요 파일:

- [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx:1)

### 2. 결과 카드 데이터 매핑

- 아래 데이터를 JJFC 결과 카드로 조합하도록 연결
  - 날짜
  - 장소
  - 팀명 / 상대팀명
  - 최종 스코어
  - MOM 이름
  - 참가자 이름
  - 쿼터별 스코어와 득점/어시스트 로그

데이터 소스:

- `matches`
- `participants`
- `moms`
- `goalEvents`

### 3. 피그마/zip 기준 자산 연결

- zip 안의 원본 export 자산을 프로젝트로 복사해서 사용 중
- 현재 사용 자산:
  - [src/imports/PublishFrame624794/svg-iagdomxrq8.ts](/Users/jihwang/Documents/team-bulgaemi/src/imports/PublishFrame624794/svg-iagdomxrq8.ts:1)
  - [src/imports/PublishFrame624794/cfbcbfcc3327cdad985937d2ad285895dbf6dd67.png](/Users/jihwang/Documents/team-bulgaemi/src/imports/PublishFrame624794/cfbcbfcc3327cdad985937d2ad285895dbf6dd67.png:1)

### 4. 렌더 방식 변경 이력

처음 시도:

- DOM 비슷하게 재구현
- 문제: 피그마와 비율/폰트/간격 차이 큼

두 번째 시도:

- `canvas`에 수동으로 텍스트/선을 그림
- 문제: DOM auto-layout과 다르게 보여서 오차 큼

세 번째 시도:

- DOM을 `foreignObject` 기반 SVG로 감싸 이미지화
- 문제: 외부 폰트/아이콘/스타일 누락

현재 시도:

- 순수 SVG 기반으로 직접 렌더
- 아이콘 path, 선, 배경, 텍스트를 SVG 안에서 직접 그림

현재 파일:

- [src/app/components/JjfcMatchResultCard.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/JjfcMatchResultCard.tsx:1)

### 5. 다운로드/프리뷰 통일

- 프리뷰와 다운로드가 같은 렌더 경로를 사용하도록 정리
- `createJjfcMatchResultCanvas`
- `createJjfcMatchResultImageUrl`
- `downloadJjfcMatchResultImage`

### 6. 확인된 Figma 값

- 헤더 보더: `1.5px solid #435161`
- 위치 바 하단선: `1.5px solid #111111`
- 어시스트 텍스트: `#8393A7`
- 가운데 대시: `#002D61`, 두께 `10.601px`
- 우리팀 점수: `rgba(248,113,16,0.98)`

## 현재 남아있는 문제

### 1. 첫 클릭 시 깨져 보이는 문제

증상:

- 매치 카드를 처음 눌렀을 때는 폰트/아이콘/레이아웃이 깨져 보이고
- 닫았다가 다시 열면 상대적으로 더 정상적으로 보임

가능한 원인:

- 프리뷰용 이미지 생성 타이밍 문제
- 첫 렌더에서 필요한 폰트나 이미지가 완전히 준비되기 전에 SVG/캔버스 생성
- 기존 프리뷰 이미지가 잠깐 보이거나, 미완성 렌더가 먼저 그려질 가능성

### 2. 레이아웃이 zip export와 완전히 같지 않음

사용자 기준 핵심 요구:

- 아래 export 코드와 "동일하게" 보이는 것
- 특히 auto-layout 계층, 간격, 폭, 폰트 비율이 같아야 함

기준 코드:

- 사용자 제공 `Frame624794.tsx` export
- zip 파일: `/Users/jihwang/Downloads/Publish this design.zip`

현재 차이 가능 지점:

- 텍스트 baseline
- score / team name / MOM / player rows 좌표
- 위치 바 텍스트 시작점
- 로고/날짜 블록 정렬
- participant row의 정렬 폭 계산

### 3. SVG 텍스트 렌더와 실제 DOM 렌더 차이

- 현재는 순수 SVG `<text>` 렌더
- 하지만 사용자가 원하는 건 zip export가 DOM으로 렌더됐을 때와 최대한 동일한 결과
- SVG 텍스트는 DOM auto-layout과 완전히 같지 않을 수 있음

## 다음 작업 우선순위

### 우선순위 1. 첫 클릭 렌더 안정화

해야 할 일:

- 프리뷰 열기 전에 JJFC 결과 카드 이미지를 먼저 생성한 뒤 오버레이 열기
- 또는 생성 완료 전까지는 오버레이에서 로딩만 보여주고, 완성 후 이미지 표시
- 첫 클릭에서 미완성 프레임이 절대 보이지 않게 만들기

핵심 파일:

- [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx:1)

### 우선순위 2. zip export와 1:1에 가깝게 맞추기

해야 할 일:

- 현재 SVG 렌더를 zip export 구조와 줄 단위로 비교
- 아래 요소를 순서대로 미세조정
  - 헤더 영역
  - 위치 바
  - 좌측 쿼터 컬럼
  - 중앙 팀명/스코어
  - MOM 라인
  - 참가자 행 배치

### 우선순위 3. 필요하면 렌더 전략 재검토

만약 순수 SVG에서도 차이가 계속 크면:

- 실제 export DOM을 별도 hidden container에 렌더
- 브라우저에서 그 DOM을 직접 캡처하는 방향 검토

이 경우 장점:

- 사용자가 준 구조와 가장 가까움

이 경우 리스크:

- 캡처 안정성
- 폰트/asset preload 관리 필요

## 관련 파일

- [src/app/components/MainScreen.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/MainScreen.tsx:1)
- [src/app/components/JjfcMatchResultCard.tsx](/Users/jihwang/Documents/team-bulgaemi/src/app/components/JjfcMatchResultCard.tsx:1)
- [src/imports/PublishFrame624794/svg-iagdomxrq8.ts](/Users/jihwang/Documents/team-bulgaemi/src/imports/PublishFrame624794/svg-iagdomxrq8.ts:1)
- [src/imports/PublishFrame624794/cfbcbfcc3327cdad985937d2ad285895dbf6dd67.png](/Users/jihwang/Documents/team-bulgaemi/src/imports/PublishFrame624794/cfbcbfcc3327cdad985937d2ad285895dbf6dd67.png:1)

## 확인 방법

최신 JJFC 개발 서버 주소는 실행 시점에 달라질 수 있음.

확인 절차:

1. `npm run dev:jjfc -- --host 127.0.0.1 --port 4177`
2. 실제 뜬 포트 확인
3. 홈 화면에서 완료된 JJFC 매치 카드 클릭
4. 첫 클릭 렌더와 재오픈 렌더 차이 확인
5. 다운로드 결과와 프리뷰가 같은지 확인

## 현재 판단

- 방향 자체는 맞다:
  - JJFC만 별도 결과 카드
  - 1080 이미지 하나를 프리뷰/다운로드 공용으로 사용

- 하지만 아직 "완성"은 아니다:
  - 첫 클릭 렌더 안정화 필요
  - zip export와의 시각적 차이 축소 필요

