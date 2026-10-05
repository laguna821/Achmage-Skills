/** kordoc 공통 타입 정의 */
interface CellContext {
    text: string;
    colSpan: number;
    rowSpan: number;
    /** HWP5 셀 열 주소 (0-based) — 병합 테이블 배치용 */
    colAddr?: number;
    /** HWP5 셀 행 주소 (0-based) — 병합 테이블 배치용 */
    rowAddr?: number;
}
/** 블록 타입 — v2.0에서 heading, list, image, separator 추가 */
type IRBlockType = "paragraph" | "table" | "heading" | "list" | "image" | "separator";
/** 인라인 강조 run-span — 문단 텍스트를 서식 단위로 쪼갠 조각 (텍스트 연결 = block.text) */
interface IRSpan {
    text: string;
    bold?: boolean;
    italic?: boolean;
    strike?: boolean;
    /** 밑줄 — 개정문 추가·변경 표시 등. GFM 문법이 없어 <u>…</u> 인라인 HTML 로 방출 */
    underline?: boolean;
    code?: boolean;
    /**
     * 미기입 누름틀의 안내문(HWPX CLICK_HERE, 수정 안 됨). 한컴은 화면에만 흐리게 보이고 인쇄하지 않는다.
     * 블록 `text` 에는 남기고(양식 채우기·패치가 원문 자리와 맞대도록) 마크다운에서는 뺀다 (v4.14.3)
     */
    placeholder?: boolean;
}
interface IRBlock {
    type: IRBlockType;
    /** 블록 글. HWPX·HWP5·HWP3 은 원문의 리터럴 `$` 를 `\$` 로 담고 `$…$`·`$$…$$` 는 수식 스팬에만 쓴다 (v4.14.3) */
    text?: string;
    table?: IRTable;
    /** 헤딩 레벨 (1-6), type="heading"일 때 사용 */
    level?: number;
    /** 원본 페이지 번호 (1-based) */
    pageNumber?: number;
    /** 바운딩 박스 — PDF에서만 제공 */
    bbox?: BoundingBox;
    /** 텍스트 스타일 정보 (선택) */
    style?: InlineStyle;
    /** 리스트 타입, type="list"일 때 사용 */
    listType?: "ordered" | "unordered";
    /** 중첩 리스트 아이템 */
    children?: IRBlock[];
    /** 하이퍼링크 URL */
    href?: string;
    /** 각주/미주 텍스트 (인라인 삽입용) */
    footnoteText?: string;
    /** 이미지 데이터 (type="image"일 때) */
    imageData?: ImageData;
    /** 인라인 강조 run-span (선택 — kordoc 생성 hwpx 왕복 채널 + 외래 실속성 볼드/이탤릭).
     *  존재하면 마크다운 변환이 **·*·` 마커를 재방출한다 */
    spans?: IRSpan[];
    /** 인용문 문단 (선택 — kordoc 생성 hwpx 왕복 채널) — 마크다운 변환이 "> " 접두 재방출 */
    quote?: boolean;
    /**
     * 문단 들여쓰기(HWPUNIT, 선택) — HWPX paraPr `<hh:margin>` 자식요소형 hc:left
     * (+양수 hc:intent 첫줄분). 마크다운 방출엔 쓰지 않는 관찰 슬롯 — gongmun 리스트
     * depth 재유도·양식 분석 등 소비자 몫 (v4.0.4)
     */
    indent?: number;
    /**
     * gongmun 리스트 단계(1~7, 선택) — indent를 levelIndent 단위로 역산한 소비 결과
     * (v4.0.5). md 리스트 문법과 충돌하는 부호('- '·'1) ') 문단에만 채워지며,
     * 마크다운 변환이 2칸/단계 선행 공백을 방출해 재생성 시 depth가 복원된다
     */
    listDepth?: number;
}
/** 추출된 이미지 바이너리 데이터 */
interface ImageData {
    /** 이미지 바이너리 */
    data: Uint8Array;
    /** MIME 타입 (image/png, image/jpeg, image/gif, image/bmp, image/wmf, image/emf) */
    mimeType: string;
    /** 원본 파일명 (있는 경우) */
    filename?: string;
}
/** 바운딩 박스 — PDF 포인트 단위 (72pt = 1인치) */
interface BoundingBox {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
}
/** 인라인 텍스트 스타일 */
interface InlineStyle {
    bold?: boolean;
    italic?: boolean;
    /** 취소선 — 법령 개정문 등의 삭제 표시. 판정은 취소선 모양 whitelist (비트만 믿으면 오탐) */
    strike?: boolean;
    /** 밑줄 — 판정은 밑줄 종류 BOTTOM 한정 (NONE 이 기본 잡음, 코퍼스 실측) */
    underline?: boolean;
    fontSize?: number;
    fontName?: string;
}
type TableClassificationKind = "semantic-table" | "non-tabular-layout" | "uncertain";
type TableClassificationReason = "repeated-row-schema" | "grid-regularity" | "high-active-density" | "column-type-consistency" | "nested-structure-wrapper" | "span-irregularity" | "spacer-bands" | "extreme-sparsity" | "diagram-context-keyword" | "low-evidence" | "ambiguous-scores";
/** 휴리스틱 분류 결과 — confidence 는 확률이 아니라 두 점수의 격차 */
interface TableClassificationSummary {
    kind: TableClassificationKind;
    confidence: number;
    semanticScore: number;
    nonTabularScore: number;
    reasons: TableClassificationReason[];
}
interface IRTable {
    rows: number;
    cols: number;
    cells: IRCell[][];
    /** PDF의 1열 데이터 표나 테두리가 있는 빈 입력란을 HTML 표로 유지한다. 목록성 틀의 평탄화와 구분한다. */
    renderAsTable?: boolean;
    /** 첫 행을 헤더로 렌더링할지 여부 (현재: rows > 1이면 true — 의미적 감지가 아닌 레이아웃 힌트) */
    hasHeader: boolean;
    /** opt-in 분류(`ParseOptions.classifyTables`) 결과 — #76 */
    classification?: TableClassificationSummary;
    /** 원본 표 식별자(HWPX `hp:tbl id`) — 렌더 region(`RenderRegion.sourceId`)과의 조인 키 */
    sourceId?: string;
    /** 렌더 인프라가 준 페이지 로컬 pt 조각(다중 페이지 표는 여럿) — extractTables 가 채운다 */
    regions?: BoundingBox[];
    /** 표 캡션 (예: "표 1. 부서별 예산") — v3.0 */
    caption?: string;
    /**
     * 캡션 내부 블록 콘텐츠 — v4.2.8 (#55).
     * 캡션 안 중첩표·문단을 구조 그대로, 원문 순서대로 보존한다 (IRCell.blocks와 같은 계약).
     * 표가 있을 때만 채워지며, caption은 하위 호환용 평탄화 문자열로 계속 제공된다.
     */
    captionBlocks?: IRBlock[];
}
interface IRCell {
    text: string;
    colSpan: number;
    rowSpan: number;
    /**
     * 셀 내부 블록 콘텐츠 — v3.0.
     * 중첩 표·이미지 등 구조 콘텐츠(또는 왕복 채널 span 문단)가 있는 셀에만 채워지며,
     * 그 안의 문단·표·이미지를 문서(원문) 순서대로 보존한다. 다중 문단뿐인 평문 셀은
     * blocks 없이 text 평탄화(문단을 `\n`으로 결합)로만 제공된다 (blocks 무게 억제, #57).
     * 표와 텍스트가 한 줄에 번갈아 놓인 셀도 배치 순서를 따른다 (v4.2.3, #49).
     * blocks가 있으면 text는 blocks의 평탄화 텍스트(하위 호환용)다.
     */
    blocks?: IRBlock[];
    /** 제목 셀 여부 (HWP5 width_ref bit2 / HWPX header 속성) — v3.0 */
    isHeader?: boolean;
}
/** 문서 메타데이터 — 각 포맷에서 추출 가능한 필드만 채워짐 */
interface DocumentMetadata {
    /** 문서 제목 */
    title?: string;
    /** 작성자 */
    author?: string;
    /** 작성 프로그램 (예: "한글 2020", "Adobe Acrobat") */
    creator?: string;
    /** 생성일시 (ISO 8601) */
    createdAt?: string;
    /** 수정일시 (ISO 8601) */
    modifiedAt?: string;
    /** 페이지/섹션 수 — pageMode="layout"이면 실제 페이지 수, "section"이면 섹션 수 */
    pageCount?: number;
    /**
     * 페이지 경계 신뢰도 (#66) — "layout": 조판 정보 기반 실제 페이지
     * (한컴 저장본 HWP/HWPX·PDF·COM, PPTX 슬라이드), "section": 섹션 단위 근사
     * (조판 캐시 없는 생성 파일). HWP/HWPX/PDF·PPTX에서만 설정된다.
     */
    pageMode?: "layout" | "section";
    /** 문서 포맷 버전 (예: HWP "5.1.0.1") */
    version?: string;
    /** 설명 */
    description?: string;
    /** 키워드 */
    keywords?: string[];
}
/** 파싱 옵션 — parse() 함수에 전달 */
interface ParseOptions {
    /**
     * 파싱할 페이지/섹션 범위 (1-based).
     * - 배열: [1, 2, 3]
     * - 문자열: "1-3", "1,3,5-7"
     *
     * PDF: 정확한 페이지 단위. HWP/HWPX: 섹션 단위 근사치.
     */
    pages?: number[] | string;
    /** 이미지 기반 PDF OCR (선택).
     *  - 지정 안 함(기본): 내장 모델이 이미 캐시에 있으면(`kordoc models` 로 받았거나 앞서 `ocr: true` 로 받은 경우) 텍스트층이
     *    없는 쪽(스캔·글자를 곡선으로 그린 쪽)과 글 없는 큰 그림(쪽 면적 5% 넘는) 속 글을 자동 인식한다. 모델이 없으면 다운로드하지
     *    않고 NEEDS_OCR·SKIPPED_IMAGE 경고만.
     *  - `false`: 끈다.
     *  - `true`: 내장 엔진(PP-OCRv5 korean, ~18MB 자동 다운로드)으로 OCR 필요 판정
     *    페이지만 인식 (스캔 페이지·글꼴 매핑 깨진 페이지). 정상 페이지는 파싱 결과 유지.
     *  - `"force"`: 전 페이지를 내장 엔진으로 강제 OCR.
     *  - 함수: 사용자 제공 OcrProvider (Claude Vision·Tesseract 등) — 판정은 `true`와 동일. */
    ocr?: boolean | "force" | OcrProvider;
    /** 진행률 콜백 — current: 현재 페이지/섹션, total: 전체 수 */
    onProgress?: (current: number, total: number) => void;
    /** PDF 머리글/바닥글 자동 제거 */
    removeHeaderFooter?: boolean;
    /**
     * 위·아래첨자를 인라인 HTML `<sup>`·`<sub>` 로 표기 — 평문으로 펴면 "10⁴ m²" 가 "104 m2", "x_i" 가 "xi" 로 값이 바뀐다.
     * 기본: HWPX·HWP·DOCX 켬(글자 모양에 적힌 첨자), PDF 끔(글자 크기·기준선으로 추정 — 논문·수식 문서는 true 권장.
     * 공개 벤치 ODL 정답이 첨자를 평문으로 적어 기본값을 두지 않는다). false 면 모든 형식에서 평문. OCR 로 읽은 글은 늘 평문
     */
    scriptTags?: boolean;
    /** 평문 Markdown — 그림 자리 표시·링크 URL·밑줄(`<u>`)·굵게(`**`) 표기를 빼고 글만 (제목·목록·표 구조는 유지).
     *  첨자 `<sup>`·`<sub>` 는 값이 남게 `10^4`·`H_2O` 로 편다. 이미지 바이트를 따로 저장하지 않는 색인·RAG 용. 기본 false. `blocks` IR 은 그대로 */
    plain?: boolean;
    /** 모든 표를 HTML 로 — 파이프 표도 HTML 표로 옮기고, 표마다 태그를 한 줄씩 들여써 낸다(BeautifulSoup prettify 모양, 첫 행 `<th>`).
     *  HTML 표만 다루는 소비자·채점기용. 기본 false(병합·중첩 없는 표는 GFM 파이프 표) */
    htmlTables?: boolean;
    /** 표 오른쪽 끝의 빈 열(서식 문서의 입력란) 보존 (#47).
     *  기본 false: 마크다운 가독성을 위해 후행 빈 열을 트림.
     *  양식 인식 경로(parse_form·fill)는 내부적으로 항상 켠다. */
    keepTrailingEmptyCols?: boolean;
    /** 테두리가 안 보이는 틀 표 처리 (v4.17.0). 기본 `"visual"`: 보이는 대로 — 선이 없는 틀은 글로 풀고 선이 보이는 부분만 표로,
     *  칸으로 조립한 분수는 `$\frac{…}{…}$` 수식으로. `"keep"`: 종전대로 원본 표 구조 그대로(왕복 패치·양식 채우기처럼
     *  원본 표 서수가 필요한 경로). HWPX·HWP5·PDF */
    layoutTables?: "visual" | "keep";
    /** 구조 파싱 뒤 표를 의미표/레이아웃/불확실로 분류해 `IRTable.classification` 에 붙인다 (#76).
     *  기본 false — 기본 parse 출력 불변. 중첩표·셀 blocks·캡션 blocks 까지 재귀, 원문 순서는 바꾸지 않는다. */
    classifyTables?: boolean;
    /** 빈 문단(텍스트 없는 hp:p) 보존 (#57). 기본 false: 종전대로 빈 문단 제거.
     *  켜면 본문은 `text: ""` paragraph 블록으로, 표 셀은 빈 줄로 순서대로 보존해
     *  "원문 문단 수 = 줄 수" 대응을 유지한다 (행 줄맞춤 서식 문서용).
     *  개체(표·이미지·글상자)만 있는 문단은 개체 출력이 따로 있어 대상이 아니다.
     *  현재 HWPX 경로 적용. */
    keepEmptyParagraphs?: boolean;
    /** 미기입 누름틀 안내문도 마크다운에 낸다 (#92). 기본 false: 종전대로 뺀다(한컴은 화면에만 흐리게 보이고 인쇄하지 않는 글).
     *  빈 서식 문서에서 "이 칸에 무엇을 적나"(예: "학교명 기재 금지")가 안내문뿐일 때 켠다. HWPX·HWP5 */
    includeFieldPlaceholders?: boolean;
    /** 비밀번호로 보호된 문서의 열기 암호.
     *  HWPX(ODF AES-256-CBC)·HWP3(DES) 지원. 한컴 DRM(문서 보안)은 별개라 해당 없음. */
    password?: string;
    /** 원본 파일 경로 (DRM COM fallback에 필요, 내부 전용) */
    filePath?: string;
    /**
     * PDF 수식 OCR 활성화 (기본 false).
     *
     * 활성화 시 각 PDF 페이지를 이미지로 렌더링 → YOLOv8 기반 수식 영역 검출 →
     * TrOCR 기반 LaTeX 인식. 감지된 수식은 `$...$` (inline) / `$$...$$` (display) 로
     * 블록 텍스트에 삽입된다.
     *
     * 필수 optional 의존성: `onnxruntime-node`, `@huggingface/transformers`,
     * `@hyzyla/pdfium`, `sharp`. 미설치 시 parse 에 실패하지 않고 **경고만** 남기고
     * 수식 인식은 skip 한다 (일반 텍스트 추출은 정상 동작).
     *
     * 모델(~155MB) 은 첫 사용 시 HuggingFace 에서 자동 다운로드 되어
     * `~/.cache/kordoc/models/pix2text/` 에 SHA-256 검증과 함께 저장된다.
     */
    formulaOcr?: boolean;
    /**
     * 레이아웃 표 페이지 반복 헤더(러닝 헤더) 정리 휴리스틱 활성화 (기본 false).
     *
     * 구형 HWP5 문서가 페이지마다 재삽입한 짧은 번호매김 러닝 헤더
     * ("2. 과제 구축 내용")를 최초 1회만 남기고 이후 중복을 제거한다.
     * 다만 페이지 위치 정보가 없는 HWP5 특성상 이 휴리스틱은 정당하게 반복되는
     * 번호매김 문단(예: 붙임/별지별 재번호 "1. 목적")도 삭제할 수 있어 opt-in 으로
     * 둔다. 활성 시 제거가 발생하면 HIDDEN_TEXT_FILTERED 경고를 남긴다.
     */
    dedupeRunningHeaders?: boolean;
    /**
     * 추출된 이미지를 마크다운에 base64 data URI 로 인라인 (기본 false).
     *
     * 활성화 시 `![image](image_001.bmp)` 참조를 `![image](data:image/png;base64,...)` 로
     * 치환한다. 임베드된 BMP 는 PNG 로 무손실 압축 후 인라인하여 용량을 크게 줄인다.
     * 별도 이미지 파일 없이 자체 완결형 마크다운이 되어 MCP/AI 에이전트 소비에 적합하다.
     * (현재 HWP5 경로 지원)
     */
    inlineImages?: boolean;
    /**
     * 이미지 바이트 추출 (기본 true). false 면 결과에 이미지 바이트를 싣지 않는다.
     * `images` 는 비고, 블록의 `imageData` 도 떼며, HWP5 `inlineImages` 도 무시한다.
     * 그림 자리 표시(`![image](…)`)는 마크다운·블록에 그대로 남아 위치는 알 수 있다.
     * PDF 는 PNG 인코딩을 건너뛴다. 거르는 기준은 같되 메모리 보호용 128MB 누적 상한은 걸리지
     * 않아, 그 상한 뒤의 그림도 자리 표시가 남는다. DOCX 는 그림 파트(`word/media`·`word/embeddings`)를
     * 풀지 않고 ZIP 비압축 상한(100MB)에도 세지 않는다 (#108).
     *
     * 검색 색인처럼 글자만 필요한 호출자용이다. 그림이 많은 문서는 base64 로 불어난 이미지가
     * JSON 출력의 대부분을 차지했다 (PDF 실측 200MB → 9.5MB, CPU 시간 30% 감소). 본문 글자와
     * OCR 은 이 옵션과 무관하다.
     */
    images?: boolean;
    /**
     * PDF 표 감지 활성화 (기본 true). false 면 선 기반 그리드·클러스터 표 감지를 모두 끄고
     * 자연 읽기순 텍스트만 뽑는다 (#64).
     *
     * 시각적 테두리 박스(시험지 안내문·보기 상자)가 표로 잡히면 주변 본문이 셀 매핑으로
     * 끌려 들어가 문항 순서가 뒤집히는데, 표가 애초에 필요 없는 텍스트 중심 사용처에는
     * 우회 수단이 없었다. 표가 실제로 있는 문서에 켜면 표 구조가 문단으로 흩어지므로
     * 문서 종류를 아는 호출자만 쓰는 opt-out 이다. PDF 전용 — 다른 포맷은 무시.
     */
    tables?: boolean;
}
/** 파싱 중 스킵/실패한 요소 보고 */
interface ParseWarning {
    /** 관련 페이지 번호 (알 수 있는 경우) */
    page?: number;
    /** 경고 메시지 */
    message: string;
    /** 구조화된 경고 코드 */
    code: WarningCode;
}
type WarningCode = "SKIPPED_IMAGE" | "SKIPPED_OLE" | "TRUNCATED_TABLE" | "OCR_FALLBACK" | "UNSUPPORTED_ELEMENT" | "BROKEN_ZIP_RECOVERY" | "HIDDEN_TEXT_FILTERED" | "MALFORMED_XML" | "PARTIAL_PARSE" | "LENIENT_CFB_RECOVERY" | "NEEDS_OCR" | "OCR_FAILED" | "OCR_APPLIED" | "OCR_LOW_CONF" | "COM_EMPTY" | "DRM_COM_FALLBACK"
/** pages 옵션 요청됐으나 조판 캐시가 없어 섹션 단위 근사로 적용됨 (#66) */
 | "PAGE_BOUNDARY_APPROXIMATE";
