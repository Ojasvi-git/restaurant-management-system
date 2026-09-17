
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#3a1d08] text-orange-50">

      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* ================= BRAND ================= */}
          <div>

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl shadow-lg">
                🍽️
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Flavor House
                </h2>

                <p className="text-xs font-medium tracking-wider text-orange-300">
                  TASTE • LOVE • REPEAT
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-orange-100/70">
              Delicious food, warm hospitality and unforgettable
              moments. At Flavor House, every dish is prepared with
              passion and served with love.
            </p>

            {/* Small Highlight */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
              <span>⭐</span>
              <span>Made for food lovers</span>
            </div>

          </div>


          {/* ================= QUICK LINKS ================= */}
          <div>

            <h3 className="text-lg font-bold text-white">
              Quick Links
            </h3>

            <div className="mt-5 h-1 w-10 rounded-full bg-orange-500" />

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/"
                  className="text-sm text-orange-100/70 transition hover:translate-x-1 hover:text-orange-300"
                >
                  → Home
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="text-sm text-orange-100/70 transition hover:translate-x-1 hover:text-orange-300"
                >
                  → Menu
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-orange-100/70 transition hover:translate-x-1 hover:text-orange-300"
                >
                  → About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-orange-100/70 transition hover:translate-x-1 hover:text-orange-300"
                >
                  → Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="text-sm text-orange-100/70 transition hover:translate-x-1 hover:text-orange-300"
                >
                  → Login
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= CATEGORIES ================= */}
          <div>

            <h3 className="text-lg font-bold text-white">
              Categories
            </h3>

            <div className="mt-5 h-1 w-10 rounded-full bg-orange-500" />

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/menu"
                  className="text-sm text-orange-100/70 transition hover:text-orange-300"
                >
                  🍛 Indian Cuisine
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="text-sm text-orange-100/70 transition hover:text-orange-300"
                >
                  🍕 Fast Food
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="text-sm text-orange-100/70 transition hover:text-orange-300"
                >
                  🍝 Main Course
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="text-sm text-orange-100/70 transition hover:text-orange-300"
                >
                  🍰 Desserts
                </Link>
              </li>

              <li>
                <Link
                  to="/menu"
                  className="text-sm text-orange-100/70 transition hover:text-orange-300"
                >
                  🥤 Beverages
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= CONTACT ================= */}
          <div>

            <h3 className="text-lg font-bold text-white">
              Get In Touch
            </h3>

            <div className="mt-5 h-1 w-10 rounded-full bg-orange-500" />

            <div className="mt-5 space-y-4">

              {/* Address */}
              <div className="flex items-start gap-3">

                <span className="text-xl">
                  📍
                </span>

                <p className="text-sm leading-6 text-orange-100/70">
                  123 Flavor Street,
                  <br />
                  Your City, India
                </p>

              </div>


              {/* Phone */}
              <div className="flex items-center gap-3">

                <span className="text-xl">
                  📞
                </span>

                <p className="text-sm text-orange-100/70">
                  +91 98765 43210
                </p>

              </div>


              {/* Email */}
              <div className="flex items-start gap-3">

                <span className="text-xl">
                  ✉️
                </span>

                <p className="break-all text-sm text-orange-100/70">
                  hello@flavorhouse.com
                </p>

              </div>


              {/* Timing */}
              <div className="flex items-start gap-3">

                <span className="text-xl">
                  🕐
                </span>

                <p className="text-sm leading-6 text-orange-100/70">
                  Mon - Sun
                  <br />
                  10:00 AM - 11:00 PM
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ================= SOCIAL ================= */}
        <div className="mt-12 flex flex-col gap-5 border-t border-orange-200/10 pt-8 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h3 className="font-bold text-white">
              Follow Us
            </h3>

            <p className="mt-1 text-sm text-orange-100/50">
              Stay connected with Flavor House
            </p>

          </div>


          <div className="flex items-center gap-3">

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white"
            >
              f
            </a>


            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white"
            >
              ◎
            </a>


            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white"
            >
              ▶
            </a>

          </div>

        </div>

      </div>


      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-orange-200/10 bg-[#2d1606]">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-xs text-orange-100/50 sm:text-sm">
            © {new Date().getFullYear()} Flavor House. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-5">

            <Link
              to="/privacy-policy"
              className="text-xs text-orange-100/50 transition hover:text-orange-300 sm:text-sm"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-orange-100/50 transition hover:text-orange-300 sm:text-sm"
            >
              Terms
            </Link>

            <Link
              to="/cookie-policy"
              className="text-xs text-orange-100/50 transition hover:text-orange-300 sm:text-sm"
            >
              Cookie Policy
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;

