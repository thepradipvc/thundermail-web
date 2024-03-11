export async function GET() {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${`${process.env.NEXT_PUBLIC_BASE_URL}/api/link-gmail/callback`}&prompt=consent&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=https://mail.google.com+email&access_type=offline`;

  return Response.redirect(url);
}
