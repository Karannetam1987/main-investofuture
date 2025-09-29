import { TrendingUp } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="InvestoFuture Home">
      <TrendingUp className="h-7 w-7 text-secondary" />
      <span className="text-xl font-bold text-secondary font-headline">
        InvestoFuture
      </span>
    </Link>
  );
}
