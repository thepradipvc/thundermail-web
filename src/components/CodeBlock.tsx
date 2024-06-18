"use client";

import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { SiBun, SiExpress, SiRedwoodjs, SiRemix, SiPython } from "react-icons/si";
import { TbBrandNextjs, TbBrandNodejs, TbBrandNuxt } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type CodeBlockProps = {
  language: string;
};

const codes = [
  {
    name: "Python",
    language: "python",
    icon: <SiPython />,
    value: `from thundermail import ThunderMail
  
  thundermail = ThunderMail('tim_12345678')
  
  data = {
    'from' = 'you@example.com',
    'to' = 'user@google.com',
    'subject' = 'hello world',
    'html' = '<strong>it works!</strong>'
  }
  
  try:
  response = thundermail.send(**email_data)
  print(response)
  except Exception as e:
  print(e)`,
  },
  {
    name: "Node.js",
    language: "javascript",
    icon: <TbBrandNodejs />,
    value: `import { ThunderMail } from 'thundermail';

const thundermail = new ThunderMail('tim_12345678');

(async function() {
  const { data, error } = await thundermail.emails.send({
    from: 'onboarding@gmail.com',
    to: 'delivered@google.com',
    subject: 'Hello World',
    html: '<strong>it works!</strong>'
  });

  if (error) {
    return console.log(error);
  }

  console.log(data);
})();`,
  },
  {
    name: "Next.js",
    language: "javascript",
    icon: <TbBrandNextjs />,
    value: `import { EmailTemplate } from '@/components/email-template';
import { ThunderMail } from 'thundermail';

const thundermail = new ThunderMail(process.env.THUNDERMAIL_API_KEY);

export async function POST() {
  const { data, error } = await thundermail.emails.send({
    from: 'onboarding@gmail.com',
    to: 'delivered@google.com',
    subject: 'Hello world',
    react: EmailTemplate({ firstName: 'John' }),
  });

  if (error) {
    return Response.json({ error });
  }

  return Response.json(data);
}`,
  },
  {
    name: "Remix",
    language: "javascript",
    icon: <SiRemix />,
    value: `import { json } from '@remix-run/node';
import { ThunderMail } from 'thundermail';

const thundermail = new ThunderMail('tim_12345678');

export const loader = async () => {
  const { data, error } = await thundermail.emails.send({
    from: 'onboarding@gmail.com',
    to: 'delivered@google.com',
    subject: 'Hello World',
    html: '<strong>it works!</strong>',
  });

  if (error) {
    return json(error, 400);
  }

  return json(data, 200);
};`,
  },
  {
    name: "Nuxt",
    language: "javascript",
    icon: <TbBrandNuxt />,
    value: `import { ThunderMail } from 'thundermail';

const thundermail = new ThunderMail('tim_12345678');

export default defineEventHandler(async () => {
  const { data, error } = await thundermail.emails.send({
    from: 'onboarding@gmail.com',
    to: 'delivered@google.com',
    subject: 'Hello World',
    html: '<strong>it works!</strong>',
  });

  if (error) {
    return error;
  }

  return data;
});`,
  },
  {
    name: "Express",
    language: "javascript",
    icon: <SiExpress />,
    value: `import { ThunderMail } from 'thundermail';
import express, { Request, Response } from 'express';

const thundermail = new ThunderMail('tim_12345678');
const app = express();

app.get('/', async (req: Request, res: Response) => {
  const { data, error } = await thundermail.emails.send({
    from: 'onboarding@gmail.com',
    to: 'delivered@google.com',
    subject: 'Hello World',
    html: '<strong>it works!</strong>',
  });

  if (error) {
    return res.status(400).json(error);
  }

  return res.status(200).json(data);
})`,
  },
  {
    name: "Redwood",
    language: "javascript",
    icon: <SiRedwoodjs />,
    value: `import { ThunderMail } from 'thundermail';
import type { APIGatewayEvent, Context } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const thundermail = new ThunderMail('tim_12345678');

  const { data, error } = await thundermail.emails.send({
    from: 'onboarding@gmail.com',
    to: ['delivered@google.com'],
    subject: 'Hello World',
    html: '<strong>it works!</strong>',
  });

  if (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  };
};`,
  },
  {
    name: "Bun",
    language: "javascript",
    icon: <SiBun />,
    value: `import { ThunderMail } from 'thundermail';
import { EmailTemplate } from './email-template';

const thundermail = new ThunderMail('tim_12345678');

const server = Bun.serve({
  port: 3000,
  async fetch() {
    const { data, error } = await thundermail.emails.send({
      from: 'onboarding@gmail.com',
      to: ['delivered@google.com'],
      subject: 'Hello World',
      html: '<strong>it works!</strong>',
    });

    if (error) {
      return new Response(JSON.stringify(error));
    }

    return new Response(JSON.stringify(data));
  },
});

console.log(\`Listening on http://localhost:\${server.port} ...\`);`,
  },
];

const CodeBlock = ({ language }: CodeBlockProps) => {
  const [active, setActive] = useState("Python");
  const [code, setCode] = useState(codes[0].value);
  const [codeLanguage, setCodeLanguage] = useState(codes[0].language);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleCodeChange = (name: string) => {
    const selectedCode = codes.find((code) => code.name === name)!;
    setActive(name);
    setCode(selectedCode.value);
    setCodeLanguage(selectedCode.language);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between gap-2 border border-gray-800 bg-background px-2 md:px-8">
        <div className="flex gap-2 overflow-x-scroll rounded-r-md bg-gradient-to-l from-gray-950 to-10%">
          {codes.map((code, index) => (
            <LanguageButton
              key={code.name}
              name={code.name}
              icon={code.icon}
              isActive={code.name === active}
              handleCodeChange={handleCodeChange}
            />
          ))}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                if (!isCopied) {
                  handleCopy();
                }
              }}
              disabled={isCopied}
              className={cn(
                "my-2 flex w-8 items-center justify-center self-stretch rounded-md p-1",
                {
                  "text-muted-foreground hover:bg-gray-800 hover:text-gray-200":
                    !isCopied,
                  "border border-gray-800 text-success-foreground": isCopied,
                },
              )}
            >
              {isCopied ? <TiTick /> : <ClipboardList />}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {isCopied ? "Copied" : "Copy to clipboard"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <SyntaxHighlighter
        showLineNumbers
        customStyle={{
          backgroundColor: "#05050A",
          margin: 0,
          padding: "1rem 1rem 1rem 0",
        }}
        language={codeLanguage}
        style={nord}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

const LanguageButton = ({
  name,
  icon,
  handleCodeChange,
  isActive = false,
}: {
  name: string;
  icon: JSX.Element;
  handleCodeChange: (name: string) => void;
  isActive?: boolean;
}) => {
  return (
    <button
      className={cn(
        "my-2 flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:text-gray-200",
        {
          "bg-gradient-to-b from-slate-700 text-gray-200 shadow-sm shadow-slate-600":
            isActive,
        },
      )}
      onClick={() => handleCodeChange(name)}
    >
      <span
        className={cn({
          "text-[#67ffded2]": isActive,
          "text-xs": name === "Remix",
        })}
      >
        {icon}
      </span>
      {name}
    </button>
  );
};
