import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="bg-[#fffaf3]">

      {/* Hero Section */}
      <section className="overflow-hidden bg-[#fff4e5]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:py-28">

          {/* Left Content */}
          <div className="w-full md:w-1/2">

            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-600">
              Welcome to Flavor House
            </p>

            <h1 className="text-5xl font-extrabold leading-tight text-[#4b270b] md:text-6xl">
              Delicious Food.
              <span className="mt-2 block text-orange-600">
                Beautiful Moments.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#73553c]">
              Enjoy freshly prepared food, warm hospitality and
              unforgettable moments with your loved ones at Flavor House.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/menu"
                className="rounded-full bg-[#8b4513] px-7 py-3.5 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#6f350f] hover:shadow-xl"
              >
                Explore Menu →
              </Link>

              <Link
                to="/about"
                className="rounded-full border-2 border-[#8b4513] px-7 py-3 font-bold text-[#8b4513] transition duration-300 hover:-translate-y-1 hover:bg-[#8b4513] hover:text-white"
              >
                Our Story
              </Link>

            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-6">

              <div>
                <p className="text-2xl font-extrabold text-[#4b270b]">
                  4.9★
                </p>
                <p className="text-sm text-[#80664f]">
                  Customer Rating
                </p>
              </div>

              <div className="h-12 w-px bg-orange-200" />

              <div>
                <p className="text-2xl font-extrabold text-[#4b270b]">
                  50+
                </p>
                <p className="text-sm text-[#80664f]">
                  Delicious Dishes
                </p>
              </div>

              <div className="h-12 w-px bg-orange-200" />

              <div>
                <p className="text-2xl font-extrabold text-[#4b270b]">
                  10+
                </p>
                <p className="text-sm text-[#80664f]">
                  Years Experience
                </p>
              </div>

            </div>
          </div>


          {/* Right Food Card */}
          <div className="flex w-full justify-center md:w-1/2">

            <div className="relative">

              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-200 opacity-70" />

              <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-[#d6a15d] opacity-40" />

              <div className="relative flex h-80 w-80 items-center justify-center rounded-3xl bg-[#8b4513] shadow-2xl transition duration-500 hover:scale-105 md:h-96 md:w-96">

                <div className="text-center">

                  <div className="text-9xl">
                    🍽️
                  </div>

                  <p className="mt-5 text-xl font-bold text-white">
                    Taste the Happiness
                  </p>

                  <p className="mt-2 text-sm text-orange-100">
                    Fresh • Delicious • Memorable
                  </p>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* Why Choose Us */}
      <section className="bg-white px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="font-bold uppercase tracking-widest text-orange-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#4b270b]">
              More Than Just Food
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#80664f]">
              We believe every meal should be an experience worth remembering.
            </p>

          </div>


          <div className="mt-12 grid gap-7 md:grid-cols-3">

            {/* Card 1 */}
            <div className="group rounded-3xl border border-orange-100 bg-[#fffaf3] p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                🥗
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Fresh Ingredients
              </h3>

              <p className="mt-3 leading-7 text-[#80664f]">
                We use fresh and carefully selected ingredients to prepare
                every dish.
              </p>

            </div>


            {/* Card 2 */}
            <div className="group rounded-3xl border border-orange-100 bg-[#fffaf3] p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                👨‍🍳
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Expert Chefs
              </h3>

              <p className="mt-3 leading-7 text-[#80664f]">
                Our experienced chefs prepare every meal with passion,
                creativity and care.
              </p>

            </div>


            {/* Card 3 */}
            <div className="group rounded-3xl border border-orange-100 bg-[#fffaf3] p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                ❤️
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#4b270b]">
                Made With Love
              </h3>

              <p className="mt-3 leading-7 text-[#80664f]">
                From kitchen to table, every dish is made to give you a
                memorable experience.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* CTA Section */}
      <section className="px-6 py-20">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#8b4513] px-8 py-16 text-center shadow-2xl md:px-16">

          <p className="font-semibold uppercase tracking-widest text-orange-200">
            Hungry?
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
            Let's Make Your Meal Special
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-orange-100">
            Explore our delicious menu and discover your next favourite dish.
          </p>

          <Link
            to="/menu"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-bold text-[#8b4513] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-orange-50 hover:shadow-xl"
          >
            View Full Menu
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Home;