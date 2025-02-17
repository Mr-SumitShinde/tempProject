import { useEffect } from "react";

const LeftNavApp = () => {
  useEffect(() => {
    const updateState = (mounted: boolean) => {
      window.leftNavMountedState = mounted;
      window.dispatchEvent(new CustomEvent("leftnav-mounted", { detail: mounted }));
    };

    updateState(true);

    return () => {
      updateState(false);
    };
  }, []);

  useEffect(() => {
    if (window.leftNavMountedState === undefined) {
      window.leftNavMountedState = false;
    }
    window.dispatchEvent(new CustomEvent("leftnav-mounted", { detail: window.leftNavMountedState }));
  }, []);

  return <nav>Left Navigation Menu</nav>;
};

export default LeftNavApp;


import { useEffect, useState } from "react";

const Header = () => {
  const getStoredLeftNavState = () => {
    return window.leftNavMountedState ?? false;
  };

  const [isLeftNavMounted, setIsLeftNavMounted] = useState(getStoredLeftNavState());

  useEffect(() => {
    const handleLeftNavMountEvent = (event: any) => {
      window.leftNavMountedState = event.detail;
      setIsLeftNavMounted(event.detail);
    };

    window.addEventListener("leftnav-mounted", handleLeftNavMountEvent);

    return () => {
      window.removeEventListener("leftnav-mounted", handleLeftNavMountEvent);
    };
  }, []);

  return (
    <header>
      <h1>My Application</h1>
      {!isLeftNavMounted && <button id="logout-button">Logout</button>}
    </header>
  );
};

export default Header;