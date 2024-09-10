document
  .getElementById("promptForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const prompt = document.getElementById("prompt").value; // Get the user input

    const responseDiv = document.getElementById("response");
    responseDiv.innerHTML = "Generating..."; // Show a loading message

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.text();
      responseDiv.innerText = result; // Display the generated response
    } catch (err) {
      responseDiv.innerText = "Error: " + err.message; // Display error message
    }
  });
