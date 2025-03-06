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
![Setting Screen](https://github.com/user-attachments/assets/62ebc61c-b0f6-4b51-81d0-668933814555)

## ▶️ Usage

1. Once installed, refresh Gmail if it is already open, and you're all set!
2. You can ask MailAutoBot to generate an email by clicking on the extension icon and selecting a mood.
![Ask Extention to write an email with a particular mood](https://github.com/user-attachments/assets/48250f35-3f5c-456d-9e72-1312fb7942aa)
![Extension generates an email](https://github.com/user-attachments/assets/dea35226-024b-4d04-9312-94aa35de6a5f)

3. You also refine the the content by further asking the LLM to improve the email.

![Can refine further](https://github.com/user-attachments/assets/e4a6c417-fcb8-4651-b87a-af501dea28eb)
![Refined response](https://github.com/user-attachments/assets/14993474-ac50-4bfe-ac91-2be845396f4f)

5. Once you are happy just hit "Finalize and apply to email". And it updates your opened email editor or open gmail and create a new editor with the updated content. I prefere second option until I fix the formating of first option.
   
6. If you already have an opened email editor or gmail, you can use the "Fix Email" option in the editor to improve the email. Again this is still under works, so you may have to format it manually. 🤷
![Fix Email](https://github.com/user-attachments/assets/6f41d3c7-3e66-43ff-998c-328b63e84cd5)


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
