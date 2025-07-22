import { useEffect } from 'react';

declare global {
    interface Window {
        frameworkReady?: () => void;
    }
}

export function useFrameworkReadyEffect() {
    useEffect(() => {
        window.frameworkReady?.();
    }, []);
}

