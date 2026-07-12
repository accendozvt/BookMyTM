import Link from 'next/link';

export default function CtaBand() {
  return (
    <section className="bg-white">
      <div className="container-site">
        <div className="hero-bg mb-0 rounded-t-[3rem] px-6 py-20 text-center md:px-12">
          <div className="mx-auto max-w-3xl space-y-7">
            <h2 className="text-3xl font-extrabold text-white md:text-5xl">Start building awesome business</h2>
            <p className="text-lg text-gray-300 md:text-xl">
              Join over 2000+ customers that already received successful trademark registration via BookMyTM
            </p>
            <Link
              href="/contact/"
              className="inline-block rounded-full bg-brand px-12 py-4 font-bold text-white shadow-xl transition hover:scale-105 hover:bg-[#3a6a2c]"
            >
              Explore our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
