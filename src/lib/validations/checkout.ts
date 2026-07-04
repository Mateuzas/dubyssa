import { z } from "zod/v4";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  street: z.string().min(1, "Street address is required").max(300),
  city: z.string().min(1, "City is required").max(100),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^LT-\d{5}$/, "Lithuanian postal code must be in format LT-XXXXX"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+370\d{8}$/, "Lithuanian phone number must be in format +370XXXXXXXX"),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Cart must have at least one item"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
