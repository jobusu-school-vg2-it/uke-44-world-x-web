import { useState, useEffect } from 'react';
import { apiRequest } from './lib/api-client';
import type { Country, CountryInfo, City } from './types';
import './App.css';

interface CountrySearchItemProps {
    name: string;
    callback: () => void;
}

function CountrySearchItem(props: CountrySearchItemProps) {
    return (
        <button className="country-search-item" onClick={props.callback}>
            <p>{props.name}</p>
        </button>
    )
}

interface CityProps {
    name: string;
    district: string;
    population: number | null;
}

function City(props: CityProps) {
    return (
        <li className="city-wrapper">
            <div>
                <p className="label">Name</p>
                <p className="value">{props.name}</p>
            </div>
            <div>
                <p className="label">District</p>
                <p className="value">{props.district}</p>
            </div>
        </li>
    )
}

function App() {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country>();
    const [selectedCountryInfo, setSelectedCountryInfo] = useState<CountryInfo>();
    const [cities, setCities] = useState<City[]>([]);

    // Country search debounce
    useEffect(() => {
        if (!search.trim()) return;

        const timeout = setTimeout(async () => {
            const data = await apiRequest<Country[]>(`/world/countries/${encodeURIComponent(search.trim())}`);
            setSearchResults(data);
        }, 200);

        return () => clearTimeout(timeout)
    }, [search]);

    // On selecting a country
    useEffect(() => {
        async function updateCountryInfo() {
            if (!selectedCountry || !selectedCountry.code) return;

            const countryInfo = await apiRequest<CountryInfo>(`/world/country/${encodeURIComponent(selectedCountry.code)}`);
            setSelectedCountryInfo(countryInfo);
        }

        async function updateCities() {
            if (!selectedCountry || !selectedCountry.code) return;

            const cities = await apiRequest<City[]>(`/world/cities/${encodeURIComponent(selectedCountry.code)}`);
            setCities(cities);
        }

        updateCountryInfo()
        updateCities()
    }, [selectedCountry]);
    
    return (
        <>
        { selectedCountry && <div className="country-header">
            <span>{selectedCountry.code}</span>
            <h1>{selectedCountry.name}</h1>
        </div> }
        
        <main>
            <div className="country-wrapper">
                <h3>Country</h3>
                <div className="country-search-wrapper">
                    <input type="text" placeholder="Search" value={search} onChange={(text) => {
                        const value = text.target.value;
                        setSearch(value);
                        if (!value.trim()) {
                            setSearchResults([]);
                        }
                    }}/>

                    { searchResults.length > 0 && <ul className="country-search-results">
                        { searchResults.map((country) => (
                            <CountrySearchItem
                                key={country.code}
                                name={country.name}
                                callback={() => {
                                    setSelectedCountry(country);
                                    setSearchResults([]);
                                    setSearch('');
                                }}
                            />
                        )) }
                    </ul> }
                </div>

                { selectedCountry && <div className="selected-country">
                    <p>{selectedCountry.name}</p>
                    <p>{selectedCountry.code}</p>
                </div> }

                { selectedCountryInfo && <div className="selected-country-info">

                </div> }
            </div>

            <div className="cities-wrapper">
                <h3>Cities</h3>
                { cities.length > 0 && <ul className="cities-list">
                    { cities.map((city) => (
                        <City
                            key={city.id}
                            name={city.name}
                            district={city.district}
                            population={city.info.population}
                        />
                    )) }
                </ul> }
            </div>
        </main>
        </>
    )
}

export default App
