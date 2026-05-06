import { createContext, useContext, useState } from '@wordpress/element';

export const BreakpointContext = createContext({
    breakpoint: 'desktop',
    setBreakpoint: () => {},
});

export function BreakpointProvider({ children }) {
    const [breakpoint, setBreakpoint] = useState('desktop');
    return (
        <BreakpointContext.Provider value={{ breakpoint, setBreakpoint }}>
            {children}
        </BreakpointContext.Provider>
    );
}

export function useBreakpoint() {
    return useContext(BreakpointContext);
}

// Helper: geeft de juiste attribute key terug op basis van breakpoint
export function getBreakpointKey(baseKey, breakpoint) {
    if (breakpoint === 'tablet') return `${baseKey}Tablet`;
    if (breakpoint === 'mobile') return `${baseKey}Mobile`;
    return baseKey;
}