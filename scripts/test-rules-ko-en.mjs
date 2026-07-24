import fs from "node:fs";
import path from "node:path";

const rulesFile = process.argv[2];

if (!rulesFile) {
  console.error(
    '사용법: node scripts/test-rules-ko-en.mjs "rules-ko-en.json 경로"'
  );
  process.exit(1);
}

const absolutePath = path.resolve(rulesFile);

if (!fs.existsSync(absolutePath)) {
  console.error(`파일을 찾을 수 없습니다: ${absolutePath}`);
  process.exit(1);
}

const raw = fs
  .readFileSync(absolutePath, "utf8")
  .replace(/^\uFEFF/, "");

function extractTopLevelKeys(jsonText) {
  const keys = [];
  let index = 0;

  const skipWhitespace = () => {
    while (
      index < jsonText.length &&
      /\s/.test(jsonText[index])
    ) {
      index += 1;
    }
  };

  const readJsonString = () => {
    if (jsonText[index] !== '"') {
      throw new Error(`문자열 시작 오류: 위치 ${index}`);
    }

    const start = index;
    index += 1;

    let escaped = false;

    while (index < jsonText.length) {
      const char = jsonText[index];

      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        index += 1;
        return JSON.parse(jsonText.slice(start, index));
      }

      index += 1;
    }

    throw new Error("닫히지 않은 JSON 문자열입니다.");
  };

  skipWhitespace();

  if (jsonText[index] !== "{") {
    throw new Error("최상위 구조가 JSON 객체가 아닙니다.");
  }

  index += 1;

  while (index < jsonText.length) {
    skipWhitespace();

    if (jsonText[index] === "}") {
      break;
    }

    if (jsonText[index] === ",") {
      index += 1;
      skipWhitespace();
    }

    const key = readJsonString();
    keys.push(key);

    skipWhitespace();

    if (jsonText[index] !== ":") {
      throw new Error(`콜론 누락: ${key}`);
    }

    index += 1;
    skipWhitespace();

    // 현재 rules-ko-en.json의 값은 모두 문자열이어야 합니다.
    readJsonString();

    skipWhitespace();

    if (
      jsonText[index] !== "," &&
      jsonText[index] !== "}"
    ) {
      throw new Error(`쉼표 또는 닫는 괄호 오류: ${key}`);
    }
  }

  return keys;
}

function countSlots(text) {
  const matches =
    text.match(/\[[A-Z][A-Z0-9_]*\]/g) ?? [];

  return matches.reduce((counter, slot) => {
    counter[slot] = (counter[slot] ?? 0) + 1;
    return counter;
  }, {});
}

function countersEqual(left, right) {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every(
    (key, index) =>
      key === rightKeys[index] &&
      left[key] === right[key]
  );
}

function normalizeKoreanPattern(text) {
  return text
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/[.,!?，。！？]+$/g, "");
}

let rules;
let sourceKeys;

try {
  sourceKeys = extractTopLevelKeys(raw);
  rules = JSON.parse(raw);
} catch (error) {
  console.error("\n❌ JSON 문법 검사 실패");
  console.error(error.message);
  process.exit(1);
}

const duplicateKeyCounts = sourceKeys.reduce(
  (counter, key) => {
    counter[key] = (counter[key] ?? 0) + 1;
    return counter;
  },
  {}
);

const duplicateKeys = Object.entries(
  duplicateKeyCounts
).filter(([, count]) => count > 1);

const slotMismatches = [];
const repeatedSlotWarnings = [];
const normalizedGroups = new Map();

for (const [koPattern, enPattern] of Object.entries(rules)) {
  const koSlots = countSlots(koPattern);
  const enSlots = countSlots(enPattern);

  if (!countersEqual(koSlots, enSlots)) {
    slotMismatches.push({
      koPattern,
      enPattern,
      koSlots,
      enSlots,
    });
  }

  const repeated = Object.entries(koSlots).filter(
    ([, count]) => count > 1
  );

  if (repeated.length > 0) {
    repeatedSlotWarnings.push({
      koPattern,
      repeated,
    });
  }

  const normalized = normalizeKoreanPattern(koPattern);
  const group = normalizedGroups.get(normalized) ?? [];
  group.push(koPattern);
  normalizedGroups.set(normalized, group);
}

const normalizedDuplicates = [
  ...normalizedGroups.entries(),
]
  .filter(([, patterns]) => patterns.length > 1)
  .map(([normalized, patterns]) => ({
    normalized,
    patterns,
  }));

const report = {
  file: absolutePath,
  totalRules: Object.keys(rules).length,
  duplicateKeyCount: duplicateKeys.length,
  slotMismatchCount: slotMismatches.length,
  repeatedSlotWarningCount:
    repeatedSlotWarnings.length,
  normalizedDuplicateCount:
    normalizedDuplicates.length,
  duplicateKeys,
  slotMismatches,
  repeatedSlotWarnings,
  normalizedDuplicates,
};

fs.writeFileSync(
  path.resolve("rules-test-report.json"),
  JSON.stringify(report, null, 2),
  "utf8"
);

console.log("\n==================================");
console.log("X-DIC rules-ko-en 검사 결과");
console.log("==================================");
console.log(`총 규칙: ${report.totalRules}`);
console.log(`동일 키 중복: ${report.duplicateKeyCount}`);
console.log(`한·영 슬롯 불일치: ${report.slotMismatchCount}`);
console.log(
  `반복 슬롯 경고: ${report.repeatedSlotWarningCount}`
);
console.log(
  `공백·문장부호 정규화 중복: ${report.normalizedDuplicateCount}`
);

if (
  report.duplicateKeyCount === 0 &&
  report.slotMismatchCount === 0 &&
  report.normalizedDuplicateCount === 0
) {
  console.log("\n✅ 필수 정적 검사 통과");
} else {
  console.log("\n❌ 수정이 필요한 항목이 있습니다.");
  console.log(
    "상세 내용: rules-test-report.json"
  );
  process.exitCode = 1;
}