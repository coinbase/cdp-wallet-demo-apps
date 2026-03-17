import { LoadingSpinner } from "@coinbase/cdp-react/components/ui/LoadingSpinner";

/**
 * App loading screen
 */
export function Loading() {
  return (
    <main>
      <h1 className="sr-only">Loading</h1>
      <LoadingSpinner />
    </main>
  );
}
