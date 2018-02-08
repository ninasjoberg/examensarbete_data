const fs = require('fs');
const xml2js = require('xml2js');
const fetch =  require('node-fetch');

const parser = new xml2js.Parser();

fs.readFile( './classification.xml', (err, data) => {
    parser.parseString(data, function (err, result) {

        const foodsYay = result.LivsmedelsLista.Livsmedel;

        const array = []; //array with all classification numbers that we want to use
        const array2 = []; //just used to make codeArray
        const arrayItem = []; //array with number of all products that we can use to compare and reduce our nutrition db

        const foods = foodsYay.map((food, i) => {

            const code = food['Klassificeringar'][0]['Klassificering'][0]['Varden'][0]['KlassificeringVarde'][0]['Kod'][0]
            const name = food['Klassificeringar'][0]['Klassificering'][0]['Varden'][0]['KlassificeringVarde'][0]['Namn'][0]
            const number = food['Nummer'][0];

            //console.log(name, number, code);

            //array with all the classificationcodes that we dont want to include, example fastfood.
            const codeArray = ['A0866' , 'A0862' , 'A0810' , 'A0310' , 'A0312' , 'A0818' , 'A0819' , 'A0820' , 'A0830' , 'A0799' , 'A0804' , 'A0865' , 'A0828' , 'A0861' , 'A0832' , 'A0842' , 'A0822' , 'A0792' , 'A0821' , 'A0797' , 'A0868' , 'A0838' , 'A0789' , 'A0863' , 'A0843' , 'A0870' , 'A0847' , 'A0848' , 'A0849' , 'A0850']
            if(!codeArray.includes(code)){
                arrayItem.push(number);
            }

            if(codeArray.includes(code)){
                return
            } else if (!array.includes(code)){
                array.push(code);
                array2.push(
                {
                    code,
                    name,
                }
            )}
        });

        console.log(arrayItem.length);

        /* Save foods to db.json fil */
        fs.writeFile('numberList.json', JSON.stringify(arrayItem), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });
 });
