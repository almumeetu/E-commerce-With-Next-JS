import { getProducts, getCategories } from "@/services/api";
import HomeClient from "@/components/HomeClient";
import { MainLayout } from "@/components/MainLayout";

export default async function Page() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <MainLayout>
      <HomeClient products={products} categories={categories} />
    </MainLayout>
  );
}
