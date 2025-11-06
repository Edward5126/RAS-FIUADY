document
  .getElementById("MenuHamburguesa")
  .addEventListener("click", toggleMenu);
document.getElementById("joinButton").addEventListener("click", toggleMenu);

function toggleMenu() {
  document.getElementById("navList").classList.toggle("visible");
  document.getElementById("navList").classList.toggle("activo");
  document.getElementById("enlacesNav").classList.toggle("visible");
  document.getElementById("enlacesNav").classList.toggle("activo");

  if (document.getElementById("navList").classList.contains("activo")) {
    document
      .getElementById("MenuHamburguesa")
      .querySelector("i")
      .classList.remove("icon-MenuHam");
    document
      .getElementById("MenuHamburguesa")
      .querySelector("i")
      .classList.add("icon-Cruz");
  } else {
    document
      .getElementById("MenuHamburguesa")
      .querySelector("i")
      .classList.remove("icon-Cruz");
    document
      .getElementById("MenuHamburguesa")
      .querySelector("i")
      .classList.add("icon-MenuHam");
  }
}