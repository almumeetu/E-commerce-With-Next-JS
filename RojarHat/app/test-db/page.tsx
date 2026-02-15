import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function DbTest() {
    const supabase = await createClient();
    const { data: products, error } = await (await supabase).from("products").select("name").limit(5);

    if (error) {
        return (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
                <p className="font-bold">Error connecting to Supabase:</p>
                <code className="text-xs">{error.message}</code>
            </div>
        );
    }

    return (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800">
            <p className="font-bold mb-2">Connection Successful! ✅</p>
            <p className="text-sm">Sample data from products table:</p>
            <pre className="text-xs mt-2">{JSON.stringify(products, null, 2)}</pre>
        </div>
    );
}

export default function SupabaseTestPage() {
    return (
        <div className="min-h-screen pt-32 px-4 flex flex-col items-center">
            <h1 className="text-2xl font-black mb-8">Supabase Connection Test</h1>
            <Suspense fallback={<div>Testing connection...</div>}>
                <DbTest />
            </Suspense>
        </div>
    );
}
