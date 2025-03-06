# MailAutoBot/Local Grammarly 📧 🤖

**MailAutoBot** is a Chrome extension that helps you write and improve emails effortlessly. Whether you need to craft an email in different moods or refine an existing message using the "Fix Email" feature, MailAutoBot streamlines your Gmail experience.

## 🚀 Features

✅ Generate emails based on different moods.  
✅ Improve existing emails instantly with the "Fix Email" option.  
✅ Seamless integration with Gmail.  
✅ Uses local LLM through Ollama so that your data is safe. I do not know why will you share you email or official mail content with Grammarly.

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kunwarmahen/mailautobot.git
   cd mailautobot
   ```
2. **Import the Chrome extension:**  
   Follow the extension setup steps from [TabNinja](https://github.com/kunwarmahen/tabninja).
3. **Download and install Ollama** plus configure Ollama (follow steps in [TabNinja](https://github.com/kunwarmahen/tabninja).
4. **Configure the extension** and start using it.

## ⚙️ Configuration

Before using the extension, configure the following settings:

```
Ollama Path = http://localhost:11434
LLM Model = qwen2.5:14b (Larger models yield better results)
```

## ▶️ Usage

1. Once installed, refresh Gmail if it is already open, and you're all set!
2. You can ask MailAutoBot to generate an email by clicking on the extension icon and selecting a mood.
3. You also refine the the content by further asking the LLM to improve the email.
4. Once you are happy just hit "Finalize and apply to email". And it updates your opened email editor or open gmail and create a new editor with the updated content. I prefere second option until I fix the formating of first option.
5. If you already have an opened email editor or gmail, you can use the "Fix Email" option in the editor to improve the email. Again this is still under works, so you may have to format it manually. 🤷

## 🛠 To-Do

- [ ] Improve **Fix Email** logic to handle email signatures.
- [ ] Support multiple email providers beyond Gmail.
- [ ] Handle adding div to maintain email structure (new line, breaks etc.)
- [ ] Add capability to use external LLM models like OpenAI or Claude or Gemini.
- [ ] Convert extension into side panel.

## 📜 License

This project is licensed under the MIT License.

---

Let me know if you'd like any further refinements! 🚀