/** 문서 구조 (헤딩 트리) */
interface OutlineItem {
    level: number;
    text: string;
    pageNumber?: number;
}
/** 구조화된 에러 코드 — 프로그래밍적 에러 핸들링용 */
type ErrorCode = "EMPTY_INPUT" | "UNSUPPORTED_FORMAT" | "ENCRYPTED" | "DRM_PROTECTED" | "CORRUPTED" | "DECOMPRESSION_BOMB" | "ZIP_BOMB" | "IMAGE_BASED_PDF" | "NO_SECTIONS" | "PARSE_ERROR" | "MISSING_DEPENDENCY"
/** 결과 직렬화가 런타임 문자열 한계를 넘음 — 이미지 다량 문서의 JSON 출력 (#65) */
 | "OUTPUT_TOO_LARGE"
/** 입력 경로가 존재하지 않음(ENOENT) — 문서 파싱 이전 단계의 실패 */
 | "FILE_NOT_FOUND";
/** 감지된 파일 형식 */
type FileType = "hwpx" | "hwp" | "hwp3" | "hwpml" | "pdf" | "xlsx" | "xls" | "docx" | "pptx" | "image" | "unknown";
interface ParseResultBase {
    fileType: FileType;
    /** 페이지/섹션 수 — PDF: 실제 페이지 수, HWP/HWPX: 섹션 수, XLSX: 시트 수 */
    pageCount?: number;
    /** 이미지 기반 PDF 여부 (텍스트 추출 불가) */
    isImageBased?: boolean;
}
interface ParseSuccess extends ParseResultBase {
    success: true;
    /** 추출된 마크다운 텍스트 */
    markdown: string;
    /**
     * 중간 표현 블록 (구조화된 데이터 접근용).
     * 블록은 문서(원문) 읽기 순서를 따른다 — 한 문단 안에 글자취급(treatAsChar)
     * 표와 텍스트가 섞여 있어도 배치 순서대로 방출된다 (v4.2.3, #50).
     */
    blocks: IRBlock[];
    /** 문서 메타데이터 */
    metadata?: DocumentMetadata;
    /** 문서 구조 (헤딩 트리) — v2.0 */
    outline?: OutlineItem[];
    /** 파싱 중 발생한 경고 — v2.0 */
    warnings?: ParseWarning[];
    /** 추출된 이미지 목록 — 마크다운에서 파일명으로 참조됨 */
    images?: ExtractedImage[];
    /**
     * 페이지별 마크다운 (#68) — `blocks` 의 `pageNumber` 로 갈라 페이지마다 다시
     * 마크다운을 만든 것. 페이지 경계의 신뢰도는 `metadata.pageMode` 를 따른다
     * ("layout" = 실제 페이지, "section" = 섹션 근사). `pages` 옵션으로 범위를
     * 줄이면 그 범위만 담긴다. 페이지 번호를 매기지 않는 포맷(DOCX 등)에서는 없고,
     * XLSX 는 `pageCount` 와 같은 의미로 시트 한 장이 한 쪽이다.
     *
     * 여러 페이지에 걸친 표는 시작 페이지 한 블록이라, 표가 이어지는 중간
     * 페이지의 `markdown` 은 빈 문자열일 수 있다 (현 IR 구조의 한계).
     */
    pages?: PageMarkdown[];
    /** 페이지별 텍스트 품질 신호 — PDF에서만 제공 */
    pageQuality?: PageQuality[];
    /** 문서 단위 품질 요약 — PDF에서만 제공 */
    qualitySummary?: DocumentQualitySummary;
}
/** 페이지 한 장의 마크다운 (#68). ParseSuccess.pages 항목. */
interface PageMarkdown {
    /** 원본 페이지 번호 (1-based) */
    pageNumber: number;
    /** 그 페이지 블록만으로 만든 마크다운. 블록이 없으면 빈 문자열 */
    markdown: string;
}
/** 페이지별 텍스트 품질 신호 (PDF 전용). 자세한 설명은 src/pdf/quality.ts */
interface PageQuality {
    page: number;
    textChars: number;
    hangulRatio: number;
    controlCharRatio: number;
    replacementCharRatio: number;
    puaRatio: number;
    needsOcr: boolean;
    ocrReason?: "vector_text" | "low_text" | "high_pua" | "high_control" | "high_replacement" | "garbled_hangul";
}
/** 문서 단위 품질 요약 (PDF 전용). */
interface DocumentQualitySummary {
    totalPages: number;
    totalTextChars: number;
    avgHangulRatio: number;
    avgControlCharRatio: number;
    avgReplacementCharRatio: number;
    avgPuaRatio: number;
    lowTextPageCount: number;
    highPuaPageCount: number;
    needsOcr: boolean;
    ocrCandidatePages: number[];
}
/** 추출된 이미지 — ParseSuccess.images에 포함 */
interface ExtractedImage {
    /** 마크다운에서 참조되는 파일명 (예: image_001.png) */
    filename: string;
    /** 이미지 바이너리 */
    data: Uint8Array;
    /** MIME 타입 */
    mimeType: string;
    /** 원본 컨테이너 내 항목명 (HWPX/DOCX ZIP 경로, HWP5 BinData 스토리지명 — PDF 등 합성 이미지는 없음, #70) */
    source?: string;
}
interface ParseFailure extends ParseResultBase {
    success: false;
    /** 오류 메시지 */
    error: string;
    /** 구조화된 에러 코드 */
    code?: ErrorCode;
}
type ParseResult = ParseSuccess | ParseFailure;
type DiffChangeType = "added" | "removed" | "modified" | "unchanged";
interface BlockDiff {
    type: DiffChangeType;
    /** 원본 블록 (added이면 undefined) */
    before?: IRBlock;
    /** 변경 후 블록 (removed이면 undefined) */
    after?: IRBlock;
    /** modified 테이블의 셀 단위 diff */
    cellDiffs?: CellDiff[][];
    /** 유사도 (0-1) */
    similarity?: number;
}
interface CellDiff {
    type: DiffChangeType;
    before?: string;
    after?: string;
}
interface DiffResult {
    stats: {
        added: number;
        removed: number;
        modified: number;
        unchanged: number;
    };
    diffs: BlockDiff[];
}
/** 패치 중 매핑 실패/미지원으로 건너뛴 항목 — silent 실패 금지 */
interface PatchSkip {
    /** 건너뛴 사유 */
    reason: string;
    /** 원본 쪽 내용 요약 (최대 80자) */
    before?: string;
    /** 편집 쪽 내용 요약 (최대 80자) */
    after?: string;
    /**
     * 부분 적용 표시 — 변경이 적용은 됐지만(applied 계상) 편집 원형 그대로는
     * 아님 (예: 셀 내 줄 추가를 마지막 문단에 병합). 완전 미적용 skip과 구분.
     */
    partial?: boolean;
}
/** patchHwpx 옵션 */
interface PatchOptions {
    /** 패치 후 재파싱 자동 검증 (기본 true) */
    verify?: boolean;
}
/** patchHwpx / patchBlocks 결과 */
interface PatchResult {
    success: boolean;
    /** 패치된 HWPX (success=true) */
    data?: Uint8Array;
    /** 적용된 변경 수 */
    applied: number;
    /** 매핑 실패 항목 (이유 포함) */
    skipped: PatchSkip[];
    /**
     * 무손실 검증 (patchHwpx/patchHwp 전용): 패치본 재파싱 vs 편집 마크다운의
     * 잔차 diff — modified/added/removed가 0이어야 의도가 전부 반영된 것.
     * session.patchBlocks는 이 필드를 채우지 않는다 (changes 참조).
     */
    verification?: DiffResult;
    /**
     * 변경 가시화 (session.patchBlocks 전용): 패치 전 → 후 문서 diff —
     * 적용된 편집 수만큼 modified가 나오는 것이 정상. verification과 의미가
     * 정반대이므로 혼용 금지.
     */
    changes?: DiffResult;
    /** 실패 사유 (success=false) */
    error?: string;
}
interface FormField {
    label: string;
    value: string;
    /** 0-based 소스 행 */
    row: number;
    /** 0-based 소스 열 */
    col: number;
    /** 매칭된 입력 키(정규화) — 모호 라벨 거부 가드(fillWithUniqueGuard)의 집계 기준 */
    key?: string;
    /** 매칭 근거. `clickhere`(누름틀 name 정확 일치)는 서식 제작자가 선언한 계약이라
     *  여러 곳에 같은 이름이 있어도 "모호"가 아니다 — 모호 라벨 거부 집계에서 제외된다.
     *  (머리말·본문에 같은 이름의 누름틀을 두는 서식이 실제로 있다) */
    source?: "clickhere";
}
interface FormResult {
    fields: FormField[];
    /** 양식 확신도 (0-1) */
    confidence: number;
}
/** 사용자 제공 OCR 함수 — 페이지 이미지를 받아 텍스트 반환.
 *  PDF 경로는 항상 "image/png", 이미지 직접 입력 경로는 원본 mime 그대로 전달. */
type OcrProvider = (pageImage: Uint8Array, pageNumber: number, mimeType: "image/png" | "image/jpeg" | "image/webp") => Promise<string>;
interface WatchOptions {
    dir: string;
    outDir?: string;
    webhook?: string;
    format?: "markdown" | "json";
    pages?: string;
    silent?: boolean;
}

/** 양식 필드 매칭 공용 유틸 — filler.ts, filler-hwpx.ts에서 공유 */
/**
 * 채울 값 — 문자열이면 같은 라벨 모든 등장에 동일값(단일 양식),
 * 배열이면 등장 순서대로 하나씩 소진(2~30장 반복 양식·명부형 표).
 */
type FillValue = string | string[];
/**
 * 채울 값 입력 — 값만 주거나, 서식 변환(format)을 함께 지정한다.
 * 프로필엔 정준값 하나(생년월일 "19900315"), 서식마다 모양이 다를 때
 * format이 도구 안에서 변환한다 (claw-hwp secure-fill 포맷엔진 이식).
 */
type FillInput = FillValue | {
    value: FillValue;
    format?: string;
};
/**
 * 값 서식 변환 — `종류:스타일` 접두형(date:/phone:/rrn:/mask:/digits/upper/lower/nospace)
 * 또는 접두 없는 자유 패턴(`#` 포함 → 숫자마스크, yyyy·yy·mm·dd 포함 → 날짜 토큰).
 * 모르는 포맷은 값 원형 반환 (fail-open — 채움 자체는 진행).
 */
declare function formatFillValue(value: string, format?: string): string;
/**
 * 다중값 커서 — 라벨별 값 소비 상태를 추적한다.
 * 스칼라 값은 무한 반복(기존 동작), 배열 값은 적용 순서대로 소진되며
 * 다 쓰면 available=false가 되어 이후 등장은 채우지 않는다.
 */
declare class ValueCursor {
    private values;
    private nextIdx;
    constructor(values: Map<string, FillValue>);
    keys(): IterableIterator<string>;
    has(key: string): boolean;
    isArray(key: string): boolean;
    /** 남은 값이 있으면 true (스칼라는 항상 true) */
    available(key: string): boolean;
    /** 현재 값 미리보기 (소진 없음) */
    peek(key: string): string | undefined;
    /** 값 소비 — 배열이면 커서 전진, 소진 시 undefined */
    consume(key: string): string | undefined;
}
/**
 * 모호 라벨 거부 가드 — 한 입력 키(스칼라)가 서식의 2곳 이상에 채워지면 남의 블록
 * 오염 위험(대표자 행에 참여인력 값이 들어가는 류)이므로, 그 키는 채우지 않고
 * rejected로 보고한 뒤 나머지 키만으로 다시 채운다 (claw-hwp require_occurrence 이식).
 * 배열 값은 다중 등장 소진이 의도된 동작이라 거부 대상이 아니다.
 * @param run 같은 원본에 대해 결정적으로 재실행 가능한 채우기 함수
 */
declare function fillWithUniqueGuard<R extends {
    filled: Array<{
        key?: string;
        label: string;
    }>;
}>(values: Record<string, FillInput>, run: (vals: Record<string, FillInput>, blockedLabels?: Set<string>) => R | Promise<R>): Promise<R & {
    rejected: string[];
}>;

/** 문서 비교 엔진 — IR 레벨 블록 비교로 신구대조표 생성 */

/**
 * 두 문서를 비교하여 블록 단위 diff 생성.
 * 크로스 포맷 지원 — HWP vs HWPX 비교 가능 (IR 레벨).
 */
declare function compare(bufferA: ArrayBuffer, bufferB: ArrayBuffer, options?: ParseOptions): Promise<DiffResult>;
/** IRBlock[] 간 diff — LCS 기반 정렬 */
declare function diffBlocks(blocksA: IRBlock[], blocksB: IRBlock[]): DiffResult;

/** 양식(서식) 필드 인식 — 테이블 기반 label-value 패턴 매칭 */

/** 라벨처럼 보이는 셀인지 판별 */
declare function isLabelCell(text: string): boolean;
/**
 * IRBlock[]에서 양식 필드를 인식하여 추출.
 * 테이블의 label-value 패턴을 감지.
 */
declare function extractFormFields(blocks: IRBlock[]): FormResult;
/** 양식 필드 타입 — 폼 UI 위젯 선택의 근거 (데이트피커/체크박스 등) */
type FormFieldType = "text" | "date" | "phone" | "email" | "amount" | "checkbox" | "idnum";
/** 타입이 추론된 양식 필드 */
interface FormFieldSchema extends FormField {
    type: FormFieldType;
    /** 라벨에 필수 표시(※·*·★·"(필수)")가 있을 때만 true */
    required?: boolean;
    /** 값이 비어 있거나 플레이스홀더(밑줄/괄호 빈칸)뿐 — 채움 대상 */
    empty: boolean;
}
interface FormSchemaResult {
    fields: FormFieldSchema[];
    /** 양식 확신도 (0-1, extractFormFields와 동일) */
    confidence: number;
}
/** 필드 타입 추론 — 기존 값의 패턴 우선, 없으면 라벨 키워드 */
declare function inferFieldType(label: string, value: string): FormFieldType;
/**
 * 양식 필드 인식 + 타입/필수/빈값 추론 — 폼 UI 자동 생성용 (v3.1).
 * extractFormFields 결과에 type(date/phone/amount/checkbox/...)·required·empty를 부여한다.
 */
declare function extractFormSchema(blocks: IRBlock[]): FormSchemaResult;

/** 양식 서식 필드 값 채우기 — IRBlock[] 기반 in-place 교체 */

/** 필드 채우기 결과 */
interface FillResult {
    /** 값이 교체된 IRBlock[] */
    blocks: IRBlock[];
    /** 실제 채워진 필드 목록 */
    filled: FormField[];
    /** 매칭 실패한 라벨 (입력에는 있지만 서식에서 못 찾은 것) */
    unmatched: string[];
    /** 비치명 경고 (입력 라벨 정규화 충돌 등) — 없으면 생략 */
    warnings?: string[];
}
/**
 * IRBlock[]에서 양식 필드를 찾아 값을 교체.
 *
 * @param blocks 원본 IRBlock[] (변경하지 않음 — deep clone)
 * @param values 채울 값 맵 (라벨 → 새 값). 라벨은 접두사 매칭 지원.
 *   값이 배열이면 같은 라벨의 등장 순서대로 하나씩 소진(반복 양식·명부형 표),
 *   문자열이면 모든 등장에 동일값.
 * @returns FillResult
 *
 * @example
 * ```ts
 * const result = await parse("신청서.hwp")
 * if (!result.success) throw new Error(result.error)
 * const { blocks, filled } = fillFormFields(result.blocks, {
 *   "성명": "홍길동",
 *   "전화번호": "010-1234-5678",
 *   "주소": "서울시 강남구",
 * })
 * ```
 */
