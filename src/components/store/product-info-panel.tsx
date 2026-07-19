"use client";

import { toast } from "sonner";

import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type InfoPanelProduct = {
  id: string;
  name: string;
  priceCents: number;
  description: string;
  images: string[];
  stockQty: number;
};

export function ProductInfoPanel({ product }: { product: InfoPanelProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const inStock = product.stockQty > 0;

  function handleAddToBag() {
    addItem({
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      image: product.images[0] ?? null,
    });
    toast.success(`Added to bag — ${product.name}`);
  }

  return (
    <div className="flex flex-col gap-6 py-6 lg:py-10">
      <div className="flex flex-col gap-2">
        <h1 className="heading-display text-2xl sm:text-3xl">
          {product.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {formatPrice(product.priceCents)}
        </p>
      </div>

      <Separator />

      <Button
        size="cta"
        className="w-full"
        disabled={!inStock}
        onClick={handleAddToBag}
      >
        {inStock ? "Add to Bag" : "Sold Out"}
      </Button>

      <Accordion multiple>
        <AccordionItem value="description">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>
            <p>{product.description || "No description available."}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping">
          <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
          <AccordionContent>
            <p>
              Free standard shipping on all orders. Delivery in 3–7 business
              days.
            </p>
            <p>Returns accepted within 30 days of delivery, unworn and with tags attached.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
