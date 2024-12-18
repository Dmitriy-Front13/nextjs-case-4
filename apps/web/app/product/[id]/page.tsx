"use client";
import Link from "next/link";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui";
import { useState } from "react";
export default function ProductPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { id } = useParams();
  const { data: product, error } = useSWR(`/api/products/${id}`);
  const router = useRouter()
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setIsDeleteDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  if (error) return <div>Failed to load product</div>;
  if (!product) return <div>Loading...</div>;
  return (
    <main>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{product.content}</p>
            <p className="text-lg font-bold mb-4">
              ${product.price.toFixed(2)}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/product/${product.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
            <Link href="/">
              <Button variant="secondary">Back to list</Button>
            </Link>
          </CardFooter>
        </Card>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                              Are you sure you want to delete this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This product will be permanently deleted from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