declare function fillFormFields(blocks: IRBlock[], values: Record<string, FillInput>, 
/** require_unique 2차에서 거부된 라벨 셀 차단 (sfill-2) — hwpx 경로와 동일 계약 */
blockedLabels?: Set<string>): FillResult;

/**
 * HWPX 원본 서식 유지 채우기 — section XML 오프셋 splice (v3.1, 바이트 보존)
 *
 * v3.0까지는 xmldom 전체 재직렬화 방식이라 변경하지 않은 영역도 속성 순서·
 * 공백·자기닫힘 표기가 바뀔 수 있었다. v3.1부터 patchHwpx와 동일한
 * source-map splice + ZIP in-place 재조립을 사용해, 변경 문단 외 XML과
 * 비변경 ZIP 엔트리를 1바이트도 건드리지 않는다.
 *
 * 전략 (v3.0과 동일, 적용 순서 보존):
 * 0. 인셀 패턴 — 체크박스 □→☑, 괄호 빈칸 (  )→(값), 어노테이션 (한자：)→(한자：값)
 * 1. 인접 라벨-값 셀 — label | value (패턴 적용 셀은 값을 앞에 삽입해 어노테이션 보존)
 * 2. 헤더+데이터 행 — 첫 행이 전부 라벨이면 열 단위 매칭 (나중 쓰기 우선 — v3.0 동일)
 * 3. 인라인 "라벨: 값" — 표 밖 본문/글상자/머리말·꼬리말·각주 문단
 *
 * 적용 범위는 v3.0과 동일하게 머리말/꼬리말 등 ctrl 내부 표·문단을 포함하고
 * (scan.orphanTables/excludedParagraphs), 셀 라벨 판정은 v3.0과 동일하게
 * 글상자(drawText) 문단을 제외한다. 패턴 매칭·범위 치환은 hp:t 연결 텍스트
 * (t-도메인) 좌표로 수행해 사이에 끼인 tab/br 요소를 건드리지 않는다.
 *
 * v3.0과의 의도적 차이: 인셀 패턴(전략 0)은 문단 단위로 매칭한다 — 문단
 * 경계에 걸친 패턴(극히 드묾)은 채우지 않는다.
 */

/** 채우기 결과 */
interface HwpxFillResult {
    /** 채워진 HWPX 바이너리 */
    buffer: ArrayBuffer;
    /** 실제 채워진 필드 목록 */
    filled: FormField[];
    /** 매칭 실패한 라벨 */
    unmatched: string[];
    /** 비치명 경고 (입력 라벨 정규화 충돌 등) — 없으면 생략 */
    warnings?: string[];
}
/**
 * HWPX 원본을 직접 수정하여 서식 필드를 채움 — 스타일 100% 보존.
 *
 * @param hwpxBuffer 원본 HWPX 파일 버퍼
 * @param values 채울 값 맵 (라벨 → 값). 값이 배열이면 같은 라벨의 등장 순서대로
 *   하나씩 소진된다 — 2~30장 반복 양식·명부형 표(헤더+여러 데이터 행) 채우기용.
 *   문자열이면 기존처럼 모든 등장에 동일값.
 * @returns HwpxFillResult
 */
declare function fillHwpx(hwpxBuffer: ArrayBuffer, values: Record<string, FillInput>, 
/** 이 정규화 라벨의 셀은 어떤 키로도 채우지 않음 — require_unique 2차에서 거부된
 *  라벨 셀이 접두사 매칭으로 남의 값에 오염되는 것을 차단 (sfill-2) */
blockedLabels?: Set<string>): Promise<HwpxFillResult>;

/**
 * 누름틀(CLICK_HERE fieldBegin) 인식·채우기 — 정부 표준 서식(기안문) 지원
 *
 * HWPX의 누름틀은 `<hp:ctrl><hp:fieldBegin type="CLICK_HERE" name="…">…</hp:fieldBegin>
 * </hp:ctrl>` 과 `<hp:ctrl><hp:fieldEnd beginIDRef="…"/></hp:ctrl>` 쌍으로 표시되고,
 * 실제 값은 두 ctrl **사이의** run 콘텐츠다. 안내문(placeholder)은 fieldBegin의
 * Clickhere Command 파라미터에만 있고 본문 텍스트가 아니므로, 채우기는 안내문과
 * 값을 비교하지 않고 무조건 사이 영역을 값으로 치환한다 — 값이 안내문과 동일해도
 * 침묵 유실이 없다 (rhwp 코어 결함 #3380 교훈).
 *
 * 치환은 filler-hwpx와 같은 철학의 원본 XML splice — fieldEnd·안내문 파라미터·둘러싼
 * run(charPr)을 1바이트도 건드리지 않고 사이 영역만 바꾼다. 값을 넣으면 fieldBegin 의 수정
 * 표시(dirty)만 "1" 로 켠다 — 미수정(dirty=0) 필드의 값이 안내문과 같으면 한컴은 화면에만 흐리게
 * 보이고 인쇄하지 않으며 kordoc 파서도 그렇게 읽는다(v4.14.3). 한컴이 직접 채운 필드도 dirty=1.
 */

/** 문서에서 발견한 누름틀 필드 */
interface ClickHereField {
    /** 누름틀 이름 (fieldBegin name 속성) */
    name: string;
    /** 안내문 — 필드가 비어 있을 때 한글이 표시하는 문구 (Clickhere Direction 파라미터) */
    placeholder?: string;
    /** begin~end 사이 현재 텍스트 — 빈 서식이면 "" (안내문은 값이 아니다) */
    value: string;
    /** 0-based 섹션 번호 */
    section: number;
}
/**
 * HWPX의 CLICK_HERE 누름틀 필드 목록 — 이름·안내문·현재값을 문서 순서로 반환.
 * 표준 서식(기안문 등)이 요구하는 필드를 채우기 전에 조사하는 용도.
 */
declare function extractClickHereFields(hwpxBuffer: ArrayBuffer): Promise<ClickHereField[]>;

/**
 * 내장 표준 서식 템플릿 — 정부 표준 기안문 (rhwp tools/forms 자산, MIT)
 *
 * templates/ 디렉토리의 누름틀(CLICK_HERE) 내장 HWPX 서식을 이름으로 제공한다.
 * 서식 원본은 「행정 효율과 협업 촉진에 관한 규정 시행규칙」 별지 제1·2호서식
 * (어트리뷰션: THIRD_PARTY/rhwp-forms.txt).
 */
/** 내장 템플릿 메타데이터 */
interface BuiltinTemplate {
    /** 영문 식별자 — CLI/MCP에서 쓰는 정식 이름 */
    id: string;
    /** 한글 별칭 (`templates:일반기안문` 표기 포함 매칭) */
    aliases: string[];
    /** templates/ 안의 서식 파일명 */
    file: string;
    /** templates/ 안의 예시값 JSON 파일명 */
    sampleFile: string;
    /** 한 줄 소개 */
    title: string;
}
declare const BUILTIN_TEMPLATES: readonly BuiltinTemplate[];
/**
 * 이름/별칭으로 내장 템플릿 해석 — `templates:` 접두사 허용.
 * 예: "gian", "gian-simple", "일반기안문", "templates:간이기안문"
 */
declare function resolveBuiltinTemplate(name: string): BuiltinTemplate | undefined;
/** 내장 템플릿 HWPX 버퍼 읽기 */
declare function readBuiltinTemplate(t: BuiltinTemplate): ArrayBuffer;
/** 내장 템플릿 예시값 JSON 읽기 */
declare function readBuiltinTemplateSample(t: BuiltinTemplate): Record<string, string>;

/**
 * place_seal — 도장/서명 이미지를 앵커 문구("(인)"·"서명 또는 인" 등) 위에
 * 부유(글 앞) 배치. 표/페이지 불확장 (P6, claw-hwp placeSeal 이식).
 *
 * 원리:
 * - 앵커 문구가 든 문단을 찾아 그 문단에 <hp:pic> 부유 개체를 anchor 한다.
 *   핵심 속성: treatAsChar="0" + flowWithText="0" + allowOverlap="1" +
 *   textWrap="IN_FRONT_OF_TEXT" — flowWithText="1"이면 한컴이 개체 높이만큼
 *   셀/페이지를 키운다 (claw-hwp GT 검증 규칙).
 * - 수평 위치는 폰트 메트릭으로 계산: 전각(한글/CJK)=1em, ASCII·반각=0.5em,
 *   em = 앵커 run charPr 높이(1/100pt). 렌더 없이 배치하고 렌더는 검증용.
 * - 가운데/오른쪽 정렬 문단(서식 셀에 흔함)은 블록 전체가 밀리므로
 *   (사용가능폭 − 문단폭)의 정렬 이동분을 x에 더한다.
 * - 위치 프레임은 PARA(문단 좌상단 기준) — 한컴은 문단 위로는 못 올라가게
 *   클램프하므로, 여유 공간이 있는 표 셀에서는 줄 세로 중앙에 앉고 본문
 *   최상단 줄에서는 상단 정렬로 눕는다.
 *
 * 적용 범위: 본문/표 셀/글상자 문단 (머리말·꼬리말·각주 내 앵커는 제외).
 * ZIP 재조립은 patchZipEntries — 비변경 엔트리는 1바이트도 건드리지 않고,
 * 도장 PNG는 BinData 신규 엔트리 + manifest(opf:item) 등재로 추가한다.
 */
/** 도장 배치 요청 */
interface SealOp {
    /** 앵커 문구 (예: "(인)", "서명 또는 인") */
    anchor: string;
    /** 같은 앵커가 여럿일 때 0-based 선택 (기본 0) */
    occurrence?: number;
    /** 도장/서명 이미지 바이트 (투명 배경 PNG 권장) */
    image: Uint8Array;
    /** 이미지 확장자 (기본 png) */
    ext?: "png" | "jpg" | "jpeg" | "bmp" | "gif";
    /** 도장 한 변 크기 mm (기본: 줄높이×1.6, 7~18mm 클램프) */
    sizeMm?: number;
    /** overlap=문구 위에 겹침, right=문구 오른쪽 옆, auto=공간 있으면 right (기본 auto) */
    mode?: "overlap" | "right" | "auto";
    /** 미세조정 mm */
    dxMm?: number;
    dyMm?: number;
}
/** 배치 결과 (도장 1개당 1건) */
interface SealPlacement {
    anchor: string;
    occurrence: number;
    sectionIndex: number;
    mode: "overlap" | "right";
    posXMm: number;
    posYMm: number;
    sizeMm: number;
    /** ZIP에 추가된 이미지 파트 경로 (BinData/imageN.ext) */
    entry: string;
    /** 근사 한계 경고 — 탭·줄바꿈 문단(seal-8), 중첩표(seal-2), 글상자(seal-3). 실측 전 근사. */
    warnings?: string[];
}
interface PlaceSealResult {
    buffer: ArrayBuffer;
    placed: SealPlacement[];
}
/**
 * HWPX에 도장/서명 이미지를 앵커 문구 기준으로 부유 배치한다.
 *
 * @param hwpxBuffer 원본 HWPX
 * @param ops 도장 배치 요청 (여러 개 가능 — 같은 이미지 재사용 시에도 op마다 파트가 추가됨)
 * @throws KordocError 앵커 미발견 (본문 내 등장 횟수를 메시지에 포함)
 */
declare function placeSealHwpx(hwpxBuffer: ArrayBuffer, ops: SealOp[]): Promise<PlaceSealResult>;

/** 요소별 글자 크기(pt) 오버라이드 — 미지정 요소는 bodyHeight 비례 기본값 */
type GaejosikSizeOverrides = Partial<{
    dae: number;
    cham: number;
    chapter: number;
    coverTitle: number;
    coverSub: number;
    tocLabel: number;
    tocRoman: number;
    tocItem: number;
    table: number;
    bodyTitle: number;
}>;

/**
 * 공문서(公文書) 모드 — 한국 행정 공문서 표준 서식 렌더링 로직
 *
 * 근거: 「행정업무의 운영 및 혁신에 관한 규정」 및 동 시행규칙(제2조 항목 표시),
 *       행정안전부 「2020 행정업무운영 편람」.
 * 자세한 표준은 docs/gongmunseo-reference.md, 구현 매핑은 docs/gongmunseo-engine-spec.md 참조.
 *
 * 이 모듈은 **순수 로직**만 담는다(항목부호 시퀀스 생성, 단계별 들여쓰기 계산,
 * 프리셋 해석). 실제 XML 조립은 generator.ts가 한다.
 */

