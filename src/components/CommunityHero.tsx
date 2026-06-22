import Image from "next/image";

export default function CommunityHero() {
  return (
    <section className="bg-maroon-dark px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium tracking-[0.3em] text-gold">
          GLOBAL ALUMNI NETWORK
        </p>
        <h1 className="mt-6 font-display text-5xl leading-tight text-cream sm:text-6xl">
          Saikapian Community
        </h1>
        <p className="mt-4 font-display text-xl italic text-gold">
          Connecting Saikapians across the globe.
        </p>
        <p className="mt-6 text-base leading-relaxed text-warm-grey">
          The Saikapian community is built on shared memories, lifelong
          friendships, and the values we carried from Sainik School
          Kapurthala. From school corridors to global cities, Saikapians
          continue to stay connected, support one another, and celebrate the
          bond that started at school.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-5xl border border-gold/20">
        <Image
          src="/images/community/ssk_community_main.png"
          alt="Historic photograph of the Sainik School Kapurthala campus with a ceremonial elephant procession"
          width={1536}
          height={1024}
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
