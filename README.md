# Buscador de Passagens (Por Pontuação)

Aplicativo multiplataforma (**Android**, **iOS** e **Web**) desenvolvido em **React Native + Expo + TypeScript** para buscar e comparar passagens aéreas por pontos/milhas em todas as companhias aéreas e programas de pontuação bancários.

## Funcionalidades

- **Categorias Nacionais e Internacionais**: Filtro rápido de categorias (*Todas*, *Nacionais*, *Internacionais*) e classificação automática de cada rota.
- **Autocomplete Inteligente de Cidades e Aeroportos**: Busca sem diferenciação de acentos por cidade, país, nome do aeroporto ou código IATA.
- **Opção Agrupada para Cidades com Múltiplos Aeroportos**: Quando a cidade possui mais de um aeroporto, a opção agrupada (*Todos os aeroportos*) aparece automaticamente na lista (ex.: `SAO` para `GRU, CGH, VCP`; `RIO` para `GIG, SDU`; `BHZ` para `CNF, PLU`; `NYC` para `JFK, LGA, EWR`; `LON`, `PAR`, `ROM`, `MIL`, `BUE`, `TYO`, etc.) e a busca compara voos de todos os aeroportos do grupo.
- **Listagem Completa de Todos os Aeroportos**: Aba dedicada com todos os aeroportos nacionais, internacionais e opções agrupadas, permitindo definir qualquer item diretamente como Origem ou Destino.
- **Campos de Datas, Passageiros e Cabine**: Calendário interativo cross-platform para **Ida e volta** ou **Só ida**, seleção de adultos/crianças e classe da cabine (*Econômica*, *Premium*, *Executiva*, *Primeira*).
- **Companhias Aéreas + Programas de Pontos (Bancos e Cartões)**:
  - **Companhias Aéreas**: Smiles (GOL), LATAM Pass, Azul Fidelidade, TAP Miles&Go, Iberia Plus (Avios), AAdvantage (American Airlines), Flying Blue (Air France/KLM), MileagePlus (United), SkyMiles (Delta), ConnectMiles (Copa), LifeMiles (Avianca), Miles&More (Lufthansa/Swiss) e Aeroplan (Air Canada).
  - **Programas de Pontos**: **Livelo**, **Esfera (Santander)**, **C6 Átomos**, **Itaú Pontos**, **Curtaí (BRB)**, **Nu Viagens / Nubank**, **Pontos Caixa**, **Coopera (Sicoob)**, **Dotz Viagens** e **KM de Vantagens**.
- **Links Diretos para Simulação nos Sites**: Cada resultado gera URLs pré-preenchidas (deep links) com origem, destino, datas, passageiros e cabine direcionando diretamente para a simulação no respectivo site/programa (e, no caso de bancos, também para a companhia aérea parceira).

## Como executar

### Pré-requisitos
- Node.js 20+
- npm

### Instalação
```bash
npm install
```

### Rodar em Android, iOS e Web
```bash
# Iniciar Expo (escaneie o QR Code com Expo Go no Android ou iOS)
npm start

# Android (emulador ou dispositivo conectado)
npm run android

# iOS (macOS com Simulator ou via Expo Go)
npm run ios

# Web
npm run web
```

### Gerar builds nativos (Android APK/AAB e iOS IPA)
O projeto já inclui `eas.json` configurado para builds na nuvem via Expo EAS:
```bash
npx eas build -p android --profile preview
npx eas build -p ios --profile production
```

### Validação e Testes
```bash
# Testes automatizados (Vitest)
npm test

# Verificação de tipos TypeScript
npm run typecheck

# Build de produção Web
npm run build:web
```