type GongmunPreset = "official" | "report" | "plan" | "notice" | "minutes" | "gaejosik" | "press" | "ministry" | "bangchim";
type GongmunNumbering = "standard" | "report" | "gaejosik";
type GongmunFont = "myeongjo" | "gothic";
/** 프리셋 입력값 — 영문 키 또는 한글 별칭(기안문·보고서·계획서·통지·회의록 등) */
type GongmunPresetInput = GongmunPreset | "기안문" | "시행문" | "공문" | "공문서" | "보고서" | "계획서" | "계획" | "통지" | "알림" | "안내" | "회의록" | "개조식" | "개조식보고서" | "정부보고서" | "정부표준개조식보고서" | "보도자료" | "업무보고" | "부처업무보고" | "중앙부처보고서" | "서울방침" | "방침서" | "방침";
/** 항목부호 단계 하나의 타이포 — 셋 다 선택(미지정=본문 계열 유지) */
interface GongmunLevelStyle {
    /** 글꼴명 (예: HY견고딕·한컴돋움·휴먼명조) */
    font?: string;
    /** 글자 크기 pt (6~60) */
    pt?: number;
    /** 굵게 */
    bold?: boolean;
}
/** 공문서 모드 옵션 (전부 선택 — 프리셋 기본값을 개별 override) */
interface GongmunOptions {
    /** 문서 종류 프리셋(영문 키 또는 한글 별칭). 기본 'official'(일반 기안문) */
    preset?: GongmunPresetInput;
    /** 본문 글꼴. 'myeongjo'=함초롬바탕(명조, 보고서·대외공문 관행) / 'gothic'=맑은 고딕(전자결재 기본) */
    bodyFont?: GongmunFont;
    /** 본문 글자 크기(pt). 기본: 기안문 12, 보고서·계획서·통지 15 */
    bodyPt?: number;
    /** 본문 줄간격(%). 기본 160 (회의록 130) */
    lineSpacing?: number;
    /** 항목부호 체계. 'standard'=법정 8단계(1. 가. 1) …) / 'report'=보고서 불릿(□ ○ - ㆍ) / 'gaejosik'=개조식(□ ○ - ㆍ + 부호별 폰트) */
    numbering?: GongmunNumbering;
    /**
     * 표지 페이지(개조식·업무보고 프리셋 기본 켜짐) — 첫 h1을 제목으로, 파랑 장식 바 + 날짜 + 기관명.
     * false로 끄거나 {date, org}로 날짜(기본 오늘, 'YYYY. M. D.')·기관명(기본 생략) 지정.
     * label = 표지 우상단 취급 표시("대외주의"·"비공개" — 업무보고 프리셋, 빨간 테두리 박스).
     */
    cover?: boolean | {
        date?: string;
        org?: string;
        dept?: string;
        label?: string;
    };
    /** 목차 페이지(개조식 프리셋 기본 켜짐) — h2 목록을 Ⅰ Ⅱ Ⅲ…로 자동 생성. false로 끔 */
    toc?: boolean;
    /** 용지 여백(mm). 기본 공식값 위20/아래10/좌20/우20 */
    margins?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    /** 문서 제목(첫 h1)을 가운데 정렬. 기본 true (행정기관명·보고서 제목) */
    centerTitle?: boolean;
    /**
     * 문단별 자동 장평 — 한두 글자(짧은 꼬리)만 다음 줄로 넘어가는 문단의 장평을
     * 95→90%까지 자동 축소해 한 줄에 담는다(공무원 실무 관행의 자동화).
     * false로 끄거나 minRatio(기본 90)로 하한 조정. 기본 켜짐.
     */
    autoFit?: boolean | {
        minRatio?: number;
    };
    /**
     * 요소별 글꼴 오버라이드 — 기관 표준 폰트 적용이나 미설치 폰트 대체용.
     * body=본문(개조식 ○·-) / heading=제목 계열(□·장헤더·표지·목차) / ref=※ 참고 / table=표 셀.
     * 실측 폰트 프리셋(개조식·보고서·계획서)은 네 역할 전부, 그 외 프리셋은 body만
     * 적용된다 (bodyFont보다 우선).
     */
    fonts?: {
        body?: string;
        heading?: string;
        ref?: string;
        table?: string;
    };
    /** 개조식 요소별 글자 크기(pt) 오버라이드 — 미지정 요소는 bodyPt 비례 기본값 */
    sizes?: GaejosikSizeOverrides;
    /**
     * 항목부호 단계별 위계 타이포(v4.12.3) — depth(0~7)마다 글꼴·크기(pt)·굵기를 지정한다.
     * 실측(실결재 기안문 206 + 보고서 337건): 법정 8단계(1. 가. 1))는 본문과 동일이 90%라 기본은
     * 무변경, □/ㅇ/- 계열 전자결재 기안문은 □=HY견고딕 +2~3pt bold·ㅇ=한컴돋움 bold·-=휴먼명조가
     * 지배 관행이다(docs/gongmunseo-reference.md 2.7). 지정한 단계만 바뀌고 나머지는 본문 계열.
     * 개조식·보고서의 실측 □(HY헤드라인M)·보도자료 각주보다 우선한다(명시 옵션).
     */
    levels?: Record<number | string, GongmunLevelStyle>;
    /** 쪽번호(하단 중앙 "- 1 -", 표지·목차는 카운트 제외). 기본: 개조식·보고서·계획서 켜짐 */
    pageNumbers?: boolean;
    /** 본문 끝 2타+"끝." 표시(행정업무규정). 기본: 기안문(official)만 켜짐 */
    endMark?: boolean;
    /** 결재란 — 직위 라벨 배열(예: ["담당","팀장","과장"]). 문서 최상단 우측 배치 */
    approval?: string[];
    /** 본문 첫 페이지 제목 박스(개조식) — 목차 뒤 본문 시작에 제목 반복(실측 관행). 기본: 표지 있으면 켜짐 */
    bodyTitleBox?: boolean;
    /** 개조식 장 헤더 제목 칸을 글자 폭에 맞춤. 기본: 꺼짐(제목 칸이 본문 폭까지) */
    chapterFit?: boolean;
    /**
     * h2 장 제목 표기 (v5): 'band'=로마자 채움 칸 + 제목 띠 표(보고서·계획서 기본 — 계획서 장르 실측 37~39%) /
     * 'roman'=Ⅰ. Ⅱ. 텍스트 / 'number'=1. 2. (통지 기본) / 'box'=장 없이 □ 대항목으로 / 'none'=번호 없음 /
     * 'square'=[Ⅰ] 테두리 번호 상자 + 위아래 괘선 제목(서울 방침서 기본).
     * 기안문 본문의 h2는 항상 법정 1. 항목.
     */
    h2Marker?: "band" | "roman" | "box" | "number" | "none" | "square";
    /**
     * 띠 제목(h2Marker 'band') 번호칸 채움색 `#RRGGBB` — 기본 #003366(서울 plan 띠 표 실측 최다).
     * 교육청형 밝은 띠는 `bandColor: "#DFE6F7", bandTextColor: "#000000"`.
     */
    bandColor?: string;
    /** 띠 제목 번호 글자색 `#RRGGBB` — 기본 #FFFFFF */
    bandTextColor?: string;
    /**
     * 2단계 항목부호 — 'ㅇ'(이응, 전자결재 기안문·공고문 실측 지배) / '○'(원, 보고서
     * 양식 계열 실측). 기본: notice·press 'ㅇ', 그 외 '○' (v4.1.0 실결재 60건 분포).
     */
    bullet2?: "ㅇ" | "○";
    /**
     * 단일 형제 항목 부호 생략(편람 규정: 항목이 하나면 부호 미부여). 기본 false —
     * 부호 없는 계단 들여쓰기가 실무 눈에 더 어색하다(실무자 QA, v4.0.2).
     * 규정 엄수가 필요하면 true. 법정 번호(standard) 전용 — 불릿 체계(report·gaejosik)엔
     * 적용되지 않으므로, 기본 numbering이 report인 plan 프리셋은 numbering:'standard' 병기 필요.
     */
    suppressSingle?: boolean;
    /** 기안문 두문표 — 행정기관명·(원훈 slogan)·수신·경유·제목 (별지 제1호서식·서울 실결재 6행 표, official 전용) */
    docHead?: {
        org?: string;
        slogan?: string;
        to?: string;
        via?: string;
        title?: string;
    };
    /**
     * 기안문 결문표 — 발신명의·결재선(기안/검토/결재 또는 approvers 배열 "직위 성명")·협조자·수신자·
     * 시행/접수·우편번호(zip)·주소·홈페이지·전화·전송·이메일·공개구분 (official 전용)
     */
    docFoot?: {
        sender?: string;
        drafter?: string;
        reviewer?: string;
        approver?: string;
        approvers?: string[];
        cooperator?: string;
        recipients?: string;
        docNum?: string;
        receive?: string;
        zip?: string;
        address?: string;
        site?: string;
        phone?: string;
        fax?: string;
        email?: string;
        disclosure?: string;
    };
    /** 보고서 요약 박스(제목표 아래 #DFE6F7 상자, 서울 실결재) — 마크다운 제목 직후 인용문(>)으로도 지정 가능 */
    summary?: string;
    /** 보고서 표지 문서정보표 — 문서번호·결재일자·공개여부·방침번호 (cover와 함께) */
    docInfo?: {
        docNum?: string;
        date?: string;
        disclosure?: string;
        policyNo?: string;
    };
    /**
     * 서울 사전 검토항목 점검표(표지 다음 쪽 — 서울 시장방침 16건 모두 실측) — 보고서·계획서·방침서 전용.
     * true = 표시 없는 빈 서식. 객체면 na 에 적은 문항(1~14)은 해당없음 ■, 나머지는 검토완료 ■, notes = 문항 번호별 비고 글
     */
    checklist?: boolean | {
        na?: number[];
        notes?: Record<number, string>;
    };
    /** 업무보고 우상단 보고정보 행 — "(보고일시, 보고자, 연락처)" (실측 t3: 휴먼명조 12pt RIGHT) */
    reportInfo?: string;
    /** 공고문 두문·결문 — 공고번호(본문 위)·날짜·발신명의(본문 아래 우측, 실측 바이오헬스 공고) */
    noticeHead?: {
        no?: string;
        date?: string;
        sender?: string;
    };
    /** 보도자료(press) 머리·담당 — 보도시점/배포 행·부제·담당 부서 표 */
    press?: {
        release?: string;
        distribute?: string;
        sub?: string[];
        contact?: {
            dept?: string;
            manager?: string;
            phone?: string;
        };
    };
}
/** 프리셋 별칭(한글/영문) → 내부 preset 키. CLI·라이브러리 공용 */
declare const PRESET_ALIAS: Record<string, GongmunPreset>;
/** 프리셋 입력(영문 키 또는 한글 별칭)을 내부 GongmunPreset로 정규화. 미상은 'official' */
declare function normalizeGongmunPreset(preset?: string): GongmunPreset;
/**
 * 프리셋과 비호환이라 resolveGongmun이 조용히 폐기/무시하는 옵션의 경고 목록 (v4.0.6).
 * 순수 함수 — 배선은 호출자 몫 (CLI stderr / MCP 응답 병기, unknownFontWarnings 관례).
 * 게이팅 조건은 resolveGongmun 본문과 1:1 — 여기 조건을 바꾸면 본문도 함께.
 */
declare function incompatibleGongmunWarnings(opts: GongmunOptions): string[];

/** HWPX 생성 시 적용할 시각 테마 (모두 선택) */
interface HwpxTheme {
    /**
     * 헤딩 레벨별 텍스트 색상. 미지정 시 검정.
     * 현재 charPr 매핑은 h1/h2/h3/h4 4단계 (h5, h6은 h4와 같은 charPr 공유)이므로
     * 키는 1~4만 받는다.
     */
    headingColors?: Partial<Record<1 | 2 | 3 | 4, string>>;
    /** 본문 단락 텍스트 색상. 미지정 시 검정 */
    bodyColor?: string;
    /**
     * 인용문 텍스트 색상. 미지정 시 검정.
     *
     * 주의: 이 옵션을 지정하면 인용문이 별도 charPr(이탤릭)로 렌더링된다.
     * 미지정 시 기존 동작 그대로 본문 charPr로 렌더링 (이탤릭 아님).
     */
    quoteColor?: string;
    /** 표 첫 행 텍스트 색상. 미지정 시 본문과 동일 */
    tableHeaderColor?: string;
    /** 표 첫 행 텍스트를 굵게 표시 (기본 false) */
    tableHeaderBold?: boolean;
}

/**
 * 페이지 옵션 (v4.5.0) — 용지 크기·방향, 다단, 머리말/꼬리말 생성.
 *
 * XML 형상 근거:
 * - landscape 속성: 코퍼스 실측 — 세로 문서 전수 WIDELY, 가로 문서(소방용수시설
 *   조사일정 2종)만 NARROWLY. 용지 width/height는 방향과 무관하게 용지 실치수 유지.
 * - 머리말/꼬리말·subList: rhwp serializer(한컴 저장본 필드 단위 전수 대조로 검증된
 *   HWP5→HWPX 변환기)의 render_header_footer 형상 미러.
 * - colPr 다단: rhwp render_col_pr_ctrl — type NEWSPAPER, sameSz=1, sameGap(HWPUNIT).
 *
 * 옵션 미지정 시 이 모듈은 아무것도 방출하지 않는다 (기존 산출물 바이트 불변).
 */
/** markdownToHwpx `page` 옵션 */
interface PageOptions {
    /** 용지 프리셋 또는 mm 실치수. 기본 A4 (210×297) */
    size?: "A4" | "A3" | "B4" | "B5" | "Letter" | {
        widthMm: number;
        heightMm: number;
    };
    /** 용지 방향. 기본 portrait(세로) */
    orientation?: "portrait" | "landscape";
    /** 다단 개수 (1~8). 기본 1 */
    columns?: number;
    /** 머리말 텍스트 — 모든 쪽, 인라인 마크다운(굵게 등) 허용 */
    header?: string;
    /** 꼬리말 텍스트 */
    footer?: string;
}

/**
 * 서식 프로필(Format Profile) — generate 시각 서식 재현 (이슈 #41 / PR #42).
 *
 * markdownToHwpx가 표의 위상(병합 구조)뿐 아니라 음영·괘선·열 너비·셀 글꼴까지
 * 재현할 수 있도록, 원본 문서 없이 서식만 실어 나르는 프로필의 타입·리맵·XML 빌더.
 *
 * 파서 IR(IRCell/IRTable)에는 서식 필드가 없으므로 프로필은 IR과 독립된 통로다.
 * 프로필의 borderFill/charPr id는 표별 로컬 네임스페이스라, 여기서 문서 전역 id로
 * 재할당(remap)한 뒤 header에 정의를 등록하고 셀에 연결한다.
 */
/** 한 변의 괘선 정의 */
interface BorderDef {
    /** SOLID | NONE | DASH | DOT ... (HWPX border type) */
    type: string;
    /** "0.12 mm" 등 HWPX width 문자열 */
    width: string;
    /** "#RRGGBB" */
    color: string;
}
/** 셀 테두리+음영 정의 (표별 로컬 id로 참조됨) */
interface BorderFillDef {
    leftBorder?: BorderDef;
    rightBorder?: BorderDef;
    topBorder?: BorderDef;
    bottomBorder?: BorderDef;
    /** 셀 음영 — winBrush faceColor. 채움 없으면 생략 */
    fill?: {
        faceColor: string;
    };
}
/** 셀 글꼴 정의 (표별 로컬 id로 참조됨) */
interface CharPrDef {
    /** "1100" (= 11pt × 100) */
    height_hwpunit?: string;
    textColor?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    /** fontfaces HANGUL 순번. render는 이름표로 손실하므로 원본 순번 보존용 */
    fontRef_hangul?: string;
    /**
     * HANGUL 글꼴 이름 (스키마 0.3.0) — 순번(fontRef_hangul)은 원본 fontfaces에서만
     * 유효하므로, 이름을 실어 생성 문서 header에 fontface를 append + 리맵해 재현한다.
     * 없으면(구버전 프로필) 생성 header 범위 내 순번만 존중, 밖이면 기본(0) 폴딩.
     */
    fontName_hangul?: string;
}
/** 셀 하나의 서식 참조 (좌표 = 병합 셀 좌상단 앵커) */
interface CellProfile {
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
    width_hwpunit?: string;
    height_hwpunit?: string;
    /** used_border_fills 키 */
    borderFillIDRef?: string;
    /** used_char_prs 키 */
    charPrIDRef?: string;
}
/** 표 하나의 서식 프로필 */
interface TableProfile {
    /** 문서 내 표 등장 순서 (0-기준) */
    table_index: number;
    rows: number;
    cols: number;
    /**
     * 첫 셀(0,0) 텍스트의 정규화 앵커(normalizeAnchor) — 소비 시 표 대응의 보조 키.
     * parse 가 마크다운으로 방출하지 않는 표(1×1 제목박스·머리말 표 등) 때문에 순번이
     * 어긋나도, 앵커+치수가 맞는 프로필만 골라 적용해 남의 서식 오적용을 막는다(v3.18.1).
     */
    anchor_text?: string;
    /**
     * 첫 행 전체 텍스트의 정규화 지문(normalizeRowAnchor) — 다중 지문 2순위 키 (0.3.0).
     * (0,0)이 빈 셀인 크로스탭은 anchor_text가 비어 순번 폴백뿐이었는데, 첫 행 전체를
     * 이어붙인 지문으로 동형 쌍둥이 표를 가른다.
     */
    anchor_row?: string;
    width_hwpunit?: string;
    col_widths_hwpunit?: string[];
    cells: CellProfile[];
    /** 로컬 id → 정의. 표별 독립 네임스페이스 */
    used_border_fills: Record<string, BorderFillDef>;
    used_char_prs?: Record<string, CharPrDef>;
}
/** 문서 전체 서식 프로필 */
interface FormatProfile {
    schema_version?: string;
    tables: TableProfile[];
}

/**
 * Markdown → HWPX 역변환
 *
 * 지원: 헤딩(h1~h6), 단락, 볼드, 이탤릭, 인라인코드, 코드블록,
 *       순서/비순서 리스트, 수평선, 인용문, 테이블
 * jszip으로 HWPX ZIP 패키징.
 *
 * 엔트리(markdownToHwpx)와 재수출만 남김 — 구현은 목적별 모듈로 분리:
 *   gen-ids.ts        — NS/charPr/paraPr id 상수·테마 해석·XML 원자(escapeXml, charPr/paraPr)
 *   md-runs.ts        — 마크다운 블록/인라인 파싱 + run/문단 XML + PrvText
 *   gen-header.ts     — container/manifest/head.xml 생성
 *   gen-gongmun-fit.ts — 공문 자동장평 계획 + 리스트 항목부호 선계산
 *   gen-table.ts      — GFM/HTML(병합) 표 XML
 *   gen-table-bf.ts   — 표 셀 위치별 borderFill 동적 레지스트리 (실측 테두리 위계)
 *   gen-section.ts    — secPr + 본문 section0.xml 조립
 *   gen-profile.ts    — 서식 프로필(#41) id 리맵·표 매칭
 */

/** markdownToHwpx 옵션 */
interface MarkdownToHwpxOptions {
    theme?: HwpxTheme;
    /**
     * 공문서 모드 — 지정 시 한국 행정 공문서 표준 서식으로 렌더링한다.
     * (공식 여백, 프리셋별 본문 크기, 항목부호 체계, 행갈굼 정렬, 줄간격 등)
     * 미지정 시 기존 범용 마크다운 변환 동작 그대로 유지.
     */
    gongmun?: GongmunOptions;
    /**
     * 서식 프로필 — 표의 borderFill(테두리·음영)·열 너비·셀 글꼴을 원본 문서 없이
     * 재현한다(이슈 #41). `hwpxToProfile()`로 추출하거나 직접 작성한 프로필을 넘기면,
     * 문서 내 표 등장 순서(table_index)로 매칭해 셀 좌표별 서식을 적용한다.
     * 미지정 시 기본 서식 — 공문서 모드는 실측 정부 표 문법, 그 외 단일 SOLID 테두리.
     */
    profile?: FormatProfile;
    /**
     * 페이지 설정 (v4.5.0) — 용지 크기·가로 방향, 다단(columns), 머리말/꼬리말.
     * 미지정 시 기존과 동일한 A4 세로 1단.
     */
    page?: PageOptions;
    /**
     * 이미지 실데이터 (v4.5.0) — `![alt](url)`의 url을 키로 바이트를 넘기면 BinData에
     * 실제로 임베드한다 (PNG/JPEG/GIF/BMP, 크기는 96dpi 환산·본문폭 캡). `data:image/...`
     * URI는 이 맵 없이도 임베드. 바이트가 없는 url은 종전 placeholder 참조 보존.
     */
    images?: Record<string, Uint8Array | ArrayBuffer>;
    /**
     * 경고 수집 싱크 (v5) — 생성기가 조용히 처리한 것(□ 한 줄 축소 한계 초과·제목 축소 등)을
     * 여기에 push한다. 호출 표면(CLI stderr·MCP 응답)이 노출.
     */
    warnings?: string[];
}
/**
 * 마크다운 텍스트를 HWPX (ArrayBuffer)로 변환.
 */
declare function markdownToHwpx(markdown: string, options?: MarkdownToHwpxOptions): Promise<ArrayBuffer>;

/**
 * 서식 프로필 추출 (hwpx → FormatProfile) — 이슈 #41 / PR #42 Part B.
 *
 * 원본 hwpx에서 표의 borderFill(테두리·음영)·열너비·셀 글꼴을 읽어
 * FormatProfile JSON으로 뽑는다. 이 프로필을 `markdownToHwpx(md, { profile })`에
 * 넘기면 원본 없이 같은 시각 서식을 재현한다(진짜 라운드트립).
 *
 * render 경로(head-styles/svg-render)는 mm→pt·font→family 손실 변환이라
 * 프로필 충실 추출엔 부적합. 여기서는 header/section XML을 원문 그대로 읽는
 * 얇은 전용 파서를 쓴다.
 */

/**
 * hwpx → FormatProfile. 문서 내 top-level 표를 등장 순서대로 추출한다.
 * @param input hwpx ArrayBuffer 또는 Buffer
 */
declare function hwpxToProfile(input: ArrayBuffer | Buffer): Promise<FormatProfile>;

