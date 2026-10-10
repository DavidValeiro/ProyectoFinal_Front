// Hook que actualiza el <title> y las etiquetas meta (descripción, Open Graph,
// Twitter y URL canónica) cada vez que cambian los datos de la página.

import { useEffect } from "react";

const SITE_NAME = "MOUSIN";

// Crea o actualiza una etiqueta <meta>, buscándola por atributo (name/property)
// y clave. Si no existe la inserta en el <head>.
const upsertMeta = (keyAttr, key, content) => {
  if (!content) return;

  let tag = document.head.querySelector(`meta[${keyAttr}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(keyAttr, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

export const usePageMeta = ({ title, description, image, type = "website" }) => {
  useEffect(() => {
    // Título compuesto con el nombre del sitio, o el genérico si no hay título.
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Periféricos de precisión`;

    document.title = fullTitle;

    // Metadatos básicos y de Open Graph.
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:locale", "es_ES");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", window.location.href);

    // Solo si hay imagen añadimos las etiquetas de las tarjetas de Twitter.
    if (image) {
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:card", "summary_large_image");
      upsertMeta("name", "twitter:title", fullTitle);
      upsertMeta("name", "twitter:description", description);
      upsertMeta("name", "twitter:image", image);
    }

    // Aseguramos que exista una URL canónica apuntando a la página actual.
    let canonical = document.head.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", window.location.href);
  }, [title, description, image, type]);
};
