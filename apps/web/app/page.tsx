"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
} from "@repo/ui";
import { Product } from "@repo/db";
import useSWR from "swr";
import Link from "next/link";
export default function HomePage() {
  const { data: products, error } = useSWR("/api/products");

  if (error) return <div>Failed to load products</div>;
  if (!products) return <div>Loading...</div>;

  return (
    <main>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Products list</h1>
        <Link href="/product/create">
          <Button className="mb-6">Add new product</Button>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{product.content}</p>
              <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/product/${product.id}`}>
                <Button variant="outline">More details</Button>
              </Link>
            </CardFooter>
          </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
