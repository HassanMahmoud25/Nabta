export type AppErrorCode =
  | "auth"
  | "network"
  | "not-found"
  | "validation"
  | "unknown";

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (
    error instanceof TypeError &&
    error.message.toLowerCase().includes("network")
  ) {
    return new AppError(
      "network",
      "Please check your connection and try again.",
      error,
    );
  }
  if (__DEV__) console.error("[Nabta]", error);
  return new AppError(
    "unknown",
    "Something went wrong. Please try again.",
    error,
  );
}
