chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "chat") {
    getSettingsValueFor("ollamaPath").then((ollamaPath) => {
      getSettingsValueFor("llmModel").then((llmModel) => {
        let messages = request.messages;
        // console.log(messages);
        fetch(ollamaPath + "/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: llmModel,
            messages: messages,
            stream: false,
          }),
        })
          .then((response) => {
            // console.log(response);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data && data.message && data.message.content) {
              sendResponse({ content: data.message.content });
            } else {
              throw new Error("Unexpected API response format");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            sendResponse({ error: "Failed to process chat: " + error.message });
          });
      });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "processContent") {
    getSettingsValueFor("ollamaPath").then((ollamaPath) => {
      getSettingsValueFor("llmModel").then((llmModel) => {
        fetch(ollamaPath + "/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: llmModel,
            // prompt: `<|begin_of_text|>
            // <|start_header_id|>system<|end_header_id|>
            //   You are a writing assistant designed to replicate the core functions of a grammar and style-checking tool, similar to Grammarly. Your role is to evaluate, correct, and enhance text provided by users. You should focus on the following tasks:

            //   1. **Grammar and Spelling**: Detect and correct grammatical errors, spelling mistakes, and typos in sentences.
            //   2. **Punctuation**: Ensure proper use of punctuation marks, including commas, periods, and quotation marks.
            //   3. **Clarity and Conciseness**: Suggest edits to make sentences clearer and more concise without altering their intended meaning.
            //   4. **Tone and Style**: Adapt the tone of the writing to suit formal, casual, or neutral contexts based on user preference.
            //   5. **Vocabulary Enhancement**: Recommend alternative words or phrases to improve readability and add variety to the text.
            //   6. **Sentence Structure**: Identify and correct run-on sentences, fragments, and overly complex structures.
            //   7. **Readability**: Provide feedback to adjust the readability of the text according to different audience levels (e.g., general, academic, professional).
            //   8. **Feedback and Explanation**: Offer concise explanations for any corrections or suggestions to aid user learning.
            //   Provide only the improved response content without any additional commentary
            //  <|eot_id|>
            //  <|start_header_id|>user<|end_header_id|>
            //  User Text:
            //  ${request.content}
            //  <|eot_id|>
            //  <|start_header_id|>assistant<|end_header_id|>`,
            prompt: `<|begin_of_text|>
            <|start_header_id|>system<|end_header_id|>
              You are a writing assistant designed to replicate the core functions of a grammar and style-checking tool, similar to Grammarly. Your role is to evaluate, correct, and enhance text provided by users.
              Provide only the improved response content without any additional commentary.
              Respond in a helpful and user-friendly manner, maintaining a balance between automated correction and user choice. Your goal is to assist users in enhancing their writing while respecting their unique voice and preferences
             <|eot_id|>
             <|start_header_id|>user<|end_header_id|>
             User Text: 
             ${request.content}
             <|eot_id|>
             <|start_header_id|>assistant<|end_header_id|>`,
            //  prompt: `You are an AI assistant specializing in indetifying spelling and gramitical mistakes in a text provided.:
            //  ${request.content}
            //  Provide only the improved response content without any additional commentary.`,
            //              // Respond in a helpful and user-friendly manner, maintaining a balance between automated correction and user choice. Your goal is to assist users in enhancing their writing while respecting their unique voice and preferences.
            stream: false, // Request a non-streaming response
          }),
        })
          .then((response) => {
            // console.log(response);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            // console.log("API Response:", data); // Log the full response for debugging
            if (data && data.response) {
              sendResponse({ modifiedContent: data.response });
            } else {
              throw new Error("Unexpected API response format");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            sendResponse({
              error: "Failed to process content: " + error.message,
            });
          });
      });
    });
    return true; // Indicates that the response is sent asynchronously
  }
});

function getSettingsValueFor(id) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([id], (result) => {
      let val = result[id] || "";
      // console.log("Found value for " + id + ": " + val);
      resolve(val);
    });
  });
}
