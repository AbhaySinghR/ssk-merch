import PhotoPlaceholder from "@/components/PhotoPlaceholder";

const chapters = [
  {
    name: "India Chapter",
    body: "The India chapter remains the heart of the Saikapian network, bringing together alumni through school visits, reunions, Old Boys Association events, and batch gatherings.",
    photoLabel: "OBA INDIA & REUNION PHOTOS COMING SOON",
  },
  {
    name: "United States Chapter",
    body: "The US chapter connects Saikapians living, studying, and working across America. From casual meetups to family gatherings, it keeps the alumni bond alive far from home.",
    photoLabel: "US ALUMNI MEETUP PHOTOS COMING SOON",
  },
  {
    name: "Canada Chapter",
    body: "The Canada chapter represents the growing global Saikapian family, bringing together alumni across cities and creating space for connection, support, and shared memories.",
    photoLabel: "CANADA ALUMNI MEETUP PHOTOS COMING SOON",
  },
];

export default function ChaptersSection() {
  return (
    <section className="bg-maroon px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.3em] text-gold">
            OUR CHAPTERS
          </p>
          <h2 className="mt-6 font-display text-4xl leading-tight text-cream sm:text-5xl">
            Our Chapters
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-warm-grey">
            Saikapians are spread across the world, but the connection
            remains strong through local chapters, alumni gatherings,
            reunions, and community events.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {chapters.map((chapter) => (
            <div key={chapter.name} className="flex flex-col">
              <PhotoPlaceholder
                label={chapter.photoLabel}
                className="aspect-[4/3] w-full"
              />
              <h3 className="mt-6 font-display text-2xl text-cream">
                {chapter.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-grey">
                {chapter.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
