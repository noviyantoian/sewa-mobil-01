import type { Car } from "@/lib/mock/cars";

/** Business NAP + brand constants. Single source of truth for SEO. */
export const SITE = {
  name: "FolkaDrive",
  legalName: "FolkaDrive Rental",
  url: "https://folkadrive.local",
  telephone: "+62-811-2000-800",
  email: "halo@folkadrive.local",
  address: {
    street: "Jl. Jenderal Sudirman",
    locality: "Jakarta Pusat",
    region: "DKI Jakarta",
    postalCode: "10220",
    country: "ID",
  },
  geo: { lat: -6.2088, lng: 106.82 },
  areaServed: ["Jakarta", "Bandung", "Bali"],
  priceRange: "Rp250.000–Rp3.100.000 / hari",
  openingHours: "Mo-Su 06:00-23:00",
  sameAs: [] as string[],
  aggregateRating: { ratingValue: 4.9, reviewCount: 2400 },
  ogImage: "/images/og-default.webp",
} as const;

/** Prefix a site-relative path with the absolute origin. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.locality,
  addressRegion: SITE.address.region,
  postalCode: SITE.address.postalCode,
  addressCountry: SITE.address.country,
};

const organizationRef = { "@type": "Organization", name: SITE.name, "@id": `${SITE.url}/#organization` };

/** Organization + AutoRental LocalBusiness, site-wide. */
export function organizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "AutoRental"],
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    telephone: SITE.telephone,
    email: SITE.email,
    logo: absoluteUrl(SITE.ogImage),
    image: absoluteUrl(SITE.ogImage),
    address: postalAddress,
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: SITE.areaServed,
    priceRange: SITE.priceRange,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "06:00",
      closes: "23:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.aggregateRating.ratingValue,
      reviewCount: SITE.aggregateRating.reviewCount,
    },
    sameAs: SITE.sameAs,
  };
}

/** WebSite with sitelinks SearchAction. */
export function websiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "id-ID",
    publisher: organizationRef,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/cari?loc={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export type BreadcrumbItem = { name: string; path: string };

/** BreadcrumbList from ordered items. */
export function breadcrumb(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** WebPage node tied to the WebSite. */
export function webPageSchema(name: string, description: string, path: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "id-ID",
    isPartOf: { "@type": "WebSite", "@id": `${SITE.url}/#website` },
  };
}

const categoryLabel: Record<Car["category"], string> = {
  mpv: "MPV",
  suv: "SUV",
  citycar: "City Car",
  premium: "Premium Sedan",
  ev: "Electric Vehicle",
};

/** Car (Vehicle) with rental Offer. */
export function carSchema(car: Car): object {
  const fullName = `${car.brand} ${car.name}`;
  const path = `/mobil/${car.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: fullName,
    url: absoluteUrl(path),
    image: absoluteUrl(car.exterior),
    brand: { "@type": "Brand", name: car.brand },
    vehicleConfiguration: categoryLabel[car.category],
    category: categoryLabel[car.category],
    vehicleSeatingCapacity: car.capacity,
    fuelType: car.fuel,
    vehicleTransmission: car.transmission === "auto" ? "Automatic" : "Manual",
    vehicleModelDate: String(car.year),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.aggregateRating.ratingValue,
      reviewCount: SITE.aggregateRating.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: car.rateSelfDrive,
      availability: car.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: car.rateSelfDrive,
        priceCurrency: "IDR",
        unitCode: "DAY",
      },
      seller: organizationRef,
    },
  };
}
