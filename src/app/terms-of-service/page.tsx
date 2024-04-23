import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <MaxWidthWrapper className="my-12">
      <h1 className="text-center text-5xl font-bold">Terms of Service</h1>
      <div className="mx-auto mt-8 max-w-prose text-lg text-gray-200">
        <p>
          Welcome to Gmailit! These Terms of Service (ToS) govern your access to
          and use of the Gmailit email sending service. By accessing or using
          the Service, you agree to be bound by these ToS and our{" "}
          <Link className="underline underline-offset-4" href="/privacy-policy">
            Privacy Policy.
          </Link>
        </p>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            User Accounts
          </h2>
          <p>
            You must create an account to use the Service through a google auth
            and other required information. You are responsible for maintaining
            the confidentiality of your account credentials and for all
            activities that occur under your account.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Use of the Service
          </h2>
          <div>
            <p>
              You may use the Service solely for lawful purposes and in
              accordance with these ToS. You agree not to:
            </p>
            <ul className="list-disc pl-4">
              <li>Use the Service for any illegal or unauthorized purposes.</li>
              <li>
                Send spam, unsolicited bulk emails, or other forms of abusive
                content.
              </li>
              <li>
                Attempt to gain unauthorized access to or disrupt the Service or
                its systems.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p>
            The Service may integrate with or link to third-party services or
            websites. We do not control and are not responsible for the content,
            policies, or practices of any third-party services.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Termination
          </h2>
          <p>
            We reserve the right to terminate or suspend your access to the
            Service, without cause or notice, for any reason, including if you
            violate these ToS. Upon termination, your rights to use the Service
            will immediately cease.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Disclaimers and Limitation of Liability
          </h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any
            kind. We do not warrant that the Service will be uninterrupted,
            error-free, or secure. To the maximum extent permitted by law, we
            disclaim all liability for any indirect, punitive, incidental,
            special, or consequential damages arising out of or related to your
            use of the Service.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Changes to the ToS
          </h2>
          <p>
            We reserve the right to modify or update these ToS at any time. Your
            continued use of the Service after any changes constitute your
            acceptance of the revised ToS.. If we make material changes, we will
            notify you by email (sent to the email address specified in your
            account) or by means of a prominent notice on our website or
            service.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our privacy practices, please contact us at{" "}
            <a
              className="underline underline-offset-4"
              href="mailto:updates.mailit@gmail.com"
            >
              updates.mailit@gmail.com.
            </a>
          </p>
        </div>

        <p className="mt-12">Last Updated: 23 April, 2024</p>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
