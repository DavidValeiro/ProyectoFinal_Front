// Lista de pedidos de la administración. Los carga desde la API del back y
// muestra el usuario, los productos y el total de cada pedido.

import { useEffect, useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { getOrders, deleteOrder } from "../../api/api";

// Colores de la etiqueta según el estado del pedido.
const STATUS_STYLES = {
  Pending: "bg-primary-container text-on-primary",
  Shipped: "bg-tertiary-container text-on-tertiary-container",
  Delivered: "bg-secondary-container text-on-secondary-container",
  Cancelled: "bg-error-container text-on-error-container",
};

const OrdersList = () => {
  const { format } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Pedido que está esperando confirmación de borrado.
  const [deletingOrder, setDeletingOrder] = useState(null);

  // Carga los pedidos al montar el componente.
  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Elimina el pedido en la API y lo quita de la lista local.
  const handleDelete = async () => {
    try {
      await deleteOrder(deletingOrder.id);
      setOrders((prev) => prev.filter((order) => order.id !== deletingOrder.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingOrder(null);
    }
  };

  if (loading) {
    return (
      <p className="font-body-md text-body-md text-secondary py-lg text-center">
        Cargando pedidos...
      </p>
    );
  }

  if (error) {
    return (
      <p className="font-body-md text-body-md text-error py-lg text-center">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="font-body-md text-body-md text-secondary py-lg text-center">
        No hay pedidos.
      </p>
    );
  }

  return (
    <>
    <div className="flex flex-col gap-sm">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col gap-sm bg-surface-container-high rounded-xl p-md neu-raised"
        >
          {/* Usuario, estado y borrado del pedido */}
          <div className="flex items-center justify-between gap-sm">
            <p className="font-body-lg text-body-lg text-on-background truncate">
              {order.user?.email ?? "Usuario desconocido"}
            </p>
            <div className="flex items-center gap-sm shrink-0">
              <span
                className={`font-label-sm text-label-sm uppercase tracking-widest px-sm py-xs rounded-full ${
                  STATUS_STYLES[order.orderStatus] ?? "bg-surface-container text-secondary"
                }`}
              >
                {order.orderStatus}
              </span>
              <button
                type="button"
                aria-label={`Eliminar pedido de ${order.user?.email ?? "usuario"}`}
                onClick={() => setDeletingOrder(order)}
                className="material-symbols-outlined text-error p-xs rounded-lg transition-all hover:bg-error-container"
              >
                delete
              </button>
            </div>
          </div>

          {/* Productos del pedido */}
          <ul className="flex flex-col gap-xs">
            {order.products.map((item) => (
              <li
                key={item.product?._id}
                className="flex items-center justify-between gap-sm font-body-md text-body-md text-on-surface-variant"
              >
                <span className="truncate">
                  {item.product?.title ?? "Producto"} × {item.quantity}
                </span>
                {item.product && (
                  <span className="shrink-0">
                    {format(item.product.price * item.quantity)}
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Total del pedido */}
          <div className="flex items-center justify-between border-t border-surface-variant/40 pt-sm">
            <span className="font-body-md text-body-md text-secondary">Total</span>
            <span className="font-body-lg text-body-lg text-primary font-bold">
              {format(order.totalPrice)}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Confirmación antes de eliminar un pedido */}
    {deletingOrder && (
      <ConfirmModal
        title="Eliminar pedido"
        description={`¿Seguro que quieres eliminar el pedido de "${deletingOrder.user?.email ?? "Usuario desconocido"}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onCancel={() => setDeletingOrder(null)}
        onConfirm={handleDelete}
      />
    )}
    </>
  );
};

export default OrdersList;
