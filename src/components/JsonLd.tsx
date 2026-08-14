type Props = {
  data: Record<string, unknown>;
};

/** Prevent `</script>` breakout in JSON-LD payloads. */
function safeJsonLdStringify(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }}
    />
  );
}
