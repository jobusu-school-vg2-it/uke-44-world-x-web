import type { Country, CountryInfo, City } from './world.types.ts';
import type { RowDataPacket } from 'mysql2/promise';
import { db } from '../../db/mysql.js';

interface CountryRow extends RowDataPacket, Country {}
interface CountryInfoRow extends RowDataPacket, CountryInfo {}
interface CityRow extends RowDataPacket, City {}

export async function searchForCountries(search: string): Promise<Country[]> {
    const [rows] = await db.execute<CountryRow[]>(
        `
        SELECT name, code, capital FROM country 
        WHERE name LIKE ?
        ORDER BY name
        `,
        [search.trim() + '%']
    );

    return rows;
}

export async function getCountryInfo(countryCode: string): Promise<CountryInfo | undefined> {
    const [rows] = await db.execute<CountryInfoRow[]>(
        `
        SELECT doc FROM countryInfo
        WHERE doc->'$.Code' = ?
        `,
        [countryCode.toUpperCase()]
    );

    return rows[0];
}

export async function getCountryCities(countryCode: string): Promise<City[] | undefined> {
    const [rows] = await db.execute<CityRow[]>(
        `
        SELECT id, name, district, countryCode, info FROM city
        WHERE countryCode = ?
        ORDER BY info->'$.population'
        `,
        [countryCode.toUpperCase()]
    );

    return rows;
}

export default {
    searchForCountries,
    getCountryInfo,
    getCountryCities,
}