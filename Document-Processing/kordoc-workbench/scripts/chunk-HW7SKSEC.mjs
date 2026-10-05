import {createRequire as __coreCreateRequire} from "node:module"; const require=__coreCreateRequire(import.meta.url); import {extensionUrl as __extensionUrl,extensionPath as __extensionPath} from "./extensions.mjs";
import {
  escapeHtml,
  sanitizeHref
} from "./chunk-PZTNOUTU.mjs";

// node_modules/kordoc/dist/chunk-JPSLMPFI.js
var LITERAL_TAG = /<(?=\/?(?:u|sup|sub)>)/g;
function escapeLiteralTags(text) {
  return text.includes("<") ? text.replace(LITERAL_TAG, "\\<") : text;
}
function wrapScript(text, kind) {
  if (!kind) return text;
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
  return m[2] ? `${m[1]}<${kind}>${m[2]}</${kind}>${m[3]}` : text;
}
function tidyScriptTags(text) {
  if (!text.includes("<su")) return text;
  return text.replace(/(?<!\\)<\/(sup|sub)><\1>/g, "").replace(/(?<!\\)<(sup|sub)>(\s+)/g, "$2<$1>").replace(/(\s+)<\/(sup|sub)>/g, "</$2>$1").replace(/(?<!\\)<(sup|sub)><\/\1>/g, "");
}
function plainScripts(md) {
  if (!md.includes("<su")) return md;
  return md.replace(/(?<!\\)<(sup|sub)>([^<\n]*)<\/\1>/g, (_, kind, body) => {
    const mark = kind === "sup" ? "^" : "_";
    return /^(?:[+\-−]?[\p{L}\p{N}]+|[*∗†‡§¶]+)$/u.test(body) ? mark + body : `${mark}(${body})`;
  });
}
var TAG_RE = /(?<!\\)<\/?su[bp]>/g;
function stripScriptTags(r) {
  const s = (t) => t.includes("<su") ? t.replace(TAG_RE, "") : t;
  const walk = (bs) => {
    for (const b of bs ?? []) {
      if (b.text) b.text = s(b.text);
      if (b.footnoteText) b.footnoteText = s(b.footnoteText);
      for (const sp of b.spans ?? []) sp.text = s(sp.text);
      walk(b.children);
      if (b.table) {
        if (b.table.caption) b.table.caption = s(b.table.caption);
        walk(b.table.captionBlocks);
        for (const row of b.table.cells) for (const c of row) {
          c.text = s(c.text);
          walk(c.blocks);
        }
      }
    }
  };
  walk(r.blocks);
  if (r.markdown) r.markdown = s(r.markdown);
  for (const p of r.pages ?? []) p.markdown = s(p.markdown);
  return r;
}
var WINGDINGS = [
  "\u{1F589}",
  "\u2702",
  "\u2701",
  "\u{1F453}",
  "\u{1F56D}",
  "\u{1F56E}",
  "\u{1F56F}",
  "\u{1F57F}",
  "\u2706",
  "\u{1F582}",
  "\u{1F583}",
  "\u{1F4EA}",
  "\u{1F4EB}",
  "\u{1F4EC}",
  "\u{1F4ED}",
  "\u{1F4C1}",
  "\u{1F4C2}",
  "\u{1F4C4}",
  "\u{1F5CF}",
  "\u{1F5D0}",
  "\u{1F5C4}",
  "\u231B",
  "\u{1F5AE}",
  "\u{1F5B0}",
  "\u{1F5B2}",
  "\u{1F5B3}",
  "\u{1F5B4}",
  "\u{1F5AB}",
  "\u{1F5AC}",
  "\u2707",
  "\u270D",
  "\u{1F58E}",
  "\u270C",
  "\u{1F44C}",
  "\u{1F44D}",
  "\u{1F44E}",
  "\u261C",
  "\u261E",
  "\u261D",
  "\u261F",
  "\u{1F590}",
  "\u263A",
  "\u{1F610}",
  "\u2639",
  "\u{1F4A3}",
  "\u2620",
  "\u{1F3F3}",
  "\u{1F3F1}",
  "\u2708",
  "\u263C",
  "\u{1F4A7}",
  "\u2744",
  "\u{1F546}",
  "\u271E",
  "\u{1F548}",
  "\u2720",
  "\u2721",
  "\u262A",
  "\u262F",
  "\u0950",
  "\u2638",
  "\u2648",
  "\u2649",
  "\u264A",
  "\u264B",
  "\u264C",
  "\u264D",
  "\u264E",
  "\u264F",
  "\u2650",
  "\u2651",
  "\u2652",
  "\u2653",
  "\u{1F670}",
  "\u{1F675}",
  "\u25CF",
  "\u25CB",
  "\u25A0",
  "\u25A1",
  "\u25A1",
  "\u2751",
  "\u2752",
  "\u2B27",
  "\u29EB",
  "\u25C6",
  "\u2756",
  "\u2B25",
  "\u2327",
  "\u2BB9",
  "\u2318",
  "\u{1F3F5}",
  "\u{1F3F6}",
  "\u{1F676}",
  "\u{1F677}",
  "",
  "\u24EA",
  "\u2460",
  "\u2461",
  "\u2462",
  "\u2463",
  "\u2464",
  "\u2465",
  "\u2466",
  "\u2467",
  "\u2468",
  "\u2469",
  "\u24FF",
  "\u2776",
  "\u2777",
  "\u2778",
  "\u2779",
  "\u277A",
  "\u277B",
  "\u277C",
  "\u277D",
  "\u277E",
  "\u277F",
  "\u{1F662}",
  "\u{1F660}",
  "\u{1F661}",
  "\u{1F663}",
  "\u{1F65E}",
  "\u{1F65C}",
  "\u{1F65D}",
  "\u{1F65F}",
  "\xB7",
  "\u2022",
  "\u25AA",
  "\u26AA",
  "\u25CB",
  "\u25EF",
  "\u25C9",
  "\u25CE",
  "\u{1F53F}",
  "\u25AA",
  "\u25FB",
  "\u{1F7C2}",
  "\u2726",
  "\u2605",
  "\u2736",
  "\u2734",
  "\u2739",
  "\u2735",
  "\u2BD0",
  "\u2316",
  "\u27E1",
  "\u2311",
  "\u2BD1",
  "\u272A",
  "\u2730",
  "\u{1F550}",
  "\u{1F551}",
  "\u{1F552}",
  "\u{1F553}",
  "\u{1F554}",
  "\u{1F555}",
  "\u{1F556}",
  "\u{1F557}",
  "\u{1F558}",
  "\u{1F559}",
  "\u{1F55A}",
  "\u{1F55B}",
  "\u2BB0",
  "\u2BB1",
  "\u2BB2",
  "\u2BB3",
  "\u2BB4",
  "\u2BB5",
  "\u2BB6",
  "\u2BB7",
  "\u{1F66A}",
  "\u{1F66B}",
  "\u{1F655}",
  "\u{1F654}",
  "\u{1F657}",
  "\u{1F656}",
  "\u{1F650}",
  "\u{1F651}",
  "\u{1F652}",
  "\u{1F653}",
  "\u232B",
  "\u2326",
  "\u2B98",
  "\u2B9A",
  "\u2B99",
  "\u2B9B",
  "\u2B88",
  "\u2B8A",
  "\u2B89",
  "\u2B8B",
  "\u2190",
  "\u2192",
  "\u2191",
  "\u2193",
  "\u2196",
  "\u2197",
  "\u2199",
  "\u2198",
  "\u2B05",
  "\u2794",
  "\u2B06",
  "\u2B07",
  "\u2B09",
  "\u2B08",
  "\u2B0B",
  "\u2B0A",
  "\u21E6",
  "\u21E8",
  "\u21E7",
  "\u21E9",
  "\u2B04",
  "\u21F3",
  "\u2B00",
  "\u2B01",
  "\u2B03",
  "\u2B02",
  "\u{1F8AC}",
  "\u{1F8AD}",
  "\u2717",
  "\u2714",
  "\u2612",
  "\u2611",
  ""
];
function wingdingsChar(code) {
  if (code < 33 || code > 255) return void 0;
  return WINGDINGS[code - 33] || void 0;
}
var BMP_SYMBOL_MAP = {
  // 도형/기호
  108: "\u25CF",
  // ●
  109: "\u25CF",
  // ● (그림자 원 근사)
  110: "\u25A0",
  // ■
  111: "\u25A1",
  // □
  112: "\u25A1",
  // □ (굵은 흰 사각 근사)
  113: "\u25A1",
  // □ (그림자 근사)
  114: "\u25A1",
  // □ (그림자 근사)
  115: "\u2B27",
  // ⬧
  116: "\u29EB",
  // ⧫
  117: "\u25C6",
  // ◆
  118: "\u2756",
  // ❖
  119: "\u2B25",
  // ⬥
  // 체크/별/점
  158: "\xB7",
  // ·
  159: "\u2022",
  // •
  160: "\xB7",
  // · (한컴 PDF 정답지 정합 — ▪ 아님)
  161: "\u26AA",
  // ⚪
  162: "\u25CB",
  // ○
  163: "\u25CB",
  // ○
  164: "\u25C9",
  // ◉
  165: "\u25CE",
  // ◎
  167: "\u25AA",
  // ▪
  168: "\u25FB",
  // ◻
  170: "\u2726",
  // ✦
  171: "\u2605",
  // ★
  172: "\u2736",
  // ✶
  173: "\u2734",
  // ✴
  174: "\u2739",
  // ✹
  // 손 모양
  69: "\u261C",
  // ☜
  70: "\u261E",
  // ☞
  71: "\u261D",
  // ☝
  72: "\u261F",
  // ☟
  // 체크마크
  251: "\u2717",
  // ✗
  252: "\u2714",
  // ✔
  253: "\u2612",
  // ☒
  254: "\u2611",
  // ☑
  // 화살표
  232: "\u2794",
  // ➔ (heavy wide-headed — 한컴 PDF 정답지 정합)
  239: "\u21E6",
  // ⇦
  240: "\u21E8",
  // ⇨
  241: "\u21E7",
  // ⇧
  242: "\u21E9",
  // ⇩
  // 기타
  34: "\u2702",
  // ✂
  54: "\u231B",
  // ⌛
  74: "\u263A",
  // ☺
  78: "\u2620",
  // ☠
  82: "\u263C",
  // ☼
  84: "\u2744",
  // ❄
  88: "\u2720",
  // ✠
  89: "\u2721"
  // ✡
};
var SUPPLEMENTARY_MAP = {
  983099: "\u2193",
  // ↓
  983791: "\xB7",
  // ·
  985172: "\u300A",
  // 《
  985173: "\u300B",
  // 》
  983258: "\u25B8",
  // ▸
  985103: "\u2501",
  // ━
  985127: "\u25A0",
  // ■
  984005: "\u25A1",
  // □ 글머리 — HWP3→HWP5 한컴 변환본 보존 코드, 한컴오피스 표시값 (rhwp #1105)
  // 아래 5종 — rhwp 44cabad9 verified_hancom_pua 표 (한컴 PDF 대조 확정)
  983339: "(\uC778)",
  // 결재·서명란
  // 한컴 PDF 실렌더 대조(v4.12.3): 네모 테두리 안 "인" 글리프 — 결재 위치("수련치과병원장"·"청원주"·"경찰서장"
  // 뒤, licbyl2 17754757·17975885). HWP5 에는 A0E1 로 접혀 저장(record.ts PUA-A 접힘 해제)
  983265: "(\uC778)",
  983804: "\u25BA",
  // 2025 행정업무운영 편람 callout 글머리
  983836: "\u25A0",
  // 2025 행정업무운영 편람 목차 글머리
  983968: "\u21B5",
  // 하이퍼텍스트 안내문의 Enter 키 픽토그램
  // 머리말 회사명 6자 (HWP3 johab 0x37C0~0x37C5의 HWP5/HWPX 변환본 대응 코드)
  984047: "\uD55C",
  984048: "\uAE00",
  984049: "\uACFC",
  984050: "\uCEF4",
  984051: "\uD4E8",
  984052: "\uD130",
  // 아래는 rhwp VERIFIED_HANCOM_PUA_DISPLAY(한컴 PDF 대조 확정표)에서 kordoc 에만
  // 빠져 있던 항목. 매핑이 없으면 sanitizeText 가 지워 글자가 사라진다 —
  // hwp3-sample11 한 문서에서만 괘선 조각·원문자 57자가 그렇게 증발했다.
  983184: "\u273A",
  // 물방울 asterisk 글머리
  983688: "\u24EA",
  // 별도 글리프 원숫자 — ③(F028B)는 근거 문서가 리터럴을 써 rhwp 표에도 없다
  983689: "\u2460",
  983690: "\u2461",
  983692: "\u2463",
  983693: "\u2464",
  983694: "\u2465",
  983695: "\u2466",
  983696: "\u2467",
  983697: "\u2468",
  983788: "\u25C7",
  // 작은 빈 마름모 글머리
  983803: "\u25B8",
  // 중첩 표 글머리
  983975: "\u229F",
  // 둥근 네모 안 −
  983976: "\u229E",
  // 둥근 네모 안 +
  984026: "\u25A1",
  // 둥근 모서리 빈 네모 글머리
  984063: "\u25A1",
  // 표 셀 제목 빈 네모 글머리
  985094: "\u250C",
  // 텍스트 다이어그램 괘선 조각
  985095: "\u252C",
  985096: "\u2510",
  985100: "\u2514",
  985102: "\u2518",
  985104: "\u2502",
  985116: "\u2508",
  // 점선 괘선 조각
  985138: "\u2550",
  // 이중 가로 괘선 조각
  985160: "\u2501"
  // 굵은 가로 막대 글머리
};
var BOXED_NUMBER_START = 983729;
var BOXED_NUMBER_END = 983748;
function mapPuaChar(code) {
  if (code >= 61472 && code <= 61695) {
    return BMP_SYMBOL_MAP[code - 61440] ?? wingdingsChar(code - 61440);
  }
  if (code >= BOXED_NUMBER_START && code <= BOXED_NUMBER_END) {
    return String.fromCodePoint(9312 + (code - BOXED_NUMBER_START));
  }
  if (code >= 983040 && code <= 985599) {
    return SUPPLEMENTARY_MAP[code];
  }
  return void 0;
}
function mapPuaText(text) {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0);
    out += mapPuaChar(code) ?? ch;
  }
  return out;
}
var MAX_COLS = 200;
var MAX_ROWS = 1e4;
var MAX_TABLE_CELLS = MAX_ROWS * MAX_COLS;
function buildTable(rows, options) {
  const maxRows = options?.maxRows ?? MAX_ROWS;
  if (rows.length > maxRows) rows = rows.slice(0, maxRows);
  const numRows = rows.length;
  const hasAddr = rows.some((row) => row.some((c) => c.colAddr !== void 0 && c.rowAddr !== void 0));
  if (hasAddr) return buildTableDirect(rows, numRows, options);
  let maxCols = 0;
  const tempOccupied = Array.from({ length: numRows }, () => []);
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let colIdx = 0;
    for (const cell of rows[rowIdx]) {
      while (colIdx < MAX_COLS && tempOccupied[rowIdx][colIdx]) colIdx++;
      if (colIdx >= MAX_COLS) break;
      for (let r = rowIdx; r < Math.min(rowIdx + cell.rowSpan, numRows); r++) {
        for (let c = colIdx; c < Math.min(colIdx + cell.colSpan, MAX_COLS); c++) {
          tempOccupied[r][c] = true;
        }
      }
      colIdx += cell.colSpan;
      if (colIdx > maxCols) maxCols = colIdx;
    }
  }
  if (maxCols === 0) return { rows: 0, cols: 0, cells: [], hasHeader: false };
  const grid = Array.from(
    { length: numRows },
    () => Array.from({ length: maxCols }, () => ({ text: "", colSpan: 1, rowSpan: 1 }))
  );
  const occupied = Array.from({ length: numRows }, () => Array(maxCols).fill(false));
  const anchorCols = /* @__PURE__ */ new Set();
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let colIdx = 0;
    let cellIdx = 0;
    while (colIdx < maxCols && cellIdx < rows[rowIdx].length) {
      while (colIdx < maxCols && occupied[rowIdx][colIdx]) colIdx++;
      if (colIdx >= maxCols) break;
      const cell = rows[rowIdx][cellIdx];
      anchorCols.add(colIdx);
      grid[rowIdx][colIdx] = {
        text: options?.keepEmptyParagraphs ? cell.text : cell.text.trim(),
        colSpan: cell.colSpan,
        rowSpan: cell.rowSpan
      };
      for (let r = rowIdx; r < Math.min(rowIdx + cell.rowSpan, numRows); r++) {
        for (let c = colIdx; c < Math.min(colIdx + cell.colSpan, maxCols); c++) {
          occupied[r][c] = true;
        }
      }
      colIdx += cell.colSpan;
      cellIdx++;
    }
  }
  return trimAndReturn(grid, numRows, maxCols, anchorCols, options);
}
function buildTableDirect(rows, numRows, options) {
  let maxCols = 0;
  const rowCap = Math.min(MAX_ROWS, numRows + rows.reduce((n, r) => n + r.length, 0) + 1);
  for (const row of rows) {
    for (const cell of row) {
      const end = (cell.colAddr ?? 0) + cell.colSpan;
      if (end > maxCols) maxCols = end;
      if (cell.rowAddr !== void 0 && cell.rowAddr >= numRows) numRows = Math.min(cell.rowAddr + 1, rowCap);
    }
  }
  if (maxCols > MAX_COLS) maxCols = MAX_COLS;
  if (maxCols === 0 || numRows === 0) return { rows: 0, cols: 0, cells: [], hasHeader: false };
  const grid = Array.from(
    { length: numRows },
    () => Array.from({ length: maxCols }, () => ({ text: "", colSpan: 1, rowSpan: 1 }))
  );
  const owner = Array.from({ length: numRows }, () => new Array(maxCols));
  const anchorCols = /* @__PURE__ */ new Set();
  for (let ri = 0; ri < rows.length; ri++) {
    for (const cell of rows[ri]) {
      const text = options?.keepEmptyParagraphs ? cell.text : cell.text.trim();
      const r = Math.min(cell.rowAddr ?? ri, numRows - 1);
      let c = cell.colAddr ?? 0;
      if (r < 0 || c < 0) continue;
      if (cell.colAddr === void 0) while (c < maxCols - 1 && owner[r][c]) c++;
      if (c >= maxCols) c = maxCols - 1;
      const own = owner[r][c];
      if (own) {
        if (text.trim()) own.text = own.text ? `${own.text}
${text}` : text;
        continue;
      }
      let colSpan = Math.max(1, Math.min(cell.colSpan, maxCols - c));
      for (let dc = 1; dc < colSpan; dc++) if (owner[r][c + dc]) {
        colSpan = dc;
        break;
      }
      let rowSpan = Math.max(1, Math.min(cell.rowSpan, numRows - r));
      for (let dr = 1; dr < rowSpan; dr++) {
        if (owner[r + dr].slice(c, c + colSpan).some(Boolean)) {
          rowSpan = dr;
          break;
        }
      }
      const ir = { text, colSpan, rowSpan };
      anchorCols.add(c);
      for (let dr = 0; dr < rowSpan; dr++) {
        for (let dc = 0; dc < colSpan; dc++) {
          owner[r + dr][c + dc] = ir;
          grid[r + dr][c + dc] = dr === 0 && dc === 0 ? ir : { text: "", colSpan: 1, rowSpan: 1 };
        }
      }
    }
  }
  return trimAndReturn(grid, numRows, maxCols, anchorCols, options);
}
function trimAndReturn(grid, numRows, maxCols, anchorCols, options) {
  let effectiveCols = maxCols;
  while (effectiveCols > 0) {
    const colEmpty = grid.every((row) => !row[effectiveCols - 1]?.text?.trim());
    if (!colEmpty) break;
    if (options?.keepAnchoredEmptyCols && anchorCols.has(effectiveCols - 1)) break;
    effectiveCols--;
  }
  if (effectiveCols < maxCols && effectiveCols > 0) {
    const trimmed = grid.map((row) => row.slice(0, effectiveCols));
    for (const row of trimmed) {
      for (let c = 0; c < row.length; c++) {
        if (c + row[c].colSpan > effectiveCols) row[c].colSpan = effectiveCols - c;
      }
    }
    return { rows: numRows, cols: effectiveCols, cells: trimmed, hasHeader: numRows > 1 };
  }
  return { rows: numRows, cols: maxCols, cells: grid, hasHeader: numRows > 1 };
}
function convertTableToText(rows) {
  return rows.map(
    (row) => row.map((c) => c.text.trim().replace(/\n/g, " ").replace(/\|/g, "\\|")).filter(Boolean).join(" / ")
  ).filter(Boolean).join("\n");
}
function escapeGfm(text) {
  const NUL = String.fromCharCode(0);
  const spans = [];
  const masked = text.replace(/!\[[^\]<>\n]*\]\([^)\s<>"'\x60]*\)|\]\((?:https?:|mailto:|tel:|#)[^)\s<>"'\x60]*\)|(?<!\\)\$\$(?:\\[\s\S]|[^\\$])*\$\$|(?<!\\)\$(?:\\[^\n]|[^\\$\n])*\$/gi, (m) => {
    spans.push(m);
    return NUL + (spans.length - 1) + NUL;
  });
  const escaped = masked.replace(/\\(?=[!-#%-\/:-@\[-\x60{}~])(?!<\/?(?:u|sup|sub)>)/g, "\\\\").replace(/([~*_`])/g, "\\$1").replace(/(?<!\\)\|/g, "\\|").replace(/^([ \t]*)(?=#{1,6}(?:[ \t]|$))/gm, "$1\\").replace(/<(?!\/?(?:u|sup|sub)>)(?=[A-Za-z/!?])/g, "\\<");
  return escaped.replace(new RegExp(NUL + "(\\d+)" + NUL, "g"), (_, n) => spans[Number(n)]);
}
function escapeLiteralDollar(text) {
  return text.includes("$") ? text.replace(/\$/g, "\\$") : text;
}
var HWP_SHAPE_ALT_TEXT_RE = /^(?:모서리가 둥근 |둥근 )?(?:사각형|직사각형|정사각형|원|타원|삼각형|이등변 삼각형|직각 삼각형|선|직선|곡선|화살표|굵은 화살표|이중 화살표|오각형|육각형|팔각형|별|[4-8]점별|십자|십자형|구름|구름형|마름모|도넛|평행사변형|사다리꼴|부채꼴|호|반원|물결|번개|하트|빗금|블록 화살표|수식|표|그림|개체|그리기\s?개체|묶음\s?개체|글상자|수식\s?개체|OLE\s?개체)\s?입니다\.?$/gm;
function sanitizePua(text) {
  return mapPuaText(text).replace(/[\u{F0000}-\u{FFFFD}]/gu, "");
}
function sanitizeText(text) {
  let result = sanitizePua(text).replace(HWP_SHAPE_ALT_TEXT_RE, "").replace(/  +/g, " ").trim();
  if (result.length <= 30 && result.includes(" ")) {
    const tokens = result.split(" ");
    const koreanSingleCharCount = tokens.filter((t) => t.length === 1 && /[\uAC00-\uD7AF\u3131-\u318E]/.test(t)).length;
    const allDateUnits = tokens.every((t) => t.length !== 1 || !/[\uAC00-\uD7AF\u3131-\u318E]/.test(t) || /[년월일시분초]/.test(t));
    if (tokens.length >= 3 && koreanSingleCharCount / tokens.length >= 0.7 && !allDateUnits) {
      result = tokens.join("");
    }
  }
  return result;
}
var FORM_FRAME_MAX_TEXT = 600;
var NON_LAYOUT_TABLES = /* @__PURE__ */ new WeakSet();
function markNonLayoutTable(table) {
  NON_LAYOUT_TABLES.add(table);
}
function flattenLayoutTables(blocks) {
  const result = [];
  for (const block of blocks) {
    if (block.type !== "table" || !block.table || NON_LAYOUT_TABLES.has(block.table)) {
      result.push(block);
      continue;
    }
    const { rows: numRows, cols: numCols, cells } = block.table;
    if (numRows === 1 && numCols === 1) {
      result.push(block);
      continue;
    }
    if (numRows <= 3) {
      let totalNewlines = 0;
      let totalTextLen = 0;
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const t = cells[r]?.[c]?.text || "";
          totalNewlines += (t.match(/\n/g) || []).length;
          totalTextLen += t.length;
        }
      }
      const hasNested = cells.some((row) => row.some((c) => c.blocks?.some((b) => b.type === "table" && b.table)));
      const isFormFrame = hasNested && totalTextLen <= FORM_FRAME_MAX_TEXT;
      if (!isFormFrame && numCols < 4 && (totalNewlines > 5 || numRows <= 2 && totalTextLen > 300)) {
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            const cell = cells[r]?.[c];
            if (!cell) continue;
            if (cell.blocks?.length) {
              result.push(...flattenLayoutTables(cell.blocks));
              continue;
            }
            const cellText = cell.text?.trim();
            if (!cellText) continue;
            for (const line of cellText.split("\n")) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              result.push({ type: "paragraph", text: trimmed, pageNumber: block.pageNumber });
            }
          }
        }
        continue;
      }
    }
    result.push(block);
  }
  return result;
}
var RUNNING_HEADER_MAX_LEN = 40;
var RUNNING_HEADER_MIN_FREQ = 3;
function isRunningHeaderCandidate(block) {
  if (block.type !== "paragraph" && block.type !== "heading") return false;
  const text = block.text?.trim();
  if (!text || text.length > RUNNING_HEADER_MAX_LEN) return false;
  return /^\d+\.\s/.test(text);
}
function dedupeRunningHeaders(blocks) {
  const freq = /* @__PURE__ */ new Map();
  for (const block of blocks) {
    if (!isRunningHeaderCandidate(block)) continue;
    const text = block.text.trim();
    freq.set(text, (freq.get(text) ?? 0) + 1);
  }
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const block of blocks) {
    if (isRunningHeaderCandidate(block)) {
      const text = block.text.trim();
      if ((freq.get(text) ?? 0) >= RUNNING_HEADER_MIN_FREQ) {
        if (seen.has(text)) continue;
        seen.add(text);
      }
    }
    result.push(block);
  }
  return result;
}
function spansToMarkdown(spans) {
  let out = "";
  for (const s of spans) {
    if (s.placeholder) continue;
    const text = sanitizePua(s.text ?? "");
    if (!text) continue;
    let marker = s.code ? "`" : s.bold && s.italic ? "***" : s.bold ? "**" : s.italic ? "*" : "";
    if (s.strike && !s.code) marker = `~~${marker}`;
    const uWrap = !!s.underline && !s.code;
    if (!marker && !uWrap) {
      out += escapeGfm(text);
      continue;
    }
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
    const core = m[2];
    if (!core) {
      out += text;
      continue;
    }
    let open = marker;
    let close = [...marker].reverse().join("");
    if (uWrap) {
      open = "<u>" + open;
      close = close + "</u>";
    }
    out += m[1] + open + (s.code ? core : escapeGfm(core)) + close + m[3];
  }
  return out;
}
function blocksToMarkdown(blocks) {
  const lines = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "heading" && block.text) {
      const prefix = "#".repeat(Math.min(block.level || 2, 6));
      const headingText = sanitizeText(block.text);
      const note = block.footnoteText ? ` (\uC8FC: ${block.footnoteText})` : "";
      if (headingText) lines.push("", `${prefix} ${escapeGfm(headingText + note)}`, "");
      continue;
    }
    if (block.type === "image" && block.text) {
      lines.push("", `![image](${block.text})`, "");
      continue;
    }
    if (block.type === "separator") {
      lines.push("", "---", "");
      continue;
    }
    if (block.type === "list" && block.text) {
      const listText = sanitizeText(block.text);
      if (!listText) continue;
      const alreadyNumbered = block.listType === "ordered" && /^\d+\.\s/.test(listText);
      const alreadyBulleted = block.listType !== "ordered" && /^-\s/.test(listText);
      const prefix = alreadyNumbered || alreadyBulleted ? "" : block.listType === "ordered" ? "1. " : "- ";
      lines.push(`${prefix}${escapeGfm(listText + (block.footnoteText ? ` (\uC8FC: ${block.footnoteText})` : ""))}`);
      if (block.children) {
        for (const child of block.children) {
          const childPrefix = child.listType === "ordered" ? "1." : "-";
          lines.push(`  ${childPrefix} ${escapeGfm(child.text || "")}`);
        }
      }
      continue;
    }
    if (block.type === "paragraph" && (block.text || block.footnoteText)) {
      let text = sanitizeText(block.text ?? "");
      if (!text && !block.footnoteText) continue;
      if (lines.length && lines[lines.length - 1] !== "") lines.push("");
      if (/^\[별표\s*\d+/.test(text)) {
        const nextBlock = blocks[i + 1];
        if (nextBlock?.type === "paragraph" && nextBlock.text && /관련\)?$/.test(nextBlock.text)) {
          lines.push("", `## ${escapeGfm(text)} ${escapeGfm(nextBlock.text)}`, "");
          i++;
        } else {
          lines.push("", `## ${escapeGfm(text)}`, "");
        }
        continue;
      }
      if (/^\([^)]*조[^)]*관련\)$/.test(text)) {
        lines.push(`*${escapeGfm(text)}*`, "");
        continue;
      }
      const listIndent = block.listDepth ? "  ".repeat(block.listDepth) : "";
      if (block.spans?.length) {
        let rendered = spansToMarkdown(block.spans);
        if (block.href) {
          const href = sanitizeHref(block.href);
          if (href) rendered = `[${rendered}](${href})`;
        }
        if (block.footnoteText) rendered += ` (\uC8FC: ${block.footnoteText})`;
        lines.push(block.quote ? "> " + rendered : listIndent + rendered, "");
        continue;
      }
      if (block.href) {
        const href = sanitizeHref(block.href);
        if (href) text = `[${text}](${href})`;
      }
      if (block.footnoteText) {
        text += ` (\uC8FC: ${block.footnoteText})`;
      }
      lines.push(block.quote ? "> " + escapeGfm(text) : listIndent + escapeGfm(text), "");
    } else if (block.type === "table" && block.table) {
      if (lines.length > 0 && lines[lines.length - 1] !== "") {
        lines.push("");
      }
      lines.push(...captionToMarkdown(block.table));
      const tableMd = tableToMarkdown(block.table);
      if (tableMd) {
        lines.push(tableMd);
        lines.push("");
      }
    }
  }
  return lines.join("\n").trim();
}
function captionToMarkdown(table) {
  if (table.captionBlocks?.length) {
    return table.captionBlocks.flatMap((b) => {
      if (b.type === "table" && b.table) {
        const md = tableToMarkdown(b.table);
        return [...captionToMarkdown(b.table), ...md ? [md, ""] : []];
      }
      if (b.type === "image" && b.text) return [blocksToMarkdown([b]), ""];
      const t = (sanitizeText(visibleText(b)) + noteSuffix(b)).trim();
      return t ? [`**${escapeGfm(t)}**`, ""] : [];
    });
  }
  const caption = table.caption ? sanitizeText(table.caption) : "";
  return caption ? [`**${escapeGfm(caption)}**`, ""] : [];
}
function captionToHtml(table) {
  if (table.captionBlocks?.length) return cellInnerHtml({ text: "", colSpan: 1, rowSpan: 1, blocks: table.captionBlocks });
  const cap = table.caption ? sanitizeText(table.caption) : "";
  return cap ? escapeHtmlCellText(cap).replace(/\n/g, "<br>") : "";
}
function hasMergedCells(table) {
  for (const row of table.cells) {
    for (const cell of row) {
      if (cell.colSpan > 1 || cell.rowSpan > 1) return true;
    }
  }
  return false;
}
function hasStructuredCellContent(table) {
  for (const row of table.cells) {
    for (const cell of row) {
      if (cell.blocks?.some((b) => b.type === "table" && b.table || b.type === "separator")) return true;
    }
  }
  return false;
}
function noteSuffix(b) {
  return b.footnoteText ? ` (\uC8FC: ${b.footnoteText})` : "";
}
function visibleText(b) {
  return b.spans?.some((s) => s.placeholder) ? b.spans.filter((s) => !s.placeholder).map((s) => s.text).join("") : b.text ?? "";
}
function escapeHtmlCellText(text) {
  return escapeHtml(text).replace(/(\\)?&lt;(\/?)(u|sup|sub)&gt;/g, (_, esc, sl, tag) => esc ? `&lt;${sl}${tag}&gt;` : `<${sl}${tag}>`);
}
function cellInnerHtml(cell) {
  if (cell.blocks?.length) {
    return cell.blocks.map((b) => {
      if (b.type === "table" && b.table) {
        const cap = captionToHtml(b.table);
        return (cap ? cap + "<br>" : "") + tableToHtml(b.table);
      }
      if (b.type === "image" && b.text) return `<img src="${escapeHtml(b.text, true)}" alt="image">`;
      const t = (sanitizeText(visibleText(b)) + noteSuffix(b)).trim();
      return t ? escapeHtmlCellText(t).replace(/\n/g, "<br>") : "";
    }).filter(Boolean).join("<br>");
  }
  return escapeHtmlCellText(sanitizeText(cell.text)).replace(/\n/g, "<br>");
}
function tableToHtml(table) {
  const { cells, rows: numRows, cols: numCols } = table;
  const skip = /* @__PURE__ */ new Set();
  const lines = ["<table>"];
  for (let r = 0; r < numRows; r++) {
    const tag = r === 0 ? "th" : "td";
    const rowHtml = [];
    for (let c = 0; c < numCols; c++) {
      if (skip.has(`${r},${c}`)) continue;
      const cell = cells[r]?.[c];
      if (!cell) continue;
      for (let dr = 0; dr < cell.rowSpan; dr++) {
        for (let dc = 0; dc < cell.colSpan; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (r + dr < numRows && c + dc < numCols) skip.add(`${r + dr},${c + dc}`);
        }
      }
      const text = cellInnerHtml(cell);
      const attrs = [];
      if (cell.colSpan > 1) attrs.push(`colspan="${cell.colSpan}"`);
      if (cell.rowSpan > 1) attrs.push(`rowspan="${cell.rowSpan}"`);
      const attrStr = attrs.length ? " " + attrs.join(" ") : "";
      rowHtml.push(`<${tag}${attrStr}>${text}</${tag}>`);
    }
    lines.push(`<tr>${rowHtml.join("")}</tr>`);
  }
  lines.push("</table>");
  return lines.join("\n");
}
function hasInlineCellBlocks(cell) {
  return !!cell.blocks?.some((b) => b.spans?.length || b.footnoteText || b.type === "image" && b.text);
}
function cellToMarkdown(cell, separator) {
  if (!hasInlineCellBlocks(cell)) return escapeGfm(sanitizeText(cell.text));
  return cell.blocks.map((b) => b.type === "image" && b.text ? `![image](${b.text})` : b.spans?.length ? spansToMarkdown(b.spans) + escapeGfm(noteSuffix(b)) : escapeGfm(sanitizeText(b.text ?? "") + noteSuffix(b))).filter(Boolean).join(separator);
}
function tableToMarkdown(table) {
  if (table.rows === 0 || table.cols === 0) return "";
  const { cells, rows: numRows, cols: numCols } = table;
  if (hasStructuredCellContent(table)) return tableToHtml(table);
  if (table.renderAsTable) return tableToHtml(table);
  if (hasMergedCells(table)) return tableToHtml(table);
  if (numCols === 1 && cells.some((row) => row[0] && hasInlineCellBlocks(row[0]))) {
    return cells.map((row) => cellToMarkdown(row[0], "\n")).filter(Boolean).join("\n");
  }
  if (numRows === 1 && numCols === 1) {
    const content = sanitizeText(cells[0][0].text);
    if (!content) return "";
    return content.split(/\n/).map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^\d+\.\s/.test(trimmed)) return `**${escapeGfm(trimmed)}**`;
      if (/^[가-힣]\.\s/.test(trimmed)) return `  ${escapeGfm(trimmed)}`;
      return escapeGfm(trimmed);
    }).filter(Boolean).join("\n");
  }
  if (numCols === 1 && numRows >= 2) {
    return cells.map((row) => escapeGfm(sanitizeText(row[0].text)).split("\n").map((l) => l.trim()).filter(Boolean).join("\n")).filter(Boolean).join("\n");
  }
  const display = Array.from({ length: numRows }, () => Array(numCols).fill(""));
  const skip = /* @__PURE__ */ new Set();
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (skip.has(`${r},${c}`)) continue;
      const cell = cells[r]?.[c];
      if (!cell) continue;
      display[r][c] = cellToMarkdown(cell, "<br>").replace(/\r\n|\r|\n/g, "<br>").replace(/(?<!\\)\|/g, "\\|");
      for (let dr = 0; dr < cell.rowSpan; dr++) {
        for (let dc = 0; dc < cell.colSpan; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (r + dr < numRows && c + dc < numCols) {
            skip.add(`${r + dr},${c + dc}`);
          }
        }
      }
      c += cell.colSpan - 1;
    }
  }
  const uniqueRows = [];
  for (let r = 0; r < display.length; r++) {
    const row = display[r];
    if (row.every((cell) => cell === "") && row.some((_, c) => skip.has(`${r},${c}`))) continue;
    uniqueRows.push(row);
  }
  if (uniqueRows.length === 0) return "";
  const md = [];
  md.push("| " + uniqueRows[0].join(" | ") + " |");
  md.push("| " + uniqueRows[0].map(() => "---").join(" | ") + " |");
  for (let i = 1; i < uniqueRows.length; i++) {
    md.push("| " + uniqueRows[i].join(" | ") + " |");
  }
  return md.join("\n");
}
var CELL_EDGES = /* @__PURE__ */ new WeakMap();
var CONTENT_CELLS = /* @__PURE__ */ new WeakSet();
var FRACTION_MAX_CHARS = 40;
function anchorsOf(t) {
  const out = [];
  const covered = /* @__PURE__ */ new Set();
  for (let r = 0; r < t.rows; r++) for (let c = 0; c < t.cols; c++) {
    if (covered.has(r * t.cols + c)) continue;
    const cell = t.cells[r]?.[c];
    if (!cell) continue;
    const rs = Math.max(1, Math.min(cell.rowSpan, t.rows - r)), cs = Math.max(1, Math.min(cell.colSpan, t.cols - c));
    for (let dr = 0; dr < rs; dr++) for (let dc = 0; dc < cs; dc++) covered.add((r + dr) * t.cols + c + dc);
    out.push({ r, c, rs, cs, cell });
  }
  return out;
}
function ruleGrids(t, anchors) {
  const H = Array.from({ length: t.rows + 1 }, () => new Array(t.cols).fill(false));
  const V = Array.from({ length: t.rows }, () => new Array(t.cols + 1).fill(false));
  for (const a of anchors) {
    const e = CELL_EDGES.get(a.cell) ?? { t: true, b: true, l: true, r: true };
    for (let c = a.c; c < a.c + a.cs; c++) {
      if (e.t) H[a.r][c] = true;
      if (e.b) H[a.r + a.rs][c] = true;
    }
    for (let r = a.r; r < a.r + a.rs; r++) {
      if (e.l) V[r][a.c] = true;
      if (e.r) V[r][a.c + a.cs] = true;
    }
  }
  return { H, V };
}
function toTex(s) {
  return s.replace(/\\\$/g, "$").replace(/\\</g, "").replace(/<\/?u>/g, "").replace(/([\\{}%#&_$])/g, "\\$1").replace(/<sup>(.*?)<\/sup>/g, "^{$1}").replace(/<sub>(.*?)<\/sub>/g, "_{$1}").replace(/\u0001/g, "<").replace(/[가-힣ㄱ-ㅎㅏ-ㅣ][가-힣ㄱ-ㅎㅏ-ㅣ\s·ㆍ]*/g, (m) => `\\text{${m.trim()}}`).trim();
}
function fractionPart(cell) {
  const t = cell.text.trim();
  return !!t && !t.includes("\n") && !cell.blocks?.length && t.replace(/<\/?(?:u|sup|sub)>/g, "").length <= FRACTION_MAX_CHARS && !/(?<!\\)\$/.test(t);
}
function mergeFractions(t, anchors, H, V) {
  const at = /* @__PURE__ */ new Map();
  for (const a of anchors) at.set(a.r * t.cols + a.c, a);
  let merged = false;
  for (const u of anchors) {
    const d = at.get((u.r + u.rs) * t.cols + u.c);
    if (!d || d.cs !== u.cs || u.rs !== 1 || d.rs !== 1 || !fractionPart(u.cell) || !fractionPart(d.cell)) continue;
    const besideText = anchors.some((a) => a !== u && a !== d && a.r <= d.r && a.r + a.rs > u.r && a.cell.text.trim());
    if (!besideText && anchors.filter((a) => a.cell.text.trim()).length !== 2) continue;
    const bar = d.r, c1 = u.c, c2 = u.c + u.cs;
    let ok = true;
    for (let c = c1; c < c2 && ok; c++) if (!H[bar][c]) ok = false;
    if (!ok || c1 > 0 && H[bar][c1 - 1] || c2 < t.cols && H[bar][c2]) continue;
    for (let c = c1; c < c2 && ok; c++) if (H[u.r][c] || H[d.r + d.rs][c]) ok = false;
    for (let r = u.r; r < d.r + d.rs && ok; r++) if (V[r][c1] || V[r][c2]) ok = false;
    if (!ok) continue;
    u.cell.text = `$\\frac{${toTex(u.cell.text)}}{${toTex(d.cell.text)}}$`;
    u.cell.rowSpan = u.rs + d.rs;
    t.cells[d.r][d.c] = { text: "", colSpan: 1, rowSpan: 1 };
    at.delete(d.r * t.cols + d.c);
    merged = true;
  }
  return merged;
}
function ruledRows(t, anchors, H, V) {
  const inRow = new Array(t.rows).fill(0);
  for (const a of anchors) for (let r = a.r; r < a.r + a.rs; r++) inRow[r]++;
  return Array.from({ length: t.rows }, (_, r) => V[r].some(Boolean) || inRow[r] >= 2 && H[r].every(Boolean) && H[r + 1].every(Boolean));
}
function bandTable(t, anchors, V, H, r0, r1, keepEmptyCols) {
  let list = anchors.filter((a) => a.r >= r0 && a.r <= r1).map((a) => ({ ...a, rs: Math.min(a.rs, r1 - a.r + 1) }));
  const blank = (a) => {
    if (CONTENT_CELLS.has(a.cell)) return false;
    if (!a.cell.blocks?.length) return !a.cell.text.trim();
    return a.cell.blocks.every((b) => (b.type === "paragraph" || b.type === "heading") && !visibleText(b).trim() && !b.footnoteText);
  };
  let lo = Infinity, hi = -Infinity;
  for (let r = r0; r <= r1; r++) {
    for (let c = 0; c <= t.cols; c++) if (V[r][c]) {
      lo = Math.min(lo, c);
      hi = Math.max(hi, c);
    }
    for (const rr of [r, r + 1]) for (let c = 0; c < t.cols; c++) if (H[rr][c]) {
      lo = Math.min(lo, c);
      hi = Math.max(hi, c + 1);
    }
  }
  if (Number.isFinite(lo)) list = list.filter((a) => a.c < hi && a.c + a.cs > lo || !blank(a));
  if (!list.length) return null;
  const drop = [];
  for (let r = r0; r <= r1; r++) {
    const starts = list.filter((a) => a.r === r);
    if (starts.length && (!H[r].some(Boolean) || !H[r + 1].some(Boolean)) && starts.every(blank)) drop.push(r);
  }
  if (drop.length) {
    const shift = (y) => y - drop.filter((d) => d < y).length;
    list = list.filter((a) => !drop.includes(a.r)).map((a) => ({ ...a, r: shift(a.r), rs: shift(a.r + a.rs) - shift(a.r) })).filter((a) => a.rs > 0);
  }
  const emptyBand = list.every(blank);
  for (let right = keepEmptyCols ? 0 : Math.max(...list.map((a) => a.c + a.cs)); right > 1; ) {
    const starts = list.filter((a) => a.c === right - 1);
    if (!starts.length || !starts.every(blank) || starts.length === list.length) break;
    list = list.filter((a) => a.c !== right - 1).map((a) => a.c + a.cs === right ? { ...a, cs: a.cs - 1 } : a);
    right--;
  }
  const colB = /* @__PURE__ */ new Set(), rowB = /* @__PURE__ */ new Set();
  for (const a of list) {
    colB.add(a.c);
    colB.add(a.c + a.cs);
    rowB.add(a.r);
    rowB.add(a.r + a.rs);
  }
  const cx = [...colB].sort((x, y) => x - y), rx = [...rowB].sort((x, y) => x - y);
  const cols = cx.length - 1, rows = rx.length - 1;
  if (cols < 1 || rows < 1) return null;
  const cells = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ text: "", colSpan: 1, rowSpan: 1 })));
  for (const a of list) {
    const r = rx.indexOf(a.r), c = cx.indexOf(a.c);
    a.cell.rowSpan = rx.indexOf(a.r + a.rs) - r;
    a.cell.colSpan = cx.indexOf(a.c + a.cs) - c;
    cells[r][c] = a.cell;
  }
  return { rows, cols, cells, hasHeader: t.hasHeader, ...emptyBand ? { renderAsTable: true } : {} };
}
function textRow(row, out, pageNumber, keepEmptyCols) {
  const parts = [];
  const flush = () => {
    if (!parts.length) return;
    if (parts.length === 1) {
      for (const line of parts[0].split("\n")) if (line.trim()) out.push({ type: "paragraph", text: line.trim(), pageNumber });
    } else {
      const text = parts.map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean).join(" ");
      if (text) out.push({ type: "paragraph", text, pageNumber });
    }
    parts.length = 0;
  };
  for (const a of row) {
    if (a.cell.blocks?.length) {
      flush();
      out.push(...unframeLayoutTables(a.cell.blocks, keepEmptyCols));
      continue;
    }
    if (a.cell.text.trim()) parts.push(a.cell.text.trim());
  }
  flush();
}
function unframeTable(t, pageNumber, keepEmptyCols) {
  let anchors = anchorsOf(t);
  if (!anchors.some((a) => CELL_EDGES.has(a.cell))) return null;
  let { H, V } = ruleGrids(t, anchors);
  if (mergeFractions(t, anchors, H, V)) {
    anchors = anchorsOf(t);
    ({ H, V } = ruleGrids(t, anchors));
  }
  const ruled = ruledRows(t, anchors, H, V);
  if (ruled.every(Boolean)) {
    const whole = bandTable(t, anchors, V, H, 0, t.rows - 1, keepEmptyCols);
    if (!whole) return null;
    if (whole.rows === t.rows && whole.cols === t.cols) {
      if (whole.renderAsTable) t.renderAsTable = true;
      return null;
    }
    return [{ type: "table", table: {
      ...t,
      rows: whole.rows,
      cols: whole.cols,
      cells: whole.cells,
      ...whole.renderAsTable ? { renderAsTable: true } : {}
    }, pageNumber }];
  }
  const out = [];
  if (t.captionBlocks?.length) out.push(...t.captionBlocks);
  else if (t.caption) out.push({ type: "paragraph", text: t.caption, pageNumber });
  for (let r = 0; r < t.rows; ) {
    if (ruled[r]) {
      let r1 = r;
      while (r1 + 1 < t.rows && ruled[r1 + 1]) r1++;
      const sub = bandTable(t, anchors, V, H, r, r1, keepEmptyCols);
      if (sub) out.push({ type: "table", table: sub, pageNumber });
      r = r1 + 1;
      continue;
    }
    textRow(anchors.filter((a) => a.r === r).sort((x, y) => x.c - y.c), out, pageNumber, keepEmptyCols);
    r++;
  }
  return out;
}
function unframeLayoutTables(blocks, keepEmptyCols = false) {
  const out = [];
  for (const b of blocks) {
    if (b.type !== "table" || !b.table) {
      out.push(b);
      continue;
    }
    if (b.table.captionBlocks?.length) b.table.captionBlocks = unframeLayoutTables(b.table.captionBlocks, keepEmptyCols);
    const flat = unframeTable(b.table, b.pageNumber, keepEmptyCols);
    const kept = flat ?? [b];
    for (const k of kept) {
      if (k.type === "table" && k.table) {
        for (const row of k.table.cells) for (const cell of row) if (cell.blocks?.length) cell.blocks = unframeLayoutTables(cell.blocks, keepEmptyCols);
      }
      out.push(k);
    }
  }
  return out;
}
var HEADING_RATIO_H1 = 1.5;
var HEADING_RATIO_H2 = 1.3;
var HEADING_RATIO_H3 = 1.15;

export {
  escapeLiteralTags,
  wrapScript,
  tidyScriptTags,
  plainScripts,
  stripScriptTags,
  WINGDINGS,
  mapPuaText,
  MAX_COLS,
  MAX_ROWS,
  MAX_TABLE_CELLS,
  buildTable,
  convertTableToText,
  escapeGfm,
  escapeLiteralDollar,
  markNonLayoutTable,
  flattenLayoutTables,
  dedupeRunningHeaders,
  blocksToMarkdown,
  noteSuffix,
  escapeHtmlCellText,
  CELL_EDGES,
  CONTENT_CELLS,
  unframeLayoutTables,
  HEADING_RATIO_H1,
  HEADING_RATIO_H2,
  HEADING_RATIO_H3
};
