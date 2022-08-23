const cjs = require('citation-js')
document.getElementById('isaac-citation-js-version').innerHTML = 'Running <a href="https://citation.js.org">Citation.js v' + cjs.version + '</a>'

const searchForm = document.getElementById('isaac-form')
searchForm.onsubmit = function (event) {
    event.preventDefault()
    const messages = searchForm.querySelectorAll('output')
    for (const message of messages) {
        message.remove()
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

        displayMessage('Successfully obtained metadata.', false)
        if (data.DOI) {
            displayMessage('DOI found, also looking for open access status with Unpaywall.', false)
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
        displayMessage(error.message, true)
    })
}

function displayMessage (text, error) {
    const message = document.createElement('output')
    if (error) { message.setAttribute('style', 'color: red;') }
    message.textContent = text
    searchForm.appendChild(message)
}

function fillForm (data) {
    displayMessage('Proceed on the ISAAC page.', false)
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['assets/js/content.js']
        }, function () {
            chrome.tabs.sendMessage(tab.id, JSON.stringify(data))
        })
    })
}
