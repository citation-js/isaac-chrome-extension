const cjs = require('citation-js')
document.getElementById('isaac-citation-js-version').innerHTML = 'Running <a href="https://citation.js.org">Citation.js v' + cjs.version + '</a>'

const searchForm = document.getElementById('isaac-form')
searchForm.onsubmit = function (event) {
    event.preventDefault()
    const formData = new FormData(searchForm)
    const identifier = formData.get('doi')
    cjs.Cite.async(identifier, function (cite) {
        fillForm(cite.format('data', { type: 'object' })[0])
    })
}

// form: #aq-main-form
// text fields: .aq-input
// radio buttons: input[type="radio"]

function fillForm (data) {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['assets/js/content.js']
        }, function () {
            chrome.tabs.sendMessage(tab.id, JSON.stringify(data))
        })
    })
}
