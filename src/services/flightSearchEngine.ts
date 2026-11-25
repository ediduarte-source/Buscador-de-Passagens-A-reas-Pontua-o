import {
  determineRouteCategory,
  expandAirportOption,
} from '../data/airports';
import { LOYALTY_PROGRAMS, PROGRAM_BY_ID } from '../data/programs';
import {
  Airport,
  CabinClass,
  FlightCategory,
  FlightOffer,
  LoyaltyProgram,
  ProgramType,
  SearchParams,
  SearchResultSummary,
  SortOption,
} from '../types/flight';
import { diffDaysIso, getTodayIso, pad2 } from '../utils/dateUtils';
import { buildCashPurchaseUrl, buildSimulationUrl } from './deepLinks';

const EARTH_RADIUS_KM = 6371;

export function calculateDistanceKm(a: Airport, b: Airport): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

const CABIN_MULTIPLIER: Record<CabinClass, number> = {
  economy: 1,
  premium_economy: 1.55,
  business: 2.65,
  first: 4.1,
};

const PROGRAM_BASE_FACTOR: Record<string, number> = {
  smiles: 1.02,
  'latam-pass': 0.96,
  'azul-fidelidade': 1.05,
  'tap-miles-go': 1.08,
  'iberia-plus': 0.91,
  aadvantage: 0.94,
  'flying-blue': 1.01,
  'mileage-plus': 1.04,
  skymiles: 1.12,
  connectmiles: 0.99,
  lifemiles: 0.95,
  'miles-and-more': 1.1,
  aeroplan: 0.97,
  livelo: 0.98,
  esfera: 1.0,
  'c6-atomos': 1.01,
  'itau-pontos': 1.03,
  curtai: 1.04,
  'nubank-ultravioleta': 1.06,
  'pontos-caixa': 1.05,
  coopera: 1.07,
  dotz: 1.24,
  'km-vantagens': 1.14,
};

const PROGRAM_AIRLINE_MAP: Record<string, { name: string; code: string }> = {
  smiles: { name: 'GOL Linhas Aéreas', code: 'G3' },
  'latam-pass': { name: 'LATAM Airlines', code: 'LA' },
  'azul-fidelidade': { name: 'Azul Linhas Aéreas', code: 'AD' },
  'tap-miles-go': { name: 'TAP Air Portugal', code: 'TP' },
  'iberia-plus': { name: 'Iberia', code: 'IB' },
  aadvantage: { name: 'American Airlines', code: 'AA' },
  'flying-blue': { name: 'Air France / KLM', code: 'AF' },
  'mileage-plus': { name: 'United Airlines', code: 'UA' },
  skymiles: { name: 'Delta Air Lines', code: 'DL' },
  connectmiles: { name: 'Copa Airlines', code: 'CM' },
  lifemiles: { name: 'Avianca', code: 'AV' },
  'miles-and-more': { name: 'Lufthansa', code: 'LH' },
  aeroplan: { name: 'Air Canada', code: 'AC' },
};

const BANK_PREFERRED_PARTNERS: Record<string, string[]> = {
  livelo: ['smiles', 'latam-pass', 'azul-fidelidade', 'tap-miles-go', 'iberia-plus'],
  esfera: ['smiles', 'latam-pass', 'azul-fidelidade', 'iberia-plus'],
  'c6-atomos': ['smiles', 'latam-pass', 'azul-fidelidade', 'tap-miles-go'],
  'itau-pontos': ['azul-fidelidade', 'latam-pass', 'smiles', 'tap-miles-go'],
  curtai: ['smiles', 'latam-pass', 'azul-fidelidade'],
  'nubank-ultravioleta': ['smiles', 'latam-pass', 'azul-fidelidade'],
  'pontos-caixa': ['azul-fidelidade', 'latam-pass', 'smiles', 'tap-miles-go'],
  coopera: ['smiles', 'latam-pass', 'azul-fidelidade'],
  dotz: ['smiles', 'latam-pass', 'azul-fidelidade'],
  'km-vantagens': ['latam-pass', 'azul-fidelidade'],
};

const CONNECTION_HUBS: Record<string, string[]> = {
  nacional: ['GRU', 'BSB', 'VCP', 'CNF', 'GIG', 'REC'],
  internacional: ['GRU', 'PTY', 'MIA', 'LIS', 'MAD', 'CDG', 'BOG', 'SCL'],
};

