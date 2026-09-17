
import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    // Demo contact form
    setTimeout(() => {
      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#fffaf3]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#4b270b] px-6 py-20">

        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-orange-500/10" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-orange-400/10" />

        <div className="relative mx-auto max-w-5xl text-center">

          <span className="inline-block rounded-full border border-orange-300/30 bg-orange-500/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
            Get In Touch
          </span>

          <h1 className="mt-6 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            We'd Love to
            <span className="block text-orange-400">
              Hear From You
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-orange-100/80 sm:text-lg">
            Have a question, suggestion or simply want to say hello?
            Send us a message and our team will be happy to help.
          </p>

        </div>
      </section>


      {/* ================= CONTACT SECTION ================= */}
      <section className="px-6 py-20">

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">

          {/* ================= CONTACT INFO ================= */}
          <div className="lg:col-span-2">

            <p className="font-bold uppercase tracking-widest text-orange-600">
              Contact Us
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#4b270b] sm:text-4xl">
              Let's make your
              <span className="text-orange-600">
                {" "}experience better.
              </span>
            </h2>

            <p className="mt-5 leading-8 text-[#73553c]">
              Whether you have a question about our menu, an order,
              feedback or anything else, feel free to reach out to us.
            </p>


            {/* Contact Cards */}
            <div className="mt-8 space-y-4">

              {/* Address */}
              <div className="group flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl transition group-hover:scale-110">
                  📍
                </div>

                <div>
                  <h3 className="font-bold text-[#4b270b]">
                    Visit Us
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#80664f]">
                    Saharanpur,
                    <br />
                    Uttar Pradesh, India
                  </p>
                </div>

              </div>


              {/* Phone */}
              <div className="group flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl transition group-hover:scale-110">
                  📞
                </div>

                <div>
                  <h3 className="font-bold text-[#4b270b]">
                    Call Us
                  </h3>

                  <p className="mt-1 text-sm text-[#80664f]">
                    +91 98XXX XXXXX
                  </p>
                </div>

              </div>


              {/* Email */}
              <div className="group flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl transition group-hover:scale-110">
                  ✉️
                </div>

                <div>
                  <h3 className="font-bold text-[#4b270b]">
                    Email Us
                  </h3>

                  <p className="mt-1 break-all text-sm text-[#80664f]">
                    hello@flavorhouse.com
                  </p>
                </div>

              </div>


              {/* Opening Hours */}
              <div className="group flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl transition group-hover:scale-110">
                  🕐
                </div>

                <div>
                  <h3 className="font-bold text-[#4b270b]">
                    Opening Hours
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#80664f]">
                    Monday - Sunday
                    <br />
                    10:00 AM - 11:00 PM
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* ================= CONTACT FORM ================= */}
          <div className="lg:col-span-3">

            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-xl sm:p-8">

              <div className="mb-8">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                  💬
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-[#4b270b] sm:text-3xl">
                  Send Us a Message
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#80664f]">
                  Fill out the form below and we'll get back to you
                  as soon as possible.
                </p>

              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Name */}
                <div>

                  <label className="mb-2 block font-semibold text-[#5c2e0b]">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-orange-100 bg-[#fffaf3] px-4 py-3.5 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />

                </div>


                {/* Email */}
                <div>

                  <label className="mb-2 block font-semibold text-[#5c2e0b]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-orange-100 bg-[#fffaf3] px-4 py-3.5 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />

                </div>


                {/* Message */}
                <div>

                  <label className="mb-2 block font-semibold text-[#5c2e0b]">
                    Your Message
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    rows="6"
                    className="w-full resize-none rounded-xl border border-orange-100 bg-[#fffaf3] px-4 py-3.5 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />

                </div>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#8b4513] py-3.5 font-bold text-white transition duration-300 hover:bg-[#6f350f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Message →"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* ================= BOTTOM CTA ================= */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-5xl rounded-3xl bg-[#4b270b] px-6 py-14 text-center shadow-xl sm:px-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-3xl">
            🍽️
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            Have a wonderful dining experience!
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-orange-100/75">
            Your feedback and suggestions help us make Flavor House
            even better.
          </p>

        </div>

      </section>

    </main>
  );
};

export default Contact;

