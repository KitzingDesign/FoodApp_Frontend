function setVhUnit() {
  // Get the viewport height and multiply it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Execute the function initially
setVhUnit();

// Execute the function on resize
window.addEventListener("resize", setVhUnit);
