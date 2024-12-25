import { getOrderById } from "../actions";
import EditOrderForm from "./_components/edit-order-form";
import { getEngineersForOrder } from "./actions";

export default async function AdminEditOrderPage({
  params: { order_id },
}: {
  params: {
    order_id: string;
  };
}) {
  const order = await getOrderById(order_id);
  const engineers = await getEngineersForOrder();

  if (!order) {
    return <>No order</>;
  }

  return <EditOrderForm orderDetails={order} engineers={engineers} />;
}
