const cjs = require('citation-js')
document.getElementById('isaac-citation-js-version').innerHTML = 'Running <a href="https://citation.js.org">Citation.js v' + cjs.version + '</a>'

const searchForm = document.getElementById('isaac-form')
searchForm.onsubmit = function (event) {
    event.preventDefault()
    const errorMessage = searchForm.querySelector('output')
    if (errorMessage) {
        errorMessage.remove()
    }

    const formData = new FormData(searchForm)
    const forceType = formData.get('type')
    const identifier = formData.get('id')
    cjs.Cite.async(identifier, { forceType }).then(function (cite) {
        const data = cite.format('data', { type: 'object' })[0]

        if (data.type === 'book' && !data.author && data.editor) {
            data.author = data.editor
            delete data.editor
        }

        if (data.DOI) {
            cjs.util
                .fetchFileAsync('https://api.unpaywall.org/v2/' + data.DOI + '?email=citationjs@protonmail.com')
                .then(response => {
                    response = JSON.parse(response)
                    if (!data.custom) { data.custom = {} }
                    data.custom.is_oa = response.is_oa
                    data.custom.oa_status = response.oa_status
                })
                .finally(() => {
                    fillForm(data)
                })
        } else {
            fillForm(data)
        }
    }).catch(function (error) {
        const message = document.createElement('output')
        message.setAttribute('style', 'color: red;')
        message.textContent = error.message
        searchForm.appendChild(message)
    })
}

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
