import './App.css';
import {FormControl, MenuItem, Select, Card, CardContent} from "@material-ui/core";
import {useState, useEffect} from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {

    const [countries, setCountries] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState("worldwide");

    const [countryInfo, setCountryInfo] = useState({});

    const [tableData, setTableData] = useState([]);

    const [mapCenter, setMapCenter] = useState({lat:20, lng: 77});

    const [mapZoom, setMapZoom] = useState(3);

    useEffect( ()=> {
        fetch("https://disease.sh/v3/covid-19/all")
            .then(response=>response.json())
            .then(data=> {
                setCountryInfo(data);
            });
    },[]);

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => (
                        {
                            name: country.country, // United States, United Kingdom
                            value: country.countryInfo.iso2 //UK,
                        }
                    ));
                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setCountries(countries);
                });
        }
        getCountriesData();
    },[]);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        //console.log("selected country code is :"+countryCode);


        // Worldwide statistics endpoint : https://disease.sh/v3/covid-19/all
        //Specific country endpoint : //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

        //using ternary operator to set desired endpoint
        const endPoint =  countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(endPoint)
            .then(response =>response.json())
            .then(data => {
                setSelectedCountry(countryCode);
                setCountryInfo(data);
                console.log("Setting lat to:",data.countryInfo.lat, "and long is:", data.countryInfo.long);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };
   // console.log("Country Info>>", countryInfo);


  return (
    <div className="app">
        <div className="app__left">
            <div className="app__header">
            <h1>Covid 19 Tracker </h1>

            <FormControl className="app__dropdown">
                <Select
                    variant="outlined"
                    value={selectedCountry}
                    onChange={onCountryChange}
                >
                    <MenuItem value="worldwide"> Worldwide </MenuItem>
                    {
                        countries.map(country=> (
                            <MenuItem value={country.value}> {country.name} </MenuItem>
                        ))
                    }


                </Select>
            </FormControl>
        </div>


            {/* Info Boxes */}
            <div className="app__stats">
        <InfoBox
            title="Coronvirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases} />

        <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered} />

        <InfoBox title="Deaths"
                 cases={countryInfo.todayDeaths}
                 total={countryInfo.deaths} />
    </div>


            {/* Map */}
            <Map
              center={mapCenter}
              zoom={mapZoom}
            />
        </div>

        <div className="app__right">
            {/* Table with countries and cases details */}
            <Card>
                <CardContent>
                    <h3>Live Cases by Country</h3>
                    <Table countries={tableData} />


                 {/* Graph */}
                <h3> Worldwide new Cases </h3>
                    <LineGraph  />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

export default App;
