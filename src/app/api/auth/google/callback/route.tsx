import { lucia } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { parseJWT } from "oslo/jwt";
import { google } from "../_googleAuthInstance";
import { thundermail } from "@/lib/thundermail";
import ThunderMailWelcomeEmail from "@/lib/emails/welcome";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier =
    cookieStore.get("google_oauth_code_verifier")?.value ?? null;
  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const googleUser = parseJWT(tokens.idToken)!.payload as GoogleUser;

    const existingUser = await db.query.users.findFirst({
      where: eq(users.googleId, googleUser.sub),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const userId = generateId(15);

    await db.insert(users).values({
      id: userId,
      googleId: googleUser.sub,
      username: googleUser.name,
      image: googleUser.picture,
    });

    await thundermail.emails.send({
      from: "ThunderMail <info.thundermail@gmail.com>",
      to: googleUser.email,
      subject: "Welcome to ThunderMail",
      react: <ThunderMailWelcomeEmail username={googleUser.name} />,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

type GoogleUser = {
  sub: string;
  email: string;
  name: string;
  picture: string;
};
