import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";

import { Loading } from "./Loading";
import { SignedInScreen } from "./SignedInScreen";
import { SignInScreen } from "./SignInScreen";

/**
 * Root component. Shows a loading state while CDP initializes, then renders
 * the sign-in screen or the signed-in screen depending on auth state.
 */
function App() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();

  return (
    <div className="app flex-col-container flex-grow">
      {!isInitialized && <Loading />}
      {isInitialized && (
        <>
          {!isSignedIn && <SignInScreen />}
          {isSignedIn && <SignedInScreen />}
        </>
      )}
    </div>
  );
}

export default App;
