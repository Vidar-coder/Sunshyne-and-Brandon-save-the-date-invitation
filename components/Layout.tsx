import type React from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/content/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://christian-and-geneva-save-the-date.vercel.app/";
const canonicalUrl = siteUrl.replace(/\/$/, "");

const desktopHero = "/LinkPreview.png";
const mobileHero = "/LinkPreview.png";
const eventImageUrl = `${canonicalUrl}${desktopHero}`;

const coupleNames = `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}`;
const eventTitle = `${coupleNames} - Wedding Invitation`;
const eventDescription = `Celebrate the wedding of ${siteConfig.couple.groomNickname} and ${siteConfig.couple.brideNickname} on ${siteConfig.wedding.date} at ${siteConfig.ceremony.venue}. RSVP, explore their story, and find everything you need to join the celebration.`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname} Wedding`,
  startDate: siteConfig.wedding.dateISO,
  endDate: siteConfig.wedding.endDateISO,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: [
    {
      "@type": "Place",
      name: siteConfig.ceremony.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.ceremony.venue,
        addressLocality: siteConfig.ceremony.location,
        addressRegion: siteConfig.ceremony.location,
        addressCountry: "PH",
      },
    },
    {
      "@type": "Place",
      name: siteConfig.reception.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.reception.location,
        addressLocality: siteConfig.reception.location,
        addressRegion: siteConfig.reception.location,
        addressCountry: "PH",
      },
    },
  ],
  image: [eventImageUrl],
  description: `You're invited to celebrate the wedding of ${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname}. Discover ceremony and reception details, RSVP, and explore their story.`,
  organizer: {
    "@type": "Person",
    name: coupleNames,
  },
  eventHashtag: `#${siteConfig.couple.groomNickname}And${siteConfig.couple.brideNickname}SayIDo`,
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#D2A4A4" />
        <meta name="format-detection" content="telephone=yes,email=no,address=no" />

        {/* Title and Description */}
        <title>{eventTitle}</title>
        <meta name="description" content={eventDescription} />
        <meta
          name="keywords"
          content={`${siteConfig.couple.groomNickname} ${siteConfig.couple.brideNickname} wedding, ${siteConfig.ceremony.venue} wedding, ${siteConfig.reception.venue} wedding, wedding invitation, RSVP, wedding gallery, message wall, love story, #${siteConfig.couple.groomNickname}And${siteConfig.couple.brideNickname}SayIDo`}
        />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Icons */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon_io/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lavishly+Yours&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Style+Script&display=swap" rel="stylesheet" />

        {/* Preload Images */}
        <link rel="preload" as="image" href={mobileHero} media="(max-width: 767px)" />
        <link rel="preload" as="image" href={desktopHero} media="(min-width: 768px)" />
        <link rel="preload" as="image" href="/Details/St. Augustine Parish Church.jpg" />
        <link rel="preload" as="image" href="/Details/La Mariposa Tagaytay Events Place.jpg" />

        {/* Open Graph */}
        <meta property="og:title" content={`${coupleNames} | ${siteConfig.wedding.date}`} />
        <meta
          property="og:description"
          content={`Celebrate the union of ${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname} on ${siteConfig.wedding.date}. Discover their story, RSVP, and find important details for the ceremony and reception.`}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={`${coupleNames} Wedding`} />
        <meta property="og:locale" content="en_PH" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={eventImageUrl} />
        <meta property="og:image:url" content={eventImageUrl} />
        <meta property="og:image:secure_url" content={eventImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content={`${coupleNames} Wedding Invitation - ${siteConfig.wedding.date}`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${coupleNames} Wedding Invitation`} />
        <meta
          name="twitter:description"
          content={`You're invited to the wedding of ${siteConfig.couple.groomNickname} & ${siteConfig.couple.brideNickname} on ${siteConfig.wedding.date}. RSVP, explore their story, and get all the details for the big day! #${siteConfig.couple.groomNickname}And${siteConfig.couple.brideNickname}SayIDo`}
        />
        <meta name="twitter:image" content={eventImageUrl} />
        <meta name="twitter:creator" content={`@${siteConfig.couple.groomNickname}And${siteConfig.couple.brideNickname}`} />
        <meta name="twitter:site" content={`@${siteConfig.couple.groomNickname}And${siteConfig.couple.brideNickname}`} />

        {/* Apple Web App */}
        <meta name="apple-mobile-web-app-title" content={coupleNames} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Application Name */}
        <meta name="application-name" content={`${coupleNames} Wedding Invitation`} />
        <meta name="author" content={coupleNames} />
        <meta name="creator" content={coupleNames} />
        <meta name="publisher" content={coupleNames} />
        <meta name="category" content="Event" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {children}
    </>
  );
}

