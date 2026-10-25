(() => {
  "use strict";

  const RESET_DELAY = 1500;

  document.querySelectorAll("pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code-btn";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");

    let resetTimer;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied!";
      } catch (err) {
        button.textContent = "Failed";
      }
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        button.textContent = "Copy";
      }, RESET_DELAY);
    });

    pre.appendChild(button);
  });
})();