function pickAirportPairForProgram(
  origins: Airport[],
  destinations: Airport[],
  programId: string,
  dateStr: string,
): { origin: Airport; destination: Airport } {
  // Evita pares onde origem === destino
  const validPairs: Array<{ origin: Airport; destination: Airport }> = [];
  for (const o of origins) {
    for (const d of destinations) {
      if (o.code !== d.code) {
        validPairs.push({ origin: o, destination: d });
      }
    }
  }
  if (validPairs.length === 0) {
    return { origin: origins[0], destination: destinations[0] };
  }

  // Preferências realistas por companhia (ex: Azul usa bastante VCP/CNF; GOL usa GRU/CGH/GIG; LATAM usa GRU/CGH/BSB)
  if (programId === 'azul-fidelidade') {
    const vcpPair = validPairs.find((p) => p.origin.code === 'VCP' || p.destination.code === 'VCP');
    if (vcpPair) return vcpPair;
  }

  const idx = Math.floor(hashSeed(`${programId}:${dateStr}:${validPairs.length}`) * validPairs.length);
  return validPairs[idx % validPairs.length];
}

function estimateBaseOneWayPoints(distanceKm: number, category: FlightCategory): number {
  if (category === 'nacional') {
    if (distanceKm < 500) return 7500;
    if (distanceKm < 1200) return 11500;
    if (distanceKm < 2200) return 16500;
    return 22000;
  }
  // Internacional
  if (distanceKm < 2800) return 22000; // América do Sul
  if (distanceKm < 6500) return 38000; // América Central / Caribe / Sul EUA
  if (distanceKm < 9800) return 54000; // EUA / Europa
  return 76000; // Ásia / Oriente Médio / Oceania
}

