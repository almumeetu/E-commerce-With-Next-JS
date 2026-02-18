import { supabase } from '../../../services/supabase';

export async function addProduct(productData: any) {
    const { error } = await supabase.from('products').insert(productData);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function updateProduct(id: string, productData: any) {
    const { error } = await supabase.from('products').update(productData).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function validateCart(itemIds: (string | number)[]) {
    const isUUID = (id: string | number) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const invalidIds = itemIds.filter(id => !isUUID(id));
    const validUUIDs = itemIds.filter(id => isUUID(id)) as string[];

    if (validUUIDs.length === 0) {
        return { invalidIds, missingIds: [] };
    }

    const { data, error } = await supabase
        .from('products')
        .select('id')
        .in('id', validUUIDs);

    if (error) return { invalidIds, missingIds: [] };

    const existingIds = new Set(data?.map(p => p.id) || []);
    const missingIds = validUUIDs.filter(id => !existingIds.has(id));

    return { invalidIds, missingIds };
}
