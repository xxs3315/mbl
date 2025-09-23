import React from "react";

// SVG 图标属性常量
const SVG_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// 图标组件
export const AddIcon = () => (
  <svg {...SVG_PROPS}>
    <path d="M12 3v14" />
    <path d="M5 10h14" />
    <path d="M5 21h14" />
  </svg>
);

export const InsertLeftIcon = () => (
  <svg {...SVG_PROPS} style={{ transform: "rotate(-90deg)" }}>
    <path d="M12 3v14" />
    <path d="M5 10h14" />
    <path d="M5 21h14" />
  </svg>
);

export const InsertRightIcon = () => (
  <svg {...SVG_PROPS} style={{ transform: "rotate(90deg)" }}>
    <path d="M12 3v14" />
    <path d="M5 10h14" />
    <path d="M5 21h14" />
  </svg>
);

export const CopyIcon = () => (
  <svg {...SVG_PROPS}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const DeleteIcon = () => (
  <svg {...SVG_PROPS}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export const MoveLeftIcon = () => (
  <svg {...SVG_PROPS}>
    <path d="m9 6-6 6 6 6" />
    <path d="M3 12h14" />
    <path d="M21 19V5" />
  </svg>
);

export const MoveRightIcon = () => (
  <svg {...SVG_PROPS}>
    <path d="M3 5v14" />
    <path d="M21 12H7" />
    <path d="m15 18 6-6-6-6" />
  </svg>
);

export const ViewIcon = () => (
  <svg {...SVG_PROPS} width="12" height="12">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const AlignLeftIcon = () => (
  <svg {...SVG_PROPS} width="16" height="16">
    <line x1="21" x2="3" y1="6" y2="6" />
    <line x1="15" x2="3" y1="12" y2="12" />
    <line x1="17" x2="3" y1="18" y2="18" />
  </svg>
);

export const AlignCenterIcon = () => (
  <svg {...SVG_PROPS} width="16" height="16">
    <line x1="21" x2="3" y1="6" y2="6" />
    <line x1="17" x2="7" y1="12" y2="12" />
    <line x1="19" x2="5" y1="18" y2="18" />
  </svg>
);

export const AlignRightIcon = () => (
  <svg {...SVG_PROPS} width="16" height="16">
    <line x1="21" x2="3" y1="6" y2="6" />
    <line x1="21" x2="9" y1="12" y2="12" />
    <line x1="21" x2="5" y1="18" y2="18" />
  </svg>
);
