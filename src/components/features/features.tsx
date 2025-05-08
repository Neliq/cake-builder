const features = [
  {
    title: "1. Zaprojektuj wygląd tortu",
    description:
      "Możesz skorzystać z gotowych inspiracji, załączyć własne zdjęcie poglądowe lub zbudować tort od zera w konfiguratorze.",
    image: "/step1.jpg",
  },
  {
    title: "2. Wybierz smaki warstw",
    description:
      "Wybierz ile warstw ma mieć Twój tort oraz z czego ma być wykonana i jaki smak ma mieć każda z warstw.",
    image: "/step2.jpg",
  },
  {
    title: "3. Podaj termin dostawy",
    description:
      "Dostarczamy torty o określonej godzinie, tak aby były świeże, a zarazem gotowe na przyjęcie. Pozostaje już tylko wyczekiwać wydarzenia.",
    image: "/step3.jpg",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
          Zobacz, jakie to proste!
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-md sm:max-w-screen-md lg:max-w-screen-lg w-full mx-auto px-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col text-start">
              <div className="mb-5 sm:mb-6 w-full aspect-[4/5] bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                {feature.title}
              </span>
              <p className="mt-2 max-w-[25ch] text-muted-foreground text-[17px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
