const fs = require('fs');
const xml2js = require('xml2js');
const fetch =  require('node-fetch');
const numberList = require('./numberList.js');


const parser = new xml2js.Parser();

fs.readFile( './data.xml', (err, data) => {
    parser.parseString(data, function (err, result) {

        const foodsYay = result.LivsmedelsLista.Livsmedel;

        const foods = foodsYay.filter((food) => {
            return numberList.includes(food['Nummer'][0])
        }).map((food) => {
            return ({
                livsmedelsverketId: Number(food.Nummer[0]),
                name: food.Namn[0],
                nutritions: food.Naringsvarden[0].Naringsvarde.map((n) => {
                    const value = n.Varde[0].replace(",", ".");
                    return {
                        name: n.Namn[0],
                        abbreviation: n.Forkortning[0],
                        value: Number(value),
                        unit: n.Enhet[0],
                    }
                }),
            })
        })

        const foodData = {foodInfo: foods} //så att db.json ser ut som det ska med en namngiven lista "foodInfo"
        //console.log(foods.length);

        /* Save foods to db.json fil */
        fs.writeFile('db.json', JSON.stringify(foodData), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });
 });
