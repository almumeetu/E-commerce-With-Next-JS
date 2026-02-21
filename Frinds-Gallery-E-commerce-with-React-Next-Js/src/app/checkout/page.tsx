import { getProducts } from "@/services/api";
import CheckoutClient from "@/components/CheckoutClient";
import { MainLayout } from "@/components/MainLayout";
import { Suspense } from "react";

export default async function Page() {
  const products = await getProducts();

  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Checkout...</div>}>
        <CheckoutClient products={products} />
      </Suspense>
    </MainLayout>
  );
}
