/* Applies the saved or system theme before first paint to avoid a flash. Loaded synchronously in <head>. */
(function () {
  try {
    var saved = localStorage.getItem("hanga-theme");
    var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