/**
 * 폰트 카탈로그 — fonts 오버라이드 오타·미설치 경고용 (A2).
 *
 * 생성은 항상 진행하고 경고만 낸다: HWPX는 폰트명을 문자열로 참조하므로
 * 미설치 폰트를 지정해도 파일은 유효하지만, 한컴이 무경고로 기본 폰트로
 * 대체 렌더해 "지정한 폰트가 안 먹는" 원인 파악이 어렵다.
 * 여기 목록은 한컴오피스 번들 + Windows 한글판 기본 + 통상 설치 무료 폰트.
 * 목록에 없다고 오류는 아니다 — 경고 문구도 그렇게 안내한다.
 */
/** 카탈로그에 있는 폰트인가 */
declare function isKnownFont(name: string): boolean;
/**
 * fonts 오버라이드 경고 목록 — 카탈로그에 없는 폰트명마다 경고 1건.
 * 빈 배열이면 전부 알려진 폰트. 경고는 생성을 막지 않는다.
 */
declare function unknownFontWarnings(fonts: Record<string, string | undefined>): string[];

/**
 * 공문서 표기법 검수기 — 「행정업무의 운영 및 혁신에 관한 규정」 시행규칙 및
 * 행정안전부 행정업무운영 편람의 날짜·시간·금액·기호 표기법을 정규식으로 검사.
 *
 * 원전: jkf87/hwpx-skill gonmun_lint.py(2025 편람 기준 13룰)를 kordoc에 맞게 이식
 * (v4.0.1). URL 쌍점 오탐 가드 등 일부 보강. v4.12.1 에 금액 한글 병기·물결표·두음법칙·
 * 외래어·차별 표현·"끝." 누락 6룰 보강 (pyhwpxlib Gongmun 검사 항목 대조). 검사는 조언용이다 — 생성은 막지 않고
 * 경고만 낸다 (A2 폰트경고와 같은 원칙). 별도 CLI `kordoc lint`는 error 시 exit 1.
 * v4.13.0: 하이픈 날짜(2026-07-18) 룰, 금액 한글 병기·하이픈 날짜는 실제 변환값을 제안.
 */
interface GongmunLintFinding {
    /** 1-based 줄 번호 */
    line: number;
    /** 걸린 원문 조각 */
    match: string;
    /** 규칙 코드 (DATE_NO_SPACE 등) */
    rule: string;
    severity: "error" | "warning";
    message: string;
    suggest?: string;
}
/**
 * 텍스트(마크다운 포함) 표기법 검수. 마크다운 펜스 코드블록(``` ~ ```) 안은
 * 건너뛴다 — 코드·URL이 날짜/쌍점 규칙에 오탐되는 것 방지.
 */
declare function lintGongmunText(text: string, opts?: {
    document?: boolean;
}): GongmunLintFinding[];
/** 검수 결과를 사람이 읽는 경고 문자열 배열로 — generate 경고 채널(A2와 동일)용 */
declare function gongmunLintWarnings(text: string, limit?: number): string[];

/**
 * 개조식 보고서 문체 검수기 — 서식이 맞아도 문체가 다르면 그 부서 문서로 읽히지 않는다.
 *
 * 표기법 검수(gongmun-lint.ts)가 "어떻게 적는가"를 본다면 이 모듈은 "어떤 꼴로 끝나는가"를
 * 본다. 개조식은 서술형 문장이 아니라 명사구로 끝나는 짧은 줄을 층층이 쌓는 문체다.
 *
 * 근거: 지자체 실무부서의 요약보고·기본계획·검토보고 15건(2,288줄) 실측 통계 —
 * jkf87/hwpx-skill v1.17.0 이 references/bogo-munche.md 로 공개한 수치를 임계값 근거로
 * 삼았다(서술형 `~다` 종결 0/264 항목, 항목 중앙 31자, 결론 중앙 30자, 물음표·느낌표
 * 본문 0건). 규칙 코드·정규식·판정 로직은 kordoc 자체 구현이다.
 *
 * 범위: 검수는 조언용이다 — 생성은 막지 않고 경고만 낸다(표기법 검수·폰트 경고와 같은
 * 원칙). 문체 *변환*은 여전히 엔진 범위 밖이다(gongmunseo-engine-spec.md).
 * 상세 규칙과 예문은 docs/gaejosik-munche.md.
 */
interface MuncheLintFinding {
    /** 1-based 줄 번호 */
    line: number;
    /** 걸린 원문 조각 */
    match: string;
    /** 규칙 코드 (DA_ENDING 등) */
    rule: string;
    severity: "error" | "warning";
    /** 판정된 줄 종류 — 같은 문장도 층에 따라 허용 여부가 다르다 */
    kind: MuncheLineKind;
    message: string;
    suggest?: string;
}
/**
 * 개조식 문체를 쓰는 프리셋 — 보고서·계획서·개조식보고서.
 * 기안문·시행문(official)은 경어 종결(`~하시기 바랍니다`), 통지·회의록·보도자료도
 * 각기 다른 문체 관행이라 이 검수를 적용하지 않는다. 적용 범위를 좁히는 것이
 * 오탐을 막는 가장 확실한 수단이다.
 */
declare function usesGaejosikMunche(preset?: string): boolean;
/** □ 소제목 / ❍ 항목 / - 세부 / ⇒ 결론 / > 리드문 / ※ 참고 / 그 밖 */
type MuncheLineKind = "dae" | "item" | "sub" | "concl" | "lead" | "note" | "para";
/**
 * 원고(마크다운/텍스트) 문체 검수. 코드펜스 안은 건너뛴다 — 예시 코드가 종결·대조
 * 규칙에 오탐되는 것 방지(표기법 검수와 같은 원칙).
 */
declare function lintMuncheText(text: string): MuncheLintFinding[];
/** 검수 결과를 사람이 읽는 경고 문자열 배열로 — generate 경고 채널(표기법과 동일)용 */
declare function muncheLintWarnings(text: string, limit?: number): string[];

/**
 * 한글 조판 텍스트 폭 계산 — 함초롬바탕(HCR Batang) 실측 advance 테이블
 *
 * 공문서 표준 본문 글꼴인 함초롬바탕 정품 TTF(한컴 공개 배포)의 hmtx advance를
 * upem=1000 기준으로 추출한 값이다. Bold도 advance가 Regular와 완전히 동일함을
 * 전수 확인했다(한컴이 굵기 간 폭을 통일해 제작). 한글 음절 11,172자 전수 = 970,
 * 한자 = 1000, 전각형·원문자·도형·화살표·단위기호 = 970으로 균일하다.
 *
 * 단위: em×1000. 실제 폭(HWPUNIT) = w/1000 × charPr.height × ratio(장평)/100.
 * (1em = 글자크기 = charPr.height HWPUNIT — 1pt = 100 HWPUNIT이므로)
 *
 * 공백: HWP는 charPr useFontSpace=0(기본)일 때 글꼴의 space advance(0.30em) 대신
 * 반각 고정폭(0.50em)을 쓴다 — kordoc 생성 문서는 모두 useFontSpace=0이므로
 * 기본 SPACE_EM=500. (글꼴값을 쓰려면 measure 옵션 fontSpace로 300 지정)
 *
 * 다른 글꼴(맑은 고딕 등)도 한글=전각 균일·숫자≈0.55em의 동일 부류 구조라
 * 이 테이블로 근사한다(오차 수 % 이내 — 공문서 본문은 어차피 함초롬바탕 관행).
 */
/** 코드포인트의 advance(em×1000). 미상 문자는 CJK권 970 / 라틴권 550 폴백 */
declare function charWidthEm1000(cp: number): number;
/** HWP 공백 폭(em×1000) — useFontSpace=0(기본): 반각 고정 500 / =1: 글꼴값 300 */
declare const SPACE_EM_FIXED = 500;
declare const SPACE_EM_FONT = 300;
/**
 * 폭 테이블 클래스 — 'hcr'(함초롬 실측, 기본) / 'fixedPitch'(고정폭 글꼴:
 * ASCII 0.5em·그 외 1.0em). 굴림체·돋움체·바탕체·궁서체('체' 접미 = 고정폭)가
 * 대상 — 전자결재 변환기 산출물의 지배 본문 글꼴. 한글이 HCR(0.97em)보다 3%
 * 넓어 함초롬 테이블로 재면 줄당 1~2자 과대적재로 wrap 지점이 어긋난다
 * (bench/verify-linebreak.mjs seoul 코퍼스 실측: fixedPitch 테이블로 74/75 일치).
 */
type FaceClass = "hcr" | "fixedPitch" | "gothic" | `font:${string}`;
interface MeasureOptions {
    /** 공백 폭(em×1000). 기본 SPACE_EM_FIXED(500) = useFontSpace 0 */
    spaceEm?: number;
    /** 자간(charPr spacing %) — 글자폭의 %가 문자마다 추가 */
    spacingPct?: number;
    /** 폭 테이블 클래스 — 기본 'hcr' (함초롬 실측 테이블) */
    faceClass?: FaceClass;
}
/**
 * 텍스트 폭(HWPUNIT). height=charPr height(pt×100), ratioPct=장평 %.
 * 결과는 float — 호출부에서 비교 시 ±0.5 HWPUNIT 오차 허용 권장.
 */
declare function measureTextWidth(text: string, height: number, ratioPct: number, opts?: MeasureOptions): number;
type WrapMode = "keep" | "charAll";
interface PreparedWrap {
    units: string[];
    advances: number[];
    steps: number[];
}
interface WrapOptions extends MeasureOptions {
    /** UTF-16 단위별 실폭(HWPUNIT) — 주면 height·장평·폭 클래스 대신 쓴다(여러 run 문단, 탭 전진폭) */
    widths?: number[];
    /** 같은 text·mode·글꼴·공백 폭으로 준비한 원 폭 — 한 문단 압축 후보에만 재사용 */
    prepared?: PreparedWrap;
}
interface WrapResult {
    /** 줄 수 */
    lines: number;
    /** 각 줄의 시작 오프셋(UTF-16) — [0, …] */
    starts: number[];
    /** 마지막 줄 텍스트 폭(HWPUNIT) */
    lastLineWidth: number;
}
/**
 * 문단 줄바꿈 시뮬레이션.
 * mode 'keep' = 어절 단위(공문서 모드 — 저장 속성 breakNonLatinWord="BREAK_WORD", 이름 역전 주의),
 * mode 'charAll' = 글자 단위(breakNonLatinWord="KEEP_WORD" — 한글 기본값·전자결재 변환기).
 * 한 어절이 줄보다 길면 keep에서도 글자 단위로 강제 분해 — 한컴처럼 다음 줄로 넘긴 뒤 쪼갠다(앞 줄은 벌어진다).
 *
 * @param text        문단 전체 텍스트(항목 부호 포함)
 * @param firstWidth  첫 줄 가용 폭(HWPUNIT)
 * @param contWidth   둘째 줄부터 가용 폭(HWPUNIT) — 내어쓰기 반영
 * @param height      charPr height (pt×100)
 * @param ratioPct    장평 %
 */
declare function simulateWrap(text: string, firstWidth: number, contWidth: number, height: number, ratioPct: number, mode?: WrapMode, opts?: WrapOptions): WrapResult;
/** @deprecated simulateWrap(text, …, 'keep') 별칭 — 하위 호환 */
declare function simulateWrapKeepWord(text: string, firstWidth: number, contWidth: number, height: number, ratioPct: number, opts?: MeasureOptions): WrapResult;
/**
 * 한두 글자(짧은 꼬리)가 다음 줄로 넘어간 문단을 장평 축소로 한 줄 줄일 수 있는지
 * 탐색. baseRatio에서 줄 수 N≥2일 때 r=baseRatio-1…minRatio를 내려가며 처음으로
 * 줄 수가 줄어드는(가장 큰) r을 반환. 불가능하면 null.
 * (실무 관행: 공무원이 문단 장평을 95→92 등으로 줄여 orphan을 위로 당기는 조작의 자동화.
 * keep 모드로 판정 — 글자 단위 조판은 항상 keep 이하의 줄 수라 함께 만족된다.)
 */
declare function fitRatioForFewerLines(text: string, firstWidth: number, contWidth: number, height: number, baseRatio: number, minRatio: number, opts?: MeasureOptions): number | null;

/**
 * HWPX 라운드트립 소스맵 — section XML 문자열에서 문단/표 셀의 문자 범위를 추적.
 *
 * DOM 재직렬화를 거치지 않고(속성 순서·공백·자기닫힘 표기까지 보존하기 위해)
 * 정규식 토크나이저로 태그를 순회하며, 각 <hp:p>가 소유한 <hp:t> 콘텐츠 범위를
 * 기록한다. 패치는 이 범위에 대한 문자열 splice로만 수행되어
 * 변경 문단 외 XML 바이트가 그대로 보존된다 (filler-hwpx.ts 패턴의 오프셋 버전).
 */
/** <hp:t> 콘텐츠 범위 — [contentStart, contentEnd) 가 여는/닫는 태그 사이 */
interface TRange {
    contentStart: number;
    contentEnd: number;
    /** 자기닫힘 <hp:t/> — 범위가 태그 전체이며, 치환 시 태그째 교체 */
    selfClosing?: boolean;
    /** 자기닫힘 치환용 네임스페이스 프리픽스 (예: "hp") */
    prefix?: string;
}
type ScanParaKind = "body" | "cell" | "draw" | "excluded";
/** 스캔된 문단 — 소유한 hp:t 범위와 합산 텍스트 */
interface ScanParagraph {
    sectionIndex: number;
    kind: ScanParaKind;
    /** <hp:p ...> 여는 태그 시작 위치 (문서 순서 정렬용) */
    start: number;
    /** 소유 hp:t 콘텐츠 범위 (문서 순서) */
    tRanges: TRange[];
    /** hp:t 텍스트 합산 (엔티티 디코딩, 내부 태그는 공백화) */
    text: string;
    /** hp:t가 하나도 없을 때 텍스트 삽입 가능한 위치 (첫 run 닫는 태그 앞) */
    runInsertPos?: number;
    /** runInsertPos에 삽입할 때 쓸 t 태그 prefix (예: "hp") */
    runPrefix?: string;
    /** 자기닫힘 <hp:run/> 태그 범위 — t 삽입 시 펼쳐서 사용 (한컴 빈 문단 패턴) */
    selfCloseRun?: {
        start: number;
        end: number;
    };
    /** 글상자(drawText) 경유 문단 — 셀 라벨 판정 등에서 본문과 구분 (v3.1) */
    inTextbox?: boolean;
}
/** 스캔된 표 셀 — 앵커 좌표와 셀 내부 문단 */
interface ScanCell {
    rowAddr?: number;
    colAddr?: number;
    colSpan: number;
    rowSpan: number;
    paragraphs: ScanParagraph[];
    /** 셀 내부 중첩표 (문서 순서) */
    tables: ScanTable[];
    /** <hp:cellAddr> 태그 범위 (자기닫힘=태그 전체, 펼친형=여는 태그) — rowAddr 재작성용 */
    addrTagRange?: {
        start: number;
        end: number;
    };
}
/** 스캔된 표 */
interface ScanTable {
    sectionIndex: number;
    start: number;
    /** 최상위 표 여부 (다른 표/ctrl/캡션 내부가 아님) */
    topLevel: boolean;
    /** 비어있지 않은 행들 (tr 순서) */
    rows: ScanCell[][];
    /** rows[i]의 <hp:tr>...</hp:tr> XML 범위 (행 추가/삭제 splice용, rows와 정렬) */
    rowRanges: {
        start: number;
        end: number;
    }[];
    /** 앵커 좌표 → 셀 ("r,c") */
    cellByAnchor: Map<string, ScanCell>;
}
/** 섹션 하나의 스캔 결과 */
interface SectionScan {
    sectionIndex: number;
    xml: string;
    /** body + draw 문단 (문서 순서) — 본문 텍스트 매핑 대상 */
    bodyParagraphs: ScanParagraph[];
    /** 최상위 표 (문서 순서) */
    tables: ScanTable[];
    /** 머리말/꼬리말 문단 텍스트 (OB 앞/뒤 배치 블록 식별용) */
    headerTexts: string[];
    footerTexts: string[];
    /**
     * 파서 비가시 영역(머리말/꼬리말/각주/캡션/메모 등 ctrl 내부) 문단 — v3.1.
     * patcher 매핑 대상이 아니며, filler가 이 영역의 인라인 패턴을 채울 때 사용.
     */
    excludedParagraphs: ScanParagraph[];
    /**
     * 어느 셀에도 속하지 않는 비최상위 표(머리말/꼬리말 등 ctrl 내부) — v3.1.
     * filler 전용. patcher의 표 서수 매핑(tables)에는 포함되지 않는다.
     */
    orphanTables: ScanTable[];
}
/** 문자열 splice 편집 — [start, end) 를 replacement로 치환 */
interface SpliceEdit {
    start: number;
    end: number;
    replacement: string;
}
/**
 * section XML 한 개를 스캔하여 소스맵을 만든다.
 * 토크나이저는 xmldom과 무관하게 동작하며, 위치(오프셋) 정보가 핵심이다.
 */
declare function scanSectionXml(xml: string, sectionIndex: number): SectionScan;
/**
 * 문단 텍스트 치환용 splice 생성 — filler-hwpx.ts replaceCellText와 동일 전략:
 * 첫 hp:t에 새 텍스트(이스케이프), 나머지 hp:t는 비움. run 구조/charPr 보존.
 * t가 없으면 첫 run 끝에 <hp:t> 삽입. 실패 시 null.
 *
 * IR 텍스트는 sanitize로 양끝 공백이 제거된 상태라, 통째 교체 시 원본의
 * 선행 공백(들여쓰기)/후행 공백이 소실된다 — 원본 t-도메인 텍스트에서
 * 양끝 공백을 복원해 새 텍스트에 입힌다 (재파싱 IR은 동일하게 유지됨).
 */
