import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta, socialprofils } from "../../content_option";
import { Link } from "react-router-dom";
import { sendEvent } from "../../analytics"; // <-- GA: import event helper

export const Home = () => {
  const siteUrl = meta.url || "https://example.com";
  const imageUrl = introdata.your_img_url;

  const geo = meta.geo || {
    regionCode: "ES-B",
    latitude: "41.3874",
    longitude: "2.1686",
    city: "Barcelona",
    country: "Spain",
  };

  const lang = meta.lang || "en";

  // JSON-LD schema (Person) – good for Google + LLMs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "David Gadyan",
    jobTitle: [
      "Algorithmic Trader",
      "Data Scientist",
      "Full Stack Developer",
      "Generative AI Engineer",
    ],
    description: introdata.description,
    url: siteUrl,
    image: imageUrl,
    sameAs: Object.values(socialprofils),
    address: {
      "@type": "PostalAddress",
      addressLocality: geo.city,
      addressCountry: geo.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
  };

  const keywords = Array.isArray(meta.keywords)
    ? meta.keywords.join(", ")
    : meta.keywords;

  // ---------- GA4 EVENT HANDLERS ----------
  const handlePortfolioClick = () => {
    sendEvent({
      action: "click_portfolio",
      category: "navigation",
      label: "Home – My Portfolio",
    });
  };

  const handleContactClick = () => {
    sendEvent({
      action: "click_contact",
      category: "navigation",
      label: "Home – Contact Me",
    });
  };
  // ---------------------------------------

  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          {/* Language for SEO + LLMs */}
          <html lang={lang} />

          {/* Basic SEO */}
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          {keywords && <meta name="keywords" content={keywords} />}
          {meta.author && <meta name="author" content={meta.author} />}

          {/* Canonical URL */}
          <link rel="canonical" href={siteUrl} />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={siteUrl} />
          <meta property="og:image" content={imageUrl} />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
          <meta name="twitter:image" content={imageUrl} />

          {/* GEO tags – hint for local SEO + LLMs */}
          <meta name="geo.region" content={geo.regionCode} />
          <meta
            name="geo.position"
            content={`${geo.latitude};${geo.longitude}`}
          />
          <meta name="ICBM" content={`${geo.latitude}, ${geo.longitude}`} />

          {/* JSON-LD structured data */}
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        <div className="intro_sec d-block d-lg-flex align-items-center ">
          <div
            className="h_bg-image order-1 order-lg-2 h-100 "
            style={{ backgroundImage: `url(${introdata.your_img_url})` }}
          ></div>
          <div className="text order-2 order-lg-1 h-100 d-lg-flex justify-content-center">
            <div className="align-self-center ">
              <div className="intro mx-auto">
                <h2 className="mb-1x">{introdata.title}</h2>
                <h1 className="fluidz-48 mb-1x">
                  <Typewriter
                    options={{
                      strings: [
                        introdata.animated.first,
                        introdata.animated.second,
                        introdata.animated.third,
                        introdata.animated.forth,
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 10,
                    }}
                  />
                </h1>
                <p className="mb-1x">{introdata.description}</p>
                <div className="intro_btn-action pb-5">
                  <Link to="/portfolio" className="text_2">
                    <div
                      id="button_p"
                      className="ac_btn btn "
                      onClick={handlePortfolioClick} // GA event
                    >
                      My Portfolio
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                  <Link to="/contact">
                    <div
                      id="button_h"
                      className="ac_btn btn"
                      onClick={handleContactClick} // GA event
                    >
                      Contact Me
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
