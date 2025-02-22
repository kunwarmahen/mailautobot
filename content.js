chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "applyChanges") {
    let composer = document.querySelector(
      'div[role="textbox"][aria-label="Message Body"] > div:first-child'
    );

    if (!composer) {
      composer = document.querySelector(
        'div[role="textbox"][aria-label="Message Body"]'
      );
    }
    const parsedEmail = parseEmail(request.content);

    const emailSubject = parsedEmail.subject;
    const emailBody = parsedEmail.body;

    if (composer) {
      const subjectcomposer = document.querySelector(
        'input[name="subjectbox"]'
      );

      if (subjectcomposer) {
        subjectcomposer.value = emailSubject;
        composer.innerHTML = emailBody;
      } else {
        composer.innerHTML = request.content;
      }
    } else {
      console.log("Composer not found, so opening gmail");
    }
  }
});

function escapeHTML(html) {
  var escape = document.createElement("textarea");
  escape.textContent = html;
  return escape.innerHTML;
}

function modifyEmail() {
  let composer = document.querySelector(
    'div[role="textbox"][aria-label="Message Body"] > div:first-child'
  );

  if (!composer) {
    composer = document.querySelector(
      'div[role="textbox"][aria-label="Message Body"]'
    );
  }

  if (composer) {
    const currentContent = composer.innerHTML;

    // Send content to background script for processing
    chrome.runtime.sendMessage(
      { action: "processContent", content: escapeHTML(currentContent) },
      function (response) {
        if (response && response.modifiedContent) {
          // Update the composer with the modified content

          console.log("Modified content:", response.modifiedContent);
          composer.innerHTML = response.modifiedContent;
        } else if (response && response.error) {
          console.error("Error from background script:", response.error);
          alert(
            "Failed to process content. Please check the console for more details."
          );
        }
      }
    );
  } else {
    console.log("Composer not found");
  }
}

// function addChatButton() {
//   const toolbarRight = document.querySelector('.btC');
//   if (toolbarRight) {
//     const button = document.createElement('div');
//     button.className = 'T-I J-J5-Ji aoO T-I-atl L3';
//     button.setAttribute('role', 'button');
//     button.style.marginRight = '10px';
//     button.innerHTML = '<span class="bzB">Chat with Llama 3.1</span>';
//     button.addEventListener('click', () => {
//       chrome.runtime.sendMessage({ action: "openPopup" });
//     });

//     toolbarRight.insertBefore(button, toolbarRight.firstChild);
//   }
// }

function addChatButton() {
  const intervalId = setInterval(() => {
    const toolbarRight = document.querySelector(".btC");
    if (toolbarRight) {
      const mlgDiv = toolbarRight.querySelector(".mlg");

      if (!mlgDiv) {
        clearInterval(intervalId);

        const parentDiv = document.createElement("div");
        parentDiv.className = "mlg";

        const button = document.createElement("div");
        button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
        button.setAttribute("role", "button");
        button.style.margin = "10px";
        button.style.borderRadius = "20px";
        button.style.backgroundColor = "#04AA6D";
        button.innerHTML = "Fix grammar";
        button.setAttribute("aria-label", "Fix grammar");
        button.setAttribute("data-tooltip", "Fix grammar");
        button.setAttribute("data-tooltip-delay", "800");
        button.addEventListener("click", modifyEmail);

        parentDiv.appendChild(button);

        toolbarRight.insertBefore(
          parentDiv,
          toolbarRight.firstChild.nextSibling
        );
      } else {
        clearInterval(intervalId);
      }
    }
  }, 1000); // Check every second
}

// Run when the page loads
addChatButton();

// Listen for navigation events
let currentUrl = location.href;
new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    addChatButton();
  }
}).observe(document, { subtree: true, childList: true });

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
