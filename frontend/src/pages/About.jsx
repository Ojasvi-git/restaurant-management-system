
const About = () => {
  return (
    <main className="min-h-screen bg-[#fffaf3]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#4b270b] px-6 py-24">

        {/* Decorative circles */}
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-orange-500/10" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-orange-400/10" />

        <div className="relative mx-auto max-w-5xl text-center">

          <span className="inline-block rounded-full border border-orange-300/30 bg-orange-500/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.25em] text-orange-300">
            Welcome to Flavor House
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Where Great Food
            <span className="block text-orange-400">
              Meets Great Moments
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-orange-100/80 sm:text-lg">
            We believe that a memorable dining experience is more than
            just delicious food. It is about people, conversations,
            celebrations and moments that stay with you.
          </p>

        </div>
      </section>


      {/* ================= OUR STORY ================= */}
      <section className="px-6 py-20">

        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">

          {/* Story Card */}
          <div className="relative">

            <div className="rounded-3xl bg-[#8b4513] p-8 shadow-xl sm:p-10">

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                🍽️
              </div>

              <p className="font-bold uppercase tracking-widest text-orange-300">
                Our Story
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                Made with passion,
                <span className="block text-orange-300">
                  served with love.
                </span>
              </h2>

              <p className="mt-6 leading-8 text-orange-50/80">
                Flavor House was created with a simple vision — to make
                every meal feel special. We bring together quality
                ingredients, thoughtful preparation and warm hospitality
                to create food that people love coming back for.
              </p>

            </div>

          </div>


          {/* Story Content */}
          <div>

            <p className="font-bold uppercase tracking-widest text-orange-600">
              More Than A Restaurant
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#4b270b] sm:text-4xl">
              A place made for
              <span className="text-orange-600"> food lovers.</span>
            </h2>

            <p className="mt-6 leading-8 text-[#73553c]">
              From the first order to the final bite, we care about every
              little detail. Our kitchen focuses on freshness and flavor,
              while our team focuses on making every guest feel welcome.
            </p>

            <p className="mt-4 leading-8 text-[#73553c]">
              Whether you are enjoying a quick meal with friends, having
              dinner with family or celebrating something special,
              Flavor House is here to make the moment delicious.
            </p>


            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-3xl">🥘</div>
                <h3 className="mt-3 font-bold text-[#4b270b]">
                  Fresh Ingredients
                </h3>
                <p className="mt-1 text-sm text-[#80664f]">
                  Carefully selected for great taste.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-3xl">❤️</div>
                <h3 className="mt-3 font-bold text-[#4b270b]">
                  Made With Love
                </h3>
                <p className="mt-1 text-sm text-[#80664f]">
                  Every dish gets our full attention.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}
      <section className="border-y border-orange-100 bg-[#fff4e5] px-6 py-16">

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-3xl">🍴</div>
            <h3 className="mt-3 text-3xl font-extrabold text-[#8b4513]">
              100+
            </h3>
            <p className="mt-1 text-sm font-medium text-[#80664f]">
              Delicious Dishes
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-3xl">😊</div>
            <h3 className="mt-3 text-3xl font-extrabold text-[#8b4513]">
              1K+
            </h3>
            <p className="mt-1 text-sm font-medium text-[#80664f]">
              Happy Guests
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-3xl">⭐</div>
            <h3 className="mt-3 text-3xl font-extrabold text-[#8b4513]">
              4.8
            </h3>
            <p className="mt-1 text-sm font-medium text-[#80664f]">
              Guest Rating
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="text-3xl">❤️</div>
            <h3 className="mt-3 text-3xl font-extrabold text-[#8b4513]">
              100%
            </h3>
            <p className="mt-1 text-sm font-medium text-[#80664f]">
              Passion
            </p>
          </div>

        </div>

      </section>


      {/* ================= WHY US ================= */}
      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="font-bold uppercase tracking-widest text-orange-600">
              Why Flavor House
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-[#4b270b] sm:text-4xl">
              What makes us special?
            </h2>

            <p className="mt-4 leading-7 text-[#80664f]">
              We combine delicious food, friendly service and a warm
              atmosphere to create an experience worth remembering.
            </p>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Card 1 */}
            <div className="group rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                🌿
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#4b270b]">
                Quality First
              </h3>

              <p className="mt-3 leading-7 text-[#80664f]">
                We believe quality ingredients are the foundation of
                every great dish.
              </p>

            </div>


            {/* Card 2 */}
            <div className="group rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                👨‍🍳
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#4b270b]">
                Skilled Kitchen
              </h3>

              <p className="mt-3 leading-7 text-[#80664f]">
                Our dishes are prepared with care, creativity and
                attention to every detail.
              </p>

            </div>


            {/* Card 3 */}
            <div className="group rounded-3xl border border-orange-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition duration-300 group-hover:scale-110">
                🤝
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#4b270b]">
                Warm Hospitality
              </h3>

              <p className="mt-3 leading-7 text-[#80664f]">
                Great service matters. We want every guest to feel
                comfortable and valued.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#4b270b] px-6 py-14 text-center shadow-xl sm:px-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-3xl">
            🍽️
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            Good food is meant to be shared.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-orange-100/75">
            Come hungry, leave happy — and make your next meal a
            memorable one at Flavor House.
          </p>

        </div>

      </section>

    </main>
  );
};

export default About;

