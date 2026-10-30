export interface Country {
    code: string;
    name: string;
    capital: number | null;
}

export interface CountryInfo {
    doc: Record<string, unknown>;
}

export interface City {
    id: number;
    name: string;
    district: string;
    countryCode: string;
    info?: Record<string, unknown> | null;
}