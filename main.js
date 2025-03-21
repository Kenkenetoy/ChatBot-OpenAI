const chatBox = document.querySelector(".chat-box");
const inputField = chatBox.querySelector("input[type='text']");
const button = chatBox.querySelector("button");
const chatBoxBody = chatBox.querySelector(".chat-box-body");

button.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return; // Don't send empty messages
  inputField.value = "";
  chatBoxBody.innerHTML += `<div class="message"><p>${message}</p></div>`;
  chatBoxBody.innerHTML += `<div id="loading" class="response loading">...</div>`;
  scrollToBottom();

  const API_KEY = "YOUR_OPENAI_API_KEY"; // ❗ Move this to a backend

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    document.getElementById("loading")?.remove(); // Ensure it exists before removing
    chatBoxBody.innerHTML += `<div class="response"><p>${data.choices[0].message.content}</p></div>`;
    scrollToBottom();
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("loading")?.remove();
    chatBoxBody.innerHTML += `<div class="response error"><p>Error: ${err.message}</p></div>`;
  } finally {
    // Prevent spamming
    button.disabled = false;
  }
}

function scrollToBottom() {
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
}
