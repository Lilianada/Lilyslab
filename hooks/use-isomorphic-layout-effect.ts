import { useEffect, useLayoutEffect } from 'react';

// This hook safely handles the useLayoutEffect warning during SSR
// It uses useLayoutEffect on the client and useEffect on the server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
