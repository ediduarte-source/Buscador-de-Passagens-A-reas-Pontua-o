import { describe, expect, it } from 'vitest';
import {
  AIRPORTS,
  AIRPORT_OPTION_BY_CODE,
  ALL_AIRPORT_OPTIONS,
  determineRouteCategory,
  searchAirportOptions,
} from '../src/data/airports';
import { AIRLINE_PROGRAMS, BANK_PROGRAMS, LOYALTY_PROGRAMS } from '../src/data/programs';
import { buildSimulationUrl } from '../src/services/deepLinks';
import {
  calculateDistanceKm,
  filterAndSortOffers,
  searchFlightsByPoints,
} from '../src/services/flightSearchEngine';

describe('Base de Aeroportos, Categorias e Agrupamento por Cidade', () => {
  it('contém ampla lista de aeroportos nacionais e internacionais', () => {
    const nacionais = AIRPORTS.filter((a) => a.category === 'nacional');
    const internacionais = AIRPORTS.filter((a) => a.category === 'internacional');

    expect(nacionais.length).toBeGreaterThanOrEqual(45);
    expect(internacionais.length).toBeGreaterThanOrEqual(60);
  });

  it('gera opção agrupada automaticamente para cidades com mais de um aeroporto', () => {
    const expectedGroups: Record<string, string[]> = {
      SAO: ['GRU', 'CGH', 'VCP'],
      RIO: ['GIG', 'SDU'],
      BHZ: ['CNF', 'PLU'],
      BUE: ['EZE', 'AEP'],
      NYC: ['JFK', 'LGA', 'EWR'],
      LON: ['LHR', 'LGW', 'STN', 'LTN', 'LCY'],
      PAR: ['CDG', 'ORY'],
      TYO: ['HND', 'NRT'],
    };

    for (const [groupCode, expectedCodes] of Object.entries(expectedGroups)) {
      const option = AIRPORT_OPTION_BY_CODE[groupCode];
      expect(option, `Grupo ${groupCode} deve existir`).toBeDefined();
      expect(option.isGroup).toBe(true);
      expect(option.groupedCodes).toEqual(expect.arrayContaining(expectedCodes));
    }
  });

  it('autocomplete ignora acentos e exibe opção agrupada junto com aeroportos individuais', () => {
    const results = searchAirportOptions('sao paulo', 'todos', 10);
    expect(results.length).toBeGreaterThanOrEqual(4);
    expect(results[0].code).toBe('SAO');
    expect(results[0].isGroup).toBe(true);

    const codes = results.map((r) => r.code);
    expect(codes).toContain('GRU');
    expect(codes).toContain('CGH');
    expect(codes).toContain('VCP');
  });

  it('filtra corretamente por categoria nacional e internacional no autocomplete', () => {
    const nacResults = searchAirportOptions('', 'nacional', 50);
    expect(nacResults.every((r) => r.category === 'nacional')).toBe(true);

    const intResults = searchAirportOptions('', 'internacional', 50);
    expect(intResults.every((r) => r.category === 'internacional')).toBe(true);

    expect(ALL_AIRPORT_OPTIONS.some((o) => o.isGroup && o.category === 'nacional')).toBe(true);
    expect(ALL_AIRPORT_OPTIONS.some((o) => o.isGroup && o.category === 'internacional')).toBe(true);
  });
});

describe('Programas de Companhias Aéreas e Bancos/Cartões', () => {
  it('inclui companhias aéreas e Livelo, Esfera, C6 Átomos e programas similares', () => {
    const ids = LOYALTY_PROGRAMS.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'smiles',
        'latam-pass',
        'azul-fidelidade',
        'tap-miles-go',
        'iberia-plus',
        'aadvantage',
        'flying-blue',
        'livelo',
        'esfera',
        'c6-atomos',
        'itau-pontos',
        'curtai',
        'nubank-ultravioleta',
        'pontos-caixa',
        'coopera',
        'dotz',
        'km-vantagens',
      ]),
    );
    expect(AIRLINE_PROGRAMS.length).toBeGreaterThanOrEqual(10);
    expect(BANK_PROGRAMS.length).toBeGreaterThanOrEqual(8);
  });
});

describe('Gerador de Deep Links para Simulação nos Sites', () => {
  it('gera URLs válidas de simulação com origem, destino e datas para todos os programas', () => {
    for (const program of LOYALTY_PROGRAMS) {
      const url = buildSimulationUrl(program.id, {
        originCode: 'GRU',
        destinationCode: 'LIS',
        departureDate: '2026-12-15',
        returnDate: '2026-12-28',
        tripType: 'round-trip',
        adults: 2,
        children: 0,
        infants: 0,
        cabin: 'economy',
      });

      expect(() => new URL(url)).not.toThrow();
      expect(url.startsWith('https://')).toBe(true);
      expect(url).toContain('GRU');
      expect(url).toContain('LIS');
    }
  });
});

