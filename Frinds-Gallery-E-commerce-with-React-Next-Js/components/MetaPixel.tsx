import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Pixel ID - REPLACE WITH YOUR ACTUAL PIXEL ID
const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID || '';

export const MetaPixel: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        if (!PIXEL_ID) {
            console.warn('Facebook Pixel ID not found. Set VITE_FACEBOOK_PIXEL_ID in .env');
            return;
        }

        // Initialize Facebook Pixel
        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.init(PIXEL_ID, undefined, {
                    autoConfig: true,
                    debug: false // Set to true for development
                });
                ReactPixel.pageView();
            })
            .catch(error => {
                console.error('Failed to initialize Facebook Pixel:', error);
            });
    }, []);

    useEffect(() => {
        if (!PIXEL_ID) return;

        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.pageView();
            });
    }, [location.pathname]);

    return null;
};

// Helper for custom events
export const trackEvent = (event: string, data?: any) => {
    if (!PIXEL_ID) {
        console.warn('Facebook Pixel ID not found. Event not tracked:', event);
        return;
    }
    
    import('react-facebook-pixel')
        .then((x) => x.default)
        .then((ReactPixel) => {
            ReactPixel.track(event, data);
            console.log('Facebook Pixel event tracked:', event, data);
        })
        .catch(error => {
            console.error('Failed to track Facebook Pixel event:', error);
        });
};

// E-commerce specific tracking functions
export const trackPurchase = (orderId: string, total: number, products: any[]) => {
    trackEvent('Purchase', {
        value: total,
        currency: 'BDT',
        transaction_id: orderId,
        contents: products.map(p => ({
            id: p.id,
            quantity: p.quantity,
            item_price: p.price
        })),
        content_type: 'product'
    });
};

export const trackAddToCart = (product: any, quantity: number = 1) => {
    trackEvent('AddToCart', {
        content_ids: [product.id],
        content_type: 'product',
        contents: [{
            id: product.id,
            quantity: quantity,
            item_price: product.price
        }],
        value: product.price * quantity,
        currency: 'BDT'
    });
};

export const trackViewContent = (product: any) => {
    trackEvent('ViewContent', {
        content_ids: [product.id],
        content_type: 'product',
        contents: [{
            id: product.id,
            item_price: product.price
        }],
        value: product.price,
        currency: 'BDT'
    });
};

export const trackInitiateCheckout = (cartTotal: number, cartItems: any[]) => {
    trackEvent('InitiateCheckout', {
        value: cartTotal,
        currency: 'BDT',
        contents: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            item_price: item.price
        })),
        content_type: 'product',
        num_items: cartItems.length
    });
};
