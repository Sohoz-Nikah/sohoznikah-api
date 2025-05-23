/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bcrypt from "bcryptjs";

async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    return match;
  } catch (error: any) {
    throw new Error("Error comparing passwords");
  }
}

export const AuthUtils = {
  comparePasswords,
};