describe('Motor de Busca e Comparação por Pontuação', () => {
  it('identifica categoria nacional, expande cidades agrupadas e inclui companhias + bancos', () => {
    const sao = AIRPORT_OPTION_BY_CODE.SAO;
    const rio = AIRPORT_OPTION_BY_CODE.RIO;

    expect(determineRouteCategory(sao, rio)).toBe('nacional');

    const result = searchFlightsByPoints({
      origin: sao,
      destination: rio,
      departureDate: '2026-12-15',
      returnDate: '2026-12-22',
      tripType: 'round-trip',
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'economy',
    });

    expect(result.category).toBe('nacional');
    expect(result.searchedOriginCodes).toEqual(expect.arrayContaining(['GRU', 'CGH', 'VCP']));
    expect(result.searchedDestinationCodes).toEqual(expect.arrayContaining(['GIG', 'SDU']));
    expect(result.airlineOffersCount).toBeGreaterThan(0);
    expect(result.bankOffersCount).toBeGreaterThan(0);

    const programIds = result.offers.map((o) => o.programId);
    expect(programIds).toEqual(
      expect.arrayContaining(['smiles', 'latam-pass', 'azul-fidelidade', 'livelo', 'esfera', 'c6-atomos']),
    );

    // Verifica que ofertas de bancos possuem link próprio e link da companhia parceira
    const liveloOffer = result.offers.find((o) => o.programId === 'livelo');
    expect(liveloOffer).toBeDefined();
    expect(liveloOffer?.simulationUrl).toContain('livelo.com.br');
    expect(liveloOffer?.partnerSimulationUrl).toBeDefined();

    // Primeiro resultado deve estar ordenado pela menor pontuação
    expect(result.offers[0].totalPoints).toBe(result.lowestPoints);
    expect(result.offers[0].badges).toContain('Menor pontuação');
  });

  it('busca internacional inclui programas globais e escala pontuação por cabine e tipo de viagem', () => {
    const gru = AIRPORT_OPTION_BY_CODE.GRU;
    const par = AIRPORT_OPTION_BY_CODE.PAR;

    const oneWayEco = searchFlightsByPoints({
      origin: gru,
      destination: par,
      departureDate: '2026-12-20',
      tripType: 'one-way',
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'economy',
    });

    const roundTripBiz = searchFlightsByPoints({
      origin: gru,
      destination: par,
      departureDate: '2026-12-20',
      returnDate: '2026-12-30',
      tripType: 'round-trip',
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'business',
    });

    expect(oneWayEco.category).toBe('internacional');
    expect(oneWayEco.searchedDestinationCodes).toEqual(expect.arrayContaining(['CDG', 'ORY']));
    expect(roundTripBiz.lowestPoints).toBeGreaterThan(oneWayEco.lowestPoints * 3);
  });

  it('filtra por tipo de programa e ordena por duração e taxas', () => {
    const result = searchFlightsByPoints({
      origin: AIRPORT_OPTION_BY_CODE.SAO,
      destination: AIRPORT_OPTION_BY_CODE.MIA,
      departureDate: '2026-12-18',
      tripType: 'one-way',
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'economy',
    });

    const onlyBanks = filterAndSortOffers(result.offers, {
      programTypeFilter: 'bank',
      sortBy: 'points',
    });
    expect(onlyBanks.length).toBeGreaterThan(0);
    expect(onlyBanks.every((o) => o.programType === 'bank')).toBe(true);

    const byDuration = filterAndSortOffers(result.offers, { sortBy: 'duration' });
    for (let i = 1; i < byDuration.length; i += 1) {
      expect(byDuration[i].durationMinutes).toBeGreaterThanOrEqual(byDuration[i - 1].durationMinutes);
    }

    const byTaxes = filterAndSortOffers(result.offers, { sortBy: 'taxes' });
    for (let i = 1; i < byTaxes.length; i += 1) {
      expect(byTaxes[i].taxesBRL).toBeGreaterThanOrEqual(byTaxes[i - 1].taxesBRL);
    }
  });

  it('calcula distância Haversine realista entre GRU e LIS', () => {
    const gru = AIRPORTS.find((a) => a.code === 'GRU')!;
    const lis = AIRPORTS.find((a) => a.code === 'LIS')!;
    const km = calculateDistanceKm(gru, lis);
    expect(km).toBeGreaterThan(7500);
    expect(km).toBeLessThan(8300);
  });
});
