export function mount() {
  console.log("leftnav-app is mounting");
  window.dispatchEvent(new CustomEvent("leftnav-mounted", { detail: true }));
  sessionStorage.setItem("leftnav-mounted", "true"); // Store the last known state
}

export function unmount() {
  console.log("leftnav-app is unmounting");
  window.dispatchEvent(new CustomEvent("leftnav-mounted", { detail: false }));
  sessionStorage.setItem("leftnav-mounted", "false"); // Update the state
}