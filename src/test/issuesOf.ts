interface SafeParseLike {
  readonly success: boolean;
  readonly error?: {
    readonly issues: readonly {
      readonly path: readonly PropertyKey[];
      readonly message: string;
    }[];
  };
}

/** Maps each failing field path (dot-joined) to its first zod issue message. */
export function issuesOf(result: SafeParseLike): Record<string, string> {
  const issues: Record<string, string> = {};
  for (const issue of result.error?.issues ?? []) {
    const key = issue.path.map(String).join(".");
    issues[key] ??= issue.message;
  }
  return issues;
}
