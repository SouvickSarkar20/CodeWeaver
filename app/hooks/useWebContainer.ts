// useWebContainer.ts
import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

let globalWebContainer: WebContainer | null = null;

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

    useEffect(() => {
        const init = async () => {
            if (!globalWebContainer) {
                globalWebContainer = await WebContainer.boot();
            }
            setWebcontainer(globalWebContainer);
        };

        init();
    }, []);

    return webcontainer;
}
