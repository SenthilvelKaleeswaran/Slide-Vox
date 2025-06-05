chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background:", request);
    const { type, data } = request;
  
    if (type === "generateSlides") {
      console.log("Processing generateSlides in background:", data);
  
      fetch("https://g2pxfjv2-5000.inc1.devtunnels.ms/api/slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((response) => {
          console.log("API response in background:", response);
          sendResponse({ data: response });
        })
        .catch((error) => {
          console.error("API error in background:", error.message);
          sendResponse({ error: error.message });
        });
  
      return true; // Keep the message channel open for async response
    }else if (type === "getSlidesByConversationId") {

        fetch(`https://g2pxfjv2-5000.inc1.devtunnels.ms/api/slides/${data?.conversationId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((response) => {
              console.log("API response in background:", response);
              sendResponse({ data: response });
            })
            .catch((error) => {
              console.error("API error in background:", error.message);
              sendResponse({ error: error.message });
            });

            return true;
        
    }
  
    return false;
  });