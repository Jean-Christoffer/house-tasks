"use server";

import { userSchema } from "../schema/schema";
import { createUser } from "../db/queries";
import { drizzleErrorHandler } from "../db/errorHandler";

export type SignUpActionState = {
  username?: string;
  password?: string;
  errors?: {
    username?: string[];
    password?: string[];
    message?: string;
  };
  ok?: boolean;
};

export async function signupAction(
  _prevState: SignUpActionState,
  formData: FormData,
): Promise<SignUpActionState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validatedFields = userSchema.safeParse({
    username,
    password,
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      username,
      password,
      errors: fieldErrors,
    };
  }

  try {
    await createUser(username, password);
    return { ok: true };
  } catch (err) {
    const drizzleError = drizzleErrorHandler(err);
    console.error(drizzleError);
    const clientMessage = drizzleError.message;

    return {
      errors: {
        message: clientMessage,
      },
    };
  }
}
