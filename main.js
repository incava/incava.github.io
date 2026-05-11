const categoryInput = document.querySelector("#category");
const languageInput = document.querySelector("#language");
const goalInput = document.querySelector("#goal");
const toneInput = document.querySelector("#tone");
const audienceInput = document.querySelector("#audience");
const constraintsInput = document.querySelector("#constraints");
const contextInput = document.querySelector("#context");
const generateButton = document.querySelector("#generateButton");
const copyButton = document.querySelector("#copyButton");
const promptPreview = document.querySelector("#promptPreview");
const statusMessage = document.querySelector("#statusMessage");

const storageKey = "prompt-crafter-form";

const templates = {
  writing: {
    ko: "당신은 구조가 탄탄한 콘텐츠 작성 전문가입니다.",
    en: "You are a structured content-writing expert.",
  },
  marketing: {
    ko: "당신은 전환을 고려해 메시지를 설계하는 마케팅 전략가입니다.",
    en: "You are a marketing strategist focused on conversion-aware messaging.",
  },
  coding: {
    ko: "당신은 요구사항을 빠르게 코드 작업 단위로 정리하는 시니어 개발자입니다.",
    en: "You are a senior engineer who turns requirements into practical coding tasks.",
  },
  study: {
    ko: "당신은 복잡한 개념을 학습 가능한 단계로 설명하는 튜터입니다.",
    en: "You are a tutor who breaks complex topics into learnable steps.",
  },
};

function buildPrompt() {
  const category = categoryInput.value;
  const language = languageInput.value;
  const goal = goalInput.value.trim() || "명확한 결과를 만들어 줘";
  const tone = toneInput.value.trim() || "명확하고 읽기 쉽게";
  const audience = audienceInput.value.trim() || "일반 사용자";
  const constraints = constraintsInput.value.trim() || "핵심만 간결하게 정리";
  const context = contextInput.value.trim() || "별도 참고 정보 없음";

  const isKorean = language === "ko";
  const prompt = isKorean
    ? [
        templates[category].ko,
        `목표: ${goal}`,
        `톤앤매너: ${tone}`,
        `대상 독자/사용자: ${audience}`,
        `반드시 지킬 조건: ${constraints}`,
        `참고 정보: ${context}`,
        "작업 방식:",
        "1. 먼저 가장 적합한 결과물을 바로 제시합니다.",
        "2. 필요한 경우 선택 이유나 대안을 짧게 덧붙입니다.",
        "3. 모호한 표현은 줄이고, 실행 가능한 문장으로 작성합니다.",
        "4. 출력은 한국어로 작성합니다.",
      ].join("\n")
    : [
        templates[category].en,
        `Goal: ${goal}`,
        `Tone: ${tone}`,
        `Audience: ${audience}`,
        `Constraints: ${constraints}`,
        `Context: ${context}`,
        "Working rules:",
        "1. Deliver the most useful result first.",
        "2. Add brief rationale or alternatives only if needed.",
        "3. Avoid vague wording and write in actionable language.",
        "4. Output must be in English.",
      ].join("\n");

  promptPreview.textContent = prompt;
  saveForm();
  statusMessage.textContent = isKorean
    ? "프롬프트를 생성했고 입력값도 브라우저에 저장했습니다."
    : "Prompt generated and inputs saved in this browser.";
}

function saveForm() {
  const payload = {
    category: categoryInput.value,
    language: languageInput.value,
    goal: goalInput.value,
    tone: toneInput.value,
    audience: audienceInput.value,
    constraints: constraintsInput.value,
    context: contextInput.value,
  };

  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function loadForm() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return;
  }

  try {
    const payload = JSON.parse(saved);
    categoryInput.value = payload.category || "writing";
    languageInput.value = payload.language || "ko";
    goalInput.value = payload.goal || "";
    toneInput.value = payload.tone || "";
    audienceInput.value = payload.audience || "";
    constraintsInput.value = payload.constraints || "";
    contextInput.value = payload.context || "";
  } catch {
    localStorage.removeItem(storageKey);
  }
}

async function copyPrompt() {
  const text = promptPreview.textContent.trim();
  if (!text || text.includes("입력 후 버튼을 누르면")) {
    statusMessage.textContent = "먼저 프롬프트를 생성해 주세요.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    statusMessage.textContent = "프롬프트를 클립보드에 복사했습니다.";
  } catch {
    statusMessage.textContent = "복사에 실패했습니다. 브라우저 권한을 확인해 주세요.";
  }
}

generateButton.addEventListener("click", buildPrompt);
copyButton.addEventListener("click", copyPrompt);

loadForm();
