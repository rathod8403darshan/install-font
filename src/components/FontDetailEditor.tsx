"use client";

import { useState } from "react";
import { FontGenerator } from "@/components/FontGenerator";
import { FontSuggestionsSection } from "@/components/FontSuggestionsSection";
import { PREVIEW_FONT_KEYS, type PreviewFontKey } from "@/fonts/preview-fonts";
import type { ShowcaseCard } from "@/data/font-showcase";

type Props = {
  card: ShowcaseCard;
};

export function FontDetailEditor({ card }: Props) {
  const fallbackKey: PreviewFontKey = card.fontKey ?? PREVIEW_FONT_KEYS[0]!;
  const [previewText, setPreviewText] = useState(card.previewText);
  const [fontKey, setFontKey] = useState<PreviewFontKey>(fallbackKey);

  return (
    <>
      <FontGenerator
        card={card}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
        fontKey={fontKey}
        onFontKeyChange={setFontKey}
      />
      <FontSuggestionsSection
        text={previewText}
        selectedKey={fontKey}
        onSelect={setFontKey}
      />
    </>
  );
}
