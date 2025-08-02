type PostgresErrorCause = {
  code: string;
  constraint?: string;
  detail?: string;
};

type HandledError = {
  code: string;
  message: string;
};

export function drizzleErrorHandler(err: unknown): HandledError {
  if (err instanceof Error && err.cause && typeof err.cause === "object") {
    const cause = err.cause as PostgresErrorCause;

    switch (cause.code) {
      case "23505":
        if (cause.constraint?.includes("users_userName_unique")) {
          return {
            code: "username_taken",
            message: "Username is already taken.",
          };
        }
        return {
          code: "unique_violation",
          message: "A unique field already exists.",
        };

      case "23503":
        return {
          code: "foreign_key_violation",
          message: "Related data is missing.",
        };

      case "23502":
        return {
          code: "not_null_violation",
          message: "A required field is missing.",
        };

      case "23514":
        return {
          code: "check_constraint_failed",
          message: "Invalid data input.",
        };

      default:
        return {
          code: "database_error",
          message: "A database error occurred.",
        };
    }
  }

  return { code: "unknown_error", message: "Something went wrong." };
}
