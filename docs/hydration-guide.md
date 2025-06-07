# Hydration Optimization Guide

This document outlines strategies and utilities for preventing hydration issues in Next.js applications, particularly when using the App Router architecture.

## Understanding Hydration Issues

Hydration issues occur when the server-rendered HTML doesn't match what React expects to render on the client. This commonly happens when:

1. Components access browser-only APIs during rendering (localStorage, window, document)
2. Components render different content based on client-only information
3. Time-sensitive rendering happens (dates, random values, etc.)

## Utility Components and Hooks

### 1. ClientOnly Component

```tsx
import { ClientOnly } from "@/components/client-only";

function MyPage() {
  return (
    <div>
      <h1>Server-rendered content</h1>
      
      <ClientOnly fallback={<p>Loading...</p>}>
        {/* This will only render on the client */}
        <ComponentWithBrowserAPIs />
      </ClientOnly>
    </div>
  );
}
```

### 2. useLocalStorage Hook

```tsx
import { useLocalStorage } from "@/hooks/use-local-storage";

function MyComponent() {
  // Works just like useState but persists to localStorage
  const [value, setValue] = useLocalStorage("my-key", "default value");
  
  return (
    <button onClick={() => setValue("new value")}>
      Current value: {value}
    </button>
  );
}
```

For simpler cases, you can use the helper functions:
```tsx
import { readFromLocalStorage, writeToLocalStorage } from "@/hooks/use-local-storage";

// Read once
const value = readFromLocalStorage("my-key", "default");

// Write once
writeToLocalStorage("my-key", "new value");
```

### 3. SafeHydration Component

For components that need special hydration handling:

```tsx
import { SafeHydration } from "@/components/safe-hydration";

function MyPage() {
  return (
    <div>
      {/* Only renders on the client */}
      <SafeHydration fallback={<p>Loading...</p>}>
        <ClientOnlyComponent />
      </SafeHydration>
      
      {/* Only renders on the server (SEO content, etc.) */}
      <SafeHydration ssrOnly>
        <ServerOnlyContent />
      </SafeHydration>
    </div>
  );
}
```

### 4. Dynamic Imports for Client Components

```tsx
import { createClientComponent } from "@/lib/dynamic-import";

const ClientOnlyChart = createClientComponent(() => import("./Chart"));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ClientOnlyChart data={...} />
    </div>
  );
}
```

### 5. Suspense for Data Fetching

```tsx
import { DataFetchingSuspense } from "@/components/suspense-boundary";

function MyPage() {
  return (
    <div>
      <h1>My Data</h1>
      <DataFetchingSuspense loadingMessage="Loading data...">
        <MyDataComponent />
      </DataFetchingSuspense>
    </div>
  );
}
```

## Best Practices

1. **Move Browser API Access to useEffect**:
   ```tsx
   // ❌ Don't do this
   const isMobile = window.innerWidth < 768;
   
   // ✅ Do this instead
   const [isMobile, setIsMobile] = useState(false);
   useEffect(() => {
     setIsMobile(window.innerWidth < 768);
   }, []);
   ```

2. **Use Optional Chaining with Browser APIs**:
   ```tsx
   // ✅ Safe access
   const userLocale = typeof window !== 'undefined' ? window.navigator?.language : 'en';
   ```

3. **Consistent Initial State**:
   Ensure your initial state is consistent between server and client.

4. **Use Next.js's Loading States**:
   Leverage `loading.tsx` for route segments that need time to load.

5. **Prefer Static Generation**:
   When possible, use static generation (`generateStaticParams`) to avoid hydration issues.

6. **Use Client Directives Properly**:
   - Mark components that use browser APIs with `'use client'`
   - Keep server components as pure rendering functions

By applying these patterns and utilities, you can prevent most hydration issues in your Next.js application.
