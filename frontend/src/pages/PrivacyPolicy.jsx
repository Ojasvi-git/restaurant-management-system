const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#4b2e1f]">
      {/* Hero */}
      <section className="bg-[#4b2e1f] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
            Flavor House
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-orange-100">
            Your privacy is important to us. This policy explains how
            Flavor House collects, uses, and protects your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl space-y-8">

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              1. Information We Collect
            </h2>

            <p className="leading-8 text-[#6b4423]">
              When you use our restaurant management website, we may collect
              information such as your name, email address, mobile number,
              order details, and feedback or ratings that you voluntarily
              provide.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              2. How We Use Your Information
            </h2>

            <p className="leading-8 text-[#6b4423]">
              We use your information to create and manage your account,
              process restaurant orders, provide order updates, manage
              customer support, improve our services, and maintain the
              security of our website.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              3. Account Information
            </h2>

            <p className="leading-8 text-[#6b4423]">
              If you create an account, you are responsible for keeping your
              login credentials secure. We recommend that you do not share
              your password with anyone.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              4. Orders and Customer Information
            </h2>

            <p className="leading-8 text-[#6b4423]">
              Information related to your restaurant orders may be stored in
              our system so that orders can be processed, tracked, billed,
              and managed properly.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              5. Feedback and Reviews
            </h2>

            <p className="leading-8 text-[#6b4423]">
              If you submit a rating or feedback, the information may be
              stored and displayed to authorized restaurant administrators
              for service improvement and management purposes.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              6. Data Security
            </h2>

            <p className="leading-8 text-[#6b4423]">
              We take reasonable measures to protect your information from
              unauthorized access, misuse, alteration, or disclosure.
              However, no internet-based system can be guaranteed to be
              completely secure.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              7. Third-Party Services
            </h2>

            <p className="leading-8 text-[#6b4423]">
              Our website may use third-party services for hosting, cloud
              storage, authentication, analytics, or other technical
              functionality. These services may process information according
              to their own privacy policies.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <h2 className="mb-4 text-2xl font-bold text-[#8b4513]">
              8. Changes to This Policy
            </h2>

            <p className="leading-8 text-[#6b4423]">
              We may update this Privacy Policy from time to time. Any
              changes will be reflected on this page.
            </p>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-7 md:p-10">
            <h2 className="mb-3 text-2xl font-bold text-[#8b4513]">
              Contact Us
            </h2>

            <p className="leading-8 text-[#6b4423]">
              If you have any questions about this Privacy Policy, please
              contact Flavor House through the contact information provided
              on our Contact page.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;