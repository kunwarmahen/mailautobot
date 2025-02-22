document.addEventListener("DOMContentLoaded", () => {
  const ollamaPathInput = document.getElementById("ollama-path");
  const llmModelInput = document.getElementById("llm-model");
  const saveButton = document.getElementById("save-button");

  // Load saved settings from storage
  chrome.storage.sync.get(["ollamaPath", "llmModel"], (result) => {
    ollamaPathInput.value = result.ollamaPath || "";
    llmModelInput.value = result.llmModel || "";
  });

  saveButton.addEventListener("click", () => {
    const ollamaPath = ollamaPathInput.value;
    const llmModel = llmModelInput.value;

    chrome.storage.sync.set({ ollamaPath, llmModel }, () => {
      console.log("Settings saved:", ollamaPath, llmModel);
    });
  });
});
