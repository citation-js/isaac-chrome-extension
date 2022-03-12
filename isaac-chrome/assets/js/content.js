const fieldMap = {
    Titel: data => data.title,
    // Subtitel: data => {},
    TitelTijdschrift: data => data['container-title'],
    ISSN: data => data.ISSN,
    UitgaveJaar: data => data.issued['date-parts'][0][0],
    Nummer: data => data.issue ? data.volume + '(' + data.issue + ')' : data.volume,
    Beginpagina: data => data.page.split('-')[0],
    Eindpagina: data => data.page.split('-')[1],
    OpenAccessUrl: data => data.DOI ? 'https://doi.org/' + data.DOI : data.URL,
    // UrlTijdschrijft: data => {}, // sic
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const data = JSON.parse(message)
    const inputs = document.querySelectorAll('#aq-main-form .aq-input')
    for (const input of inputs) {
        const name = input.getAttribute('name')
        const field = name.split('-')[1].split('_')[0]
        try {
            input.value = fieldMap[field](data)
        } catch (e) {}
    }
})
