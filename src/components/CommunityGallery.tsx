import PhotoPlaceholder from "@/components/PhotoPlaceholder";

const moments = [
  "REUNION PHOTOS COMING SOON",
  "CHAPTER GATHERING PHOTOS COMING SOON",
  "SCHOOL VISIT PHOTOS COMING SOON",
  "FAMILY MEETUP PHOTOS COMING SOON",
  "BATCH MEMORY PHOTOS COMING SOON",
  "ALUMNI EVENT PHOTOS COMING SOON",
];

export default function CommunityGallery() {
  return (
    <section className="bg-maroon-dark px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.3em] text-gold">
            COMMUNITY MOMENTS
          </p>
          <h2 className="mt-6 font-display text-4xl leading-tight text-cream sm:text-5xl">
            Community Moments
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-warm-grey">
            A glimpse into the moments that keep the Saikapian bond alive —
            reunions, chapter gatherings, school visits, family meetups, and
            memories shared across generations.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {moments.map((label, i) => (
            <PhotoPlaceholder
              key={i}
              label={label}
              className="aspect-square w-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
