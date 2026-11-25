export type FlightCategory = 'nacional' | 'internacional';
export type CategoryFilter = 'todos' | FlightCategory;
export type TripType = 'one-way' | 'round-trip';
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';
export type ProgramType = 'airline' | 'bank';

export interface Airport {
  code: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  category: FlightCategory;
  lat: number;
  lng: number;
  groupCode?: string;
  groupName?: string;
}

export interface AirportOption {
  code: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  category: FlightCategory;
  lat: number;
  lng: number;
  isGroup: boolean;
  groupedCodes: string[];
  groupedAirports?: Airport[];
  searchText: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  shortName: string;
  type: ProgramType;
  color: string;
  textColor: string;
  currencyName: string;
  description: string;
  baseUrl: string;
  partners?: string[];
  transferRatio?: string;
  supportsNational: boolean;
  supportsInternational: boolean;
  hubCountries?: string[];
}

export interface SearchParams {
  origin: AirportOption;
  destination: AirportOption;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  tripType: TripType;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
  categoryFilter?: CategoryFilter;
  selectedProgramIds?: string[];
}

export interface DeepLinkParams {
  originCode: string;
  destinationCode: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  tripType: TripType;
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
}

export interface FlightOffer {
  id: string;
  programId: string;
  programName: string;
  programShortName: string;
  programType: ProgramType;
  programColor: string;
  programTextColor: string;
  airlineName: string;
  airlineCode: string;
  originAirport: Airport;
  destinationAirport: Airport;
  category: FlightCategory;
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  stopAirports: string[];
  pointsPerPassenger: number;
  totalPoints: number;
  currencyName: string;
  taxesBRL: number;
  estimatedCashBRL: number;
  cpmBRL: number;
  cabin: CabinClass;
  tripType: TripType;
  simulationUrl: string;
  partnerSimulationUrl?: string;
  partnerProgramName?: string;
  transferNote?: string;
  badges: string[];
  valueScore: number;
}

export interface SearchResultSummary {
  offers: FlightOffer[];
  category: FlightCategory;
  originLabel: string;
  destinationLabel: string;
  lowestPoints: number;
  lowestTaxesBRL: number;
  totalProgramsCompared: number;
  airlineOffersCount: number;
  bankOffersCount: number;
  searchedOriginCodes: string[];
  searchedDestinationCodes: string[];
}

export type SortOption = 'points' | 'value' | 'duration' | 'taxes';
