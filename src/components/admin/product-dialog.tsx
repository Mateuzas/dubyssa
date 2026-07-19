"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, Upload, X } from "lucide-react";
import { toast } from "sonner";

import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/app/(admin)/admin/products/actions";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";
import type { schema } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Product = typeof schema.products.$inferSelect;

const MAX_IMAGES = 8;

type FormState = {
  name: string;
  description: string;
  price: string;
  stockQty: string;
  category: string;
  images: string[];
  isPublished: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  stockQty: "1",
  category: "",
  images: [],
  isPublished: false,
};

function toFormState(product?: Product): FormState {
  if (!product) return EMPTY_FORM;
  return {
    name: product.name,
    description: product.description,
    price: (product.priceCents / 100).toFixed(2),
    stockQty: String(product.stockQty),
    category: product.category ?? "",
    images: product.images,
    isPublished: product.isPublished,
  };
}

export function ProductDialog({
  open,
  onOpenChange,
  mode,
  product,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  product?: Product;
}) {
  // The parent gives this component a fresh `key` each time it opens (see
  // ProductsTable), so lazy initial state is enough — no reset effect needed.
  const [form, setForm] = useState<FormState>(() => toFormState(product));
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductInput, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - form.images.length;
    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > filesToUpload.length) {
      toast.error(`Only ${MAX_IMAGES} images allowed per product — extra photos were skipped.`);
    }

    setUploading(true);
    // Uploaded sequentially (rather than in parallel) so the images always
    // land in the same order they were selected in, regardless of which
    // upload happens to finish first.
    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadProductImage(formData);
      if ("error" in result) {
        toast.error(result.error);
        continue;
      }
      const url = result.url;
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    }
    setUploading(false);
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function handleDrop(index: number) {
    setForm((prev) => {
      if (dragIndex === null || dragIndex === index) return prev;
      const images = [...prev.images];
      const [moved] = images.splice(dragIndex, 1);
      images.splice(index, 0, moved);
      return { ...prev, images };
    });
    setDragIndex(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const candidate = {
      name: form.name,
      description: form.description,
      priceCents: Math.round(Number(form.price) * 100),
      stockQty: Number(form.stockQty),
      category: form.category || null,
      images: form.images,
      isPublished: form.isPublished,
    };

    const parsed = productSchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ProductInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ProductInput;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const result =
      mode === "edit" && product
        ? await updateProduct(product.id, parsed.data)
        : await createProduct(parsed.data);

    setSubmitting(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit product" : "Add product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-base text-muted-foreground md:text-sm">
                  €
                </span>
                <Input
                  id="price"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="pl-6"
                  aria-invalid={!!errors.priceCents}
                />
              </div>
              {errors.priceCents && (
                <p className="text-xs text-destructive">{errors.priceCents}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stockQty">Stock</Label>
              <Input
                id="stockQty"
                type="number"
                min={0}
                value={form.stockQty}
                onChange={(e) => updateField("stockQty", e.target.value)}
                aria-invalid={!!errors.stockQty}
              />
              {errors.stockQty && (
                <p className="text-xs text-destructive">{errors.stockQty}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.category || null}
              onValueChange={(value) =>
                updateField("category", (value as string) ?? "")
              }
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Images</Label>
            <p className="text-xs text-muted-foreground">
              Drag to reorder — the first photo is the primary one shown in
              listings.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {form.images.map((src, index) => (
                <div
                  key={src}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => setDragIndex(null)}
                  className={cn(
                    "group relative aspect-square cursor-grab overflow-hidden rounded-md border active:cursor-grabbing",
                    dragIndex === index && "opacity-40"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="pointer-events-none object-cover"
                  />
                  <div className="pointer-events-none absolute top-1 left-1 rounded-sm bg-background/80 p-0.5">
                    <GripVertical className="size-3" />
                  </div>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-sm bg-background/80 px-1 text-[10px] leading-tight">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 rounded-full bg-background/80 p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {form.images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:text-foreground disabled:opacity-50"
                  )}
                >
                  <Upload className="size-4" />
                  <span className="text-[10px]">
                    {uploading ? "Uploading…" : "Add"}
                  </span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting || uploading}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
