![Gmailit Cover](/screenshots/homepage.png)

<div style="font-size: 36px" align="center"><strong>Gmailit</strong></div>
<div align="center">
<a href="https://gmailit.vercel.app">Website</a> 
<span> · </span>
<a href="https://github.com/thepradipvc/gmailit-web">GitHub</a> 
</div>

## Introduction

Gmailit let's you send emails through your gmail account from your project/website in a easy way. Use Gmailit's [javascript SDK](https://www.npmjs.com/package/gmailit) or use the Gmailit API directly. Refer the [API guide](#api-guide) given below.

## Why

Everyone can't afford to buy domain for their side projects. I built gmailit with a similar experience to resend but using gmail account to send emails. Now you can use gmail without gmailit to send emails but gmailit provides you more. It gives you nice dashboard to view the emails you sent.

## Disclaimer

Gmailit is not a replacement for resend or a similar service for a businesses as it needs to send a lot of emails daily whereas gmail has limit of some 500 emails or so. Also a personal domain builds a more trust of a business.

## Features

- [Easy to use API](#api-guide)
- [Javascript SDK available](https://www.npmjs.com/package/gmailit)
- [Email history on dashboard](https://gmailit.vercel.app/dashboard/emails)

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Upstash](https://upstash.com/) – redis ratelimiting
- [Neon](https://neon.tech/) – database
- [Lucia Auth](https://lucia-auth.com/) – auth
- [Vercel](https://vercel.com/) – deployments
- [AWS SQS queue](https://aws.amazon.com/sqs/) – queue
- [AWS lambda functions](https://aws.amazon.com/lambda/) - sending emails

## API Guide

Send Email
```
Endpoint: POST -> https://gmailit.vercel.app/api/v1/emails
Headers:  Authorization: Bearer [API_KEY]
          Content-Type: application/json

Body Parameters:
1. from -> string (required)
Sender email address.
To include a friendly name, use the format "Your Name <sender@domain.com>".

2. to -> string | string[] (required)
Recipient email address. For multiple addresses, send as an array of strings.

3. subject -> string (required)
Email subject.

4. bcc -> string | string[]
Bcc recipient email address. For multiple addresses, send as an array of strings.

5. cc -> string | string[]
Cc recipient email address. For multiple addresses, send as an array of strings.

6. reply_to -> string | string[]
Reply-to email address. For multiple addresses, send as an array of strings.

7. html string
The HTML version of the message.

8. text string
The plain text version of the message.
```

Retrive Email
```
Endpoint: GET -> https://gmailit.vercel.app/api/v1/emails/[email_id]
Headers:  Authorization: Bearer [API_KEY]
          Content-Type: application/json

```