import jjfcDefaultMatchImage from "../../assets/jjfc-default-match.png";
import jjfcLogo from "../../assets/jjfc-logo.png";

type TeamPlayer = {
  id: string;
  number: string;
  name: string;
};

const DEFAULT_TEAM_NAME = "팀불개미";
const DEFAULT_TEAM_SLUG = "team-bulgaemi";
const DEFAULT_STORAGE_NAMESPACE = "soccer";
const DEFAULT_TEAM_LOGO_URL = "https://i.imgur.com/JrwAlWz.png";
const DEFAULT_MATCH_IMAGE_URL = "https://i.imgur.com/djSmkjp.png";

const TEAM_ASSET_DEFAULTS = {
  jjfc: {
    logoUrl: jjfcLogo,
    defaultMatchImageUrl: jjfcDefaultMatchImage,
  },
} as const;

const defaultPlayers: TeamPlayer[] = [
  { id: "1", number: "1", name: "박지황" },
  { id: "2", number: "4", name: "서준혁" },
  { id: "3", number: "6", name: "강석민" },
  { id: "4", number: "7", name: "김민겸" },
  { id: "5", number: "11", name: "정이삭" },
  { id: "6", number: "12", name: "장준희" },
  { id: "7", number: "19", name: "김동범" },
  { id: "8", number: "23", name: "강민수" },
  { id: "9", number: "27", name: "양재원" },
  { id: "10", number: "30", name: "박성민" },
  { id: "11", number: "49", name: "이현재" },
  { id: "12", number: "66", name: "김대영" },
  { id: "13", number: "77", name: "양준희" },
  { id: "14", number: "88", name: "박효창" },
  { id: "15", number: "96", name: "이찬호" },
  { id: "16", number: "99", name: "전민수" },
  { id: "17", number: "8", name: "한창희" },
  { id: "18", number: "0", name: "김대현" },
  { id: "19", number: "0", name: "권혁수" },
  { id: "20", number: "0", name: "권용찬" },
  { id: "21", number: "0", name: "전용주" },
  { id: "22", number: "0", name: "강대한" },
  { id: "23", number: "0", name: "임수훈" },
  { id: "24", number: "0", name: "박현민" },
];

const sanitizeSlug = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;

  const sanitized = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || fallback;
};

const sanitizeColor = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;

  return trimmed.replace(/^['"]+|['"]+$/g, "") || fallback;
};

const parsePlayers = (raw: string | undefined): TeamPlayer[] => {
  if (!raw?.trim()) return defaultPlayers;

  const entries = raw
    .split(/\r?\n|;/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const parsedPlayers = entries
    .map((entry, index) => {
      const separatorIndex = entry.indexOf(":");
      if (separatorIndex === -1) return null;

      const number = entry.slice(0, separatorIndex).trim();
      const name = entry.slice(separatorIndex + 1).trim();
      if (!name) return null;

      return {
        id: String(index + 1),
        number: number || "0",
        name,
      };
    })
    .filter((player): player is TeamPlayer => Boolean(player));

  return parsedPlayers.length > 0 ? parsedPlayers : defaultPlayers;
};

const teamName =
  import.meta.env.VITE_TEAM_NAME?.trim() || DEFAULT_TEAM_NAME;
const teamSlug = sanitizeSlug(
  import.meta.env.VITE_TEAM_SLUG,
  DEFAULT_TEAM_SLUG,
);
const assetDefaults = TEAM_ASSET_DEFAULTS[
  teamSlug as keyof typeof TEAM_ASSET_DEFAULTS
];

export const teamConfig = {
  name: teamName,
  slug: teamSlug,
  pageTitle:
    import.meta.env.VITE_APP_TITLE?.trim() || teamName,
  storageNamespace:
    import.meta.env.VITE_STORAGE_NAMESPACE?.trim() ||
    DEFAULT_STORAGE_NAMESPACE,
  logoUrl:
    import.meta.env.VITE_TEAM_LOGO_URL?.trim() ||
    assetDefaults?.logoUrl ||
    DEFAULT_TEAM_LOGO_URL,
  defaultMatchImageUrl:
    import.meta.env.VITE_DEFAULT_MATCH_IMAGE_URL?.trim() ||
    assetDefaults?.defaultMatchImageUrl ||
    DEFAULT_MATCH_IMAGE_URL,
  downloadFilePrefix:
    import.meta.env.VITE_DOWNLOAD_FILE_PREFIX?.trim() ||
    teamSlug,
  ignoreRemoteMatchImages:
    import.meta.env.VITE_IGNORE_REMOTE_MATCH_IMAGES === "true",
  showDevModeBadge:
    import.meta.env.VITE_SHOW_DEV_MODE_BADGE === "true",
  editAccessKey:
    import.meta.env.VITE_EDIT_ACCESS_KEY?.trim() || "",
  editAccessQueryParam:
    import.meta.env.VITE_EDIT_ACCESS_QUERY_PARAM?.trim() ||
    "edit",
  playerJerseySelectedColor:
    sanitizeColor(
      import.meta.env.VITE_PLAYER_JERSEY_SELECTED_COLOR,
      "#242B35",
    ),
  playerJerseyUnselectedColor:
    sanitizeColor(
      import.meta.env.VITE_PLAYER_JERSEY_UNSELECTED_COLOR,
      "#CECECE",
    ),
  playerNumberSelectedColor:
    sanitizeColor(
      import.meta.env.VITE_PLAYER_NUMBER_SELECTED_COLOR,
      "#F2F2F2",
    ),
  playerNumberUnselectedColor:
    sanitizeColor(
      import.meta.env.VITE_PLAYER_NUMBER_UNSELECTED_COLOR,
      "#6E7783",
    ),
  playerSelectionCheckColor:
    sanitizeColor(
      import.meta.env.VITE_PLAYER_SELECTION_CHECK_COLOR,
      "#242B35",
    ),
  leaderboardJerseyPrimaryColor:
    sanitizeColor(
      import.meta.env.VITE_LEADERBOARD_JERSEY_PRIMARY_COLOR,
      "#E24444",
    ),
  leaderboardJerseySecondaryColor:
    sanitizeColor(
      import.meta.env.VITE_LEADERBOARD_JERSEY_SECONDARY_COLOR,
      "#283135",
    ),
  leaderboardJerseyNumberColor:
    sanitizeColor(
      import.meta.env.VITE_LEADERBOARD_JERSEY_NUMBER_COLOR,
      "#283135",
    ),
  players: parsePlayers(import.meta.env.VITE_TEAM_PLAYERS),
} as const;

export type { TeamPlayer };
