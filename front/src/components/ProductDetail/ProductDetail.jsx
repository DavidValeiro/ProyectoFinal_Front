// Página de detalle de producto: galería, especificaciones, precio y acciones
// de compra. El producto se busca por el slug de su título.

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toSlug } from "../../utils/slugify";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useCurrency } from "../../context/CurrencyContext";
import { usePageMeta } from "../../hooks/usePageMeta";

// Límite de miniaturas visibles y tamaño de las mismas en la galería.
const MAX_GALLERY_COLUMNS = 5;
const THUMB_SIZE = "60px";

// Valoración con estrellas enteras y media. La media se dibuja con el icono
// `star_half` y las enteras con `FILL` activo en la variación de la fuente.
function RatingStars({ rating }) {
  const filled = Math.floor(rating);
  const hasHalf = rating - filled >= 0.5;

  return (
    <span className="inline-flex text-primary">
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < filled;
        const isHalf = !isFilled && hasHalf && index === filled;

        return (
          <span
            key={index}
            aria-hidden="true"
            className="material-symbols-outlined"
            style={{ fontVariationSettings: isFilled ? "'FILL' 1" : undefined }}
          >
            {isHalf ? "star_half" : "star"}
          </span>
        );
      })}
    </span>
  );
}

// Galería de imágenes: imagen principal grande y miniaturas seleccionables.
function Gallery({ product, activeImage, onSelectImage }) {
  const images = product.images;
  const hasGallery = images.length > 1;
  const columns = Math.min(images.length, MAX_GALLERY_COLUMNS);

  return (
    <figure className="lg:col-span-5 w-full max-w-md mx-auto">
      {/* Imagen activa, dentro de un marco con efecto "pulsado" */}
      <div className="neu-pressed rounded-xl p-sm bg-surface-container-low aspect-square flex items-center justify-center overflow-hidden">
        <img
          key={images[activeImage]}
          src={images[activeImage]}
          alt={`${product.title} — vista ${activeImage + 1} de ${images.length}`}
          className="w-full h-full object-cover product-detail-image"
        />
      </div>
      <figcaption className="sr-only">
        {product.title} — galería de {images.length}{" "}
        {images.length === 1 ? "imagen" : "imágenes"}
      </figcaption>

      {/* Miniaturas (solo si hay más de una imagen) */}
      {hasGallery && (
        <ul
          className="grid gap-sm mt-sm justify-center"
          style={{
            gridTemplateColumns: `repeat(${columns}, ${THUMB_SIZE})`,
          }}
        >
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => onSelectImage(index)}
                aria-label={`Ver vista ${index + 1} de ${product.title}`}
                aria-pressed={index === activeImage}
                className={`w-full rounded-lg p-xs bg-surface-container aspect-square transition-all hover:scale-[1.02] ${
                  index === activeImage ? "neu-pressed" : "neu-raised"
                }`}
              >
                <span className="block w-full h-full bg-surface-container-highest rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}

// Cuadrícula de especificaciones técnicas (icono, etiqueta y valor).
function SpecGrid({ specs }) {
  return (
    <dl className="grid grid-cols-2 gap-sm">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="neu-pressed rounded-xl bg-surface-container-low p-sm flex flex-col items-center text-center"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-primary mb-xs">
            {spec.icon}
          </span>
          <dt className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            {spec.label}
          </dt>
          <dd className="font-body-lg text-body-lg text-on-background">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Migas de pan: Catálogo › categoría › producto.
function Breadcrumb({ product }) {
  const dot = "w-1 h-1 shrink-0 rounded-full bg-current";

  return (
    <nav aria-label="Migas de pan" className="mb-sm">
      <ul className="flex flex-wrap items-center gap-md font-body-md text-body-md text-secondary">
        <li className="flex items-center gap-md">
          <Link to="/Catalog" className="hover:text-primary transition-colors">
            Catálogo
          </Link>
          <span aria-hidden="true" className={dot} />
        </li>
        <li className="flex items-center gap-md">
          <span className="text-on-surface-variant">{product.category}</span>
          <span aria-hidden="true" className={dot} />
        </li>
        <li>
          <span aria-current="page" className="text-on-surface font-semibold">
            {product.title}
          </span>
        </li>
      </ul>
    </nav>
  );
}

// Vista alternativa cuando el slug no corresponde a ningún producto.
function ProductNotFound({ slug }) {
  return (
    <main className="max-w-6xl mx-auto px-margin-desktop py-lg flex flex-col items-center gap-sm text-center">
      <span aria-hidden="true" className="material-symbols-outlined text-secondary text-5xl">
        search_off
      </span>
      <h1 className="font-headline-md text-3xl font-bold text-on-background">
        Producto no encontrado
      </h1>
      <p className="font-body-md text-body-md text-secondary">
        No existe ningún producto con el identificador «{slug}».
      </p>
      <Link
        to="/Catalog"
        className="bg-primary-container text-on-primary font-bold px-md py-sm rounded-xl neu-raised neu-btn-active transition-all font-body-md text-body-md"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}

const ProductDetail = () => {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  // Localiza el producto cuyo título, pasado a slug, coincide con la URL.
  const product = products.find((item) => toSlug(item.title) === slug);
  // Índice de la imagen visible y control del cambio de producto.
  const [activeImage, setActiveImage] = useState(0);
  const [lastSlug, setLastSlug] = useState(slug);
  const { addToCart } = useCart();
  const { format } = useCurrency();

  // Al cambiar de producto, vuelve a la primera imagen.
  if (slug !== lastSlug) {
    setLastSlug(slug);
    setActiveImage(0);
  }

  // Sube al principio de la página cada vez que cambia el producto.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  // Metadatos de la página (título, descripción e imagen para compartir).
  usePageMeta({
    title: product ? product.title : "Producto no encontrado",
    description: product
      ? `${product.description.slice(0, 155)}…`
      : "El producto solicitado no existe en el catálogo de MOUSIN.",
    image: product?.images[0],
    type: "product",
  });

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-lg text-center">
        <p className="font-body-md text-body-md text-secondary">
          Cargando producto...
        </p>
      </main>
    );
  }

  if (!product) {
    return <ProductNotFound slug={slug} />;
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <main className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-md">
      <Breadcrumb product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
        {/* Columna izquierda: galería de imágenes */}
        <Gallery
          product={product}
          activeImage={activeImage}
          onSelectImage={setActiveImage}
        />

        {/* Columna derecha: datos del producto y acciones */}
        <div className="lg:col-span-7 flex flex-col gap-sm">
          <div className="flex flex-col gap-xs">
            <p className="inline-block self-start px-sm py-xs bg-surface-variant text-on-surface-variant font-label-sm text-label-sm rounded-full border border-outline-variant">
              {product.category}
            </p>
            <h1 className="font-headline-md text-3xl font-bold text-on-background tracking-tight">
              {product.title}
            </h1>
            <p className="flex items-center gap-sm">
              <RatingStars rating={product.rating} />
              <span className="text-secondary">
                {product.rating.toFixed(1)} ({product.reviews} reseñas)
              </span>
            </p>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          <p className="py-xs flex items-baseline gap-sm">
            <data
              value={product.price}
              className="font-display-lg text-3xl text-primary-container font-extrabold"
            >
              {format(product.price)}
            </data>
            {product.compareAtPrice && (
              <s className="font-body-md text-body-md text-secondary">
                {format(product.compareAtPrice)}
              </s>
            )}
          </p>

          <SpecGrid specs={product.specs} />

          <div className="flex flex-col sm:flex-row gap-sm pt-sm">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-primary-container text-on-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all flex items-center justify-center gap-xs"
            >
              <span aria-hidden="true" className="material-symbols-outlined">
                add_shopping_cart
              </span>
              <span className="font-body-md text-body-md">Añadir al carrito</span>
            </button>
            <Link
              to="/Catalog"
              className="flex-1 bg-surface-container-high text-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all hover:bg-primary-container hover:text-on-primary flex items-center justify-center gap-xs"
            >
              <span aria-hidden="true" className="material-symbols-outlined">
                keyboard
              </span>
              <span className="font-body-md text-body-md">Seguir comprando</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;