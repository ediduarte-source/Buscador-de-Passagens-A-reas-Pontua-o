import { CabinClass, DeepLinkParams } from '../types/flight';
import { parseIsoDate } from '../utils/dateUtils';

function toMMDDYYYY(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

function toDDMMYYYYDots(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function toYYYYMMDDCompact(iso: string): string {
  return iso.replace(/-/g, '');
}

function toEpochMsNoonUTC(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

function mapCabin(cabin: CabinClass, format: 'smiles' | 'latam' | 'generic' | 'upper'): string {
  if (format === 'smiles') {
    if (cabin === 'business' || cabin === 'first') return 'BUSINESS';
    if (cabin === 'premium_economy') return 'PREMIUM_ECONOMIC';
    return 'ECONOMIC';
  }
  if (format === 'latam') {
    if (cabin === 'business' || cabin === 'first') return 'Business';
    if (cabin === 'premium_economy') return 'PremiumEconomy';
    return 'Economy';
  }
  if (format === 'upper') {
    if (cabin === 'first') return 'FIRST';
    if (cabin === 'business') return 'BUSINESS';
    if (cabin === 'premium_economy') return 'PREMIUM_ECONOMY';
    return 'ECONOMY';
  }
  return cabin;
}

/**
 * Gera links profundos (deep links) que direcionam o usuário diretamente para a tela de
 * simulação/busca pré-preenchida no site de cada companhia aérea ou programa de pontuação.
 */
export function buildSimulationUrl(programId: string, params: DeepLinkParams): string {
  const {
    originCode,
    destinationCode,
    departureDate,
    returnDate,
    tripType,
    adults,
    children,
    infants,
    cabin,
  } = params;

  const isRoundTrip = tripType === 'round-trip' && Boolean(returnDate);
  const effectiveReturn = isRoundTrip && returnDate ? returnDate : undefined;

  switch (programId) {
    case 'smiles': {
      const q = new URLSearchParams({
        originAirportCode: originCode,
        destinationAirportCode: destinationCode,
        departureDate: String(toEpochMsNoonUTC(departureDate)),
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        isFlexibleDateChecked: 'false',
        tripType: isRoundTrip ? '1' : '2',
        cabinType: mapCabin(cabin, 'smiles'),
      });
      if (effectiveReturn) {
        q.set('returnDate', String(toEpochMsNoonUTC(effectiveReturn)));
      }
      return `https://www.smiles.com.br/emissao-com-milhas?${q.toString()}`;
    }

    case 'latam-pass': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        outbound: `${departureDate}T12:00:00.000Z`,
        adt: String(adults),
        chd: String(children),
        inf: String(infants),
        trip: isRoundTrip ? 'RT' : 'OW',
        cabin: mapCabin(cabin, 'latam'),
        redemption: 'true',
      });
      if (effectiveReturn) {
        q.set('inbound', `${effectiveReturn}T12:00:00.000Z`);
      }
      return `https://www.latamairlines.com/br/pt/oferta-voos?${q.toString()}`;
    }

    case 'azul-fidelidade': {
      const q = new URLSearchParams({
        'c[0].ds': originCode,
        'c[0].std': toMMDDYYYY(departureDate),
        'c[0].as': destinationCode,
        'p[0].t': 'ADT',
        'p[0].c': String(adults),
        'p[0].cp': 'false',
        'f.dl': '3',
        'f.dr': '3',
        cc: 'PTS',
      });
      if (effectiveReturn) {
        q.set('c[1].ds', destinationCode);
        q.set('c[1].std', toMMDDYYYY(effectiveReturn));
        q.set('c[1].as', originCode);
      }
      if (children > 0) {
        q.set('p[1].t', 'CHD');
        q.set('p[1].c', String(children));
      }
      return `https://www.voeazul.com.br/br/pt/home/selecao-voo?${q.toString()}`;
    }

    case 'tap-miles-go': {
      const q = new URLSearchParams({
        market: 'BR',
        language: 'pt',
        origin: originCode,
        destination: destinationCode,
        depDate: toDDMMYYYYDots(departureDate),
        adt: String(adults),
        chd: String(children),
        inf: String(infants),
        award: 'true',
      });
      if (effectiveReturn) {
        q.set('retDate', toDDMMYYYYDots(effectiveReturn));
      }
      return `https://booking.flytap.com/booking/flights/deeplink?${q.toString()}`;
    }

    case 'iberia-plus': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        cabin: mapCabin(cabin, 'upper'),
        avios: 'true',
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.iberia.com/br/buscador-vuelos/?${q.toString()}`;
    }

    case 'aadvantage': {
      const slices = [
        { orig: originCode, dest: destinationCode, date: departureDate },
        ...(effectiveReturn ? [{ orig: destinationCode, dest: originCode, date: effectiveReturn }] : []),
      ];
      const q = new URLSearchParams({
        locale: 'pt_BR',
        pax: String(adults + children),
        adult: String(adults),
        type: isRoundTrip ? 'RoundTrip' : 'OneWay',
        searchType: 'Award',
        cabin: mapCabin(cabin, 'generic'),
        slices: JSON.stringify(slices),
      });
      return `https://www.aa.com/booking/search?${q.toString()}`;
    }

    case 'flying-blue': {
      const connections = effectiveReturn
        ? `${originCode}:A:${toYYYYMMDDCompact(departureDate)}>${destinationCode}:A-${destinationCode}:A:${toYYYYMMDDCompact(effectiveReturn)}>${originCode}:A`
        : `${originCode}:A:${toYYYYMMDDCompact(departureDate)}>${destinationCode}:A`;
      const q = new URLSearchParams({
        pax: `${adults}:${children}:${infants}`,
        cabinClass: mapCabin(cabin, 'upper'),
        connections,
        bookingFlow: 'REWARD',
      });
      return `https://wwws.airfrance.com.br/search/offers?${q.toString()}`;
    }

    case 'mileage-plus': {
      const q = new URLSearchParams({
        f: originCode,
        t: destinationCode,
        d: departureDate,
        tt: isRoundTrip ? '1' : '0',
        at: '1',
        px: String(adults + children),
        tqp: 'A',
      });
      if (effectiveReturn) {
        q.set('r', effectiveReturn);
      }
      return `https://www.united.com/pt/br/fsr/choose-flights?${q.toString()}`;
    }

    case 'skymiles': {
      const q = new URLSearchParams({
        action: 'findFlights',
        tripType: isRoundTrip ? 'ROUND_TRIP' : 'ONE_WAY',
        originCity: originCode,
        destinationCity: destinationCode,
        departureDate: toMMDDYYYY(departureDate),
        paxCount: String(adults + children),
        awardTravel: 'true',
      });
      if (effectiveReturn) {
        q.set('returnDate', toMMDDYYYY(effectiveReturn));
      }
      return `https://www.delta.com/flight-search/search?${q.toString()}`;
    }

    case 'connectmiles': {
      const q = new URLSearchParams({
        roundtrip: isRoundTrip ? 'true' : 'false',
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        date1: departureDate,
        airport1: originCode,
        airport2: destinationCode,
        useMiles: 'true',
      });
      if (effectiveReturn) {
        q.set('date2', effectiveReturn);
      }
      return `https://shopping.copaair.com/?${q.toString()}`;
    }

    case 'lifemiles': {
      const q = new URLSearchParams({
        orig: originCode,
        dest: destinationCode,
        depDate: departureDate,
        adults: String(adults),
        cabin: cabin === 'business' || cabin === 'first' ? '2' : '1',
      });
      if (effectiveReturn) {
        q.set('retDate', effectiveReturn);
      }
      return `https://www.lifemiles.com/fly/find?${q.toString()}`;
    }

    case 'miles-and-more': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        outboundDate: departureDate,
        adults: String(adults),
        cabin: mapCabin(cabin, 'generic'),
        award: 'true',
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.lufthansa.com/br/pt/homepage?${q.toString()}`;
    }

    case 'aeroplan': {
      const q = new URLSearchParams({
        org0: originCode,
        dest0: destinationCode,
        departureDate0: departureDate,
        ADT: String(adults),
        CHD: String(children),
        INF: String(infants),
        tripType: isRoundTrip ? 'R' : 'O',
      });
      if (effectiveReturn) {
        q.set('org1', destinationCode);
        q.set('dest1', originCode);
        q.set('departureDate1', effectiveReturn);
      }
      return `https://www.aircanada.com/aeroplan/redeem/availability/outbound?${q.toString()}`;
    }

    // ===================== PROGRAMAS DE PONTOS / BANCOS =====================
    case 'livelo': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        tripType: isRoundTrip ? 'roundtrip' : 'oneway',
        cabin: mapCabin(cabin, 'generic'),
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.livelo.com.br/viagens/passagens-aereas?${q.toString()}`;
    }

    case 'esfera': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
        children: String(children),
        tripType: isRoundTrip ? 'roundtrip' : 'oneway',
        cabin: mapCabin(cabin, 'generic'),
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.esfera.com.vc/viagens/passagens-aereas?${q.toString()}`;
    }

    case 'c6-atomos': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
        tripType: isRoundTrip ? 'roundtrip' : 'oneway',
        cabin: mapCabin(cabin, 'generic'),
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.c6bank.com.br/atomos/?${q.toString()}`;
    }

    case 'itau-pontos': {
      const q = new URLSearchParams({
        origem: originCode,
        destino: destinationCode,
        ida: departureDate,
        adultos: String(adults),
        classe: mapCabin(cabin, 'generic'),
      });
      if (effectiveReturn) {
        q.set('volta', effectiveReturn);
      }
      return `https://www.itau.com.br/cartoes/beneficios/programa-de-pontos?${q.toString()}`;
    }

    case 'curtai': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
        tripType: isRoundTrip ? 'roundtrip' : 'oneway',
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.curtai.com.br/viagens?${q.toString()}`;
    }

    case 'nubank-ultravioleta': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
        tripType: isRoundTrip ? 'roundtrip' : 'oneway',
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://nubank.com.br/ultravioleta/?${q.toString()}`;
    }

    case 'pontos-caixa': {
      const q = new URLSearchParams({
        origem: originCode,
        destino: destinationCode,
        ida: departureDate,
        adultos: String(adults),
      });
      if (effectiveReturn) {
        q.set('volta', effectiveReturn);
      }
      return `https://www.caixa.gov.br/voce/cartoes/programa-pontos?${q.toString()}`;
    }

    case 'coopera': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.shopcoopera.com.br/viagens?${q.toString()}`;
    }

    case 'dotz': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.dotz.com.br/viagens/passagens-aereas?${q.toString()}`;
    }

    case 'km-vantagens': {
      const q = new URLSearchParams({
        origin: originCode,
        destination: destinationCode,
        departureDate,
        adults: String(adults),
      });
      if (effectiveReturn) {
        q.set('returnDate', effectiveReturn);
      }
      return `https://www.kmdevantagens.com.br/wps/portal/Applications/MarketPlace?${q.toString()}`;
    }

    default: {
      const fallbackDate = parseIsoDate(departureDate).toISOString().slice(0, 10);
      return `https://www.google.com/travel/flights?q=Flights%20from%20${originCode}%20to%20${destinationCode}%20on%20${fallbackDate}`;
    }
  }
}
