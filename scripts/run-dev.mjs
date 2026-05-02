import readline from "node:readline";
import { spawn } from "node:child_process";

const teamModes = {
  bulgaemi: {
    mode: "bulgaemi",
    label: "팀불개미",
    port: "4178",
  },
  jjfc: {
    mode: "jjfc",
    label: "JJFC",
    port: "4177",
  },
};

const normalizeChoice = (value) => {
  const normalized = value.trim().toLowerCase();

  if (normalized === "1" || normalized === "bulgaemi" || normalized === "team-bulgaemi") {
    return "bulgaemi";
  }

  if (normalized === "2" || normalized === "jjfc") {
    return "jjfc";
  }

  return null;
};

const killChild = (child, signal = "SIGTERM") => {
  if (!child || child.killed) return;
  try {
    child.kill(signal);
  } catch {
    // Ignore shutdown race conditions from already-exited children.
  }
};

const startDevServer = (choice) => {
  const selected = teamModes[choice];

  if (!selected) {
    process.exitCode = 1;
    console.error("지원하지 않는 팀입니다.");
    return;
  }

  console.log(`\n${selected.label} 개발 서버를 시작합니다.`);
  console.log(`주소: http://127.0.0.1:${selected.port}\n`);

  const tailwindWatcher = spawn(
    "npx",
    [
      "@tailwindcss/cli",
      "-i",
      "./src/styles/utilities-source.css",
      "-o",
      "./src/styles/generated-utilities.css",
      "--minify",
      "--watch",
    ],
    {
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  const child = spawn(
    "npx",
    [
      "vite",
      "--mode",
      selected.mode,
      "--host",
      "127.0.0.1",
      "--port",
      selected.port,
    ],
    {
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  const shutdown = (signal) => {
    killChild(tailwindWatcher, signal);
    killChild(child, signal);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("exit", () => shutdown("SIGTERM"));

  tailwindWatcher.on("exit", (code, signal) => {
    if (signal) {
      killChild(child, signal);
      process.kill(process.pid, signal);
      return;
    }

    if ((code ?? 0) !== 0) {
      killChild(child);
      process.exit(code ?? 1);
    }
  });

  child.on("exit", (code, signal) => {
    killChild(tailwindWatcher);

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
};

const argChoice = process.argv[2] ? normalizeChoice(process.argv[2]) : null;

if (argChoice) {
  startDevServer(argChoice);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("어느 팀으로 실행할까요?");
  console.log("1. 팀불개미");
  console.log("2. JJFC");

  rl.question("선택 (1/2, 기본값 1): ", (answer) => {
    rl.close();
    const choice = normalizeChoice(answer || "1") || "bulgaemi";
    startDevServer(choice);
  });
}