declare function buildParagraphSplices(para: ScanParagraph, newText: string, xml?: string): SpliceEdit[] | null;
/**
 * t-도메인 텍스트(paraTText 좌표계)의 [start, end) 범위만 치환하는 정밀 splice
 * — run/탭 구조 보존 (v3.1).
 *
 * 좌표계가 t-도메인이므로 tab/br이 사이에 끼어 있어도 동작한다 (해당 요소는
 * 건드리지 않고 t 콘텐츠만 수술). hp:t 콘텐츠에 엔티티/내부 태그가 있으면
 * 오프셋 정합이 깨지므로 null을 반환한다 (호출자가 폴백 결정).
 */
declare function buildRangeSplices(para: ScanParagraph, xml: string, start: number, end: number, replacement: string): SpliceEdit[] | null;
/**
 * splice 일괄 적용 — 시작 위치로 정렬(같으면 넣은 순서), 겹치면 내부 오류, 원문 조각과 치환 글을 한 번에 잇는다.
 * 종전엔 뒤에서부터 slice+치환+slice 를 되풀이해 splice 마다 문자열 전체를 복사했다(O(글자 수 × splice 수)) —
 * 줄 배치 캐시를 전부 지우는 큰 섹션(1,020만 자·26,939 splice)에서 patch·fill·seal 이 32.6초 (v4.14.4 리뷰 실측).
 * 결과는 종전과 같다 (redact-hwpx.ts applySplicesLinear 와 같은 방식)
 */
declare function applySplices(xml: string, splices: SpliceEdit[]): string;

/** 2-pass colSpan/rowSpan 테이블 빌더 및 Markdown 변환 */

declare function flattenLayoutTables(blocks: IRBlock[]): IRBlock[];
declare function blocksToMarkdown(blocks: IRBlock[]): string;
/**
 * 셀에 GFM 표 문법으로 담을 수 없는 구조 콘텐츠(중첩표·구분선)가 있는가 (#76 Task 4) — hasNestedTables 의 일반화.
 * 이미지는 GFM 셀에 `![image](src)` 로 인라인할 수 있어 여기 세지 않는다 — 대신 GFM 경로가 blocks 를 직접 직렬화해
 * (아래 tableToMarkdown) 병합 없는 단순 표의 셀 이미지가 사라지지 않게 한다. span 문단(왕복 채널)도 GFM 그대로.
 */
declare function hasStructuredCellContent(table: IRTable): boolean;

/**
 * HWPX 서식 보존 무손실 라운드트립 패치 — v3.0 킬러기능.
 *
 * parse()로 얻은 마크다운을 편집한 뒤 patchHwpx()에 넘기면, 원본 HWPX의
 * ZIP/XML 구조를 그대로 두고 변경된 문단/셀의 텍스트만 in-place 치환한다.
 * 스타일·이미지·표 구조·설정은 1바이트도 건드리지 않는다 (section XML 외
 * ZIP 엔트리는 원본 바이트 그대로, 변경 문단도 run 구조·charPr 보존).
 *
 * 지원: 문단/헤딩 텍스트 수정, 표 셀 텍스트 수정 (GFM·HTML·1x1·1열 표),
 * 문단 → GFM 표 인플레이스 변환 (v3.5 — table-insert.ts),
 * GFM/HTML 표 행 추가/삭제 (v3.7 — table-rows.ts, 병합 교차·개체 포함 행은 skip).
 * 미지원(graceful skip): 블록 추가/삭제/순서 변경, 표 열/병합 변경,
 * 캡션·각주·머리말/꼬리말·이미지 변경. skipped[]에 사유와 함께 보고된다.
 */

/**
 * 원본 HWPX와 편집된 마크다운으로 서식 보존 패치본을 만든다.
 *
 * @param original 원본 HWPX 바이트 (속이 HWP 5.x 인 문서는 patchHwp 로 넘긴다)
 * @param editedMarkdown parse(original).markdown을 편집한 마크다운
 */
declare function patchHwpx(original: Uint8Array, editedMarkdown: string, options?: PatchOptions): Promise<PatchResult>;

/**
 * HWP 5.x 바이너리 서식 보존 무손실 라운드트립 패치 — patchHwpx의 HWP5 대응.
 *
 * parse()로 얻은 마크다운을 편집한 뒤 patchHwp()에 넘기면, 원본 HWP의
 * CFB/레코드 구조를 그대로 두고 변경된 문단/표 셀의 PARA_TEXT만 치환한다.
 * 연쇄 갱신: PARA_HEADER nChars, CHAR_SHAPE 위치, LINE_SEG 재구성, 레코드
 * 크기 재계산 → 섹션 스트림 재직렬화 → deflate 재압축 → CFB 재조립.
 *
 * 안전 게이트 (하나라도 깨지면 해당 수정은 graceful skip — 파일 무결성 우선):
 *  - 섹션 레코드 재직렬화가 원본과 바이트 동일해야 패치 허용
 *  - ctrlMask=0(순수 텍스트) + PARA_TEXT 1개 + 레코드 텍스트 재구성 일치 문단만 수정
 *  - 배포용/암호화/DRM 문서는 전체 거부
 *
 * 지원: 본문 문단/헤딩 텍스트 수정, GFM 표 셀 텍스트 수정 (좌표 기반).
 * 미지원(graceful skip): 블록 추가/삭제, 표 구조 변경, HTML 표 셀, 캡션·각주·
 * 머리말/꼬리말, 컨트롤(탭/개체/필드) 포함 문단. skipped[]에 사유 보고.
 */

/**
 * 원본 HWP 5.x와 편집된 마크다운으로 서식 보존 패치본을 만든다.
 *
 * @param original 원본 HWP 바이트 (OLE2/CFB — 속이 HWPX(ZIP)인 문서는 patchHwpx 로 넘긴다)
 * @param editedMarkdown parse(original).markdown을 편집한 마크다운
 */
declare function patchHwp(original: Uint8Array, editedMarkdown: string, options?: PatchOptions): Promise<PatchResult>;

/**
 * HWPX 구조 검증 — 한컴오피스/한컴독스가 열기를 거부하는 컨테이너 결함을 사전에 잡는다.
 *
 * 검사 항목 (claw-hwp validate.py의 실측 검사셋 이식 — MIT © DoHyun468/claw-hwp):
 * - 유효한 ZIP인지, mimetype이 첫 엔트리이고 내용이 application/hwp+zip인지
 * - 필수 파일 존재 (META-INF/container.xml, content.hpf, header.xml, section0.xml)
 * - XML/HPF/RDF 엔트리 웰폼드
 * - header.xml secCnt == 실제 Contents/sectionN.xml 수
 *   (한컴독스는 실제 파일 목록이 아니라 secCnt를 신뢰하고, 불일치 시 열기를 거부한다)
 * - content.hpf manifest의 <opf:item href>가 전부 실존하는지
 */
/** 검증에서 발견된 문제 하나 */
interface ValidateIssue {
    /** 문제가 발견된 zip 내부 경로 (컨테이너 전역 문제면 생략) */
    path?: string;
    message: string;
}
/** validateHwpx 결과 */
interface ValidateResult {
    ok: boolean;
    issues: ValidateIssue[];
    /** 검사한 zip 엔트리 수 (디렉토리 제외) */
    entryCount: number;
}
/** HWPX 버퍼의 컨테이너 구조를 검증한다. 문제가 없으면 ok=true. */
declare function validateHwpx(buffer: ArrayBuffer | Uint8Array): Promise<ValidateResult>;

/**
 * 한국 공문서 PII(개인정보) 탐지·마스킹 순수 로직.
 *
 * 텍스트 in → 마스킹된 텍스트 + 히트 리포트 out. 문서 파일 단위 마스킹(머리말·각주·미리보기·메타데이터
 * 포함)은 redact-doc.ts 가 이 엔진을 불러 쓴다.
 *
 * 원칙:
 * - 서식 보존 마스킹 — 자릿수·구분자를 유지해 마스킹 전후 길이(UTF-16 단위)가 동일
 * - 히트 리포트에 원본 PII를 절대 담지 않는다 (`masked` 필드만 존재)
 * - 탐지는 같은 길이로 정규화한 그림자 문자열에서 한다 — 전각 숫자·영문·@, 유니코드 대시(‐‑–—−－·─·ㅡ),
 *   NBSP·전각 공백을 ASCII 로 1:1 치환하므로 오프셋이 그대로이고, 마스킹은 원문 글자에 적용한다
 * - 번호 모양만으로 모호한 형태(구분자 없는 13자리·10~14자리, 여권 구형 등)는 바로 앞 라벨
 *   ("주민등록번호", "계좌", "여권" …) 이나 표 열 머리글이 해당 유형일 때만 잡는다. 가장 가까운
 *   라벨이 이긴다 — "법인등록번호" 옆 6-7 번호는 주민번호로 보지 않는다
 * - 체크섬: 카드 Luhn, 사업자·법인등록번호 가중합. 주민·외국인등록번호는 2020-10 이후 뒷자리가
 *   임의 번호라 체크섬으로 거르지 않고 생년월일(세기 포함)·성별 자리만 검증한다
 * - 룰 우선순위 겹침 처리 — 우선순위순으로 매치를 수집하고, 이미 점유된 구간과 겹치는 하위 룰
 *   매치는 스킵 (RULE_PRIORITY 참조)
 * - 정규식은 모듈 로드 시 1회 컴파일, 탐지 루프가 lastIndex 를 0 으로 돌려 그대로 쓴다 (복제 비용 — detect 주석)
 *
 * 룰별 근거·오탐 실측은 bench/redact-bench.mjs (합성 정답 셋 + 실코퍼스) 참조.
 */
type RedactRule = "rrn" | "phone" | "email" | "card" | "account" | "passport" | "driver" | "brn" | "crn" | "ip" | "name" | "address";
interface RedactHit {
    rule: RedactRule;
    /** 마스킹 후 문자열 — 원본 PII는 리포트에 담지 않는다 */
    masked: string;
    /** 원문 내 시작 오프셋 (UTF-16 단위) */
    index: number;
    /** 매치 길이 (서식 보존이라 마스킹 전후 동일) */
    length: number;
}
interface RedactTextResult {
    text: string;
    hits: RedactHit[];
}
interface RedactOptions {
    /** 적용할 룰 (기본: DEFAULT_REDACT_RULES — crn·ip는 기본 OFF) */
    rules?: readonly RedactRule[];
    /** 마스크 문자 — 1글자(UTF-16 1단위). 영숫자·공백·제어문자·마크다운/XML 특수문자(|\<>&"')는 금지. 기본 "●" */
    maskChar?: string;
}
/**
 * 기본 적용 룰. 실코퍼스 2,303문서 오탐 실측 근거(bench/redact-bench.mjs --corpus):
 * - brn(사업자등록번호)은 종전 account 가 잡던 것을 체크섬으로 분리 — 기본 마스킹 범위 그대로
 * - passport 는 신형(M123A4567)만 무문맥, 구형(M12345678)은 "여권" 라벨이 있을 때만 → 기본 ON
 * - driver 는 지역코드(11~28)·지역명 검증으로 좁혔고 종전에도 account 로 가려지던 모양 → 기본 ON
 * - crn(법인등록번호)은 개인정보가 아니고, ip 는 "1.2.3.4" 절 번호·버전과 겹쳐 opt-in
 * - name(인명)·address(주소)는 사전 + 문맥 게이트라 번호형보다 경계가 흐리다 — opt-in (redact-name-address.ts)
 */
declare const DEFAULT_REDACT_RULES: readonly RedactRule[];
/**
 * 텍스트에서 PII를 탐지해 서식 보존 마스킹.
 *
 * @param text - 대상 텍스트 (마크다운 포함)
 * @param options - 룰 선택·마스크 문자 (기본: DEFAULT_REDACT_RULES, "●")
 * @returns 마스킹된 텍스트 + 히트 리포트 (index 오름차순, 원본 PII 미포함)
 */
declare function redactText(text: string, options?: RedactOptions): RedactTextResult;
/**
 * 마크다운 문서 전용 래퍼 — base64 이미지(data URI) 라인은 마스킹에서 제외한다.
 * base64 페이로드의 숫자열이 phone 등에 오탐되면 이미지가 깨지기 때문.
 * 표 셀은 열 머리글("주민등록번호"·"계좌번호" …)을 라벨 문맥으로 쓰고, 인라인 서식 표지(**·\\ 이스케이프 등)가
 * 번호를 갈라도 잡는다. hits의 index는 문서 전체 기준 절대 오프셋으로 환산된다 (masked 에는 표지가 그대로).
 */
declare function redactMarkdown(markdown: string, options?: RedactOptions): RedactTextResult;

/**
 * RAG용 구조 보존 청킹 — IRBlock[] → DocChunk[].
 *
 * 문서의 위계(마크다운 헤딩 스택 + 개조식 리스트 깊이)를 breadcrumb으로 보존한
 * 청크 목록을 만든다. 토큰 상한·오버랩 등 자르기 정책은 의도적으로 없다 —
 * "구조 트리 제공"까지가 이 모듈의 몫이고 실제 분할은 소비자(RAG 파이프라인)가 한다.
 *
 * breadcrumb 규칙:
 * - 헤딩(level 1~6)은 스택 구조 — 같거나 깊은 level을 팝하고 push, 리스트 위계 리셋
 * - 리스트 항목은 깊이 d 등장 시 depth>=d를 팝하고 push — 하위 항목이 뒤따르면
 *   그 breadcrumb으로 승격되고, 자식이 없으면 다음 형제/헤딩이 팝해 자연 소멸
 * - 깊이는 IR의 listDepth 그대로. listDepth가 없는 개조식 선두 부호 문단
 *   (□·○·- / 1.·가.·1) 등)은 depth 0 항목으로 취급 — IR에 없는 깊이는 지어내지 않는다
 * - 청크의 breadcrumb은 자기 자신을 제외한 상위 경로다
 */

interface DocChunk {
    /** "c0001" 순번 id — 같은 입력이면 같은 출력 (결정적) */
    id: string;
    type: "text" | "table" | "heading";
    /** 상위 헤딩 + 리스트 위계 경로 (예: ["1. 개요", "가. 목적"]) */
    breadcrumb: string[];
    /** 청크 본문 마크다운 — 표는 GFM/HTML 그대로 (blocksToMarkdown 재사용) */
    text: string;
    /** 원본 페이지/섹션 번호 (1-based) — IR에 없으면 생략 */
    page?: number;
    /** 원본 IRBlock 인덱스 범위 [start, end] (양끝 포함) — 출처 앵커 */
    blockRange: [number, number];
    /** 표 청크 전용 구조 요약 — cells는 includeTableCells 옵션 시에만 */
    table?: {
        rows: number;
        cols: number;
        cells?: string[][];
    };
}
interface ChunkOptions {
    /** 표 청크에 셀 텍스트 행렬 포함 여부 (기본 false) */
    includeTableCells?: boolean;
    /**
     * "section"(기본): 같은 breadcrumb 아래 연속 텍스트 블록을 하나로 병합,
     * "block": IRBlock 1개 = 청크 1개
     */
    granularity?: "block" | "section";
}
declare function blocksToChunks(blocks: IRBlock[], options?: ChunkOptions): DocChunk[];

/**
 * HWPX 문서 세션 — 에디터 통합용 블록 단위 증분 패치 API (v3.1).
 *
 * patchHwpx가 "편집된 마크다운 전체"를 받아 내부에서 LCS 정렬하는 것과 달리,
 * 세션은 블록 인덱스로 직접 편집을 지정한다 (에디터의 블록 클릭-편집에 대응).
 *
 * 설계 원칙:
 * - 매핑은 patcher와 동일한 알고리즘 재사용 (정규화 텍스트 버킷 + 표 서수) —
 *   "n회 연속 patchBlocks ≡ 일괄 patchHwpx" 동등성이 성립하는 근거.
 * - 패치 후 상태는 새 바이트에서 전체 재구축 (오프셋 리베이스 대신 재스캔 —
 *   성능보다 정합성). patchBlocks 호출 후 이전 블록 인덱스는 무효이며
 *   session.blocks를 다시 읽어야 한다.
 * - capability()는 patcher의 graceful-skip 게이트를 사전 판정으로 노출 —
 *   에디터가 편집 전에 잠금 UI를 띄울 수 있는 단일 진실 소스.
 */

