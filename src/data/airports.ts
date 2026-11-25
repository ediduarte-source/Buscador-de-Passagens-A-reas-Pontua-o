import { Airport, AirportOption, CategoryFilter, FlightCategory } from '../types/flight';

export const AIRPORTS: Airport[] = [
  // ===================== BRASIL — NACIONAIS =====================
  // São Paulo (Agrupado: SAO)
  {
    code: 'GRU',
    name: 'Aeroporto Internacional de Guarulhos',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    countryCode: 'BR',
    category: 'nacional',
    lat: -23.4356,
    lng: -46.4731,
    groupCode: 'SAO',
    groupName: 'São Paulo — Todos os aeroportos',
  },
  {
    code: 'CGH',
    name: 'Aeroporto de Congonhas',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    countryCode: 'BR',
    category: 'nacional',
    lat: -23.6261,
    lng: -46.6564,
    groupCode: 'SAO',
    groupName: 'São Paulo — Todos os aeroportos',
  },
  {
    code: 'VCP',
    name: 'Aeroporto Internacional de Viracopos (Campinas)',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    countryCode: 'BR',
    category: 'nacional',
    lat: -23.0074,
    lng: -47.1344,
    groupCode: 'SAO',
    groupName: 'São Paulo — Todos os aeroportos',
  },

  // Rio de Janeiro (Agrupado: RIO)
  {
    code: 'GIG',
    name: 'Aeroporto Internacional do Galeão (Tom Jobim)',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    countryCode: 'BR',
    category: 'nacional',
    lat: -22.8099,
    lng: -43.2505,
    groupCode: 'RIO',
    groupName: 'Rio de Janeiro — Todos os aeroportos',
  },
  {
    code: 'SDU',
    name: 'Aeroporto Santos Dumont',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    countryCode: 'BR',
    category: 'nacional',
    lat: -22.9105,
    lng: -43.1631,
    groupCode: 'RIO',
    groupName: 'Rio de Janeiro — Todos os aeroportos',
  },

  // Belo Horizonte (Agrupado: BHZ)
  {
    code: 'CNF',
    name: 'Aeroporto Internacional de Confins (Tancredo Neves)',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'Brasil',
    countryCode: 'BR',
    category: 'nacional',
    lat: -19.6244,
    lng: -43.9719,
    groupCode: 'BHZ',
    groupName: 'Belo Horizonte — Todos os aeroportos',
  },
  {
    code: 'PLU',
    name: 'Aeroporto da Pampulha',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'Brasil',
    countryCode: 'BR',
    category: 'nacional',
    lat: -19.8512,
    lng: -43.9506,
    groupCode: 'BHZ',
    groupName: 'Belo Horizonte — Todos os aeroportos',
  },

  // Demais Capitais e Grandes Cidades Brasileiras
  { code: 'BSB', name: 'Aeroporto Internacional de Brasília', city: 'Brasília', state: 'DF', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -15.8711, lng: -47.9186 },
  { code: 'SSA', name: 'Aeroporto Internacional de Salvador', city: 'Salvador', state: 'BA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -12.9086, lng: -38.3225 },
  { code: 'REC', name: 'Aeroporto Internacional do Recife (Guararapes)', city: 'Recife', state: 'PE', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -8.1265, lng: -34.9236 },
  { code: 'FOR', name: 'Aeroporto Internacional de Fortaleza (Pinto Martins)', city: 'Fortaleza', state: 'CE', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -3.7763, lng: -38.5326 },
  { code: 'POA', name: 'Aeroporto Internacional Salgado Filho', city: 'Porto Alegre', state: 'RS', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -29.9944, lng: -51.1714 },
  { code: 'CWB', name: 'Aeroporto Internacional Afonso Pena', city: 'Curitiba', state: 'PR', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -25.5285, lng: -49.1758 },
  { code: 'FLN', name: 'Aeroporto Internacional Hercílio Luz', city: 'Florianópolis', state: 'SC', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -27.6703, lng: -48.5525 },
  { code: 'BEL', name: 'Aeroporto Internacional de Belém (Val-de-Cans)', city: 'Belém', state: 'PA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -1.3793, lng: -48.4763 },
  { code: 'MAO', name: 'Aeroporto Internacional Eduardo Gomes', city: 'Manaus', state: 'AM', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -3.0386, lng: -60.0497 },
  { code: 'VIX', name: 'Aeroporto de Vitória (Eurico de Aguiar Salles)', city: 'Vitória', state: 'ES', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -20.2581, lng: -40.2864 },
  { code: 'GYN', name: 'Aeroporto Internacional Santa Genoveva', city: 'Goiânia', state: 'GO', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -16.632, lng: -49.2207 },
  { code: 'CGB', name: 'Aeroporto Internacional Marechal Rondon', city: 'Cuiabá', state: 'MT', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -15.6529, lng: -56.1167 },
  { code: 'CGR', name: 'Aeroporto Internacional de Campo Grande', city: 'Campo Grande', state: 'MS', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -20.4687, lng: -54.6725 },
  { code: 'NAT', name: 'Aeroporto Internacional de Natal (São Gonçalo)', city: 'Natal', state: 'RN', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -5.7681, lng: -35.3761 },
  { code: 'MCZ', name: 'Aeroporto Internacional Zumbi dos Palmares', city: 'Maceió', state: 'AL', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -9.5108, lng: -35.7917 },
  { code: 'AJU', name: 'Aeroporto Internacional Santa Maria', city: 'Aracaju', state: 'SE', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -10.984, lng: -37.0703 },
  { code: 'JPA', name: 'Aeroporto Internacional Presidente Castro Pinto', city: 'João Pessoa', state: 'PB', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -7.1458, lng: -34.9486 },
  { code: 'SLZ', name: 'Aeroporto Internacional Marechal Cunha Machado', city: 'São Luís', state: 'MA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -2.5854, lng: -44.2341 },
  { code: 'THE', name: 'Aeroporto Senador Petrônio Portella', city: 'Teresina', state: 'PI', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -5.0599, lng: -42.8235 },
  { code: 'PMW', name: 'Aeroporto Brigadeiro Lysias Rodrigues', city: 'Palmas', state: 'TO', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -10.2915, lng: -48.357 },
  { code: 'PVH', name: 'Aeroporto Internacional Governador Jorge Teixeira', city: 'Porto Velho', state: 'RO', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -8.7093, lng: -63.9023 },
  { code: 'RBR', name: 'Aeroporto Internacional Plácido de Castro', city: 'Rio Branco', state: 'AC', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -9.8689, lng: -67.8981 },
  { code: 'BVB', name: 'Aeroporto Internacional Atlas Brasil Cantanhede', city: 'Boa Vista', state: 'RR', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: 2.8463, lng: -60.6901 },
  { code: 'MCP', name: 'Aeroporto Internacional Alberto Alcolumbre', city: 'Macapá', state: 'AP', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: 0.0507, lng: -51.0722 },

  // Destinos Turísticos e Regionais do Brasil
  { code: 'IGU', name: 'Aeroporto Internacional de Foz do Iguaçu', city: 'Foz do Iguaçu', state: 'PR', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -25.5962, lng: -54.4872 },
  { code: 'NVT', name: 'Aeroporto Internacional de Navegantes', city: 'Navegantes / Balneário Camboriú', state: 'SC', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -26.8799, lng: -48.6514 },
  { code: 'JOI', name: 'Aeroporto Lauro Carneiro de Loyola', city: 'Joinville', state: 'SC', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -26.2245, lng: -48.7974 },
  { code: 'BPS', name: 'Aeroporto Internacional de Porto Seguro', city: 'Porto Seguro', state: 'BA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -16.4386, lng: -39.0809 },
  { code: 'IOS', name: 'Aeroporto Jorge Amado', city: 'Ilhéus', state: 'BA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -14.8159, lng: -39.0332 },
  { code: 'FEN', name: 'Aeroporto de Fernando de Noronha', city: 'Fernando de Noronha', state: 'PE', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -3.8549, lng: -32.4233 },
  { code: 'JJD', name: 'Aeroporto Regional de Jericoacoara', city: 'Jericoacoara', state: 'CE', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -2.9064, lng: -40.3581 },
  { code: 'LDB', name: 'Aeroporto Governador José Richa', city: 'Londrina', state: 'PR', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -23.3336, lng: -51.1301 },
  { code: 'MGF', name: 'Aeroporto Regional Silvio Name Júnior', city: 'Maringá', state: 'PR', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -23.4764, lng: -52.0164 },
  { code: 'UDI', name: 'Aeroporto Tenente-Coronel Aviador César Bombonato', city: 'Uberlândia', state: 'MG', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -18.8828, lng: -48.2256 },
  { code: 'RAO', name: 'Aeroporto Leite Lopes', city: 'Ribeirão Preto', state: 'SP', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -21.1342, lng: -47.7742 },
  { code: 'SJP', name: 'Aeroporto Prof. Eribelto Manoel Reino', city: 'São José do Rio Preto', state: 'SP', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -20.8166, lng: -49.4065 },
  { code: 'XAP', name: 'Aeroporto Serafin Enoss Bertaso', city: 'Chapecó', state: 'SC', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -27.1342, lng: -52.6566 },
  { code: 'CXJ', name: 'Aeroporto Regional Hugo Cantergiani', city: 'Caxias do Sul / Gramado', state: 'RS', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -29.1971, lng: -51.1875 },
  { code: 'PET', name: 'Aeroporto Internacional João Simões Lopes Neto', city: 'Pelotas', state: 'RS', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -31.7184, lng: -52.3277 },
  { code: 'IMP', name: 'Aeroporto Prefeito Renato Moreira', city: 'Imperatriz', state: 'MA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -5.5313, lng: -47.4601 },
  { code: 'STM', name: 'Aeroporto Maestro Wilson Fonseca', city: 'Santarém', state: 'PA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -2.4247, lng: -54.7858 },
  { code: 'MAB', name: 'Aeroporto João Correa da Rocha', city: 'Marabá', state: 'PA', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -5.3686, lng: -49.138 },
  { code: 'PNZ', name: 'Aeroporto Senador Nilo Coelho', city: 'Petrolina', state: 'PE', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -9.3624, lng: -40.5691 },
  { code: 'JDO', name: 'Aeroporto Orlando Bezerra de Menezes', city: 'Juazeiro do Norte', state: 'CE', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -7.2189, lng: -39.2701 },
  { code: 'PPB', name: 'Aeroporto Estadual de Presidente Prudente', city: 'Presidente Prudente', state: 'SP', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -22.1751, lng: -51.4246 },
  { code: 'BYO', name: 'Aeroporto Regional de Bonito', city: 'Bonito', state: 'MS', country: 'Brasil', countryCode: 'BR', category: 'nacional', lat: -21.2472, lng: -56.4525 },

  // ===================== INTERNACIONAIS — AMÉRICA DO SUL =====================
  // Buenos Aires (Agrupado: BUE)
  {
    code: 'EZE',
    name: 'Aeroporto Internacional Ministro Pistarini (Ezeiza)',
    city: 'Buenos Aires',
    country: 'Argentina',
    countryCode: 'AR',
    category: 'internacional',
    lat: -34.8222,
    lng: -58.5358,
    groupCode: 'BUE',
    groupName: 'Buenos Aires — Todos os aeroportos',
  },
  {
    code: 'AEP',
    name: 'Aeroparque Jorge Newbery',
    city: 'Buenos Aires',
    country: 'Argentina',
    countryCode: 'AR',
    category: 'internacional',
    lat: -34.5592,
    lng: -58.4156,
    groupCode: 'BUE',
    groupName: 'Buenos Aires — Todos os aeroportos',
  },
  { code: 'SCL', name: 'Aeroporto Internacional Arturo Merino Benítez', city: 'Santiago', country: 'Chile', countryCode: 'CL', category: 'internacional', lat: -33.393, lng: -70.7858 },
  { code: 'MVD', name: 'Aeroporto Internacional de Carrasco', city: 'Montevidéu', country: 'Uruguai', countryCode: 'UY', category: 'internacional', lat: -34.8384, lng: -56.0308 },
  { code: 'BOG', name: 'Aeroporto Internacional El Dorado', city: 'Bogotá', country: 'Colômbia', countryCode: 'CO', category: 'internacional', lat: 4.7016, lng: -74.1469 },
  { code: 'LIM', name: 'Aeroporto Internacional Jorge Chávez', city: 'Lima', country: 'Peru', countryCode: 'PE', category: 'internacional', lat: -12.0219, lng: -77.1143 },
  { code: 'ASU', name: 'Aeroporto Internacional Silvio Pettirossi', city: 'Assunção', country: 'Paraguai', countryCode: 'PY', category: 'internacional', lat: -25.24, lng: -57.52 },
  { code: 'UIO', name: 'Aeroporto Internacional Mariscal Sucre', city: 'Quito', country: 'Equador', countryCode: 'EC', category: 'internacional', lat: -0.1292, lng: -78.3575 },
  { code: 'BRC', name: 'Aeroporto Internacional Teniente Luis Candelaria', city: 'Bariloche', country: 'Argentina', countryCode: 'AR', category: 'internacional', lat: -41.1512, lng: -71.1575 },
  { code: 'MDZ', name: 'Aeroporto Internacional El Plumerillo', city: 'Mendoza', country: 'Argentina', countryCode: 'AR', category: 'internacional', lat: -32.8317, lng: -68.7929 },
  { code: 'CTG', name: 'Aeroporto Internacional Rafael Núñez', city: 'Cartagena', country: 'Colômbia', countryCode: 'CO', category: 'internacional', lat: 10.4424, lng: -75.513 },

  // ===================== INTERNACIONAIS — AMÉRICA DO NORTE & CARIBE =====================
  // Nova York (Agrupado: NYC)
  {
    code: 'JFK',
    name: 'Aeroporto Internacional John F. Kennedy',
    city: 'Nova York',
    state: 'NY',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 40.6413,
    lng: -73.7781,
    groupCode: 'NYC',
    groupName: 'Nova York — Todos os aeroportos',
  },
  {
    code: 'LGA',
    name: 'Aeroporto LaGuardia',
    city: 'Nova York',
    state: 'NY',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 40.7769,
    lng: -73.874,
    groupCode: 'NYC',
    groupName: 'Nova York — Todos os aeroportos',
  },
  {
    code: 'EWR',
    name: 'Aeroporto Internacional Newark Liberty',
    city: 'Nova York',
    state: 'NJ',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 40.6895,
    lng: -74.1745,
    groupCode: 'NYC',
    groupName: 'Nova York — Todos os aeroportos',
  },

  // Miami / Sul da Flórida (Agrupado: QMI)
  {
    code: 'MIA',
    name: 'Aeroporto Internacional de Miami',
    city: 'Miami',
    state: 'FL',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 25.7959,
    lng: -80.287,
    groupCode: 'QMI',
    groupName: 'Miami — Todos os aeroportos',
  },
  {
    code: 'FLL',
    name: 'Aeroporto Internacional de Fort Lauderdale-Hollywood',
    city: 'Miami',
    state: 'FL',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 26.0742,
    lng: -80.1506,
    groupCode: 'QMI',
    groupName: 'Miami — Todos os aeroportos',
  },

  // Washington D.C. (Agrupado: WAS)
  {
    code: 'IAD',
    name: 'Aeroporto Internacional Washington Dulles',
    city: 'Washington D.C.',
    state: 'VA',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 38.9531,
    lng: -77.4565,
    groupCode: 'WAS',
    groupName: 'Washington D.C. — Todos os aeroportos',
  },
  {
    code: 'DCA',
    name: 'Aeroporto Nacional Ronald Reagan',
    city: 'Washington D.C.',
    state: 'DC',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 38.8512,
    lng: -77.0402,
    groupCode: 'WAS',
    groupName: 'Washington D.C. — Todos os aeroportos',
  },
  {
    code: 'BWI',
    name: 'Aeroporto Internacional Baltimore/Washington',
    city: 'Washington D.C.',
    state: 'MD',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 39.1774,
    lng: -76.6684,
    groupCode: 'WAS',
    groupName: 'Washington D.C. — Todos os aeroportos',
  },

  // Chicago (Agrupado: CHI)
  {
    code: 'ORD',
    name: "Aeroporto Internacional O'Hare",
    city: 'Chicago',
    state: 'IL',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 41.9742,
    lng: -87.9073,
    groupCode: 'CHI',
    groupName: 'Chicago — Todos os aeroportos',
  },
  {
    code: 'MDW',
    name: 'Aeroporto Internacional Midway',
    city: 'Chicago',
    state: 'IL',
    country: 'Estados Unidos',
    countryCode: 'US',
    category: 'internacional',
    lat: 41.7868,
    lng: -87.7522,
    groupCode: 'CHI',
    groupName: 'Chicago — Todos os aeroportos',
  },

  // Toronto (Agrupado: YTO)
  {
    code: 'YYZ',
    name: 'Aeroporto Internacional Toronto Pearson',
    city: 'Toronto',
    country: 'Canadá',
    countryCode: 'CA',
    category: 'internacional',
    lat: 43.6777,
    lng: -79.6248,
    groupCode: 'YTO',
    groupName: 'Toronto — Todos os aeroportos',
  },
  {
    code: 'YTZ',
    name: 'Aeroporto Billy Bishop Toronto City',
    city: 'Toronto',
    country: 'Canadá',
    countryCode: 'CA',
    category: 'internacional',
    lat: 43.6275,
    lng: -79.3962,
    groupCode: 'YTO',
    groupName: 'Toronto — Todos os aeroportos',
  },

  { code: 'MCO', name: 'Aeroporto Internacional de Orlando', city: 'Orlando', state: 'FL', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 28.4312, lng: -81.3081 },
  { code: 'LAX', name: 'Aeroporto Internacional de Los Angeles', city: 'Los Angeles', state: 'CA', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 33.9416, lng: -118.4085 },
  { code: 'SFO', name: 'Aeroporto Internacional de São Francisco', city: 'São Francisco', state: 'CA', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 37.6213, lng: -122.379 },
  { code: 'ATL', name: 'Aeroporto Internacional Hartsfield-Jackson', city: 'Atlanta', state: 'GA', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 33.6407, lng: -84.4277 },
  { code: 'DFW', name: 'Aeroporto Internacional Dallas/Fort Worth', city: 'Dallas', state: 'TX', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 32.8998, lng: -97.0403 },
  { code: 'IAH', name: 'Aeroporto Intercontinental George Bush', city: 'Houston', state: 'TX', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 29.9902, lng: -95.3368 },
  { code: 'BOS', name: 'Aeroporto Internacional Logan', city: 'Boston', state: 'MA', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 42.3656, lng: -71.0096 },
  { code: 'LAS', name: 'Aeroporto Internacional Harry Reid', city: 'Las Vegas', state: 'NV', country: 'Estados Unidos', countryCode: 'US', category: 'internacional', lat: 36.084, lng: -115.1537 },
  { code: 'YUL', name: 'Aeroporto Internacional Montréal-Trudeau', city: 'Montreal', country: 'Canadá', countryCode: 'CA', category: 'internacional', lat: 45.4706, lng: -73.7408 },
  { code: 'YVR', name: 'Aeroporto Internacional de Vancouver', city: 'Vancouver', country: 'Canadá', countryCode: 'CA', category: 'internacional', lat: 49.1967, lng: -123.1815 },
  { code: 'MEX', name: 'Aeroporto Internacional da Cidade do México', city: 'Cidade do México', country: 'México', countryCode: 'MX', category: 'internacional', lat: 19.4363, lng: -99.0721 },
  { code: 'CUN', name: 'Aeroporto Internacional de Cancún', city: 'Cancún', country: 'México', countryCode: 'MX', category: 'internacional', lat: 21.0365, lng: -86.8771 },
  { code: 'PTY', name: 'Aeroporto Internacional de Tocumen', city: 'Cidade do Panamá', country: 'Panamá', countryCode: 'PA', category: 'internacional', lat: 9.0714, lng: -79.3835 },
  { code: 'PUJ', name: 'Aeroporto Internacional de Punta Cana', city: 'Punta Cana', country: 'República Dominicana', countryCode: 'DO', category: 'internacional', lat: 18.5674, lng: -68.3634 },
  { code: 'AUA', name: 'Aeroporto Internacional Rainha Beatrix', city: 'Aruba', country: 'Aruba', countryCode: 'AW', category: 'internacional', lat: 12.5014, lng: -70.0152 },

  // ===================== INTERNACIONAIS — EUROPA =====================
  // Londres (Agrupado: LON)
  {
    code: 'LHR',
    name: 'Aeroporto de Londres Heathrow',
    city: 'Londres',
    country: 'Reino Unido',
    countryCode: 'GB',
    category: 'internacional',
    lat: 51.47,
    lng: -0.4543,
    groupCode: 'LON',
    groupName: 'Londres — Todos os aeroportos',
  },
  {
    code: 'LGW',
    name: 'Aeroporto de Londres Gatwick',
    city: 'Londres',
    country: 'Reino Unido',
    countryCode: 'GB',
    category: 'internacional',
    lat: 51.1537,
    lng: -0.1821,
    groupCode: 'LON',
    groupName: 'Londres — Todos os aeroportos',
  },
  {
    code: 'STN',
    name: 'Aeroporto de Londres Stansted',
    city: 'Londres',
    country: 'Reino Unido',
    countryCode: 'GB',
    category: 'internacional',
    lat: 51.886,
    lng: 0.2389,
    groupCode: 'LON',
    groupName: 'Londres — Todos os aeroportos',
  },
  {
    code: 'LTN',
    name: 'Aeroporto de Londres Luton',
    city: 'Londres',
    country: 'Reino Unido',
    countryCode: 'GB',
    category: 'internacional',
    lat: 51.8747,
    lng: -0.3683,
    groupCode: 'LON',
    groupName: 'Londres — Todos os aeroportos',
  },
  {
    code: 'LCY',
    name: 'Aeroporto London City',
    city: 'Londres',
    country: 'Reino Unido',
    countryCode: 'GB',
    category: 'internacional',
    lat: 51.5053,
    lng: 0.0553,
    groupCode: 'LON',
    groupName: 'Londres — Todos os aeroportos',
  },

  // Paris (Agrupado: PAR)
  {
    code: 'CDG',
    name: 'Aeroporto de Paris-Charles de Gaulle',
    city: 'Paris',
    country: 'França',
    countryCode: 'FR',
    category: 'internacional',
    lat: 49.0097,
    lng: 2.5479,
    groupCode: 'PAR',
    groupName: 'Paris — Todos os aeroportos',
  },
  {
    code: 'ORY',
    name: 'Aeroporto de Paris-Orly',
    city: 'Paris',
    country: 'França',
    countryCode: 'FR',
    category: 'internacional',
    lat: 48.7262,
    lng: 2.3652,
    groupCode: 'PAR',
    groupName: 'Paris — Todos os aeroportos',
  },

  // Roma (Agrupado: ROM)
  {
    code: 'FCO',
    name: 'Aeroporto Leonardo da Vinci (Fiumicino)',
    city: 'Roma',
    country: 'Itália',
    countryCode: 'IT',
    category: 'internacional',
    lat: 41.8003,
    lng: 12.2389,
    groupCode: 'ROM',
    groupName: 'Roma — Todos os aeroportos',
  },
  {
    code: 'CIA',
    name: 'Aeroporto de Roma Ciampino',
    city: 'Roma',
    country: 'Itália',
    countryCode: 'IT',
    category: 'internacional',
    lat: 41.7994,
    lng: 12.5949,
    groupCode: 'ROM',
    groupName: 'Roma — Todos os aeroportos',
  },

  // Milão (Agrupado: MIL)
  {
    code: 'MXP',
    name: 'Aeroporto de Milão-Malpensa',
    city: 'Milão',
    country: 'Itália',
    countryCode: 'IT',
    category: 'internacional',
    lat: 45.63,
    lng: 8.7231,
    groupCode: 'MIL',
    groupName: 'Milão — Todos os aeroportos',
  },
  {
    code: 'LIN',
    name: 'Aeroporto de Milão-Linate',
    city: 'Milão',
    country: 'Itália',
    countryCode: 'IT',
    category: 'internacional',
    lat: 45.4494,
    lng: 9.2783,
    groupCode: 'MIL',
    groupName: 'Milão — Todos os aeroportos',
  },

  // Istambul (Agrupado: IST_ALL)
  {
    code: 'IST',
    name: 'Aeroporto Internacional de Istambul',
    city: 'Istambul',
    country: 'Turquia',
    countryCode: 'TR',
    category: 'internacional',
    lat: 41.2753,
    lng: 28.7519,
    groupCode: 'QIS',
    groupName: 'Istambul — Todos os aeroportos',
  },
  {
    code: 'SAW',
    name: 'Aeroporto Sabiha Gökçen',
    city: 'Istambul',
    country: 'Turquia',
    countryCode: 'TR',
    category: 'internacional',
    lat: 40.8986,
    lng: 29.3092,
    groupCode: 'QIS',
    groupName: 'Istambul — Todos os aeroportos',
  },

  { code: 'LIS', name: 'Aeroporto Humberto Delgado (Lisboa)', city: 'Lisboa', country: 'Portugal', countryCode: 'PT', category: 'internacional', lat: 38.7742, lng: -9.1342 },
  { code: 'OPO', name: 'Aeroporto Francisco Sá Carneiro', city: 'Porto', country: 'Portugal', countryCode: 'PT', category: 'internacional', lat: 41.2481, lng: -8.6814 },
  { code: 'MAD', name: 'Aeroporto Adolfo Suárez Madrid-Barajas', city: 'Madri', country: 'Espanha', countryCode: 'ES', category: 'internacional', lat: 40.4983, lng: -3.5676 },
  { code: 'BCN', name: 'Aeroporto de Barcelona-El Prat', city: 'Barcelona', country: 'Espanha', countryCode: 'ES', category: 'internacional', lat: 41.2974, lng: 2.0833 },
  { code: 'AMS', name: 'Aeroporto de Amsterdã Schiphol', city: 'Amsterdã', country: 'Holanda', countryCode: 'NL', category: 'internacional', lat: 52.3105, lng: 4.7683 },
  { code: 'FRA', name: 'Aeroporto de Frankfurt', city: 'Frankfurt', country: 'Alemanha', countryCode: 'DE', category: 'internacional', lat: 50.0379, lng: 8.5622 },
  { code: 'MUC', name: 'Aeroporto de Munique', city: 'Munique', country: 'Alemanha', countryCode: 'DE', category: 'internacional', lat: 48.3537, lng: 11.775 },
  { code: 'ZRH', name: 'Aeroporto de Zurique', city: 'Zurique', country: 'Suíça', countryCode: 'CH', category: 'internacional', lat: 47.4647, lng: 8.5492 },
  { code: 'GVA', name: 'Aeroporto de Genebra', city: 'Genebra', country: 'Suíça', countryCode: 'CH', category: 'internacional', lat: 46.237, lng: 6.1092 },
  { code: 'VCE', name: 'Aeroporto Marco Polo', city: 'Veneza', country: 'Itália', countryCode: 'IT', category: 'internacional', lat: 45.5053, lng: 12.3519 },
  { code: 'BRU', name: 'Aeroporto de Bruxelas', city: 'Bruxelas', country: 'Bélgica', countryCode: 'BE', category: 'internacional', lat: 50.901, lng: 4.4856 },
  { code: 'DUB', name: 'Aeroporto de Dublin', city: 'Dublin', country: 'Irlanda', countryCode: 'IE', category: 'internacional', lat: 53.4264, lng: -6.2499 },
  { code: 'VIE', name: 'Aeroporto Internacional de Viena', city: 'Viena', country: 'Áustria', countryCode: 'AT', category: 'internacional', lat: 48.1103, lng: 16.5697 },
  { code: 'PRG', name: 'Aeroporto Václav Havel', city: 'Praga', country: 'República Tcheca', countryCode: 'CZ', category: 'internacional', lat: 50.1008, lng: 14.26 },
  { code: 'ATH', name: 'Aeroporto Internacional de Atenas', city: 'Atenas', country: 'Grécia', countryCode: 'GR', category: 'internacional', lat: 37.9364, lng: 23.9445 },

  // ===================== INTERNACIONAIS — ÁSIA, ORIENTE MÉDIO, ÁFRICA E OCEANIA =====================
  // Tóquio (Agrupado: TYO)
  {
    code: 'HND',
    name: 'Aeroporto Internacional de Tóquio (Haneda)',
    city: 'Tóquio',
    country: 'Japão',
    countryCode: 'JP',
    category: 'internacional',
    lat: 35.5494,
    lng: 139.7798,
    groupCode: 'TYO',
    groupName: 'Tóquio — Todos os aeroportos',
  },
  {
    code: 'NRT',
    name: 'Aeroporto Internacional de Narita',
    city: 'Tóquio',
    country: 'Japão',
    countryCode: 'JP',
    category: 'internacional',
    lat: 35.772,
    lng: 140.3929,
    groupCode: 'TYO',
    groupName: 'Tóquio — Todos os aeroportos',
  },

  // Osaka (Agrupado: OSA)
  {
    code: 'KIX',
    name: 'Aeroporto Internacional de Kansai',
    city: 'Osaka',
    country: 'Japão',
    countryCode: 'JP',
    category: 'internacional',
    lat: 34.4347,
    lng: 135.2441,
    groupCode: 'OSA',
    groupName: 'Osaka — Todos os aeroportos',
  },
  {
    code: 'ITM',
    name: 'Aeroporto Internacional de Osaka (Itami)',
    city: 'Osaka',
    country: 'Japão',
    countryCode: 'JP',
    category: 'internacional',
    lat: 34.7855,
    lng: 135.4382,
    groupCode: 'OSA',
    groupName: 'Osaka — Todos os aeroportos',
  },

  // Seul (Agrupado: SEL)
  {
    code: 'ICN',
    name: 'Aeroporto Internacional de Incheon',
    city: 'Seul',
    country: 'Coreia do Sul',
    countryCode: 'KR',
    category: 'internacional',
    lat: 37.4602,
    lng: 126.4407,
    groupCode: 'SEL',
    groupName: 'Seul — Todos os aeroportos',
  },
  {
    code: 'GMP',
    name: 'Aeroporto Internacional de Gimpo',
    city: 'Seul',
    country: 'Coreia do Sul',
    countryCode: 'KR',
    category: 'internacional',
    lat: 37.5583,
    lng: 126.7906,
    groupCode: 'SEL',
    groupName: 'Seul — Todos os aeroportos',
  },

  { code: 'DXB', name: 'Aeroporto Internacional de Dubai', city: 'Dubai', country: 'Emirados Árabes', countryCode: 'AE', category: 'internacional', lat: 25.2532, lng: 55.3657 },
  { code: 'DOH', name: 'Aeroporto Internacional Hamad', city: 'Doha', country: 'Catar', countryCode: 'QA', category: 'internacional', lat: 25.2731, lng: 51.6081 },
  { code: 'AUH', name: 'Aeroporto Internacional Zayed', city: 'Abu Dhabi', country: 'Emirados Árabes', countryCode: 'AE', category: 'internacional', lat: 24.433, lng: 54.6511 },
  { code: 'SIN', name: 'Aeroporto Internacional Changi', city: 'Singapura', country: 'Singapura', countryCode: 'SG', category: 'internacional', lat: 1.3644, lng: 103.9915 },
  { code: 'BKK', name: 'Aeroporto Suvarnabhumi', city: 'Bangkok', country: 'Tailândia', countryCode: 'TH', category: 'internacional', lat: 13.69, lng: 100.7501 },
  { code: 'HKG', name: 'Aeroporto Internacional de Hong Kong', city: 'Hong Kong', country: 'China', countryCode: 'HK', category: 'internacional', lat: 22.308, lng: 113.9185 },
  { code: 'SYD', name: 'Aeroporto Kingsford Smith', city: 'Sydney', country: 'Austrália', countryCode: 'AU', category: 'internacional', lat: -33.9399, lng: 151.1753 },
  { code: 'MEL', name: 'Aeroporto de Melbourne', city: 'Melbourne', country: 'Austrália', countryCode: 'AU', category: 'internacional', lat: -37.669, lng: 144.841 },
  { code: 'AKL', name: 'Aeroporto de Auckland', city: 'Auckland', country: 'Nova Zelândia', countryCode: 'NZ', category: 'internacional', lat: -37.0082, lng: 174.785 },
  { code: 'JNB', name: 'Aeroporto Internacional O. R. Tambo', city: 'Joanesburgo', country: 'África do Sul', countryCode: 'ZA', category: 'internacional', lat: -26.1367, lng: 28.2411 },
  { code: 'CPT', name: 'Aeroporto Internacional da Cidade do Cabo', city: 'Cidade do Cabo', country: 'África do Sul', countryCode: 'ZA', category: 'internacional', lat: -33.9715, lng: 18.6021 },
  { code: 'CAI', name: 'Aeroporto Internacional do Cairo', city: 'Cairo', country: 'Egito', countryCode: 'EG', category: 'internacional', lat: 30.1219, lng: 31.4056 },
  { code: 'CMN', name: 'Aeroporto Internacional Mohammed V', city: 'Casablanca', country: 'Marrocos', countryCode: 'MA', category: 'internacional', lat: 33.3675, lng: -7.5899 },
];

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Constrói a lista completa de opções de aeroportos, gerando automaticamente
 * uma opção agrupada ("Todos os aeroportos") sempre que uma cidade tiver mais de um aeroporto.
 */
export function buildAirportOptions(airports: Airport[] = AIRPORTS): AirportOption[] {
  const options: AirportOption[] = [];
  const cityBuckets = new Map<string, Airport[]>();

  for (const airport of airports) {
    const key = airport.groupCode
      ? `group:${airport.groupCode}`
      : `city:${normalizeText(airport.city)}|${airport.countryCode}`;
    const existing = cityBuckets.get(key) ?? [];
    existing.push(airport);
    cityBuckets.set(key, existing);
  }

  for (const bucket of cityBuckets.values()) {
    if (bucket.length > 1) {
      const first = bucket[0];
      const groupCode = first.groupCode ?? `${first.city.slice(0, 3).toUpperCase()}`;
      const groupName = first.groupName ?? `${first.city} — Todos os aeroportos`;
      const groupedCodes = bucket.map((a) => a.code);
      const avgLat = bucket.reduce((sum, a) => sum + a.lat, 0) / bucket.length;
      const avgLng = bucket.reduce((sum, a) => sum + a.lng, 0) / bucket.length;

      const combinedSearch = [
        groupCode,
        groupName,
        first.city,
        first.state ?? '',
        first.country,
        'todos os aeroportos',
        ...bucket.map((a) => `${a.code} ${a.name}`),
      ].join(' ');

      options.push({
        code: groupCode,
        name: `${groupName} (${groupedCodes.join(', ')})`,
        city: first.city,
        state: first.state,
        country: first.country,
        countryCode: first.countryCode,
        category: first.category,
        lat: avgLat,
        lng: avgLng,
        isGroup: true,
        groupedCodes,
        groupedAirports: bucket,
        searchText: normalizeText(combinedSearch),
      });
    }

    for (const airport of bucket) {
      const individualSearch = [
        airport.code,
        airport.name,
        airport.city,
        airport.state ?? '',
        airport.country,
        airport.groupCode ?? '',
      ].join(' ');

      options.push({
        code: airport.code,
        name: airport.name,
        city: airport.city,
        state: airport.state,
        country: airport.country,
        countryCode: airport.countryCode,
        category: airport.category,
        lat: airport.lat,
        lng: airport.lng,
        isGroup: false,
        groupedCodes: [airport.code],
        searchText: normalizeText(individualSearch),
      });
    }
  }

  return options;
}

export const ALL_AIRPORT_OPTIONS: AirportOption[] = buildAirportOptions(AIRPORTS);

export const AIRPORT_BY_CODE: Record<string, Airport> = Object.fromEntries(
  AIRPORTS.map((airport) => [airport.code, airport]),
);

export const AIRPORT_OPTION_BY_CODE: Record<string, AirportOption> = Object.fromEntries(
  ALL_AIRPORT_OPTIONS.map((option) => [option.code, option]),
);

export function searchAirportOptions(
  query: string,
  categoryFilter: CategoryFilter = 'todos',
  limit = 15,
): AirportOption[] {
  const normalizedQuery = normalizeText(query);

  const filteredByCategory =
    categoryFilter === 'todos'
      ? ALL_AIRPORT_OPTIONS
      : ALL_AIRPORT_OPTIONS.filter((opt) => opt.category === categoryFilter);

  if (!normalizedQuery) {
    // Mostra os principais hubs agrupados e capitais primeiro
    const priorityCodes = ['SAO', 'GRU', 'CGH', 'RIO', 'GIG', 'SDU', 'BSB', 'BHZ', 'CNF', 'SSA', 'REC', 'FOR', 'POA', 'MIA', 'NYC', 'LIS', 'PAR', 'LON', 'BUE'];
    const priorityMap = new Map(priorityCodes.map((c, idx) => [c, idx]));
    return [...filteredByCategory]
      .sort((a, b) => {
        const pa = priorityMap.get(a.code) ?? 999;
        const pb = priorityMap.get(b.code) ?? 999;
        if (pa !== pb) return pa - pb;
        return a.city.localeCompare(b.city);
      })
      .slice(0, limit);
  }

  const scored = filteredByCategory
    .map((option) => {
      const codeNorm = normalizeText(option.code);
      const cityNorm = normalizeText(option.city);
      const nameNorm = normalizeText(option.name);
      const countryNorm = normalizeText(option.country);

      let score = 0;
      if (codeNorm === normalizedQuery) {
        score = 120;
      } else if (option.isGroup && option.groupedCodes.some((c) => normalizeText(c) === normalizedQuery)) {
        score = 95;
      } else if (cityNorm === normalizedQuery) {
        score = option.isGroup ? 115 : 105;
      } else if (cityNorm.startsWith(normalizedQuery)) {
        score = option.isGroup ? 100 : 90;
      } else if (codeNorm.startsWith(normalizedQuery)) {
        score = 85;
      } else if (nameNorm.includes(normalizedQuery)) {
        score = 70;
      } else if (countryNorm.startsWith(normalizedQuery)) {
        score = option.isGroup ? 65 : 60;
      } else if (option.searchText.includes(normalizedQuery)) {
        score = option.isGroup ? 55 : 50;
      }

      return { option, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.option.isGroup !== b.option.isGroup) return a.option.isGroup ? -1 : 1;
      return a.option.city.localeCompare(b.option.city);
    });

  return scored.slice(0, limit).map((item) => item.option);
}

export function determineRouteCategory(origin: AirportOption, destination: AirportOption): FlightCategory {
  if (origin.countryCode === 'BR' && destination.countryCode === 'BR') {
    return 'nacional';
  }
  return 'internacional';
}

export function expandAirportOption(option: AirportOption): Airport[] {
  if (option.isGroup && option.groupedAirports && option.groupedAirports.length > 0) {
    return option.groupedAirports;
  }
  const found = AIRPORT_BY_CODE[option.code];
  return found ? [found] : [];
}
