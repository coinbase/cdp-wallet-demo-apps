interface TabNavigationProps {
  activeTab: "auth0" | "cdp";
  onTabChange: (tab: "auth0" | "cdp") => void;
}

/**
 * Navigation component that allows switching between Auth0 and CDP wallet tabs
 *
 * @param root0 - Component props
 * @param root0.activeTab - The currently active tab
 * @param root0.onTabChange - Callback function to change the active tab
 * @returns The tab navigation component
 */
export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="tab-navigation">
      <button
        className={`tab-button ${activeTab === "cdp" ? "active" : ""}`}
        onClick={() => onTabChange("cdp")}
      >
        CDP Embedded Wallet
      </button>
      <button
        className={`tab-button ${activeTab === "auth0" ? "active" : ""}`}
        onClick={() => onTabChange("auth0")}
      >
        Auth0 Authentication
      </button>
    </div>
  );
};
