document.getElementById("generate-diamond").addEventListener("click", function() {
    let size = parseInt(document.getElementById("diamond-size").value);

    // Add 1 if input is even
    if (size % 2 === 0) {
      size + 1;
    }

    // Error message if size is less than 2
    if (size < 2) {
      alert("Error! Size must be at least 2.");
      return;
    }

    // Clear existing diamond container
    const container = document.getElementById("diamond-container");
    container.innerHTML = "";

    // Number of floors in each half (not counting middle row)
    const half = Math.floor(size / 2);

    // Generate the top half (including the middle row)
    for (let i = 0; i <= half; i++) {
      const row = document.createElement("div");
      row.classList.add("diamond-row");
      const numAsterisks = 2 * i + 1;
      for (let j = 0; j < numAsterisks; j++) {
        const asterisk = document.createElement("div");
        asterisk.classList.add("diamond-text");
        asterisk.textContent = "*";
        row.appendChild(asterisk);
      }
      container.appendChild(row);
    }

    // Generate the bottom half (not including the middle row)
    for (let i = half - 1; i >= 0; i--) {
      const row = document.createElement("div");
      row.classList.add("diamond-row");
      const numAsterisks = 2 * i + 1;
      for (let j = 0; j < numAsterisks; j++) {
        const asterisk = document.createElement("div");
        asterisk.classList.add("diamond-text");
        asterisk.textContent = "*";
        row.appendChild(asterisk);
      }
      container.appendChild(row);
    }
  });
