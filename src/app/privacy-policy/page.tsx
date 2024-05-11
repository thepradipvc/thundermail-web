import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const page = () => {
  return (
    <MaxWidthWrapper className="my-12">
      <h1 className="text-center text-5xl font-bold">Privacy Policy</h1>
      <div className="mx-auto mt-8 max-w-prose text-lg text-gray-200">
        <p>
          At Thunder Mail, we are committed to protecting your privacy and
          ensuring the security of your personal information. This Privacy
          Policy outlines how we collect, use, disclose, and safeguard the
          information you provide when using our email sending service.
        </p>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Information We Collect
          </h2>
          <p>
            When you register for Thunder Mail, we collect your email address
            and any other personal information you choose to provide, such as
            your email, name, and image. We also store the emails that
            you&apos;ve sent using Thunder Mail for your further reference.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <p>
            The information we collect is used solely to provide and improve the
            Thunder Mail email sending service. Specifically, we use your email
            address to authenticate and link your Gmail account(s) with our
            service. We use the email data (recipient addresses and content) to
            facilitate the sending of emails on your behalf. We do not sell,
            trade, or rent your personal information to third parties for
            marketing purposes.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Data Security
          </h2>
          <p>
            We implement reasonable security measures to protect your personal
            information from unauthorized access, use, or disclosure. These
            measures include secure data storage, encryption, and access
            controls.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            User Rights
          </h2>
          <p>
            You have the right to access, update, and delete your personal
            information stored by Thunder Mail. You can also revoke access to
            your Gmail account(s) at any time by removing them from our service.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-3xl font-semibold text-foreground">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. If we make
            material changes, we will notify you by email (sent to the email
            address specified in your account) or by means of a prominent notice
            on our website or service.
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
              href="mailto:info.thundermail@gmail.com"
            >
              info.thundermail@gmail.com.
            </a>
          </p>
        </div>

        <p className="mt-12">Last Updated: 23 April, 2024</p>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
