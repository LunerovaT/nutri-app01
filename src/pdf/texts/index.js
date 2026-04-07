// pdf/texts/index.js – texty dle cíle + metadata

import { C } from '../styles';

// ─── METADATA CÍLŮ ────────────────────────────────────────────────────────────
export const GOAL_META = {
  maintain: { label: 'Udržení hmotnosti', color: C.teal, bg: C.tealLight },
  lose_10: { label: 'Mírná redukce −10 %', color: C.orange, bg: C.orangeLight },
  lose_15: { label: 'Redukce −15 %', color: C.orange, bg: C.orangeLight },
  lose_20: { label: 'Redukce −20 %', color: C.orange, bg: C.orangeLight },
  lose_25: {
    label: 'Výrazná redukce −25 %',
    color: C.orange,
    bg: C.orangeLight,
  },
  gain_10: { label: 'Nabírání svalové hmoty', color: C.blue, bg: C.blueLight },
};

export const getGoalMeta = (goal) => GOAL_META[goal] ?? GOAL_META.maintain;

// ─── REDUKCE ──────────────────────────────────────────────────────────────────
const REDUCTION_TEXT = {
  title: 'Informace pro klienty v redukci hmotnosti',
  intro:
    'Redukce hmotnosti je pro mnoho lidí spojena především s dietami a omezováním jídla. Ve skutečnosti je ale mnohem komplexnějším procesem, který ovlivňuje celé fungování organismu i každodenní návyky. Moderní doporučení ukazují, že tělesná hmotnost a zdraví nejsou dány jen množstvím přijatých kalorií, ale především souhrou více faktorů – kvalitou stravy, úrovní pohybu, spánkem, psychickou pohodou i životním stylem jako celkem.',
  intro2:
    'Proto je důležité nepřistupovat k hubnutí jako ke krátkodobé dietě, ale jako k postupné a dlouhodobé změně návyků, která vede nejen ke snížení hmotnosti, ale i ke zlepšení celkového zdraví a kvality života.',
  sections: [
    {
      title: '1. Strava a výživa',
      body: 'Jídlo je při hubnutí často největší výzva. Nejde ale o to jíst co nejméně nebo si zakazovat oblíbená jídla. Mnohem důležitější je naučit se jíst tak, aby vás jídlo zasytilo, dodalo energii a zároveň podpořilo vaše cíle.',
      bullets: [
        'Jezte pravidelně – pravidelnost pomáhá udržet stabilní energii i kontrolu nad hladem.',
        'Každé jídlo si sestavte chytře – bílkoviny + sacharidy + tuky + zelenina nebo ovoce.',
        'Jezte pomalu a v klidu – tělu chvíli trvá, než si uvědomí, že je syté.',
        'Naučte se rozeznat hlad vs. chuť – hlad je postupný, chuť je konkrétní.',
        'Dovolte si oblíbená jídla – úplné zákazy vedou k přejídání.',
        'Neřešte jednu chybu – důležité je, co děláte dlouhodobě.',
      ],
    },
    {
      title: '2. Pohyb',
      body: 'Pohyb je při hubnutí důležitý, ale nemusí to znamenat hodiny v posilovně. Klíčem je začít jednoduše a najít něco, co bude dlouhodobě udržitelné.',
      bullets: [
        'Začněte jednoduše – pravidelná chůze 20–30 minut denně je skvělý začátek.',
        'Nepodceňujte běžný pohyb – schody, procházky, chůze do práce. Každý krok se počítá.',
        'Najděte pohyb, který vás baví – kolo, plavání, tanec, turistika.',
        'Zařaďte lehké posilování – základní cviky s vlastní vahou pomáhají udržet svaly.',
        'Nastavte realistická očekávání – 2–3 tréninky týdně + chůze mají velký efekt.',
        'Buďte k sobě fér – budou horší dny. Důležité je vrátit se zpět.',
      ],
    },
    {
      title: '3. Pitný režim',
      body: 'Dostatečný příjem tekutin je nezbytný pro správné fungování organismu i podporu metabolismu.',
      bullets: [
        'Přibližně 1,5–2,5 litru tekutin denně (dle individuálních potřeb).',
        'Preferujte čistou vodu, neslazené čaje nebo minerální vody.',
        'Omezte slazené nápoje a alkohol.',
        'Nedostatek tekutin může vést k únavě a zvýšenému pocitu hladu.',
      ],
    },
    {
      title: '4. Spánek a regenerace',
      body: 'Kvalitní spánek je často podceňovaný, ale zásadní faktor při hubnutí.',
      bullets: [
        'Spěte 7–9 hodin denně.',
        'Dodržujte pravidelný spánkový režim.',
        'Minimalizujte rušivé vlivy – světlo, obrazovky před spaním.',
        'Nedostatek spánku narušuje hormonální rovnováhu a zvyšuje chuť k jídlu.',
      ],
    },
    {
      title: '5. Psychika a stres',
      body: 'Psychická pohoda má velký vliv na úspěšnost redukce. Chronický stres může vést k přejídání.',
      bullets: [
        'Zařazujte relaxační aktivity – procházky, dechová cvičení, meditace.',
        'Věnujte čas odpočinku a koníčkům.',
        'Pracujte se stresem vědomě.',
      ],
    },
    {
      title: '6. Dlouhodobý přístup',
      body: 'Redukce hmotnosti by měla být postupná a realistická. Ideální tempo je přibližně 0,5–1 kg týdně.',
      bullets: [
        'Zaměřte se na dlouhodobou udržitelnost, nečekejte rychlé výsledky.',
        'Přijměte, že občasné odchylky jsou normální.',
        'Klíčem je konzistence, ne dokonalost.',
      ],
    },
  ],
  summary: {
    title: 'Stručné shrnutí',
    items: [
      ['Strava', 'Pravidelná, vyvážená, pestrá, bez extrémů'],
      ['Pohyb', 'Min. 150 min týdně + silový trénink'],
      ['Pitný režim', '1,5–2,5 l denně, hlavně voda'],
      ['Spánek', '7–9 hodin denně'],
      ['Psychika', 'Zvládání stresu, relaxace'],
      ['Přístup', 'Trpělivost, dlouhodobost, udržitelnost'],
    ],
  },
};
//UDRŽENÍ HMOTNOSTI
const MAINTAIN_TEXT = {
  title: 'Informace pro klienty – udržení hmotnosti',

  intro:
    'Tento jídelníček vám má být oporou, ne omezením. Pomůže vám vytvořit si návyky, které dávají smysl ve vašem každodenním životě a které dokážete dlouhodobě udržet. Není potřeba dělat všechno na 100 %. Důležité je, že se postupně posouváte správným směrem a hledáte rovnováhu, která vám bude vyhovovat.',

  intro2:
    ' Zdravý životní styl není o přísných pravidlech ani o snaze být dokonalý. Je to cesta, na které se učíte lépe vnímat své tělo, jeho potřeby a signály. Každý krok, který uděláte směrem k vyváženější stravě, pravidelnému pohybu nebo lepšímu odpočinku, má smysl – i když není perfektní.',

  sections: [
    {
      title: '1. Strava a výživa',
      body: 'Základem udržení hmotnosti je pestrá a vyvážená strava. Není potřeba vyřazovat žádné skupiny potravin – důležitější je jejich množství a vzájemný poměr. Každé jídlo by mělo obsahovat kombinaci bílkovin, sacharidů a tuků, které společně zajistí stabilní energii a pocit sytosti.',
      bullets: [
        'Jezte pravidelně během dne, ideálně 3–5 jídel, aby nedocházelo k velkým výkyvům hladu.',
        'Vnímejte velikost porcí – jezte tak, abyste byli příjemně sytí, ne přejedení.',
        'Zařazujte dostatek zeleniny, ovoce a kvalitních základních potravin.',
        'Občasné „méně nutriční“ potraviny nejsou problém – důležitý je celkový kontext, ne jednotlivé jídlo.',
      ],
    },

    {
      title: '2. Pohyb',
      body: 'Pohyb je důležitý nejen pro udržení hmotnosti, ale i pro celkové zdraví. Podle doporučení WHO by měl být přirozenou součástí každodenního života. Nemusí jít jen o sport – důležitá je i běžná aktivita během dne.',
      bullets: [
        'Snažte se dosáhnout alespoň 150 minut středně intenzivního pohybu týdně.',
        'Zařazujte také silový trénink, který pomáhá udržovat svalovou hmotu a metabolismus.',
        'Využívejte běžné příležitosti k pohybu – chůzi, schody nebo aktivní přestávky.',
        'Najděte si aktivity, které vás baví – jedině ty budete dlouhodobě dodržovat.',
      ],
    },

    {
      title: '3. Pitný režim, spánek a psychika',
      body: 'Zdravý životní styl není jen o jídle a pohybu. Velkou roli hraje také dostatek tekutin, kvalitní spánek a psychická pohoda. Tyto faktory ovlivňují hormony, chuť k jídlu i celkovou energii během dne.',
      bullets: [
        'Dbejte na dostatečný příjem tekutin, ideálně kolem 1,5–2,5 litru denně.',
        'Spánek by měl trvat přibližně 7–9 hodin – jeho nedostatek může zvyšovat chuť k jídlu.',
        'Věnujte pozornost stresu – dlouhodobé napětí často vede k nepravidelnému stravování.',
        'Je normální, že se hmotnost mírně mění – sledujte trend, ne jednotlivé dny.',
      ],
    },
  ],

  summary: {
    title: 'Shrnutí – co je opravdu důležité',
    text: 'Udržení hmotnosti stojí na několika jednoduchých principech: jezte pravidelně a pestře, hýbejte se přirozeně každý den a dopřejte tělu dostatek spánku i regenerace. Nejde o dokonalost, ale o dlouhodobou rovnováhu. Pokud většinu času děláte věci správně, drobné odchylky nehrají zásadní roli.',
    items: [
      ['Strava', 'Pestrá, vyvážená a bez zbytečných zákazů'],
      ['Pohyb', 'Pravidelný pohyb alespoň 150 min týdně'],
      ['Tekutiny', 'Dostatek vody během dne'],
      ['Spánek', '7–9 hodin kvalitního spánku'],
      ['Přístup', 'Dlouhodobá udržitelnost, ne perfekcionismus'],
    ],
  },
};

