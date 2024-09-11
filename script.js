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

    links.forEach((link, index) => {
      let profile = getDomainFromURL(link);
      if(profile == undefined){return;}
      const li = document.createElement('li');
      li.innerHTML = `<a href="${link}" target="_blank">${profile}</a> <button data-index="${index}">rem</button>`;
      list.appendChild(li);
    });

    const removeButtons = document.querySelectorAll('button[data-index]');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        removeLink(index);
      });
    });
  });
}

function removeLink(index) {
  chrome.storage.local.get({ savedLinks: [] }, function(result) {
    const links = result.savedLinks;
    links.splice(index, 1); // Remove o link da lista

    chrome.storage.local.set({ savedLinks: links }, function() {
      if (chrome.runtime.lastError) {
        console.error("Erro ao remover o link: ", chrome.runtime.lastError);
      } else {
        console.log('Link removido com sucesso');
        update(); // Atualiza a lista após a remoção
      }
    });
  });
}

function getDomainFromURL(url) {
    const urlObject = new URL(url);
    const pathSegments = urlObject.pathname.split('/');
    return pathSegments[2];
  }