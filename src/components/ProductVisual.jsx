function Hookah() {
  return (
    <>
      <path d="M58 22c10 8 12 16 8 26H46c-3-10 0-18 12-26Z" fill="currentColor" fillOpacity="0.14" />
      <path d="M40 48h36" />
      <path d="M58 48v16" />
      <path d="M30 64h56" />
      <path d="M58 64v24" />
      <path d="M38 112c0-16 8-26 20-26s20 10 20 26c0 14-8 26-20 26s-20-12-20-26Z" fill="currentColor" fillOpacity="0.14" />
      <path d="M78 74c18 2 26 14 28 32" />
      <path d="M106 106v10" />
    </>
  );
}

function Bowl() {
  return (
    <path
      d="M34 58h52l-8 42c-2 16-10 26-18 26s-16-10-18-26L34 58Zm8 0c2-14 8-22 18-22s16 8 18 22"
      fill="currentColor"
      fillOpacity="0.14"
    />
  );
}

function Kaloud() {
  return (
    <>
      <circle cx="60" cy="78" r="30" fill="currentColor" fillOpacity="0.14" />
      <circle cx="60" cy="78" r="30" />
      <path d="M60 48v60M30 78h60M40 58l40 40M40 98 80 58" />
      <circle cx="60" cy="78" r="8" />
    </>
  );
}

function Flask() {
  return (
    <path
      d="M48 28h24v20c16 8 24 24 24 42 0 24-14 40-36 40S24 114 24 90c0-18 8-34 24-42V28Z"
      fill="currentColor"
      fillOpacity="0.14"
    />
  );
}

function Shaft() {
  return (
    <>
      <rect x="48" y="18" width="24" height="124" rx="12" fill="currentColor" fillOpacity="0.14" />
      <path d="M44 36h32M44 124h32" />
    </>
  );
}

function Mesh() {
  return (
    <>
      <circle cx="60" cy="80" r="34" fill="currentColor" fillOpacity="0.14" />
      <circle cx="60" cy="80" r="34" />
      <path d="M34 62h52M34 80h52M34 98h52M46 46v68M60 46v68M74 46v68" />
    </>
  );
}

const figures = {
  hookah: Hookah,
  bowls: Bowl,
  kalouds: Kaloud,
  flasks: Flask,
  shafts: Shaft,
  meshes: Mesh,
};

export default function ProductVisual({ category }) {
  const Figure = figures[category] || Hookah;
  return (
    <div className={`visual visual-${category || "hookah"}`}>
      <svg
        viewBox="0 0 120 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <Figure />
      </svg>
    </div>
  );
}