/** 블록 편집 가능성 — 에디터 잠금 UI의 근거 */
type BlockCapability = "text" | "cell-text" | "locked";
interface CellCapability {
    editable: boolean;
    /** 편집 불가 사유 (한국어) */
    reason?: string;
}
interface BlockCapabilityInfo {
    capability: BlockCapability;
    /** locked 사유 (한국어) */
    reason?: string;
    /** 표 블록: IRTable 격자 좌표(row×col)별 셀 편집 가능 여부 */
    cells?: CellCapability[][];
}
/** 블록 → 원본 위치 참조 (에디터 하이라이트/점프용) */
interface BlockSourceRef {
    kind: "paragraph" | "table";
    /** 0-based 섹션 인덱스 */
    sectionIndex: number;
    /** 섹션 XML 내 시작 문자 오프셋 (<hp:p>/<hp:tbl> 여는 태그) */
    xmlStart: number;
}
/** 블록 단위 편집 — patchBlocks 입력 */
interface BlockEdit {
    /** session.blocks 기준 0-based 블록 인덱스 */
    blockIndex: number;
    /**
     * 문단/헤딩 블록의 새 텍스트 (평문).
     * 빈 문자열(비우기)은 미지원 — patchHwpx의 "블록 삭제 미지원"과 정합
     * (비우면 재파싱 시 블록 핸들이 사라져 세션으로 복구 불가).
     */
    newText?: string;
    /** 표 블록의 셀 편집 (IRTable 격자 좌표 기준). 이미지가 든 셀은 이미지
     *  토큰(`![image](...)`/`[이미지: ...]`)을 유지한 채 텍스트만 수정해야 한다. */
    cells?: Array<{
        row: number;
        col: number;
        text: string;
    }>;
}
declare class HwpxSession {
    private state;
    private constructor();
    /** HWPX 바이트로 세션을 연다 (입력은 복사되어 외부 변이와 격리) */
    static open(input: Uint8Array | ArrayBuffer): Promise<HwpxSession>;
    /** 현재 문서의 IR 블록 — patchBlocks 후 갱신되므로 호출마다 다시 읽을 것 */
    get blocks(): IRBlock[];
    /** 현재 문서의 마크다운 */
    get markdown(): string;
    /** 현재 문서 바이트 (복사본) */
    get bytes(): Uint8Array;
    /** 블록 → 원본 위치 참조. 매핑 실패 시 undefined */
    sourceRef(blockIndex: number): BlockSourceRef | undefined;
    /** 블록 편집 가능성 사전 판정 — patcher graceful-skip 게이트의 사전 버전 */
    capability(blockIndex: number): BlockCapabilityInfo;
    /** 전 블록의 편집 가능성 */
    capabilities(): BlockCapabilityInfo[];
    /**
     * 블록 단위 증분 패치 — 적용 후 세션 상태가 새 바이트로 갱신된다.
     *
     * - 호출은 내부적으로 직렬화된다 (동시 호출 시 도착 순서대로 누적 적용)
     * - 무변경 편집(현재 텍스트와 동일)은 조용히 건너뜀 (applied/skipped 모두 제외)
     * - 변경이 하나도 적용되지 않으면 반환 data는 현재 문서와 바이트 동일
     * - changes는 "패치 전 → 후" 문서 diff — modified 수가 기대 편집 수와
     *   일치하는지 확인 용도. patchHwpx의 verification(잔차 검증)과 의미가 다르다.
     */
    patchBlocks(edits: BlockEdit[], options?: PatchOptions): Promise<PatchResult>;
    private opQueue;
    private patchBlocksInner;
    /** 문단/헤딩 평문 편집 — patcher.patchParagraphUnit의 평문 입력 버전 */
    private patchParagraphPlain;
}
/** HWPX 문서 세션 열기 */
declare function openHwpxDocument(input: Uint8Array | ArrayBuffer): Promise<HwpxSession>;
/** 원샷 블록 패치 — 세션 없이 한 번에 (stateless RPC용) */
declare function patchHwpxBlocks(original: Uint8Array | ArrayBuffer, edits: BlockEdit[], options?: PatchOptions): Promise<PatchResult>;

type PrintPreset = "default" | "gov-formal" | "compact";
interface PageMargin {
    top: string | number;
    right: string | number;
    bottom: string | number;
    left: string | number;
}
interface PrintOptions {
    preset?: PrintPreset;
    pageSize?: "A4" | "Letter";
    orientation?: "portrait" | "landscape";
    margin?: PageMargin;
    /** 페이지 머리글 (HTML 허용, gov-formal 프리셋에서 자동 표시) */
    header?: string;
    /** 페이지 바닥글 (HTML 허용) */
    footer?: string;
    /** 워터마크 텍스트 (대각선 회색) */
    watermark?: string;
    /** 사용자 정의 추가 CSS */
    extraCss?: string;
}
/**
 * Markdown 또는 IRBlock[] → HTML 문자열.
 * 외부 PDF 엔진(weasyprint, wkhtmltopdf 등)과 결합 가능.
 */
declare function renderHtml(markdown: string, options?: PrintOptions): string;
/** Markdown → PDF (Buffer). */
declare function markdownToPdf(markdown: string, options?: PrintOptions): Promise<Buffer>;
/** IRBlock[] → PDF (Buffer). */
declare function blocksToPdf(blocks: IRBlock[], options?: PrintOptions): Promise<Buffer>;

/**
 * 공유 렌더 장면(RenderScene) 계약 — HWPX/HWP5 어댑터가 채우고 SVG·HTML·래스터·PDF·crop 이 소비한다 (#75).
 *
 * 좌표 규약: 공개 bbox 는 **pt**, **페이지 로컬**(물리 페이지 좌상단 원점), 페이지 번호 **1-based**.
 * 한 논리 개체가 여러 페이지에 걸치면 `regions` 에 페이지별 조각을 여럿 둔다(세로 스택 전역 좌표 금지).
 * region id 는 같은 문서·같은 옵션이면 결정적 — 그리기(문서) 순서로 유형별 일련번호를 매긴다.
 */
type RenderSourceFormat = "hwpx" | "hwp";
type RenderObjectType = "paragraph" | "table" | "image" | "shape" | "equation" | "unknown";
interface PageBBox {
    /** 1-based 페이지 */
    page: number;
    /** pt, 페이지 로컬, 좌상단 원점 */
    x: number;
    y: number;
    width: number;
    height: number;
}
interface RenderRegion {
    /** 결정적 id — `table-000017` 꼴 */
    id: string;
    type: RenderObjectType;
    /** 첫 조각의 페이지 (편의 필드) */
    page: number;
    /** 페이지별 조각 — 한 논리 개체가 여러 물리 페이지에 걸칠 수 있다 */
    regions: PageBBox[];
    /** 원본 식별자(HWPX `hp:tbl id` 등) — 있을 때만 */
    sourceId?: string;
    /** 중첩 표·셀 안 이미지·문단 안 개체의 부모 region */
    parentId?: string;
}
interface ScenePage {
    page: number;
    /** pt */
    width: number;
    height: number;
}
interface RenderScene {
    format: RenderSourceFormat;
    pages: ScenePage[];
    regions: RenderRegion[];
    warnings: string[];
    stats: {
        texts: number;
        tables: number;
        images: number;
        shapes: number;
    };
}

/**
 * 레이아웃 보존 렌더 — HWPX 조판 캐시(lineseg·cellAddr·hp:pos)를 SVG 절대배치로 그린다.
 *
 * 조판 엔진 없음: 한컴이 저장 시 기록한 좌표를 그대로 사용한다. 따라서
 * 한컴(또는 조판 캐시를 기록하는 편집기)에서 저장한 파일만 렌더 가능 —
 * markdownToHwpx 산출물엔 linesegarray가 없어 KordocError를 던진다.
 *
 * 좌표 산식(실측 검증 — .claude/plans/render-poc/findings.md):
 * - 단위 HWPUNIT(1/7200in), pt = /100. 최상위 문단 lineseg = 본문영역 로컬,
 *   셀 문단 = 셀 로컬. PARA 밀어내기 개체 anchor = 호스트vp − (omTop+h+omBottom) 역산.
 * - horzsize는 줄 "영역" 폭(텍스트 폭 아님) — 마지막 줄이 아닌 줄은 원본 줄바꿈에
 *   맞춰 textLength로 고정하고, 마지막 줄만 paraPr 정렬(LEFT 자연폭/CENTER/RIGHT/배분)을 적용.
 * - 좌표 속성엔 uint32로 저장된 음수가 섞여 있다(toInt32 필수).
 * - 표 열은 span 제약 경계 전파로, 행은 rs=1 max + 콘텐츠 초과 성장으로 푼다.
 *
 * 페이지: 최상위 lineseg vertpos는 페이지 로컬(페이지마다 0부터 리셋)이므로 역행
 *   지점을 페이지 경계로 감지, 전 페이지를 세로 스택으로 그린다(페이지별 흰 배경 +
 *   클립). 페이지에 걸친 표는 시작 페이지에서 잘린다(조판 캐시에 분할점이 없음).
 *
 * 범위: section0 한정(다중 구역은 첫 구역만), 수식·그리기개체 도형은 미지원(경고 수집).
 */

interface RenderSvgOptions {
    /** 이미지 1장당 허용 최대 바이트 (기본 40MB) */
    maxImageBytes?: number;
    /** 검색어 형광펜 — 텍스트 조각 내 매치 구간에 배경 rect (대소문자 무시).
     *  charPr(스타일) 경계에 걸친 매치는 칠하지 못한다. */
    highlights?: string[];
    /** Tier-2 reflow — 조판 캐시(linesegarray) 없는 파일도 순수 TS 조판으로 렌더.
     *  캐시가 있으면 무시(한컴본은 캐시 재생). 기본 false(캐시 없으면 KordocError). */
    reflow?: boolean;
    /** reflow 줄바꿈 폴백 모드 — 'keep'(어절) / 'charAll'(글자). 문단 paraPr에
     *  breakSetting 선언이 있으면 그 값이 우선하며(BREAK_WORD=어절, KEEP_WORD=글자 —
     *  이름 역전 주의), 이 옵션은 선언 없는 문단에만 적용된다. */
    reflowMode?: WrapMode;
}
interface RenderSvgResult {
    svg: string;
    /** 페이지 폭 (pt) */
    width: number;
    /** 전체 캔버스 높이 (pt) — 페이지 세로 스택 + 간격 */
    height: number;
    /** 렌더된 페이지 수 */
    pageCount: number;
    warnings: string[];
    stats: {
        texts: number;
        images: number;
        tables: number;
        shapes: number;
    };
    /** 개체 region(페이지 로컬 pt bbox·결정적 id) — #75 */
    regions: RenderRegion[];
}
/**
 * HWPX(한컴 저장본) → 레이아웃 보존 SVG. **전 구역(section*)을 세로 스택으로** 렌더한다.
 * 조판 캐시(linesegarray)가 없는 구역은 reflow 옵션으로 합성 조판(없으면 그 구역 생략);
 * 렌더 가능한 구역이 하나도 없으면 KordocError.
 */
declare function renderHwpxToSvg(input: ArrayBuffer | Uint8Array, options?: RenderSvgOptions): Promise<RenderSvgResult>;
/** 페이지별 독립 SVG 산출 — RenderScene 과 선택 페이지의 standalone SVG (#75 Task 3) */
interface HwpxPagesResult {
    scene: RenderScene;
    /** 페이지 번호(1-based) → standalone SVG. 선택된 페이지만 조립 */
    pageSvgs: Map<number, string>;
}

/**
 * HWP5 렌더 어댑터 (#75 Task 7) — BodyText 레코드(PARA_LINE_SEG·CTRL_HEADER/TABLE/LIST_HEADER·SHAPE_COMPONENT(_PICTURE))를
 * HWPX 조판 캐시와 같은 뜻의 section DOM 으로 합성해 공용 SVG 렌더러(svg-render)에 넘긴다.
 *
 * 근거: 같은 문서를 한컴이 HWPX 로 저장하면 lineseg(textpos/vertpos/horzpos/horzsize)·cellAddr/cellSz·pos/sz/outMargin 이
 * HWP5 레코드 값과 1:1 이다(bench/corpus/pairs hwp↔hwpx 실측, 2026-09-06). 그리기(페이지 분할·표 격자·이미지·region)는
 * svg-render 하나가 맡고, 이 모듈은 레코드 → 속성 번역만 한다. 목표는 픽셀 파리티가 아니라 **결정적·페이지 로컬 region**.
 *
 * 레코드 레이아웃(pairs 실측 · 스펙 5.0 rev1.3):
 *  - PARA_LINE_SEG 36B: textpos u32 | vertpos i32 | lineHeight | textHeight | baseline | spacing | horzpos | horzsize | flags
 *  - CTRL_HEADER 개체 공통 attr u32@4: bit0 treatAsChar · bit3-4 vertRelTo(0 PAPER/1 PAGE/2 PARA) · bit5-7 vertAlign ·
 *    bit8-9 horzRelTo(0 PAPER/1 PAGE/2 COLUMN/3 PARA) · bit10-12 horzAlign · bit21-23 textWrap(0 SQUARE/1 TOP_AND_BOTTOM/2 BEHIND/3 FRONT);
 *    vertOffset i32@8 · horzOffset@12 · width u32@16 · height@20 · outMargin u16×4@28(l r t b)
 *  - TABLE: rows u16@4 · cols@6 · inMargin u16×4@10. LIST_HEADER(셀): attr u32@2(bit5-6 vertAlign) · col u16@8 row@10 cs@12 rs@14 ·
 *    w u32@16 h@20 · margin u16×4@24 · borderFillId u16@32 (parser.ts parseCell 과 동일)
 *  - SHAPE_COMPONENT(gso 직속): "gso "@0 · chid@4 · offset i32@8/@12 · orgSz u32@20/@24 · curSz@28/@32. 묶음($con) 안 자식은 4바이트
 *    접두가 없어 chid@0 · offset@4/@8 · orgSz@16/@20 · curSz@24/@28 (licbyl 18018145 실측, 중첩 묶음도 같은 꼴). PICTURE: crop i32×4@44 · binDataId u16@71
 *  - DocInfo BORDER_FILL: 속성 u16@0 · 변 4개(왼/오/위/아래) = @2+6k (type u8 · width u8 · COLORREF) · 대각선 @26 · 채우기 type u32@32 ·
 *    배경 COLORREF@36 (pairs header.xml 대조: type 1=SOLID·8=DOUBLE_SLIM, width 1=0.12mm·6=0.4mm·7=0.5mm, 배경 0xFFFFFFFF=없음).
 *    CHAR_SHAPE: faceId u16@0 · ratio u8@14 · spacing i8@21 · relSize u8@28 · baseSize@42(1/100pt) · attr@46(bit0 italic·bit1 bold·bit2-3 underline) · color@52
 *
 * 한계(HWPX 경로와 동일): 머리말·꼬리말·각주 미렌더, 수식·OLE 경고, 조판 캐시(LINE_SEG) 없는 비한컴 저장본 문단은 reflow 폴백.
 * 한컴 접힘 PUA-A(결재란 "(인)" 등)는 글리프 복원을 우선해 그 문단 안에서만 슬롯이 어긋날 수 있다.
 */

interface RenderHwp5Options extends RenderSvgOptions {
    /** 암호 문서 열기 암호 */
    password?: string;
}
/** HWP5(OLE2) → 페이지별 독립 SVG + RenderScene. renderHwpxPages 와 같은 계약 (#75 Task 7) */
declare function renderHwp5Pages(input: ArrayBuffer | Uint8Array, options?: RenderHwp5Options, select?: Set<number> | ((pageCount: number) => Set<number>)): HwpxPagesResult;

/**
 * 통합 문서 렌더 API (#75 Task 3·8) — 입력(경로/버퍼) → 포맷 감지 → 어댑터 → RenderScene + 페이지 SVG
 * → SVG/HTML/PNG/JPEG/PDF 자산. 다운스트림은 RenderScene 만 알면 된다.
 *
 *   hwpx → HWPX 어댑터(svg-render, 조판 캐시 재생·reflow 폴백)
 *   hwp  → HWP5 어댑터(hwp5-scene: 레코드 → 동형 section DOM → 같은 렌더러)
 *   기타 → 미지원
 */

type RenderFormat = "svg" | "html" | "png" | "jpeg" | "pdf";
interface SceneRenderOptions {
    /** 1-based 페이지 선택 — [2,3] 또는 "1-3,7". 미지정이면 전 페이지 */
    pages?: number[] | string;
    /** 조판 캐시 없는 HWPX 를 순수 TS 조판으로 렌더 (기본 true — 캐시가 있으면 무시) */
    reflow?: boolean;
    /** 암호 HWP5 열기 암호 */
    password?: string;
    reflowMode?: WrapMode;
    highlights?: string[];
    maxImageBytes?: number;
}
interface SceneRenderResult {
    scene: RenderScene;
    /** 선택된 페이지의 standalone SVG (페이지 로컬 좌표) */
    pageSvgs: Map<number, string>;
}
interface RenderDocumentOptions extends SceneRenderOptions {
    format: RenderFormat;
    /** 래스터 출력 최대 폭 px */
    maxWidthPx?: number;
    /** JPEG 품질 */
    quality?: number;
    /** PDF 용 Chromium 실행 파일 */
    browserExecutablePath?: string;
    /** HTML/PDF 문서 제목 */
    title?: string;
}
interface RenderAsset {
    format: RenderFormat;
    /** 페이지 단위 산출은 page, 문서 단위(HTML/PDF)는 없음 */
    page?: number;
    data: string | Buffer;
    /** 픽셀(래스터) 또는 pt(SVG) */
    width?: number;
    height?: number;
    /** 래스터 pt→px 실배율 */
    scale?: number;
    mimeType?: string;
}
interface RenderDocumentResult {
    scene: RenderScene;
    assets: RenderAsset[];
}
type RenderInput = string | ArrayBuffer | Buffer | Uint8Array;
/**
 * 문서 → RenderScene + 선택 페이지 SVG. 페이지 선택은 조립 단계에서 걸러 비선택 페이지의 SVG 문자열을 만들지 않는다.
 * 선택 결과가 비면(범위 밖) KordocError.
 */
declare function renderDocumentToScene(input: RenderInput, options?: SceneRenderOptions): Promise<SceneRenderResult>;
/** 통합 렌더 — 포맷별 자산. 래스터·PDF 는 선택 페이지만 처리한다 */
declare function renderDocument(input: RenderInput, options: RenderDocumentOptions): Promise<RenderDocumentResult>;

/**
 * 레이아웃 보존 HTML — 페이지별 standalone SVG 를 `.kordoc-page[data-page]` 로 감싼 자급자족 문서 (#75 Task 4).
 * 의미 HTML(IRBlock → <h1>/<p>/<table>) 이 아니다 — 원본 조판 재현이 목적. CDN·외부 자원 없음.
 * 인쇄 CSS(@page 크기 = 첫 페이지 크기, 페이지마다 break-after) 를 포함해 PDF 경로가 그대로 소비한다.
 */

