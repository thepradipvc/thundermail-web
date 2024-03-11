import { validateUser } from "@/auth";
import { db } from "@/db";
import { gmailAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { NextRequest } from "next/server";
import { parseJWT } from "oslo/jwt";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/link-gmail/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!res.ok) {
      return new Response(null, {
        status: 400,
      });
    }

    const tokens: authResponse = await res.json();

    const googleUser = parseJWT(tokens.id_token)!.payload as GoogleUser;

    const { user } = await validateUser();

    if (!user) {
      return new Response("Bad Resquest", {
        status: 400,
      });
    }

    const existingAccount = await db.query.gmailAccounts.findFirst({
      where: eq(gmailAccounts.email, googleUser.email),
    });

    if (existingAccount && user.id == existingAccount.userId) {
      await db
        .update(gmailAccounts)
        .set({ refreshToken: tokens.refresh_token, status: "active" });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard/gmail-accounts",
        },
      });
    }

    if (existingAccount) {
      return new Response(null, {
        status: 302,
        headers: {
          Location:
            "/dashboard/gmail-accounts?error=This gmail account is already registered with some other account",
        },
      });
    }

    const gmailAccountId = generateId(15);
    await db.insert(gmailAccounts).values({
      id: gmailAccountId,
      email: googleUser.email,
      refreshToken: tokens.refresh_token,
      status: "active",
      userId: user.id,
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard/gmail-accounts",
      },
    });
  } catch (e) {
    return new Response(null, {
      status: 500,
    });
  }
}

type authResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
};

type GoogleUser = {
  sub: string;
  email: string;
};
