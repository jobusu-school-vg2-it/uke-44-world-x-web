import express from 'express';
const router = express.Router();

import { BadRequestError } from '../../errors/http-error.js';
import { searchForCountries, getCountryInfo, getCountryCities } from './world.controller.js';

// Code parameter validation middleware
router.param('code', (request, _response, next, value) => {
    if (value.trim().length !== 3) {
        next(new BadRequestError("Paramter 'code' must be 3 characters long."));
        return;
    }

    request.params.code = value.trim();
    next();
});

router.get('/countries/:search', searchForCountries);
router.get('/country/:code', getCountryInfo);
router.get('/cities/:code', getCountryCities);

export default router;
