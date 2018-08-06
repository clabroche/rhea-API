const rp = require('request-promise')
const cheerio = require('cheerio')
const url = "https://www.marmiton.org/recettes/recette_chocolat-des-neiges_18452.aspx"
rp.get(url).then(data=>{
    const $ = cheerio.load(data)
    const name = $('.main-title').text()
    const img = $('.af-pin-it-wrapper').find('img').attr('src')
    const nbPerson = +$('.recipe-ingredients__qt-counter input')[0].attribs.value
    const time = $('.recipe-infos__timmings__total-time span').text()
    const ingredients = $('.recipe-ingredients__list__item').toArray().map(($ingredient)=>{
        $ingredient = cheerio.load($.html($ingredient))
        return {
            qt: $ingredient('.recipe-ingredient-qt').text(),
            ingredient: $ingredient('.ingredient').text()
        }
    })
    const preparation = $('.recipe-preparation__list__item').toArray().map(($preparation, i) => {
         $preparation = cheerio.load($.html($preparation))
         $preparation('h3').remove()
         return `<h3>Etape ${i + 1}</h3>\n<p>${$preparation('.recipe-preparation__list__item').text().trim()}</p>`
    }).join('\n')
    return {
        name,
        img,
        nbPerson,
        time,
        ingredients,
        preparation
    }
}).then(console.log).catch(console.error)