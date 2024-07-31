document.getElementById('stopAutoplay').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: 'toggleAutoplay', enable: false}, (response) => {
    console.log(response.status);
  });
});

document.getElementById('allowAutoplay').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: 'toggleAutoplay', enable: true}, (response) => {
    console.log(response.status);
  });
});
