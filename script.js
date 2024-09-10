const list = document.querySelector('ul');
const saveButton = document.getElementById('saveLink');

update();

saveButton.addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];

    chrome.storage.local.get({ savedLinks: [] }, function(result) {
      const links = result.savedLinks;
      links.push(currentTab.url);

      chrome.storage.local.set({ savedLinks: links }, function() {
        if (chrome.runtime.lastError) {
          console.error("Erro ao salvar o link: ", chrome.runtime.lastError);
        } else {
          console.log('Link salvo com sucesso:', currentTab.url);
          update();
        }
      });
    });
  });
});

function update() {
  chrome.storage.local.get({ savedLinks: [] }, function(result) {
    const links = result.savedLinks;

    list.innerHTML = '';

    links.forEach(link => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
      list.appendChild(li);
    });
  });
}
