let chatHistory = [];

const sendBtn = document.getElementById("sendBtn");
const applyBtn = document.getElementById("applyBtn");
const settingsButton = document.getElementById("settings-button");
const textarea = document.getElementById("userInput");
const chatbox = document.getElementById("chatbox");

sendBtn.addEventListener("click", sendMessage);
applyBtn.addEventListener("click", applyToEmail);

// Handle Enter key in textarea
textarea.addEventListener("keydown", (event) => {
  // Check if Enter was pressed without Shift key
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevent default Enter behavior (new line)

    sendMessage();
  }
});

settingsButton.addEventListener("click", () => {
  // Trigger the desired action, such as:
  // 1. Open the options page:
  chrome.runtime.openOptionsPage();

  // 2. Show a settings modal or dialog:
  // (You'll need to implement the modal/dialog logic)
  // ...
});

chatHistory.push({
  role: "system",
  content: `You are an AI email writer. Your role is to compose funny emails based on user-provided topics or prompts. When responding, format your output as follows:

[Subject:<Insert subject line here>]


[Email]
<Insert email body here>

Ensure the subject line is concise and relevant, while the email body is clear, well-structured, and tailored to the context. Write in a funny tone, and adapt the style as necessary based on user input.
`,
});

// Function to format message with paragraphs
function formatMessage(text) {
  // Split text by double newlines to separate paragraphs
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => `<p class="message-paragraph">${paragraph.trim()}</p>`)
    .join("");
}

function sendMessage() {
  const message = userInput.value.trim();
  if (message) {
    appendMessage("You", message);
    chatHistory.push({ role: "user", content: message });
    textarea.value = "";

    // Disable input while processing
    textarea.disabled = true;
    sendBtn.disabled = true;
    applyBtn.disabled = true;

    // Send message to background script
    chrome.runtime.sendMessage(
      { action: "chat", messages: chatHistory },
      (response) => {
        // console.log(response);
        if (response && response.content) {
          appendMessage("Auto-Bot", response.content);
          chatHistory.push({ role: "assistant", content: response.content });
        } else if (response && response.error) {
          appendMessage("Error", response.error);
        }
        textarea.disabled = false;
        sendBtn.disabled = false;
        applyBtn.disabled = false;
        textarea.focus();
      }
    );
  }
}

function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = formatMessage(
    `<strong>${sender}:</strong> ${message}`
  );
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function applyToEmail() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const url = currentTab.url;
    console.log("Current tab url:", url);
    if (url.includes("mail.google.com")) {
      console.log("Applying changes to email");
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applyChanges",
        content: chatHistory[chatHistory.length - 1].content,
      });
    } else {
      const emailContent = chatHistory[chatHistory.length - 1].content;
      const parsedEmail = parseEmail(emailContent);
      // console.log("Parsed email:", parsedEmail);

      const emailSubject = parsedEmail.subject;
      const emailBody = parsedEmail.body;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;

      chrome.tabs.create({
        url: gmailUrl,
      });
    }
  });
}

function parseEmail(input) {
  // Use a regular expression to match the subject line and the rest as body
  let match = input.match(/\[Subject:(.*?)\](.*)/s);

  if (match) {
    let subject = match[1].trim();
    let body = match[2].trim();
    body = body.replace(/\[Email\]/g, "").trim();
    return {
      subject: subject,
      body: body,
    };
  } else {
    return {
      subject: "",
      body: input.replace(/\[Email\]/g, "").trim(), // Remove '[Email]' if no subject is found
    };
  }
}
