import { useEffect } from "react";

const LeftNavApp = () => {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("leftnav-mounted", { detail: true }));
    sessionStorage.setItem("leftnav-mounted", "true");

    return () => {
      window.dispatchEvent(new CustomEvent("leftnav-mounted", { detail: false }));
      sessionStorage.setItem("leftnav-mounted", "false");
    };
  }, []);

  return <nav>Left Navigation Menu</nav>;
};

export default LeftNavApp;

import { useEffect, useState } from "react";

const Header = () => {
  const [isLeftNavMounted, setIsLeftNavMounted] = useState(
    sessionStorage.getItem("leftnav-mounted") === "true"
  );

  useEffect(() => {
    const handleLeftNavMountEvent = (event: any) => setIsLeftNavMounted(event.detail);
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
