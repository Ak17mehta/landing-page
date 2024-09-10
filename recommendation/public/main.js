document
  .getElementById("promptForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const prompt = document.getElementById("prompt").value; // Get the user input for field of interest
    const responseDiv = document.getElementById("response");
    const nextFormContainer = document.getElementById("nextFormContainer");

    responseDiv.innerHTML = "Generating questions..."; // Show a loading message

    try {
      // Send the field of interest to the server
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ step: "questions", field: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json(); // Expect JSON response
      responseDiv.innerText = result.questions; // Display the questions

      // Create the second form for answers dynamically
      nextFormContainer.innerHTML = `
      <h3>Please provide your answers:</h3>
      <form id="answerForm">
        <label for="answers">Your answers:</label>
        <textarea id="answers" rows="5" cols="50" required></textarea>
        <button type="submit">Submit Answers</button>
      </form>
      <div id="answerResponse"></div>
    `;

      // Add an event listener for the second form (answers submission)
      document
        .getElementById("answerForm")
        .addEventListener("submit", async function (event) {
          event.preventDefault();

          const answers = document.getElementById("answers").value; // Get user's answers
          const answerResponseDiv = document.getElementById("answerResponse");

          answerResponseDiv.innerHTML = "Submitting your answers...";

          try {
            // Send the user's answers to the server
            const answerResponse = await fetch("/api/generate-content", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ step: "answers", field: prompt, answers }),
            });

            if (!answerResponse.ok) {
              throw new Error("Network response was not ok");
            }

            const answerResult = await answerResponse.json();
            answerResponseDiv.innerText = `Analysis: ${
              answerResult.analysis
            }\nRecommended Courses: ${answerResult.recommendations.join(", ")}`;

            // Create the next prompt form (dynamically) for follow-up questions after receiving answers
            nextFormContainer.innerHTML += `
          <h3>Enter your follow-up response or next prompt:</h3>
          <form id="followUpForm">
            <input type="text" id="followUpPrompt" placeholder="Next prompt" required />
            <button type="submit">Submit Next Prompt</button>
          </form>
          <div id="followUpResponse"></div>
        `;

            // Add event listener for follow-up prompt form
            document
              .getElementById("followUpForm")
              .addEventListener("submit", async function (event) {
                event.preventDefault();

                const followUpPrompt =
                  document.getElementById("followUpPrompt").value;
                const followUpResponseDiv =
                  document.getElementById("followUpResponse");

                followUpResponseDiv.innerHTML =
                  "Generating follow-up response...";

                try {
                  // Send the follow-up prompt to the server
                  const followUpResponse = await fetch(
                    "/api/generate-content",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        step: "follow-up",
                        prompt: followUpPrompt,
                      }),
                    }
                  );

                  if (!followUpResponse.ok) {
                    throw new Error("Network response was not ok");
                  }

                  const followUpResult = await followUpResponse.json();
                  followUpResponseDiv.innerText =
                    followUpResult.followUpResponse; // Display the follow-up response
                } catch (err) {
                  followUpResponseDiv.innerText = "Error: " + err.message;
                }
              });
          } catch (err) {
            answerResponseDiv.innerText = "Error: " + err.message;
          }
        });
    } catch (err) {
      responseDiv.innerText = "Error: " + err.message;
    }
  });
