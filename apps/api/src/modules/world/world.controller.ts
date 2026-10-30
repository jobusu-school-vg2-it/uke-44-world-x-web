import type { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../../errors/http-error.js';
import worldService from './world.service.js';

export async function searchForCountries(request: Request, response: Response) {
    const search = String(request.params.search).trim();
    if (!search || search === '') {
        throw new BadRequestError('Invalid search parameter');
    }

    const countries = await worldService.searchForCountries(search);
    if (!countries) {
        throw new NotFoundError(`Found no cities from search: '${search}'`);
    }

    response.status(200).json(countries);
}

export async function getCountryInfo(request: Request, response: Response) {
    const countryCode = String(request.params.code);
    const countryInfo = await worldService.getCountryInfo(countryCode);

    if (!countryInfo) {
        throw new NotFoundError(`Found no countryInfo with countryCode: '${countryCode}'`);
    }

    response.status(200).json(countryInfo);
}

export async function getCountryCities(request: Request, response: Response) {
    const countryCode = String(request.params.code);
    const cities = await worldService.getCountryCities(countryCode);

    if (!cities) {
        throw new NotFoundError(`Found no cities with countryCode: '${countryCode}'`);
    }

    response.status(200).json(cities);
}