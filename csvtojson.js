(function(){

  var fileSystem=require("fs");
  fileSystem.readFile("WDI_Data.csv",{encoding:"utf8"}, function(error,data){

    var allTextLines = data.split(/\r\n|\n/);
    var row=[];
    var header=allTextLines[0].split(/,/);



    fileSystem.readFile("continent-lookup-latest.csv",{encoding:"utf8"}, function(error,data){


            //varibales for 3rd graph
            var graphDataForAfrica=[];
            var graphDataForAsia=[];
            var graphDataForEurope=[];
            var graphDataForAmerica=[];
            var graphDataForOcenia=[];

            function graphDataForAfricaJson(yr,gdp){
              this.year=yr;
              this.gdpPerCapita=gdp;
            }

            function graphDataForAsiaJson(yr,gdp){
              this.year=yr;
              this.gdpPerCapita=gdp;
            }

            function graphDataForEuropeJson(yr,gdp){
              this.year=yr;
              this.gdpPerCapita=gdp;
            }

            function graphDataForAmericaJson(yr,gdp){
              this.year=yr;
              this.gdpPerCapita=gdp;
            }

            function graphDataForOceniaJson(yr,gdp){
              this.year=yr;
              this.gdpPerCapita=gdp;
            }

            var aggregatedGdpForAfrica=[];
            var aggregatedGdpForAmerica=[];
            var aggregatedGdpForAsia=[];
            var aggregatedGdpForEurope=[];
            var aggregatedGdpForOceania=[];

            var continent;
            var countryContinent;
            var asia=[];
            var africa=[];
            var america=[];
            var europe=[];
            var oceania=[];

        continent=data.split(/\r\n|\n/);
        for (var i = 0; i < continent.length; i++) {
          countryContinent=continent[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (countryContinent[1]==="Africa ") {
            africa.push(countryContinent[0]);
          }
          else if (countryContinent[1]==="America") {
            america.push(countryContinent[0]);
          }
          else if (countryContinent[1]==="Asia") {
            asia.push(countryContinent[0]);
          }
          else if (countryContinent[1]==="Europe") {
            europe.push(countryContinent[0]);
          }
          else if (countryContinent[1]==="Oceania") {
            oceania.push(countryContinent[0]);
          }
        }
    // var country=require("fs");
    fileSystem.readFile("WDI_Country.csv",{encoding:"utf8"}, function(error,data){

      var dataOfCountries=data.split(/\r\n|\n/);
      var allCountyList=[];
      var notACountryListCode=[];
      for(var i=0,j=0; i<dataOfCountries.length; i++)
      {
        allCountyList=dataOfCountries[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if(allCountyList[5]==='' ){
          notACountryListCode[j]=allCountyList[0];
          j++;
        }
      }

      // console.log(notACountryListCode);

      var countForDataOfIndia=0; // as we will get only one row for this.. so we can reduce the comparision
      var graphDataIndGdp=[];
      function graphDataIndGdpJson(yr,gdp){
        this.year=Number(year);
        this.gdpGrowthAnnual=Number(gdp);
      }
// initialize array by zero..
      for (var x=0,year=1960;year<=2015;year++,x++) {
           aggregatedGdpForAmerica[x]=0;
           aggregatedGdpForEurope[x]=0;
           aggregatedGdpForAsia[x]=0;
           aggregatedGdpForOceania[x]=0;
           aggregatedGdpForAfrica[x]=0;
      }

      for(var i=0,j=0; i<allTextLines.length; i++) // process file line by line
      {
        eachLine=allTextLines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        if(eachLine[3]==="NY.GDP.MKTP.KD" && eachLine[49] !=='' && !(isInArray(eachLine[1],notACountryListCode)) ){
            row[j]={countryCode:eachLine[1],gdp:eachLine[49]};
          j++;
        }

        //extract information only for india... for graph 2
        if (countForDataOfIndia==0) {
          if (eachLine[3]==="NY.GDP.MKTP.KD.ZG" && eachLine[1]==="IND") {

            countForDataOfIndia++;
            for (var k=0,year=1960,l=4;year<=2015;year++,l++) {

              if (eachLine[l]!=='') {
                 graphDataIndGdp[k]=new graphDataIndGdpJson(year,eachLine[l]);
                 k++;
              }
            }
          }
        }



        // code for 3rd graph will go here..
        if (eachLine[3]==="NY.GDP.PCAP.KD") {
          // console.log(eachLine);
          if (africa.indexOf(eachLine[0])>-1) {
            for (var x=0,year=1960,y=4;year<=2015;year++,y++,x++) {
              if (eachLine[y] !=='') {
                 aggregatedGdpForAfrica[x]=parseFloat(Number(aggregatedGdpForAfrica[x])) + parseFloat(Number((eachLine[y]))) ;
              }
            }
            //  console.log(eachLine[0] +"    =>     Africa");
          }
          else if (america.indexOf(eachLine[0])>-1) {
            for (var x=0,year=1960,y=4;year<2015;year++,y++,x++) {
              if (eachLine[y] !=='') {
                 aggregatedGdpForAmerica[x]=parseFloat(Number(aggregatedGdpForAmerica[x])) + parseFloat(Number(eachLine[y]));
               }
            }
            //  console.log(eachLine[0] +"    =>     America");
          }
          else if (asia.indexOf(eachLine[0])>-1) {
            for (var x=0,year=1960,y=4;year<2015;year++,y++,x++) {
              // console.log(eachLine[y]);
              if (eachLine[y] !=='') {
                 aggregatedGdpForAsia[x]=parseFloat(Number(aggregatedGdpForAsia[x])) + parseFloat(Number(eachLine[y]));
               }
            }
            //  console.log(eachLine[0] +"    =>     Asia");

          }
          else if (europe.indexOf(eachLine[0])>-1) {
            // console.log(eachLine[y]);

            for (var x=0,year=1960,y=4;year<2015;year++,y++,x++) {
              if (eachLine[y] !=='') {
                 aggregatedGdpForEurope[x]=parseFloat(Number(aggregatedGdpForEurope[x])) + parseFloat(Number(eachLine[y]));
               }
            }
            //  console.log(eachLine[0] +"    =>     Europe");
          }
          else if (oceania.indexOf(eachLine[0])>-1) {
            // console.log(eachLine[y]);

            for (var x=0,year=1960,y=4;year<2015;year++,y++,x++) {
              if (eachLine[y] !=='') {
                 aggregatedGdpForOceania[x]=parseFloat(Number(aggregatedGdpForOceania[x])) + parseFloat(Number(eachLine[y]));
               }
            }
            //  console.log(eachLine[0] +"    =>     Oceania");
          }
          else {
            // console.log("*************************ERROR*********************");
            // console.log(eachLine[0]);
            // console.log("*************************ERROR*********************");
          }
        }// if for 3rd graph ends..



      }// process file line by line :: end


      // code for 3rd one....
      // console.log("aggregated data");
      // console.log(aggregatedGdpForAfrica);
      // console.log("aggregated data");
      // console.log(aggregatedGdpForAmerica);
      // console.log("aggregated data");
      // console.log(aggregatedGdpForAsia);
      // console.log("aggregated data");
      // console.log(aggregatedGdpForEurope);
      // console.log("aggregated data");
      // console.log(aggregatedGdpForOceania);
      // console.log("aggregated data");

      for (var x=0,year=1960;year<2015;year++,x++) {
        graphDataForAsia[x]=new graphDataForAsiaJson(year,aggregatedGdpForAsia[x]);
        graphDataForAmerica[x]=new graphDataForAmericaJson(year,aggregatedGdpForAmerica[x]);
        graphDataForAfrica[x]=new graphDataForAfricaJson(year,aggregatedGdpForAfrica[x]);
        graphDataForOcenia[x]=new graphDataForOceniaJson(year,aggregatedGdpForOceania[x]);
        graphDataForEurope[x]=new graphDataForEuropeJson(year,aggregatedGdpForEurope[x]);
          //  aggregatedGdpForEurope[x]=0;
          //  aggregatedGdpForAsia[x]=0;
          //  aggregatedGdpForOceania[x]=0;
          //  aggregatedGdpForAfrica[x]=0;
      }

      function graphForGdpContinent(cont,dat){
        this.continent=cont;
        this.aggregate=dat;
      }

      var graphForGdpContinentJson=[];
      graphForGdpContinentJson[0]=new graphForGdpContinent("Africa",graphDataForAfrica);
      graphForGdpContinentJson[1]=new graphForGdpContinent("America",graphDataForAmerica);
      graphForGdpContinentJson[2]=new graphForGdpContinent("Asia",graphDataForAsia);
      graphForGdpContinentJson[3]=new graphForGdpContinent("Europe",graphDataForEurope);
      graphForGdpContinentJson[4]=new graphForGdpContinent("Oceania",graphDataForOcenia);

      // console.log(row);
      // console.log(row.length);

      row.sort(function (a, b) {
        if (parseFloat(a.gdp) > parseFloat(b.gdp))
        {return -1;}
        if (parseFloat(a.gdp) < parseFloat(b.gdp))
        {return 1;}
        return 0;
      });

      var top15=[];

      for (var i = 0; i <15; i++) {
        top15[i]=row[i].countryCode;
      }

      //  console.log(row);

      var graphDataGdpGni=[];
      function graphDataGdpGniJson(country,gdp,gni){
        this.countryName=country;
        this.gdpConstant2005USd=Number(gdp);
        this.gniConstant2005USd=Number(gni);
      }

      var graphPerCapDataGdpGni=[];
      function graphPerCapDataGdpGniJson(country,gdp,gni){
        this.countryName=country;
        this.gdpPerCapConst2005Usd=Number(gdp);
        this.gniPerCapConst2005Usd=Number(gni);
      }

      var countConst=0;
      var countPerCap=0;

      for (var i = 0; i < top15.length; i++) {
        var currentCountry=top15[i];
        for(var j=0; j<allTextLines.length; j++)
        {
          var tempVarForContr;
          var tempVarForGdp;
          var tempVarForGni;
          var tempVarForPerCapContr;
          var tempVarForPerCapGdp;
          var tempVarForPerCapGni;
          eachLine=allTextLines[j].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (countConst!=2){

            if((eachLine[3]==="NY.GDP.MKTP.KD" || eachLine[3]==="NY.GNP.MKTP.KD") && eachLine[1]===currentCountry ){
              // console.log("picking for country  1  "+eachLine[1] +"    count =>  "+countConst);
              if (countConst===0) {
                tempVarForContr=eachLine[0].replace(/"/g,"");
                // graphDataGdpGni[i]={countryName:eachLine[0].replace(/"/g,"")};
              }

              if (eachLine[3]==="NY.GDP.MKTP.KD") {
                // graphDataGdpGni[i].gdpConstant2005US$=eachLine[49];
                tempVarForGdp=eachLine[49];
                countConst++;
                // console.log("picking for gdp  1   "+eachLine[49] +"  count =>  "+countConst);
              }
              else {
                // graphDataGdpGni[i].gniConstant2005US$=eachLine[49];
                tempVarForGni=eachLine[49];
                countConst++;
                // console.log("picking for gni 1  "+eachLine[49]+" count => "+countConst);
              }

              if (countConst==2 && countPerCap==2) {
                graphDataGdpGni[i]=new graphDataGdpGniJson(tempVarForContr,tempVarForGdp,tempVarForGni);
                graphPerCapDataGdpGni[i]=new graphPerCapDataGdpGniJson(tempVarForPerCapContr,tempVarForPerCapGdp,tempVarForPerCapGni);
                countPerCap=0;
                countConst=0;
                break;
              }
            }
          }

          if(countPerCap!=2)
          {
            if((eachLine[3]==="NY.GDP.PCAP.KD" || eachLine[3]==="NY.GNP.PCAP.KD") && eachLine[1]===currentCountry ){
              // console.log("picking for country 2"+eachLine[1] +"    count =>   "+countPerCap);
              if (countPerCap===0) {
                tempVarForPerCapContr=eachLine[0].replace(/"/g,"");
                // graphPerCapDataGdpGni[i]={countryName:eachLine[0].replace(/"/g,"")};
              }

              if (eachLine[3]==="NY.GDP.PCAP.KD") {
                tempVarForPerCapGdp=eachLine[49];
                // graphPerCapDataGdpGni[i].gdpPerCapConst2005Us$=eachLine[49];
                countPerCap++;
                // console.log("picking for gdp  2"+eachLine[49] +"  count =>   "+countPerCap);
              }
              else {
                // graphPerCapDataGdpGni[i].gniPerCapConst2005Us$=eachLine[49];
                tempVarForPerCapGni=eachLine[49];
                countPerCap++;
                // console.log("picking for gni  2"+eachLine[49]+" count =>  "+countPerCap);
              }

              if (countPerCap==2 && countConst ==2) {
                graphDataGdpGni[i]=new graphDataGdpGniJson(tempVarForContr,tempVarForGdp,tempVarForGni);
                graphPerCapDataGdpGni[i]=new graphPerCapDataGdpGniJson(tempVarForPerCapContr,tempVarForPerCapGdp,tempVarForPerCapGni);
                countPerCap=0;
                countConst=0;
                break;
              }
            }
          }

        }
      }

      console.log();
      console.log();
      console.log("********************************************************");
      console.log("DATA for GDP DNI COST 2005 US $");
      console.log("********************************************************");
      console.log();
      console.log();
      console.log(JSON.stringify(graphDataGdpGni));



      console.log();
      console.log();
      console.log("********************************************************");
      console.log("DATA for GDP DNI Per Cap COST 2005 US $");
      console.log("********************************************************");
      console.log();
      console.log();
      console.log(JSON.stringify(graphPerCapDataGdpGni));

      console.log();
      console.log();
      console.log("********************************************************");
      console.log("DATA FOR IND GDP ANNUAL GROWTH ");
      console.log("********************************************************");
      console.log();
      console.log();
      console.log(JSON.stringify(graphDataIndGdp));

      console.log();
      console.log();
      console.log("********************************************************");
      console.log("DATA FOR continent aggregated GDP ");
      console.log("********************************************************");
      console.log();
      console.log();
      console.log(JSON.stringify(graphForGdpContinentJson));

      //write all data in jason files.
      fileSystem.writeFile('./jsonfiles/graphDataGdpGni.json',JSON.stringify(graphDataGdpGni));
      fileSystem.writeFile('./jsonfiles/graphPerCapDataGdpGni.json',JSON.stringify(graphPerCapDataGdpGni));
      fileSystem.writeFile('./jsonfiles/graphDataIndGdp.json',JSON.stringify(graphDataIndGdp));
      fileSystem.writeFile('./jsonfiles/graphForGdpContinentJson.json',JSON.stringify(graphForGdpContinentJson));
      fileSystem.writeFile('./jsonfiles/graphDataForAfrica.json',JSON.stringify(graphDataForAfrica));
      fileSystem.writeFile('./jsonfiles/graphDataForAsia.json',JSON.stringify(graphDataForAsia));
      fileSystem.writeFile('./jsonfiles/graphDataForOcenia.json',JSON.stringify(graphDataForOcenia));
      fileSystem.writeFile('./jsonfiles/graphDataForAmerica.json',JSON.stringify(graphDataForAmerica));
      fileSystem.writeFile('./jsonfiles/graphDataForEurope.json',JSON.stringify(graphDataForEurope));

});
});
}); // end of filesystem read

  function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }
})();
