import { SOCIAL_LINKS } from "@/lib/site-config";

type Props = {
  className?: string;
  linkClassName?: string;
};

export function SocialLinks({
  className = "",
  linkClassName = "",
}: Props) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {SOCIAL_LINKS.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded-full border border-[color:var(--header-border)] bg-[var(--header-surface)] px-3.5 py-2 text-sm font-medium text-[var(--foreground)]/90 transition-[border-color,background-color,color] hover:border-[var(--accent)]/40 hover:bg-[var(--header-hover)] hover:text-[var(--foreground)] ${linkClassName}`.trim()}
            aria-label={`${link.label} (opens in new tab)`}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
