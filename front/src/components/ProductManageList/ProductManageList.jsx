// Fila de un producto dentro de la lista de administración. Muestra la
// miniatura, el título, el precio y los botones de editar y eliminar.

import { useCurrency } from "../../context/CurrencyContext";

const ProductManageList = ({ product, onEdit, onDelete }) => {
  // Formatea el precio con la divisa activa.
  const { format } = useCurrency();
  return (
    <div className="flex items-center gap-sm bg-surface-container-high rounded-xl p-sm neu-raised">
      {/* Miniatura del producto */}
      <img
        src={product.image}
        alt={product.title}
        className="w-14 h-14 sm:w-24 sm:h-16 object-cover rounded-md shrink-0"
      />
      {/* Título y precio; el título se recorta si es demasiado largo */}
      <div className="flex flex-col min-w-0 flex-1">
        <h2 className="font-body-lg text-body-lg text-on-background truncate">
          {product.title}
        </h2>
        <p className="font-body-md text-body-md text-primary">
          <data
            value={product.price}
            className="text-primary font-bold"
          >
            {format(product.price)}
          </data>
        </p>
      </div>
      {/* Acciones de administración */}
      <div className="flex flex-col sm:flex-row gap-xs shrink-0">
        <button
          onClick={() => onEdit(product.id)}
          className="bg-primary-container text-on-primary font-semibold px-sm py-xs rounded-lg neu-raised neu-btn-active transition-all hover:bg-primary"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-error text-on-error font-semibold px-sm py-xs rounded-lg neu-raised neu-btn-active transition-all hover:bg-error-container hover:text-on-error-container"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};



export default ProductManageList;
