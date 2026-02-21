import { getProducts, getCategories } from "@/services/api";
import ShopClient from "@/components/ShopClient";
import { MainLayout } from "@/components/MainLayout";
import { Suspense } from "react";

export default async function Page() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ShopClient products={products} categories={categories} />
      </Suspense>
    </MainLayout>
  );
}
