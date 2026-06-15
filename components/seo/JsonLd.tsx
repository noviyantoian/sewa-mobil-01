/**
 * Renders a JSON-LD <script> tag. Server component only.
 *
 * This is the ONE sanctioned use of dangerouslySetInnerHTML in this codebase:
 * the payload is a server-serialized schema.org object (no user input).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
