(function () {

const fieldMap = {
    Titel: data => data.title,
    // Subtitel: data => {},
    TitelTijdschrift: data => data['container-title'],
    ISSN: data => data.ISSN,
    UitgaveJaar: data => data.issued['date-parts'][0][0],
    Nummer: data => data.issue ? data.volume + '(' + data.issue + ')' : data.volume,
    Beginpagina: data => data.page.split('-')[0] || data.page,
    Eindpagina: data => data.page.split('-')[1] || data.page,
    OpenAccessUrl: data => data.DOI ? 'https://doi.org/' + data.DOI : data.URL,
    // UrlTijdschrijft: data => {}, // sic
}

const radioMap = {
    Gerefereerd: data => 1
}

const authorFieldMap = {
    Volgnummer: (data, i) => i + 1,
    // DAI: data => {},
    Titulatuur: data => data['dropping-particle'],
    Voornaam: data => data['given'].includes('.') ? undefined : data['given'],
    Voorletters: data => data['given'].includes('.') ? data['given'] : data['given'].replace(/([^\W])[^\w]+/g, '$1.'),
    Voorvoegsel: data => data['non-dropping-particle'],
    Achternaam: data => data['family'],
    // Geboortedatum: data => {},
}

const pages = {
    type: 'Product_Keuze_1',
    work: 'Product_1',
    author: 'ProductBetrokkenheid_1'
}

const typeMap = {
    'article-journal': 'WetenschapelijkArtikel',
    book: 'Boek',
    chapter: 'HoofdstukinBoek',
    thesis: 'Proefschrift',
    'paper-conference': 'Conference_Paper',
    article: 'ProfessionelePublicatie',
    report: 'ProfessionelePublicatie',
    'article-newspaper': 'PublicatiekPubliek',
    'article-magazine': 'PublicatiekPubliek',
    patent: 'Octrooi'
}

function identifyPage () {
    for (const page in pages) {
        if (document.getElementById(pages[page])) {
            return page
        }
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const data = JSON.parse(message)
    sendResponse(true)

    let index = 0

    const formContainer = document.getElementById('aq-main-form').parentNode
    const handlePageChange = getPageChangeHandler(data, () => index, value => { index = value })
    const observer = new MutationObserver(handlePageChange)
    observer.observe(formContainer, { attributes: true, childList: true, subtree: true })
})

function getPageChangeHandler (data, getIndex, setIndex) {
    return function () {
        console.log(identifyPage(), getIndex())
        switch (identifyPage()) {
            case 'type':
                processType(data)
                break

            case 'work':
                processWork(data)
                break

            case 'author':
                processAuthor(data, getIndex())
                setIndex(getIndex() + 1)
                break
        }
    }
}

function processType (data) {
    const type = typeMap[data.type] || 'OverigeOutput'
    document.getElementById(type + '_1').click()
}

function processWork (data) {
    const inputs = document.querySelectorAll('#aq-main-form .aq-input')
    for (const input of inputs) {
        const name = input.getAttribute('name')
        const field = name.split('-')[1].split('_')[0]
        try {
            input.value = fieldMap[field](data)
        } catch (e) {}
    }

    const radios = document.querySelectorAll('#aq-main-form input[type="radio"]')
    for (const radio of radios) {
        const name = radio.getAttribute('id')
        const [field, value] = name.split('-')[1].split(/_\d/)[0]
        try {
            if (value === radioMap[field](data).toString()) {
                 radio.checked = true
            }
        } catch (e) {}
    }
}

function processAuthor (data, index) {
    // #Toevoegen_1
    if (data.author) {
        for (const author of data.author) {
            authorButton.click()
            const inputs = document.querySelector('#aq-main-form .aq-input')
            for (const input of inputs) {
                const name = input.getAttribute('name')
                const field = name.split('-')[1].split('_')[0]
                try {
                    input.value = authorFieldMap[field](author)
                } catch (e) {}
            }
            // const button = document.getElementById('Verder_2')
            // button.click()
        }
    }
}

})()
