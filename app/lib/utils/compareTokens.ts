import { getRefreshToken } from "../db/queries/queries";
import { compare } from "bcrypt-ts";

export const compareTokens = async (token: string) => {
  const tokenToCompare = await getRefreshToken(token);

  if (!tokenToCompare) return false;

  const refreshTokenMatches = await compare(token, tokenToCompare);

  if (!refreshTokenMatches) return false;

  return true;
};
