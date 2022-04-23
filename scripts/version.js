#!/usr/bin/env node

const { promises: fs } = require('fs')
const path = require('path')

async function main (version) {
  const date = new Date()

  {
    const fileName = path.join(__dirname, '..', 'CITATION.cff')
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date.getDate().toString().padStart(2, '0')
    let file = await fs.readFile(fileName, 'utf8')
    file = file.replace(/^(date-released:) .+$/m, `$1 ${yyyy}-${mm}-${dd}`)
    file = file.replace(/^(version:) .+$/m, `$1 v${version}`)
    await fs.writeFile(fileName, file)
  }

  {
    const fileName = path.join(__dirname, '..', 'isaac-chrome', 'manifest.json')
    let file = await fs.readFile(fileName, 'utf8')
    file = file.replace(/^(  "version":) ".+",$/m, `$1 "${version.split('.').slice(0, 2).join('.')}",`)
    await fs.writeFile(fileName, file)
  }

  {
    const fileName = path.join(__dirname, '..', 'LICENSE')
    let file = await fs.readFile(fileName, 'utf8')
    file = file.replace(/(\d{4})-\d{4}/m, `$1-${date.getFullYear()}`)
    await fs.writeFile(fileName, file)
  }
}

main(...process.argv.slice(2)).catch(console.error)
