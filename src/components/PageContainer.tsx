import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className = "" }: Props) {
  return <div className={`page-container ${className}`.trim()}>{children}</div>;
}
