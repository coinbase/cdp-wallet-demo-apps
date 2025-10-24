import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { IconCheck, IconCopy, IconUser } from "./Icons";

/**
 * Header component
 */
export function Header() {
  const { address } = useAccount();
  const [isCopied, setIsCopied] = useState(false);

  const formatAddress = useCallback((address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isCopied) return;
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <header>
      <div className="header-inner">
        <div className="title-container">
          <h1 className="site-title">CDP React + Wagmi</h1>
        </div>
        <div className="user-info flex-row-container">
          {address && (
            <button
              aria-label="copy wallet address"
              className="flex-row-container copy-address-button"
              onClick={copyAddress}
            >
              {!isCopied && (
                <>
                  <IconUser className="user-icon user-icon--user" />
                  <IconCopy className="user-icon user-icon--copy" />
                </>
              )}
              {isCopied && <IconCheck className="user-icon user-icon--check" />}
              <span className="wallet-address">{formatAddress(address)}</span>
            </button>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
