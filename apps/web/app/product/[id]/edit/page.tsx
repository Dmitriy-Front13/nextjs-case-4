import ProductForm from "../../../../components/form";
// import useSWR from "swr";
export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  const product = await response.json();

  return (
    <ProductForm
      initialData={product} // Передаём данные в форму
    />
  );
}