interface SceneHtmlOptions {
    /** <title> — 기본 "kordoc" */
    title?: string;
}
/**
 * @param scene    페이지 크기 메타(전 페이지)
 * @param pageSvgs 페이지 번호 → standalone SVG (선택된 페이지만 있어도 된다 — 있는 페이지만 방출)
 */
declare function renderSceneToHtml(scene: RenderScene, pageSvgs: Map<number, string>, options?: SceneHtmlOptions): string;

type RasterFormat = "png" | "jpeg";

/**
 * region crop (#75 Task 5) — RenderScene 의 페이지 로컬 bbox 를 래스터 실배율로 픽셀 환산해 잘라낸다.
 * DPI 를 여기서 다시 추정하지 않는다: pixel = pt × rasterize 가 돌려준 scale.
 * 의미 판단(진짜 표인지 조직도인지)은 하지 않는다 — 렌더러가 표라고 아는 개체를 자르는 것뿐.
 */

interface ExtractRegionOptions extends Pick<SceneRenderOptions, "pages" | "reflow" | "reflowMode"> {
    /** 기본 전 유형 */
    types?: RenderObjectType[];
    format?: RasterFormat;
    /** bbox 둘레 여백(pt) — 페이지 안으로 클램프 */
    paddingPt?: number;
    /** 페이지 래스터 최대 폭 px (crop 해상도) */
    maxWidthPx?: number;
    quality?: number;
    /** region 선별 — sourceId·id 로 특정 개체만 자를 때 (extractTables). types 필터 뒤에 적용 */
    filter?: (region: RenderRegion) => boolean;
}
interface RegionAsset {
    region: RenderRegion;
    page: number;
    bbox: PageBBox;
    mimeType: "image/png" | "image/jpeg";
    data: Buffer;
    widthPx: number;
    heightPx: number;
}
/** 렌더러가 아는 개체(표·이미지·문단·도형)를 페이지 이미지에서 잘라낸다. 페이지당 래스터 1회 */
declare function extractRenderedRegions(input: RenderInput, options?: ExtractRegionOptions): Promise<RegionAsset[]>;

/**
 * 표 분류기 (#76) — IRTable 이 "데이터 표"인지 "표를 레이아웃 캔버스로 쓴 것"(조직도·비상연락망·체계도)인지 휴리스틱 판정.
 *
 * 신호는 두 축. 의미 신호: 반복 행 스키마·격자 규칙성·활성 밀도·열 타입 일관성. 비표 신호: 병합 불규칙·빈 띠(행/열)·
 * 극단적 희소·중첩 구조 래퍼. 도표 문맥 키워드(조직도 등)는 구조 증거가 있을 때만 가산한다 — "조직도" 한 단어가 정상 표를
 * 도표로 바꾸면 안 된다. LLM·네트워크 없음. confidence 는 확률이 아니라 두 점수의 격차.
 */

interface ClassifyContext {
    /** 표 앞뒤 문단·캡션 텍스트 — 도표 문맥 키워드 판정용 */
    nearbyText?: string[];
}
declare function classifyTable(table: IRTable, ctx?: ClassifyContext): TableClassificationSummary;
/** 셀 안 블록에서 표 블록 재귀 수집 (문서 순서) — analyze·visual 이 공유 */
declare function collectTableBlocks(blocks: IRBlock[], out?: IRBlock[]): IRBlock[];

/**
 * 표 분류 배선 (#76 Task 3·5) — 파싱이 끝난 IRBlock 트리를 재귀하며 `IRTable.classification` 을 붙인다.
 * 원문 순서·셀 텍스트·캡션은 건드리지 않는다(메타만 추가). 기본 parse 는 이 함수를 부르지 않는다(opt-in).
 */

/** 트리 전체 분류(변경은 classification 필드 추가뿐). 같은 배열을 돌려준다 */
declare function classifyTableTree(blocks: IRBlock[]): IRBlock[];
type TableRepresentation = "gfm" | "html" | "visual";
/**
 * 분류 인식 표현 정책 — `visual` 은 명시 요청(스마트 시각 출력)에서만 나온다. 기본 마크다운 경로는 이 함수를 쓰지 않는다.
 *   단순 의미표 → gfm(손실 없을 때) · 구조 셀/병합 → html · non-tabular(+smart) → visual · uncertain(+smart) → html(구조)+시각은 호출자
 */
declare function chooseTableRepresentation(table: IRTable, opts?: {
    smartVisual?: boolean;
}): TableRepresentation;

/**
 * 분류된 표 ↔ 렌더 region 조인 (#76 Task 6·7). bbox 는 여기서 계산하지 않는다 — #75 의 RenderRegion.sourceId 로 IRTable.sourceId 를 잇는다
 * (HWPX 는 `hp:tbl id`, HWP5 는 table-ids.ts 의 문서 순번 `t{N}` — 파서·렌더 어댑터가 같은 프리패스를 쓴다).
 */

type TableVisualPolicy = "none" | "non-tabular" | "non-tabular-and-uncertain" | "all";
interface ExtractTableVisualOptions {
    /** 어떤 분류에 crop 을 만들지 — 기본 non-tabular-and-uncertain. none 이면 분류·region 만 */
    policy?: TableVisualPolicy;
    format?: "png" | "jpeg";
    paddingPt?: number;
    /** 페이지 래스터 최대 폭 px */
    maxWidthPx?: number;
}
interface ExtractedTableCrop {
    page: number;
    bbox: PageBBox;
    mimeType: "image/png" | "image/jpeg";
    data: Buffer;
}
interface ExtractedTable {
    /** sourceId(HWPX `hp:tbl id` · HWP5 `t{N}`) 또는 문서 순서 `tbl-N` */
    id: string;
    page: number;
    table: IRTable;
    classification: TableClassificationSummary;
    sourceId?: string;
    regions: PageBBox[];
    crops: ExtractedTableCrop[];
    /** 표별 경고 — region 미매칭·중복 매칭·렌더 미지원 형식 */
    warnings: string[];
}
/** 문서 → 분류된 표 목록(+HWPX·HWP 는 region·crop). 정상 parse 는 래스터하지 않는다 — 이 API 만 명시적으로 */
declare function extractTables(input: string | ArrayBuffer | Buffer, options?: ExtractTableVisualOptions): Promise<ExtractedTable[]>;

/** 매직 바이트 기반 파일 포맷 감지 */

/** ZIP 파일 여부: PK\x03\x04 */
declare function isZipFile(buffer: ArrayBuffer): boolean;
/** HWPX (ZIP 기반 한컴 문서): PK\x03\x04 — 하위 호환용 */
declare function isHwpxFile(buffer: ArrayBuffer): boolean;
/** HWP 5.x (OLE2 바이너리 한컴 문서): \xD0\xCF\x11\xE0 */
declare function isOldHwpFile(buffer: ArrayBuffer): boolean;
/** PDF 문서: %PDF */
declare function isPdfFile(buffer: ArrayBuffer): boolean;
/** 동기 포맷 감지 — ZIP은 모두 "hwpx"로 반환 (하위 호환) */
declare function detectFormat(buffer: ArrayBuffer): FileType;
/**
 * OLE2 컨테이너 내부 스트림 기반 포맷 세분화.
 * HWP 5.x, XLS 모두 OLE2이므로 스트림 이름으로 구분.
 *  - "Workbook" 또는 "Book" → 'xls'
 *  - 그 외 (FileHeader 등) → 'hwp'
 */
declare function detectOle2Format(buffer: ArrayBuffer): "hwp" | "xls" | "unknown";
/**
 * ZIP 내부 구조 기반 포맷 세분화.
 * HWPX, XLSX, DOCX, PPTX 모두 ZIP이므로 내부 파일로 구분.
 */
declare function detectZipFormat(buffer: ArrayBuffer): Promise<"hwpx" | "xlsx" | "docx" | "pptx" | "unknown">;

/**
 * 페이지별 마크다운 사영 (#68)
 *
 * 문서를 다시 파싱하지 않고 이미 만들어진 `IRBlock.pageNumber` 로만 블록을 갈라
 * 페이지마다 `blocksToMarkdown()` 을 돌린다. 페이지 번호의 신뢰도는 파서가
 * 정하는 것이고(`metadata.pageMode` — "layout" 은 실제 페이지, "section" 은
 * 섹션 근사), 여기서는 그 값을 그대로 존중한다.
 */

/**
 * 블록을 페이지 번호로 묶어 페이지별 마크다운을 만든다.
 *
 * - 어떤 블록에도 페이지 번호가 없으면 `undefined` — 페이지 개념이 없는 포맷에
 *   "전부 1페이지" 같은 없는 사실을 만들어 내지 않는다.
 * - 번호가 없는 블록은 **직전 블록의 페이지로 이어붙인다.** 블록은 읽기 순서라
 *   이게 원문 위치에 가장 가깝고, 무엇보다 어느 페이지에도 안 실려 조용히
 *   사라지는 블록이 생기지 않는다. 선두의 번호 없는 블록은 첫 실번호 페이지로.
 * - 관측된 최소~최대 페이지 사이의 빈 페이지도 항목으로 낸다. 여러 페이지에
 *   걸친 표는 시작 페이지 한 블록이라 중간 페이지가 실제로 비어 있고, 이때
 *   항목을 빼면 소비자가 배열 길이로 페이지 수를 셀 수 없다.
 * - `render` 는 쪽 블록 → 마크다운. 문서 마크다운에 포맷 고유 마무리가 붙는 파서(PDF: 쪽번호 제거·균등배분 정리)는
 *   같은 마무리를 넘겨 쪽 마크다운이 문서 마크다운과 어긋나지 않게 한다.
 */
declare function blocksToPages(blocks: IRBlock[], render?: (blocks: IRBlock[]) => string): PageMarkdown[] | undefined;

/** kordoc 공용 유틸리티 */
declare const VERSION: string;

/**
 * 파일 버퍼를 자동 감지하여 Markdown으로 변환
 *
 * @example
 * ```ts
 * import { parse } from "kordoc"
 * // 파일 경로로 파싱
 * const result = await parse("document.hwp")
 * // 또는 Buffer로 파싱
 * const result = await parse(buffer)
 * ```
 */
declare function parse(input: string | ArrayBuffer | Buffer, options?: ParseOptions): Promise<ParseResult>;
/** 이미지(PNG/JPEG/WebP)를 OCR 로 Markdown 변환 — 텍스트층이 없으므로 OCR 상시 적용 */
declare function parseImage(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** HWP 3.x (구버전 한컴 워드프로세서) 파일을 Markdown 으로 변환. */
declare function parseHwp3(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** HWPX 파일을 Markdown으로 변환 */
declare function parseHwpx(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** HWP 5.x 바이너리 파일을 Markdown으로 변환 */
declare function parseHwp(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** PDF 파일에서 텍스트를 추출하여 Markdown으로 변환 */
declare function parsePdf(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** XLSX 파일을 Markdown으로 변환 */
declare function parseXlsx(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** XLS (Excel 97-2003) 파일을 Markdown으로 변환 */
declare function parseXls(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** DOCX 파일을 Markdown으로 변환 */
declare function parseDocx(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** PPTX (PowerPoint) 파일을 Markdown으로 변환 — 슬라이드 1장 = 1쪽 */
declare function parsePptx(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/** HWPML (XML 기반 한컴 문서) 파일을 Markdown으로 변환 */
declare function parseHwpml(buffer: ArrayBuffer, options?: ParseOptions): Promise<ParseResult>;
/**
 * 서식 채우기 출력 포맷
 * - "markdown": 마크다운 텍스트
 * - "hwpx": 새로 생성한 HWPX (스타일 초기화)
 * - "hwpx-preserve": 원본 HWPX ZIP 직접 수정 (스타일 100% 보존, HWPX 입력만 가능)
 */
type FillOutputFormat = "markdown" | "hwpx" | "hwpx-preserve";
/** 서식 채우기 결과 */
interface FillFormOutput {
    /** 채워진 문서 (markdown: string, hwpx/hwpx-preserve: ArrayBuffer) */
    output: string | ArrayBuffer;
    /** 출력 포맷 */
    format: FillOutputFormat;
    /** 채우기 상세 — filled 필드 목록 + unmatched 라벨 */
    fill: {
        filled: FormField[];
        unmatched: string[];
    };
}
/**
 * 서식 문서를 파싱하여 필드를 채우고, 원하는 포맷으로 출력.
 *
 * - "hwpx-preserve": HWPX 입력 → 원본 ZIP XML 직접 수정 (테두리/폰트/병합 등 100% 보존)
 * - "hwpx": 아무 포맷 → IRBlock → Markdown → HWPX 생성 (스타일 초기화됨)
 * - "markdown": 아무 포맷 → IRBlock → Markdown
 *
 * @example
 * ```ts
 * // HWPX 원본 스타일 보존 채우기
 * const result = await fillForm("신청서.hwpx", { "성명": "홍길동" }, "hwpx-preserve")
 * writeFileSync("결과.hwpx", Buffer.from(result.output as ArrayBuffer))
 *
 * // 아무 포맷 → 마크다운 채우기
 * const result = await fillForm("신청서.hwp", { "성명": "홍길동" })
 * console.log(result.output)  // 채워진 마크다운
 * ```
 */
declare function fillForm(input: string | ArrayBuffer | Buffer, values: Record<string, FillInput>, outputFormat?: FillOutputFormat): Promise<FillFormOutput>;

export { BUILTIN_TEMPLATES, type BlockCapability, type BlockCapabilityInfo, type BlockDiff, type BlockEdit, type BlockSourceRef, type BorderDef, type BorderFillDef, type BoundingBox, type BuiltinTemplate, type CellCapability, type CellContext, type CellDiff, type CellProfile, type CharPrDef, type ChunkOptions, type ClassifyContext, type ClickHereField, DEFAULT_REDACT_RULES, type DiffChangeType, type DiffResult, type DocChunk, type DocumentMetadata, type DocumentQualitySummary, type ErrorCode, type ExtractRegionOptions, type ExtractTableVisualOptions, type ExtractedImage, type ExtractedTable, type ExtractedTableCrop, type FileType, type FillFormOutput, type FillInput, type FillOutputFormat, type FillResult, type FillValue, type FormField, type FormFieldSchema, type FormFieldType, type FormResult, type FormSchemaResult, type FormatProfile, type GongmunFont, type GongmunLintFinding, type GongmunNumbering, type GongmunOptions, type GongmunPreset, type GongmunPresetInput, type HwpxFillResult, HwpxSession, type HwpxTheme, type IRBlock, type IRBlockType, type IRCell, type IRTable, type ImageData, type InlineStyle, type MarkdownToHwpxOptions, type MeasureOptions, type MuncheLineKind, type MuncheLintFinding, type OcrProvider, type OutlineItem, PRESET_ALIAS, type PageBBox, type PageMargin, type PageMarkdown, type PageOptions, type PageQuality, type ParseFailure, type ParseOptions, type ParseResult, type ParseSuccess, type ParseWarning, type PatchOptions, type PatchResult, type PatchSkip, type PlaceSealResult, type PrintOptions, type PrintPreset, type RedactHit, type RedactOptions, type RedactRule, type RedactTextResult, type RegionAsset, type RenderAsset, type RenderDocumentOptions, type RenderDocumentResult, type RenderFormat, type RenderObjectType, type RenderRegion, type RenderScene, type RenderSourceFormat, type RenderSvgOptions, type RenderSvgResult, SPACE_EM_FIXED, SPACE_EM_FONT, type ScanCell, type ScanParaKind, type ScanParagraph, type ScanTable, type ScenePage, type SceneRenderOptions, type SceneRenderResult, type SealOp, type SealPlacement, type SectionScan, type SpliceEdit, type TRange, type TableProfile, type TableRepresentation, type TableVisualPolicy, VERSION, type ValidateIssue, type ValidateResult, ValueCursor, type WarningCode, type WatchOptions, type WrapMode, type WrapResult, applySplices, blocksToChunks, blocksToMarkdown, blocksToPages, blocksToPdf, buildParagraphSplices, buildRangeSplices, charWidthEm1000, chooseTableRepresentation, classifyTable, classifyTableTree, collectTableBlocks, compare, detectFormat, detectOle2Format, detectZipFormat, diffBlocks, extractClickHereFields, extractFormFields, extractFormSchema, extractRenderedRegions, extractTables, fillForm, fillFormFields, fillHwpx, fillWithUniqueGuard, fitRatioForFewerLines, flattenLayoutTables, formatFillValue, gongmunLintWarnings, hasStructuredCellContent, hwpxToProfile, incompatibleGongmunWarnings, inferFieldType, isHwpxFile, isKnownFont, isLabelCell, isOldHwpFile, isPdfFile, isZipFile, lintGongmunText, lintMuncheText, markdownToHwpx, markdownToPdf, measureTextWidth, muncheLintWarnings, normalizeGongmunPreset, openHwpxDocument, parse, parseDocx, parseHwp, parseHwp3, parseHwpml, parseHwpx, parseImage, parsePdf, parsePptx, parseXls, parseXlsx, patchHwp, patchHwpx, patchHwpxBlocks, placeSealHwpx, readBuiltinTemplate, readBuiltinTemplateSample, redactMarkdown, redactText, renderDocument, renderDocumentToScene, renderHtml, renderHwp5Pages, renderHwpxToSvg, renderSceneToHtml, resolveBuiltinTemplate, scanSectionXml, simulateWrap, simulateWrapKeepWord, unknownFontWarnings, usesGaejosikMunche, validateHwpx };
