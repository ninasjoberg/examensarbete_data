const fs = require('fs');
const xml2js = require('xml2js');
const fetch =  require('node-fetch');

const parser = new xml2js.Parser();

fs.readFile( './classification.xml', (err, data) => {
    parser.parseString(data, function (err, result) {

        const foodsYay = result.LivsmedelsLista.Livsmedel;

        const array = []; //array with all classification numbers that we want to use
        const arrayItem = []; //array with number of all products that we can use to compare and reduce our nutrition db
        const arrayOfGroups = [];

        const foods = foodsYay.map((food, i) => {

            const name = food['Namn'][0];
            const group = food['Huvudgrupp'][0];
            const euroFirName = food['Klassificeringar'][0]['Klassificering'][0]['Varden'][0]['KlassificeringVarde'][0]['Namn'][0];
            const euroFirCode = food['Klassificeringar'][0]['Klassificering'][0]['Varden'][0]['KlassificeringVarde'][0]['Kod'][0]
            const livsmedelsverketId = food['Nummer'][0];

            //array with all the euroFir classification codes that we dont want to include, example fastfood.
            const codeArray = ['A0866' , 'A0862' , 'A0810' , 'A0310' , 'A0312' , 'A0864', 'A0818' , 'A0819' , 'A0820' , 'A0830' , 'A0799' , 'A0804' , 'A0865' , 'A0828' , 'A0861' , 'A0832' , 'A0842' , 'A0822' , 'A0792' , 'A0821' , 'A0797' , 'A0868' , 'A0838' , 'A0789' , 'A0863' , 'A0843' , 'A0870' , 'A0847' , 'A0848' , 'A0849' , 'A0850']
            if(!codeArray.includes(euroFirCode)){
                array.push({livsmedelsverketId, name, group, euroFirName, euroFirCode})
            }

            // make array of groups
            if(!arrayOfGroups.includes(group)){
                arrayOfGroups.push(group);
            }

        });

        console.log(array);

        // print array of groups
        console.log(arrayOfGroups);
        
        /* Save foods to db.json fil */
         fs.writeFile('classificationList.json', JSON.stringify(array), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        }); 
    });
 });
