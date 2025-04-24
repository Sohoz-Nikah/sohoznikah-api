/* eslint-disable @typescript-eslint/no-explicit-any */

// Calculate subtotal based on unit price, quantity, and discount
export const calculateSubtotal = (
  unitPrice: number,
  quantity: number,
  discount: number = 0,
): number => {
  return unitPrice * quantity - (unitPrice * quantity * discount) / 100;
};

// Calculate grand total for an array of items
export const calculateGrandTotal = (items: any[]): number => {
  return items.reduce(
    (total, item) =>
      total +
      calculateSubtotal(
        item.unitPrice,
        item.quantity,
        item.purchaseDiscount || item.saleDiscount || item.returnDiscount,
      ),
    0,
  );
};

// Calculate due amount
export const calculateDueAmount = (
  grandTotal: number = 0,
  paidAmount: number = 0,
): number => {
  return (grandTotal || 0) - (paidAmount || 0);
};

// Validate if the calculated values match the provided ones
export const validateAmounts = (
  calculated: number | 0,
  provided: number,
  fieldName: string,
) => {
  if (calculated !== provided) {
    throw new Error(
      `Invalid ${fieldName}. Expected: ${calculated}, Received: ${provided}`,
    );
  }
};
