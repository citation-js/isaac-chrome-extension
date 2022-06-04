(function () {

const fieldMap = {
    Aanvraagnummer: data => data.number,
    Beginpagina: data => data.page.split('-')[0] || data.page,
    Druk: data => data.edition || 1,
    Eindpagina: data => data.page.split('-')[1] || data.page,
    GepubliceerdIn: data => data['container-title'],
    ISBN: data => data.ISBN,
    ISSN: data => data.ISSN,
    Medium: data => data.medium,
    NaamUitgeverij: data => data.publisher,
    Nummer: data => data.issue ? data.volume + '(' + data.issue + ')' : data.volume,
    OpenAccesUrl: /* sic */ data => data.DOI ? 'https://doi.org/' + data.DOI : data.URL,
    PaginaAantal: data => data['number-of-pages'],
    PlaatsnaamUitgeverij: data => data['publisher-place'],
    Prioriteitsdatum: data => data.issued['date-parts'][0][0],
    // Subtitel: data => {},
    Titel: data => data.title,
    TitelBoek: data => data['container-title'],
    TitelTijdschrift: data => data['container-title'],
    UitgaveJaar: data => data.issued['date-parts'][0][0],
    Uitgavejaar: data => data.issued['date-parts'][0][0],
    // UrlTijdschrijft: /* sic */ data => {},
    // UrlUitgeverij: data => {},
    // urlUitgeverij: /* sic */ data => {},
}

const radioMap = {
    Gerefereerd: data => 1,
    OpenAccess: data => data.custom && (data.custom.is_oa === false ? 2 : 1),
    OpenAccesKenmerk: /* sic */ data => data.custom && openAccessMap[data.custom.oa_status]
}

const authorFieldMap = {
    Volgnummer: (data, i) => i + 1,
    // DAI: data => {},
    Titulatuur: data => data['dropping-particle'] || '',
    Voornaam: data => data['given'].includes('.') ? '' : data['given'] || '',
    Voorletters: data => data['given'].includes('.') ? data['given'] : data['given'].replace(/([^\W])[^\W]*/g, '$1.'),
    Voorvoegsel: data => data['non-dropping-particle'] || '',
    Achternaam: data => data['family'] || '',
    // Geboortedatum: data => {},
}

const pages = {
    start: 'Project_ProductOverzicht',
    type: 'Product_Keuze',
    work: 'Product',
    author: 'ProductBetrokkenheid'
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

const openAccessMap = {
    green: 1,
    gold: 2,
    hybrid: 4
    // bronze: not supported
}

function identifyPage () {
    for (const page in pages) {
        if (document.querySelector('div#' + pages[page] + '_1')) {
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
    observer.observe(formContainer, { attributes: true, childList: true, subtree: false })

    handlePageChange()
})

function getPageChangeHandler (data, getIndex, setIndex) {
    return function (changes, observer) {
        switch (identifyPage()) {
            case 'type':
                processType(data)
                break

            case 'work':
                processWork(data, getIndex())
                break

            case 'author':
                processAuthor(data, getIndex())
                setIndex(getIndex() + 1)
                break

            case 'start':
                observer.disconnect()
                break
        }
    }
}

function processType (data) {
    const type = typeMap[data.type] || 'OverigeOuput'
    document.getElementById(type + '_1').click()
}

function processWork (data, index) {
    if (document.querySelector('#aq-main-form .aq-input').value) {
        if (data.author && data.author[index]) {
            document.getElementById('Toevoegen_1').click()
        }
        return
    }

    const inputs = document.querySelectorAll('#aq-main-form .aq-input')
    for (const input of inputs) {
        const name = input.getAttribute('name')
        const field = name.split('-')[1].split('_')[0]
        try {
            const value = fieldMap[field](data)
            if (value !== undefined) {
                input.value = value
            }
        } catch (e) {}
    }

    const radios = document.querySelectorAll('#aq-main-form input[type="radio"]')
    for (const radio of radios) {
        const name = radio.getAttribute('id')
        const [field, value] = name.split('-')[1].split(/_\d/)
        try {
            if (value === radioMap[field](data).toString()) {
                 radio.checked = true
            }
        } catch (e) {}
    }

    if (data.author && data.author[index]) {
        document.getElementById('Toevoegen_1').click()
    }
}

function processAuthor (data, index) {
    if ( document.querySelector('#aq-main-form .aq-input').value) {
        return
    }

    const author = data.author[index]
    const inputs = document.querySelectorAll('#aq-main-form .aq-input')
    for (const input of inputs) {
        const name = input.getAttribute('name')
        const field = name.split('-')[1].split('_')[0]
        try {
            input.value = authorFieldMap[field](author, index)
        } catch (e) {}
    }

    // const button = document.getElementById('Verder_2')
    // button.click()
}

})()
