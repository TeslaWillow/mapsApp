export interface StadiaSearchQueryResponce {
  bbox:      number[];
  features:  Feature[];
  geocoding: Geocoding;
  type:      string;
}

export interface Feature {
  bbox:       number[];
  geometry:   Geometry;
  properties: Properties;
  type:       string;
}

export interface Geometry {
  coordinates: number[];
  type:        string;
}

export interface Properties {
  accuracy:       string;
  addendum:       Addendum;
  confidence:     number;
  continent?:     string;
  continent_gid?: string;
  country:        string;
  country_a:      string;
  country_code:   string;
  country_gid:    string;
  county?:        string;
  county_a?:      string;
  county_gid?:    string;
  gid:            string;
  id:             string;
  label:          string;
  layer:          string;
  locality?:      string;
  locality_gid?:  string;
  match_type:     string;
  name:           string;
  region?:        string;
  region_a?:      string;
  region_gid?:    string;
  source:         string;
  source_id:      string;
}

export interface Addendum {
  concordances: Concordances;
}

export interface Concordances {
  "gn:id":      number;
  "gp:id"?:     number;
  "ne:id"?:     number;
  "qs_pg:id"?:  number;
  "wd:id"?:     string;
  "wk:page"?:   string;
  "fips:code"?: string;
  "hasc:id"?:   string;
  "iso:code"?:  string;
  "iso:id"?:    string;
  "unlc:id"?:   string;
}

export interface Geocoding {
  attribution: string;
  engine:      Engine;
  query:       Query;
  timestamp:   number;
  version:     string;
  warnings:    string[];
}

export interface Engine {
  author:  string;
  name:    string;
  version: string;
}

export interface Query {
  lang:        Lang;
  layers:      string[];
  parsed_text: ParsedText;
  parser:      string;
  private:     boolean;
  querySize:   number;
  size:        number;
  text:        string;
}

export interface Lang {
  defaulted: boolean;
  iso6391:   string;
  iso6393:   string;
  name:      string;
  via:       string;
}

export interface ParsedText {
  city: string;
}
