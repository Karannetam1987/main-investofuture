"use client";

import { useMemo } from "react";
import type { Query, DocumentReference } from "firebase/firestore";

// This hook is used to memoize Firebase queries and references.
// It is important to prevent infinite loops when using hooks like useCollection or useDoc.
export function useMemoFirebase<T extends Query | DocumentReference>(
    factory: () => T | null,
    deps: React.DependencyList
): T | null {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(factory, deps);
}
