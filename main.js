const templateInput = document.querySelector("#template");
const languageInput = document.querySelector("#language");
const subjectInput = document.querySelector("#subject");
const sceneInput = document.querySelector("#scene");
const styleInput = document.querySelector("#style");
const lightingInput = document.querySelector("#lighting");
const compositionInput = document.querySelector("#composition");
const paletteInput = document.querySelector("#palette");
const ratioInput = document.querySelector("#ratio");
const qualityInput = document.querySelector("#quality");
const detailsInput = document.querySelector("#details");
const negativeInput = document.querySelector("#negative");
const generateButton = document.querySelector("#generateButton");
const copyButton = document.querySelector("#copyButton");
const promptPreview = document.querySelector("#promptPreview");
const statusMessage = document.querySelector("#statusMessage");
const templateName = document.querySelector("#templateName");
const templateDescription = document.querySelector("#templateDescription");
const templateBase = document.querySelector("#templateBase");

const storageKey = "prompt-crafter-form";

const templates = {
  portrait: {
    label: "인물 Portrait",
    description: "인물의 표정, 의상, 무드, 배경 깊이를 중심으로 구성합니다.",
    base: {
      ko: "주제 인물을 중심에 두고, 얼굴 인상과 의상 디테일, 배경 분위기까지 함께 설계하는 인물 이미지 프롬프트",
      en: "A portrait-focused image prompt built around the subject's expression, styling, and atmospheric background depth.",
    },
    prompt: {
      ko: "세련된 인물 이미지, 표정과 스타일링이 살아 있고 배경이 무드를 보강하는 구성",
      en: "A refined portrait image where expression, styling, and background atmosphere work together.",
    },
  },
  product: {
    label: "제품 Product",
    description: "브랜드 제품을 선명하게 드러내고 재질과 고급감을 강조합니다.",
    base: {
      ko: "제품의 형태, 재질, 반사, 브랜드 무드를 또렷하게 보여주는 제품 광고 이미지 프롬프트",
      en: "A product-ad prompt that highlights form, material, reflections, and brand atmosphere with clarity.",
    },
    prompt: {
      ko: "광고용 제품 이미지, 재질 표현과 라이팅이 핵심인 고급 스튜디오 연출",
      en: "A premium studio product visual focused on material definition and lighting control.",
    },
  },
  interior: {
    label: "공간 Interior",
    description: "공간의 구조, 재료감, 자연광 흐름, 동선을 함께 묘사합니다.",
    base: {
      ko: "건축적 구조와 소재, 조명 분위기, 공간 깊이를 함께 설계하는 인테리어 이미지 프롬프트",
      en: "An interior prompt that defines architecture, materials, light atmosphere, and spatial depth together.",
    },
    prompt: {
      ko: "감도 높은 공간 이미지, 구조적 질서와 조명 무드가 살아 있는 연출",
      en: "A tasteful interior scene with strong spatial rhythm and deliberate lighting mood.",
    },
  },
  poster: {
    label: "포스터 Poster",
    description: "키비주얼과 타이포그래피가 함께 보이는 그래픽 중심 템플릿입니다.",
    base: {
      ko: "강한 메시지 전달을 위해 메인 비주얼과 타이포 리듬을 함께 설계하는 포스터 프롬프트",
      en: "A poster prompt designed to combine a key visual with rhythmic typography and clear messaging.",
    },
    prompt: {
      ko: "강렬한 포스터 비주얼, 그래픽 포인트와 타이포 레이아웃이 균형 잡힌 구성",
      en: "A bold poster visual balancing graphic impact with structured typography layout.",
    },
  },
};

function updateTemplatePreview() {
  const template = templates[templateInput.value];
  const language = languageInput.value;

  templateName.textContent = template.label;
  templateDescription.textContent = template.description;
  templateBase.textContent = template.base[language];
}

function buildPrompt() {
  const template = templates[templateInput.value];
  const language = languageInput.value;
  const subject = subjectInput.value.trim() || "main subject";
  const scene = sceneInput.value.trim() || "designed environment";
  const style = styleInput.value;
  const lighting = lightingInput.value;
  const composition = compositionInput.value;
  const palette = paletteInput.value;
  const ratio = ratioInput.value;
  const quality = qualityInput.value.trim() || "high detail, clean rendering, refined texture";
  const details = detailsInput.value.trim() || "no extra custom instructions";
  const negative = negativeInput.value.trim() || "blurry, distorted anatomy, low quality, watermark";

  const isKorean = language === "ko";
  const prompt = isKorean
    ? [
        `[${template.label}]`,
        template.prompt.ko,
        `메인 피사체: ${subject}`,
        `장면 설명: ${scene}`,
        `스타일: ${style}`,
        `조명: ${lighting}`,
        `구도: ${composition}`,
        `색감: ${palette}`,
        `화면 비율: ${ratio}`,
        `품질 키워드: ${quality}`,
        `추가 커스텀: ${details}`,
        `네거티브 프롬프트: ${negative}`,
        "",
        "최종 이미지 프롬프트:",
        `${subject}, ${scene}, ${template.prompt.ko}, ${style} style, ${lighting} lighting, ${composition}, ${palette} palette, aspect ratio ${ratio}, ${quality}, ${details}`,
      ].join("\n")
    : [
        `[${template.label}]`,
        template.prompt.en,
        `Subject: ${subject}`,
        `Scene: ${scene}`,
        `Style: ${style}`,
        `Lighting: ${lighting}`,
        `Composition: ${composition}`,
        `Palette: ${palette}`,
        `Aspect Ratio: ${ratio}`,
        `Quality Notes: ${quality}`,
        `Custom Details: ${details}`,
        `Negative Prompt: ${negative}`,
        "",
        "Final Image Prompt:",
        `${subject}, ${scene}, ${template.prompt.en}, ${style} style, ${lighting} lighting, ${composition}, ${palette} palette, aspect ratio ${ratio}, ${quality}, ${details}`,
      ].join("\n");

  promptPreview.textContent = prompt;
  saveForm();
  statusMessage.textContent = isKorean
    ? "프롬프트를 생성했고 입력값도 브라우저에 저장했습니다."
    : "Prompt generated and inputs saved in this browser.";
}

function saveForm() {
  const payload = {
    template: templateInput.value,
    language: languageInput.value,
    subject: subjectInput.value,
    scene: sceneInput.value,
    style: styleInput.value,
    lighting: lightingInput.value,
    composition: compositionInput.value,
    palette: paletteInput.value,
    ratio: ratioInput.value,
    quality: qualityInput.value,
    details: detailsInput.value,
    negative: negativeInput.value,
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
    templateInput.value = payload.template || "portrait";
    languageInput.value = payload.language || "ko";
    subjectInput.value = payload.subject || "";
    sceneInput.value = payload.scene || "";
    styleInput.value = payload.style || "cinematic";
    lightingInput.value = payload.lighting || "soft";
    compositionInput.value = payload.composition || "closeup";
    paletteInput.value = payload.palette || "warm";
    ratioInput.value = payload.ratio || "1:1";
    qualityInput.value = payload.quality || "";
    detailsInput.value = payload.details || "";
    negativeInput.value = payload.negative || "";
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
templateInput.addEventListener("change", updateTemplatePreview);
languageInput.addEventListener("change", updateTemplatePreview);

loadForm();
updateTemplatePreview();
