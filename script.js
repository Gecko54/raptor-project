// Load the header shared by all pages.
async function loadHeader() {
  const container = document.querySelector("#site-header");

  if (!container) {
    return;
  }

  try {
    const response = await fetch("header.html");

    if (!response.ok) {
      throw new Error(`Could not load header: ${response.status}`);
    }

    container.innerHTML = await response.text();

    initializeNavigation();
  } catch (error) {
    console.error(error);

    const fallback = document.createElement("a");
    fallback.href = "index.html";
    fallback.textContent = "The Raptor Project — Home";

    container.replaceChildren(fallback);
  }
}


// Activate the mobile navigation after the header loads.
function initializeNavigation() {
  const menu = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navigation");

  if (!menu || !navigation) {
    return;
  }

  const mobile = window.matchMedia("(max-width: 700px)");

  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    navigation.dataset.collapsed = String(mobile.matches);
  }

  function updateNavigation() {
    menu.hidden = !mobile.matches;
    closeMenu();
  }

  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";

    menu.setAttribute("aria-expanded", String(open));
    navigation.dataset.collapsed = String(!open);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a") && mobile.matches) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobile.matches &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });

  mobile.addEventListener("change", updateNavigation);

  updateNavigation();
}


// Show the current year in the footer.
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}


// Start loading the shared header.
loadHeader();