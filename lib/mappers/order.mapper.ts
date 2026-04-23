import { IOrder } from '@/lib/db/models/order.model'

export function toOrderEmail(order: IOrder) {
  return {
    _id: order._id.toString(),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,

    isPaid: order.isPaid,
    paidAt: order.paidAt,

    totalPrice: order.totalPrice,
    itemsPrice: order.itemsPrice,
    taxPrice: order.taxPrice,
    shippingPrice: order.shippingPrice,

    paymentMethod: order.paymentMethod,
    expectedDeliveryDate: order.expectedDeliveryDate,
    isDelivered: order.isDelivered,

    user: order.user as { name: string; email: string },

    shippingAddress: order.shippingAddress,

    items: order.items.map((item) => ({
      clientId: item.clientId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      product: item.product.toString(),
      slug: item.slug,
      category: item.category,
      countInStock: item.countInStock,
    })),
  }
}
