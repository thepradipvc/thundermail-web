import CodeBlock from "@/components/CodeBlock";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

const Home = async () => {
  return (
    <main>
      <section className="mt-12">
        <MaxWidthWrapper className="flex items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold md:text-6xl">
              Send <span className="text-primary">Emails</span> the{" "}
              <span className="text-primary">easy</span> way.
            </h1>
            <p className="mt-4 max-w-md md:text-lg">
              You can now send emails from your email account to your customers
              with ThunderMail&apos;s easy to use SDKs or use the API
            </p>
            <Button className="mt-4 md:mt-8" asChild>
              <Link href="/signin">Get Started</Link>
            </Button>
          </div>

          <div className="hidden flex-1 md:block">
            <Image
              className="rounded-lg"
              src="/email.svg"
              alt=""
              width={1920}
              height={1080}
            />
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="mt-12">
        <MaxWidthWrapper>
          <h2 className="text-center text-4xl font-semibold md:text-6xl">
            Code the way <br /> <span className="text-primary">you like</span>
          </h2>
          <div className="mt-4">
            <CodeBlock language="javascript" />
          </div>
          <p className="mt-4 px-4 text-muted-foreground">
            SDKs for other languages coming soon. Connect with me on twitter{" "}
            <Button variant="link" className="p-0 text-base underline" asChild>
              <a href="https://twitter.com/thepradipvc" target="_blank">
                thepradipvc
              </a>
            </Button>{" "}
            , if you would like to build an SDK for your favorite language{" "}
          </p>
        </MaxWidthWrapper>
      </section>

      <section className="mx-auto mt-20">
        <MaxWidthWrapper>
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="mt-2 text-4xl font-semibold text-foreground sm:text-5xl">
                Integrate with your favorite tools today
              </h2>
              <p className="mt-4 text-lg text-gray-200">
                Sending emails has never been easier than with ThunderMail.
              </p>
            </div>
          </div>

          {/* Steps */}
          <ol className="my-8 space-y-4 md:flex md:space-x-12 md:space-y-0">
            <li className="md:flex-1">
              <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary">Step 1</span>
                <span className="text-xl font-semibold">Setup account</span>
                <span className="mt-2 text-gray-100">
                  Sign up for an account and link your gmail account from the
                  dashboard.
                </span>
              </div>
            </li>
            <li className="md:flex-1">
              <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary">Step 2</span>
                <span className="text-xl font-semibold">Create an API Key</span>
                <span className="mt-2 text-gray-100">
                  Create an API Key from the dashboard to use with the
                  thundermail SDK.
                </span>
              </div>
            </li>
            <li className="md:flex-1">
              <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary">Step 3</span>
                <span className="text-xl font-semibold">
                  Start sending Emails
                </span>
                <span className="mt-2 text-gray-100">
                  It&apos;s that simple. Try out ThunderMail today - it realy
                  takes less than a minute.
                </span>
              </div>
            </li>
          </ol>

          <div className="mx-auto max-w-6xl">
            <div className="rounded-xl bg-gray-200/15 p-2 md:p-4">
              <Image
                src="/emails-dashboard-page.png"
                width={1920}
                height={972}
                quality={100}
                className="ring- rounded-md shadow-2xl ring-primary"
                alt="Emails dashboard preview"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <footer className="py-8">
        <MaxWidthWrapper className="flex flex-col items-center text-gray-300 sm:flex-row sm:gap-2">
          <div className="flex items-center gap-2">
            Built with <FaHeart className="text-red-500" /> by
            <Button variant="link" className="p-0 text-base underline" asChild>
              <a href="https://twitter.com/thepradipvc" target="_blank">
                thepradipvc.
              </a>
            </Button>
          </div>
          <div>
            The source code is available on{" "}
            <Button variant="link" className="p-0 text-base underline" asChild>
              <a
                href="https://github.com/thepradipvc/thundermail-web"
                target="_blank"
              >
                Github.
              </a>
            </Button>
          </div>
        </MaxWidthWrapper>
      </footer>
    </main>
  );
};

export default Home;
