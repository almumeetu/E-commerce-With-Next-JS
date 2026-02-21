import { getProducts, getCategories } from "@/services/api";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { MainLayout } from "@/components/MainLayout";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    notFound();
  }

  return (
    <MainLayout>
      <ProductDetailsClient
        product={product}
        allProducts={products}
        categories={categories}
      />
    </MainLayout>
  );
}