function formatClock(totalMinutesFromMidnight: number): string {
  const normalized = ((totalMinutesFromMidnight % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function getEligiblePrograms(
  category: FlightCategory,
  selectedProgramIds?: string[],
): LoyaltyProgram[] {
  return LOYALTY_PROGRAMS.filter((program) => {
    if (selectedProgramIds && selectedProgramIds.length > 0 && !selectedProgramIds.includes(program.id)) {
      return false;
    }
    if (category === 'nacional') {
      return program.supportsNational;
    }
    return program.supportsInternational;
  });
}

export function searchFlightsByPoints(params: SearchParams): SearchResultSummary {
  const origins = expandAirportOption(params.origin);
  const destinations = expandAirportOption(params.destination);

  if (origins.length === 0 || destinations.length === 0) {
    throw new Error('Selecione aeroportos válidos de origem e destino.');
  }

  const category = determineRouteCategory(params.origin, params.destination);
  const eligiblePrograms = getEligiblePrograms(category, params.selectedProgramIds);

  const today = getTodayIso();
  const daysUntilDeparture = Math.max(0, diffDaysIso(today, params.departureDate));
  // Passagens muito próximas tendem a custar mais pontos
  const advanceFactor =
    daysUntilDeparture < 7 ? 1.28 : daysUntilDeparture < 21 ? 1.12 : daysUntilDeparture > 60 ? 0.92 : 1.0;

  const isRoundTrip = params.tripType === 'round-trip' && Boolean(params.returnDate);
  const tripMultiplier = isRoundTrip ? 1.92 : 1.0;
  const cabinMultiplier = CABIN_MULTIPLIER[params.cabin];
  const payingPassengers = Math.max(1, params.adults) + Math.max(0, params.children) * 0.75 + Math.max(0, params.infants) * 0.1;

  const offers: FlightOffer[] = [];

  for (const program of eligiblePrograms) {
    const { origin, destination } = pickAirportPairForProgram(
      origins,
      destinations,
      program.id,
      params.departureDate,
    );

    const distanceKm = Math.max(200, calculateDistanceKm(origin, destination));
    const seed = hashSeed(
      `${program.id}|${origin.code}|${destination.code}|${params.departureDate}|${params.returnDate ?? ''}|${params.cabin}|${params.tripType}`,
    );
    const seed2 = hashSeed(`time|${program.id}|${origin.code}|${destination.code}|${params.departureDate}`);

    const baseOneWay = estimateBaseOneWayPoints(distanceKm, category);
    const programFactor = PROGRAM_BASE_FACTOR[program.id] ?? 1.0;
    const marketVariance = 0.84 + seed * 0.34; // variação realista de -16% a +18%

    const rawPointsPerPassenger =
      baseOneWay * programFactor * marketVariance * advanceFactor * cabinMultiplier * tripMultiplier;
    const pointsPerPassenger = Math.max(3500, Math.round(rawPointsPerPassenger / 500) * 500);
    const totalPoints = Math.round((pointsPerPassenger * payingPassengers) / 100) * 100;

    // Estima duração real de voo (velocidade de cruzeiro ~810 km/h + 35min solo/táxi)
    const directDurationMin = Math.round((distanceKm / 810) * 60 + 35);
    const allowDirect =
      category === 'nacional' ? distanceKm < 2800 || seed2 > 0.35 : distanceKm < 10500 && seed2 > 0.42;
    const stops = allowDirect && seed2 > 0.38 ? 0 : distanceKm > 9000 && seed2 < 0.25 ? 2 : 1;

    const layoverMinutes = stops === 0 ? 0 : stops === 1 ? 85 + Math.round(seed * 95) : 190 + Math.round(seed * 110);
    const durationMinutes = directDurationMin + layoverMinutes;

    const hubPool = CONNECTION_HUBS[category].filter(
      (h) => h !== origin.code && h !== destination.code,
    );
    const stopAirports: string[] = [];
    for (let s = 0; s < stops; s += 1) {
      const hub = hubPool[Math.floor((seed + s * 0.31) * hubPool.length) % hubPool.length];
      if (hub && !stopAirports.includes(hub)) {
        stopAirports.push(hub);
      }
    }

    const departureMinute = 360 + Math.floor(seed2 * 960); // entre 06:00 e 22:00
    const departureTime = formatClock(departureMinute);
    const arrivalTime = formatClock(departureMinute + durationMinutes);

    // Taxas de embarque estimadas em BRL
    const baseTaxes = category === 'nacional' ? 46 + seed * 38 : 265 + seed * 340;
    const taxesBRL = Number((baseTaxes * (isRoundTrip ? 1.9 : 1) * Math.max(1, params.adults + params.children)).toFixed(2));

    // Companhia operadora e eventual parceiro de transferência para programas de banco
    let airlineName = PROGRAM_AIRLINE_MAP[program.id]?.name ?? 'Companhia Parceira';
    let airlineCode = PROGRAM_AIRLINE_MAP[program.id]?.code ?? 'BR';
    let partnerProgramName: string | undefined;
    let partnerSimulationUrl: string | undefined;
    let transferNote: string | undefined;

    const deepLinkParams = {
      originCode: origin.code,
      destinationCode: destination.code,
      departureDate: params.departureDate,
      returnDate: isRoundTrip ? params.returnDate : undefined,
      tripType: params.tripType,
      adults: params.adults,
      children: params.children,
      infants: params.infants,
      cabin: params.cabin,
    };

    if (program.type === 'bank') {
      const partnerIds = (BANK_PREFERRED_PARTNERS[program.id] ?? ['smiles', 'latam-pass', 'azul-fidelidade']).filter(
        (pid) => {
          const p = PROGRAM_BY_ID[pid];
          return p && (category === 'nacional' ? p.supportsNational : p.supportsInternational);
        },
      );
      const chosenPartnerId =
        partnerIds[Math.floor(seed * partnerIds.length) % Math.max(1, partnerIds.length)] ?? 'smiles';
      const partner = PROGRAM_BY_ID[chosenPartnerId];
      const op = PROGRAM_AIRLINE_MAP[chosenPartnerId] ?? { name: 'GOL / LATAM / Azul', code: 'BR' };
      airlineName = op.name;
      airlineCode = op.code;
      if (partner) {
        partnerProgramName = partner.shortName;
        partnerSimulationUrl = buildSimulationUrl(partner.id, deepLinkParams);
        transferNote = `Resgate direto no portal ${program.shortName} ou transfira (${program.transferRatio ?? '1:1'}) para ${partner.shortName}`;
      }
    }

    // Preço real de compra direta no site da companhia aérea em dinheiro (desconsiderando milhas/pontos)
    const cashBaseOneWay =
      category === 'nacional'
        ? distanceKm < 500
          ? 289
          : distanceKm < 1200
            ? 439
            : distanceKm < 2200
              ? 649
              : 879
        : distanceKm < 2800
          ? 1190
          : distanceKm < 6500
            ? 2350
            : distanceKm < 9800
              ? 3490
              : 4890;

    const airlineCashSeed = hashSeed(
      `cash|${airlineCode}|${origin.code}|${destination.code}|${params.departureDate}|${params.returnDate ?? ''}|${params.cabin}|${params.tripType}`,
    );
    const cashCabinMult =
      params.cabin === 'first' ? 5.2 : params.cabin === 'business' ? 3.4 : params.cabin === 'premium_economy' ? 1.65 : 1.0;
    const cashFareBRL =
      cashBaseOneWay *
      (0.86 + airlineCashSeed * 0.36) *
      advanceFactor *
      cashCabinMult *
      (isRoundTrip ? 1.88 : 1.0) *
      payingPassengers;
    const cashPriceBRL = Number((cashFareBRL + taxesBRL).toFixed(2));
    const cpmBRL = Number((((cashPriceBRL - taxesBRL) / Math.max(1, totalPoints)) * 1000).toFixed(2));
    const cashPurchaseUrl = buildCashPurchaseUrl(airlineCode, deepLinkParams);

    const simulationUrl = buildSimulationUrl(program.id, deepLinkParams);

    const badges: string[] = [];
    if (stops === 0) {
      badges.push('Voo direto');
    }
    if (program.type === 'bank' && program.transferRatio?.includes('1:1')) {
      badges.push('Transferência 1:1');
    }

    // Score de custo-benefício (quanto menor, melhor)
    const valueScore = totalPoints + taxesBRL * 32 + stops * 2200;

    offers.push({
      id: `${program.id}-${origin.code}-${destination.code}-${params.departureDate}`,
      programId: program.id,
      programName: program.name,
      programShortName: program.shortName,
      programType: program.type,
      programColor: program.color,
      programTextColor: program.textColor,
      airlineName,
      airlineCode,
      originAirport: origin,
      destinationAirport: destination,
      category,
      departureDate: params.departureDate,
      returnDate: isRoundTrip ? params.returnDate : undefined,
      departureTime,
      arrivalTime,
      durationMinutes,
      stops,
      stopAirports,
      pointsPerPassenger,
      totalPoints,
      currencyName: program.currencyName,
      taxesBRL,
      cashPriceBRL,
      cashPurchaseUrl,
      cpmBRL,
      cabin: params.cabin,
      tripType: params.tripType,
      simulationUrl,
      partnerSimulationUrl,
      partnerProgramName,
      transferNote,
      badges,
      valueScore,
    });
  }

  // Ordena inicialmente por menor pontuação total
  offers.sort((a, b) => a.totalPoints - b.totalPoints);

  if (offers.length > 0) {
    offers[0].badges = ['Menor pontuação', ...offers[0].badges];

    const bestValue = [...offers].sort((a, b) => a.valueScore - b.valueScore)[0];
    if (bestValue && !bestValue.badges.includes('Menor pontuação')) {
      bestValue.badges = ['Melhor custo-benefício', ...bestValue.badges];
    }
  }

  const lowestPoints = offers.length > 0 ? Math.min(...offers.map((o) => o.totalPoints)) : 0;
  const lowestCashBRL = offers.length > 0 ? Math.min(...offers.map((o) => o.cashPriceBRL)) : 0;
  const lowestTaxesBRL = offers.length > 0 ? Math.min(...offers.map((o) => o.taxesBRL)) : 0;
  const airlineOffersCount = offers.filter((o) => o.programType === 'airline').length;
  const bankOffersCount = offers.filter((o) => o.programType === 'bank').length;

  return {
    offers,
    category,
    originLabel: `${params.origin.city} (${params.origin.code})`,
    destinationLabel: `${params.destination.city} (${params.destination.code})`,
    lowestPoints,
    lowestCashBRL,
    lowestTaxesBRL,
    totalProgramsCompared: offers.length,
    airlineOffersCount,
    bankOffersCount,
    searchedOriginCodes: origins.map((a) => a.code),
    searchedDestinationCodes: destinations.map((a) => a.code),
  };
}

export function filterAndSortOffers(
  offers: FlightOffer[],
  options: {
    programTypeFilter?: 'all' | ProgramType;
    maxStops?: number | null;
    sortBy?: SortOption;
  },
): FlightOffer[] {
  const { programTypeFilter = 'all', maxStops = null, sortBy = 'points' } = options;

  const filtered = offers.filter((offer) => {
    if (programTypeFilter !== 'all' && offer.programType !== programTypeFilter) {
      return false;
    }
    if (maxStops !== null && offer.stops > maxStops) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'cash':
        return a.cashPriceBRL - b.cashPriceBRL;
      case 'value':
        return a.valueScore - b.valueScore;
      case 'duration':
        return a.durationMinutes - b.durationMinutes;
      case 'taxes':
        return a.taxesBRL - b.taxesBRL;
      case 'points':
      default:
        return a.totalPoints - b.totalPoints;
    }
  });
}
