"use client";
import { mutate } from "swr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Button,
  Label,
  Textarea,
  ToastAction,
} from "@repo/ui";
import { useToast } from "@repo/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Схема валидации Zod
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  content: z.string().optional(),
});

// Функция для отправки запросов
const fetcher = async (url: string, method: string, data: any) => {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to ${method === "POST" ? "create" : "update"} product`
    );
  }

  return res.json();
};

export default function ProductForm({
  initialData,
}: {
  initialData?: { name: string; price: number; content?: string; id: number };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { name: "", price: 0, content: "" },
  });

  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
      action: (
        <ToastAction altText="Go back" onClick={() => router.back()}>
          Go back
        </ToastAction>
      ),
    });
  };
  const onSubmit = async (data: any) => {
    try {
      if (initialData) {
        // Режим редактирования
        await fetcher(`/api/products/${initialData.id}`, "PUT", data);
        showToast("Product updated", `Product ${initialData.name} updated.`);
      } else {
        // Режим создания
        await fetcher("/api/products", "POST", data);
        showToast("Product created", `Product ${data.name} created.`);
      }

      mutate("/api/products"); // Обновление кеша SWR
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {initialData ? "Edit Product" : "Create Product"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Product name"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Product description</Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Product description (optional)"
              />
              {errors.content && (
                <p className="text-red-500">{errors.content.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Product price</Label>
              <Input
                type="number"
                id="price"
                {...register("price", { valueAsNumber: true })}
                placeholder="Product price"
                step="0.01"
              />
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
            <Link href="/">
              <Button variant="secondary">Back to list</Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