// ─── NABÍRÁNÍ ─────────────────────────────────────────────────────────────────
const GAIN_TEXT = {
  title: 'Informace pro klienty – nabírání svalové hmoty',
  intro:
    'Nabírání svalové hmoty vyžaduje kombinaci dostatečného kalorického přebytku, optimálního příjmu bílkovin a pravidelného silového tréninku. Na rozdíl od hubnutí zde tělu poskytujeme více energie, než spotřebuje – a tato energie musí být co nejlépe využita pro růst svalů.',
  intro2:
    'Váš jídelníček je nastaven s přebytkem 10 % nad vaším výdejem. Klíčem k úspěchu je kvalita potravin, dostatečné bílkoviny a důsledný trénink.',
  sections: [
    {
      title: '1. Strava a výživa',
      body: 'Při nabírání je strava stejně důležitá jako trénink – bez dostatku energie a bílkovin svaly neporostou.',
      bullets: [
        'Cílete na 1,8–2,2 g bílkovin na kg tělesné hmotnosti denně.',
        'Jezte dostatečně, i když nemáte hlad – kalorický přebytek je nutný.',
        'Komplexní sacharidy jsou vaším palivem – rýže, ovesné vločky, brambory, těstoviny.',
        'Zdravé tuky podporují hormonální prostředí příznivé pro růst svalů.',
        'Jezte 4–6× denně – menší, ale výživná jídla v pravidelných intervalech.',
        'Bílkoviny konzumujte rovnoměrně během celého dne.',
      ],
    },
    {
      title: '2. Trénink',
      body: 'Bez silového tréninku se kalorický přebytek promění v tuk, ne ve svaly.',
      bullets: [
        'Zařaďte silový trénink min. 3–4× týdně.',
        'Zaměřte se na základní složené pohyby – dřep, mrtvý tah, bench press, přítahy.',
        'Postupně zvyšujte zátěž – progresivní přetížení je klíčem k růstu.',
        'Nevynechávejte regeneraci – svaly rostou v klidu, ne při tréninku.',
      ],
    },
    {
      title: '3. Regenerace a spánek',
      body: 'Spánek a odpočinek jsou při nabírání rovnocenné tréninku.',
      bullets: [
        'Spěte 8–9 hodin denně – v průběhu spánku se uvolňuje růstový hormon.',
        'Mezi tréninky stejných svalových skupin nechte min. 48 hodin.',
        'Zvládejte stres – kortizol potlačuje růst svalů.',
        'Pijte dostatečně – 2–3 l vody denně, při tréninku více.',
      ],
    },
  ],
  summary: {
    title: 'Klíčové zásady pro nabírání svalů',
    items: [
      ['Bílkoviny', '1,8–2,2 g / kg tělesné hmotnosti'],
      ['Kalorie', 'Přebytek +10 % nad výdejem'],
      ['Trénink', 'Silový, 3–4× týdně'],
      ['Spánek', '8–9 hodin denně'],
      ['Přístup', 'Konzistence, trpělivost, progrese'],
    ],
  },
};

// ─── ROUTER ───────────────────────────────────────────────────────────────────
export const getInfoText = (goal) => {
  if (['lose_10', 'lose_15', 'lose_20', 'lose_25'].includes(goal))
    return REDUCTION_TEXT;
  if (goal === 'gain_10') return GAIN_TEXT;
  return MAINTAIN_TEXT;
};
