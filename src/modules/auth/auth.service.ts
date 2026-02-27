import { prisma } from "../../config/database.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../../utils/jwt.js";
import type { SignupInput, LoginInput } from "./auth.schema.js";

function tokenPair(userId: string, username: string) {
  const payload = { sub: userId, username };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

function safeUser(user: { id: string; email: string; username: string }) {
  return { id: user.id, email: user.email, username: user.username };
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });

  if (existing) {
    const field = existing.email === input.email ? "email" : "username";
    const error = new Error(`A user with this ${field} already exists`);
    (error as any).statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { email: input.email, username: input.username, passwordHash },
  });

  return { user: safeUser(user), ...tokenPair(user.id, user.username) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    const error = new Error("Invalid email or password");
    (error as any).statusCode = 401;
    throw error;
  }

  return { user: safeUser(user), ...tokenPair(user.id, user.username) };
}

export async function refresh(refreshToken: string) {
  const payload = verifyToken(refreshToken);

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    const error = new Error("User no longer exists");
    (error as any).statusCode = 401;
    throw error;
  }

  return { user: safeUser(user), ...tokenPair(user.id, user.username) };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error("User not found");
    (error as any).statusCode = 404;
    throw error;
  }
  return safeUser(user);
}
