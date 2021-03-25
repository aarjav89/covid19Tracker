import './App.css';
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {useState, useEffect} from "react";
import InfoBox from "./InfoBox";

function App() {

    const [countries, setCountries] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState("worldwide");

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
                    setCountries(countries);
                });
        }
        getCountriesData();
    },[]);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        //console.log("selected country code is :"+countryCode);
        setSelectedCountry(countryCode);
    }


  return (
    <div className="app">

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
        <InfoBox title="Coronvirus Cases" cases={5000} total={123} />
        <InfoBox title="Recovered" cases={2000} total={1234} />
        <InfoBox title="Deaths" cases={3000} total={12345} />
    </div>





    {/* Table with countries and cases details */}
    {/* Graph */}

    {/* Map */}
    </div>
  );
}

export default App;
