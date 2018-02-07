const fs = require('fs');
const xml2js = require('xml2js');
const fetch =  require('node-fetch');

const parser = new xml2js.Parser();

fs.readFile( './data.xml', (err, data) => {
    parser.parseString(data, function (err, result) {

        const foodsYay = result.LivsmedelsLista.Livsmedel;

        const foods = foodsYay.map((food, i) => {
            return {
                id: Number(food.Nummer[0]),
                name: food.Namn[0],
                nutrition: food.Naringsvarden[0].Naringsvarde.map((n) => {
                    return n.Namn[0];
                }),
            }
        });

        const foodData = {foodInfo: foods} //så att db.json ser ut som det ska med en namngiven lista "foodInfo"

        /* Save foods to db.json fil */
        // fs.writeFile('db.json', JSON.stringify(foodData), (err) => {
        //     if (err) throw err;
        //     console.log('The file has been saved!');
        // });
    });
 });



 //gör detta sen i frontend-koden:
function getDataFromJsonServer() {
    return fetch(`http://localhost:3000/foodInfo?name=Sesamsås grädde`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            return {
                error: error.message,
            };
        });
}

getDataFromJsonServer();


/*
GET /posts?title=json-server&author=typicode
GET /posts?id=1&id=2
GET /comments?author.name=typicode
*/
