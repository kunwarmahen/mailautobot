let chatHistory = [];

const sendBtn = document.getElementById("sendBtn");
const applyBtn = document.getElementById("applyBtn");
const settingsButton = document.getElementById("settings-button");
const textarea = document.getElementById("userInput");
const chatbox = document.getElementById("chatbox");
const moodButtons = document.querySelectorAll(".mood-btn");

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

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove selected class from all buttons
    moodButtons.forEach((btn) => btn.classList.remove("selected"));
    // Add selected class to clicked button
    button.classList.add("selected");
    let selectedMood = button.dataset.mood;
    updateSystemPrompt(selectedMood);
  });
});

settingsButton.addEventListener("click", () => {
  // Trigger the desired action, such as:
  // 1. Open the options page:
  chrome.runtime.openOptionsPage();

  // 2. Show a settings modal or dialog:
  // (You'll need to implement the modal/dialog logic)
  // ...
});

// chatHistory.push({
//   role: "system",
//   content: `You are an AI email writer. Your role is to compose funny emails based on user-provided topics or prompts. When responding, format your output as follows:

// [Subject:<Insert subject line here>]

// [Email]
// <Insert email body here>

// Ensure the subject line is concise and relevant, while the email body is clear, well-structured, and tailored to the context. Write in a funny tone, and adapt the style as necessary based on user input.
// `,
// });

// Define the system prompts for each mood
const moodPrompts = {
  professional: {
    role: "system",
    content: `You are an AI email writer. Your role is to compose professional and polished emails based on user-provided topics or prompts. When responding, format your output as follows:

[Subject:<Insert subject line here>]
[Email]
<Insert email body here>

Ensure the subject line is clear and business-appropriate, while the email body maintains a professional tone with proper business etiquette. Use concise language, clear structure, and maintain a respectful, business-focused approach throughout the email.`,
  },
  friendly: {
    role: "system",
    content: `You are an AI email writer. Your role is to compose warm and friendly emails based on user-provided topics or prompts. When responding, format your output as follows:

[Subject:<Insert subject line here>]
[Email]
<Insert email body here>

Create a subject line that's welcoming but clear, and write the email body in a warm, approachable tone. Use conversational language while maintaining clarity and appropriateness. The email should feel personal and engaging without being overly casual.`,
  },
  funny: {
    role: "system",
    content: `You are an AI email writer. Your role is to compose funny and entertaining emails based on user-provided topics or prompts. When responding, format your output as follows:

[Subject:<Insert subject line here>]
[Email]
<Insert email body here>

Create a witty subject line that grabs attention, and write the email body with humor and playfulness. Include appropriate jokes, wordplay, or light-hearted references while ensuring the main message remains clear. Keep the tone fun but not inappropriate.`,
  },
  quirky: {
    role: "system",
    content: `You are an AI email writer. Your role is to compose uniquely creative and unconventional emails based on user-provided topics or prompts. When responding, format your output as follows:

[Subject:<Insert subject line here>]
[Email]
<Insert email body here>

Create an imaginative subject line, and write the email body with unexpected twists and creative flair. Use unusual analogies, unique perspectives, or unexpected formatting choices while keeping the message comprehensible. Make the email memorable and different without being confusing.`,
  },
  formal: {
    role: "system",
    content: `You are an AI email writer. Your role is to compose highly formal and ceremonious emails based on user-provided topics or prompts. When responding, format your output as follows:

[Subject:<Insert subject line here>]
[Email]
<Insert email body here>

Create a proper and formal subject line, and write the email body with utmost attention to formal language and structure. Use sophisticated vocabulary, proper honorifics, and formal email conventions throughout. Maintain the highest level of professionalism and ceremony in the communication.`,
  },
};

// Default mood if none is selected
const defaultMood = "professional";

// Function to update the system prompt in chatHistory
function updateSystemPrompt(selectedMood = defaultMood) {
  if (chatHistory.length > 0) {
    // Replace the first item if it's a system message
    if (chatHistory[0].role === "system") {
      chatHistory[0] = moodPrompts[selectedMood] || moodPrompts[defaultMood];
    } else {
      // Insert the system message at the beginning if not present
      chatHistory.unshift(
        moodPrompts[selectedMood] || moodPrompts[defaultMood]
      );
    }
  } else {
    // Initialize chatHistory with the system message if empty
    chatHistory.push(moodPrompts[selectedMood] || moodPrompts[defaultMood]);
  }
}

updateSystemPrompt();

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
    print(chatHistory);
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
