// Maps English keywords → emoji characters for OpenMoji card images.
// Look-up is: exact phrase → first word → null (falls back to letter placeholder).

export const WORD_TO_EMOJI = {
  // ── Animals ────────────────────────────────────────────────────────────────
  cat: "🐱", dog: "🐶", bird: "🐦", fish: "🐟", horse: "🐴",
  cow: "🐄", pig: "🐷", chicken: "🍗", duck: "🦆", rabbit: "🐰",
  elephant: "🐘", tiger: "🐯", lion: "🦁", monkey: "🐒", snake: "🐍",
  frog: "🐸", butterfly: "🦋", bee: "🐝", ant: "🐜", spider: "🕷",
  bear: "🐻", fox: "🦊", wolf: "🐺", deer: "🦌", sheep: "🐑",
  goat: "🐐", turtle: "🐢", crab: "🦀", shrimp: "🦐", octopus: "🐙",
  whale: "🐳", dolphin: "🐬", shark: "🦈", penguin: "🐧", owl: "🦉",
  eagle: "🦅", parrot: "🦜", crocodile: "🐊", giraffe: "🦒", zebra: "🦓",
  hippo: "🦛", rhino: "🦏", camel: "🐪", kangaroo: "🦘", koala: "🐨",
  panda: "🐼", gorilla: "🦍", mouse: "🐭", rat: "🐀", hamster: "🐹",
  squirrel: "🐿", hedgehog: "🦔", bat: "🦇", snail: "🐌", worm: "🐛",
  ladybug: "🐞", dragonfly: "🦟", lobster: "🦞", oyster: "🦪",

  // ── Food & Drink ───────────────────────────────────────────────────────────
  rice: "🍚", noodle: "🍜", noodles: "🍜", soup: "🍲", bread: "🍞",
  egg: "🥚", eggs: "🥚", meat: "🥩", pork: "🥩", beef: "🥩",
  vegetable: "🥦", vegetables: "🥦", fruit: "🍎", apple: "🍎",
  banana: "🍌", orange: "🍊", mango: "🥭", watermelon: "🍉",
  grapes: "🍇", strawberry: "🍓", pineapple: "🍍", coconut: "🥥",
  tomato: "🍅", carrot: "🥕", corn: "🌽", potato: "🥔",
  onion: "🧅", garlic: "🧄", mushroom: "🍄", pepper: "🌶",
  coffee: "☕", tea: "🍵", water: "💧", milk: "🥛", beer: "🍺",
  wine: "🍷", juice: "🧃", cake: "🎂", cookie: "🍪",
  "ice cream": "🍦", pizza: "🍕", burger: "🍔", sandwich: "🥪",
  salad: "🥗", sushi: "🍣", dumpling: "🥟", chopsticks: "🥢",
  bowl: "🍜", plate: "🍽", fork: "🍴", spoon: "🥄", knife: "🔪",
  lemon: "🍋", peach: "🍑", pear: "🍐", cherry: "🍒", melon: "🍈",
  kiwi: "🥝", avocado: "🥑", broccoli: "🥦", cucumber: "🥒",
  lettuce: "🥬", sweet: "🍬", chocolate: "🍫", candy: "🍭",
  popcorn: "🍿", honey: "🍯", salt: "🧂", butter: "🧈",
  soda: "🥤", cocktail: "🍹", champagne: "🍾", cup: "🫖",
  glass: "🥛", bottle: "🍶", pan: "🍳", pot: "🫕",

  // ── Body Parts ─────────────────────────────────────────────────────────────
  eye: "👁", eyes: "👁", ear: "👂", nose: "👃", mouth: "👄",
  hand: "✋", hands: "🤲", foot: "🦶", feet: "🦶", arm: "💪",
  leg: "🦵", head: "🗣", heart: "❤️", brain: "🧠", tooth: "🦷",
  teeth: "🦷", hair: "💇", face: "😊", finger: "☝", thumb: "👍",
  bone: "🦴", muscle: "💪", skin: "🩹", blood: "🩸",
  shoulder: "🤷", knee: "🦵", elbow: "💪", wrist: "⌚",
  tongue: "👅", lip: "💋", lips: "💋", nail: "💅",

  // ── Colors ────────────────────────────────────────────────────────────────
  red: "🔴", blue: "🔵", green: "🟢", yellow: "🟡", orange: "🟠",
  purple: "🟣", black: "⚫", white: "⚪", pink: "🩷", brown: "🟤",
  gray: "🩶", grey: "🩶", gold: "🥇", silver: "🥈",

  // ── Family & People ────────────────────────────────────────────────────────
  mother: "👩", father: "👨", sister: "👧", brother: "👦",
  grandmother: "👵", grandfather: "👴", baby: "👶", family: "👨‍👩‍👧‍👦",
  wife: "👰", husband: "🤵", daughter: "👧", son: "👦",
  aunt: "👩", uncle: "👨", parents: "👨‍👩‍👧", child: "🧒",
  children: "👦", friend: "🤝", person: "🧑", man: "👨", woman: "👩",
  boy: "👦", girl: "👧", people: "👥", crowd: "👥", couple: "👫",
  student: "🎓", teacher: "👩‍🏫", doctor: "👨‍⚕️", nurse: "👩‍⚕️",
  farmer: "👨‍🌾", chef: "👨‍🍳", police: "👮", soldier: "💂",
  king: "🤴", queen: "👸", president: "🏛", boss: "👔",

  // ── Nature & Environment ───────────────────────────────────────────────────
  sun: "☀️", moon: "🌙", star: "⭐", cloud: "☁️", rain: "🌧",
  snow: "❄️", wind: "💨", fire: "🔥", earth: "🌍",
  mountain: "⛰", tree: "🌳", flower: "🌸", grass: "🌿",
  leaf: "🍃", rock: "🪨", river: "🏞", sea: "🌊", ocean: "🌊",
  beach: "🏖", forest: "🌲", desert: "🏜", island: "🏝",
  sky: "🌤", rainbow: "🌈", storm: "⛈", thunder: "⚡",
  lightning: "⚡", fog: "🌫", ice: "🧊", wave: "🌊", lake: "🏞",
  waterfall: "💦", valley: "🏔", volcano: "🌋", cave: "🕳",
  seed: "🌱", plant: "🌱", bush: "🌿", cactus: "🌵",
  palm: "🌴", bamboo: "🎋", rose: "🌹", tulip: "🌷", sunflower: "🌻",

  // ── Objects & Home ─────────────────────────────────────────────────────────
  house: "🏠", home: "🏠", door: "🚪", window: "🪟", bed: "🛏",
  chair: "🪑", table: "🪞", book: "📚", phone: "📱", computer: "💻",
  television: "📺", tv: "📺", radio: "📻", camera: "📷", lamp: "💡",
  light: "💡", key: "🔑", lock: "🔒", clock: "⏰", watch: "⌚",
  mirror: "🪞", sofa: "🛋", toilet: "🚽", shower: "🚿", bath: "🛁",
  sink: "🚰", fridge: "🧊", oven: "🫕", microwave: "📦", blender: "🫙",
  umbrella: "☂", towel: "🏖", pillow: "🛏", blanket: "🛏",
  curtain: "🪟", carpet: "🏠", shelf: "🪵", ladder: "🪜",
  hammer: "🔨", nail: "🪛", screwdriver: "🪛", saw: "🪚",
  rope: "🪢", bucket: "🪣", broom: "🧹", mop: "🧹",

  // ── Clothes & Accessories ─────────────────────────────────────────────────
  clothes: "👕", shirt: "👕", pants: "👖", skirt: "👗", dress: "👗",
  shoes: "👟", boot: "👢", boots: "👢", sandal: "👡", sandals: "👡",
  hat: "🎩", cap: "🧢", glasses: "👓", sunglasses: "🕶", gloves: "🧤",
  scarf: "🧣", coat: "🧥", jacket: "🧥", sweater: "🧶", suit: "👔",
  tie: "👔", sock: "🧦", socks: "🧦", underwear: "🩲", bikini: "👙",
  belt: "👔", ring: "💍", necklace: "📿", earring: "💎", bracelet: "📿",
  bag: "👜", purse: "👛", wallet: "💰", backpack: "🎒", suitcase: "🧳",

  // ── Transport ─────────────────────────────────────────────────────────────
  car: "🚗", bus: "🚌", train: "🚂", bicycle: "🚲", motorbike: "🏍",
  motorcycle: "🏍", airplane: "✈️", boat: "🚢", ship: "🛳", helicopter: "🚁",
  taxi: "🚕", truck: "🚚", van: "🚐", tractor: "🚜", ambulance: "🚑",
  "fire truck": "🚒", police: "🚓", scooter: "🛵", skateboard: "🛹",
  submarine: "🤿", rocket: "🚀", satellite: "🛰",

  // ── Places & Buildings ─────────────────────────────────────────────────────
  school: "🏫", hospital: "🏥", market: "🏪", restaurant: "🍽",
  hotel: "🏨", park: "🌳", museum: "🏛", church: "⛪", temple: "⛩",
  airport: "✈️", station: "🚉", bank: "🏦", library: "📚",
  shop: "🏪", store: "🏪", office: "🏢", factory: "🏭",
  farm: "🚜", garden: "🌺", stadium: "🏟", gym: "🏋",
  cinema: "🎬", theater: "🎭", zoo: "🦁", aquarium: "🐠",
  pharmacy: "💊", police: "👮", prison: "🔒", court: "⚖️",
  palace: "🏰", castle: "🏰", tower: "🗼", bridge: "🌉",
  tunnel: "🚇", road: "🛣", street: "🏙", city: "🌆", village: "🏘",

  // ── Time ──────────────────────────────────────────────────────────────────
  morning: "🌅", afternoon: "🌞", evening: "🌆", night: "🌙",
  today: "📅", tomorrow: "📆", yesterday: "⏪", week: "📅",
  month: "🗓", year: "🗓", hour: "⏰", minute: "⏱", second: "⏱",
  spring: "🌸", summer: "☀️", autumn: "🍂", fall: "🍂", winter: "❄️",
  monday: "📅", tuesday: "📅", wednesday: "📅", thursday: "📅",
  friday: "🎉", saturday: "🎊", sunday: "⛪",
  birthday: "🎂", holiday: "🎉", wedding: "💒",

  // ── Numbers ────────────────────────────────────────────────────────────────
  one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣",
  six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", ten: "🔟",
  hundred: "💯", thousand: "🔢", million: "🔢", zero: "0️⃣",
  first: "🥇", second: "🥈", third: "🥉",

  // ── Weather ───────────────────────────────────────────────────────────────
  hot: "🔥", cold: "🥶", warm: "🌡", cool: "😎",
  sunny: "☀️", rainy: "🌧", cloudy: "☁️", windy: "💨",
  foggy: "🌫", snowy: "❄️", humid: "💦", dry: "🏜",
  temperature: "🌡", weather: "⛅", climate: "🌍",

  // ── Emotions & States ────────────────────────────────────────────────────
  happy: "😊", sad: "😢", angry: "😠", scared: "😨",
  surprised: "😲", tired: "😴", sick: "🤒", healthy: "💪",
  love: "❤️", laugh: "😂", cry: "😢", smile: "😊", think: "🤔",
  worry: "😟", fear: "😨", hope: "🙏", dream: "💭", sleep: "😴",
  hungry: "😋", thirsty: "🥤", bored: "😑", excited: "🤩",
  proud: "😤", shame: "😔", lonely: "😔", jealous: "😤",

  // ── Adjectives ────────────────────────────────────────────────────────────
  beautiful: "✨", ugly: "🤢", big: "🐘", small: "🐭", tall: "📏",
  short: "📏", long: "📏", wide: "↔", narrow: "↔",
  fast: "🏃", slow: "🐢", good: "👍", bad: "👎",
  new: "🆕", old: "🧓", young: "👶", rich: "💰", poor: "💸",
  clean: "✨", dirty: "🗑", heavy: "🏋", light: "🪶",
  hard: "💎", soft: "🧸", sharp: "🔪", smooth: "🧴",
  loud: "📢", quiet: "🤫", dark: "🌑", bright: "☀️",
  empty: "⬜", full: "🍽", open: "🔓", closed: "🔐",
  strong: "💪", weak: "🥱", smart: "🧠", clever: "🧠",

  // ── Actions / Verbs ───────────────────────────────────────────────────────
  eat: "🍽", drink: "🥤", walk: "🚶", run: "🏃",
  swim: "🏊", fly: "✈️", read: "📖", write: "✍", sing: "🎤",
  dance: "💃", play: "🎮", work: "💼", study: "📚", cook: "👨‍🍳",
  drive: "🚗", travel: "✈️", talk: "💬", listen: "👂", see: "👁",
  buy: "🛒", sell: "🏷", give: "🤲", take: "✋", go: "🚶",
  come: "🏃", sit: "🪑", stand: "🧍", climb: "🧗", jump: "🦘",
  throw: "🥏", catch: "🤲", push: "👊", pull: "🤝",
  open: "🔓", close: "🔐", turn: "↩", move: "📦",
  build: "🔨", break: "💥", fix: "🔧", clean: "🧹",
  wash: "🧼", cut: "✂", sew: "🧵", paint: "🎨",
  teach: "👩‍🏫", learn: "📚", help: "🤝", call: "📞",
  meet: "🤝", wait: "⏳", start: "▶", stop: "⏹", finish: "🏁",
  win: "🏆", lose: "😔", try: "💪", choose: "🤔",
  know: "🧠", remember: "💭", forget: "🤷", understand: "💡",

  // ── Sports & Activities ───────────────────────────────────────────────────
  football: "⚽", soccer: "⚽", basketball: "🏀", tennis: "🎾",
  baseball: "⚾", volleyball: "🏐", swimming: "🏊", running: "🏃",
  cycling: "🚴", yoga: "🧘", boxing: "🥊", wrestling: "🤼",
  golf: "⛳", hockey: "🏒", skiing: "⛷", surfing: "🏄",
  climbing: "🧗", hiking: "🥾", fishing: "🎣", hunting: "🏹",
  archery: "🏹", chess: "♟", cards: "🃏", dice: "🎲",

  // ── Music & Arts ─────────────────────────────────────────────────────────
  music: "🎵", song: "🎵", guitar: "🎸", piano: "🎹", drum: "🥁",
  violin: "🎻", trumpet: "🎺", flute: "🪈", microphone: "🎤",
  art: "🎨", painting: "🖼", drawing: "✏", sculpture: "🗿",
  photography: "📷", movie: "🎬", film: "🎬", theater: "🎭",
  dance: "💃", concert: "🎵", festival: "🎉",

  // ── Technology ────────────────────────────────────────────────────────────
  internet: "🌐", email: "📧", message: "💬", video: "📹",
  photo: "📷", app: "📱", website: "🌐", password: "🔐",
  robot: "🤖", satellite: "🛰", telescope: "🔭", microscope: "🔬",
  battery: "🔋", electricity: "⚡", engine: "⚙", machine: "🔧",

  // ── Money & Commerce ─────────────────────────────────────────────────────
  money: "💰", coin: "🪙", price: "🏷", cost: "💸", salary: "💵",
  bank: "🏦", tax: "📋", trade: "🤝", business: "💼", market: "🏪",
  receipt: "🧾", discount: "🏷", profit: "📈", loss: "📉",

  // ── Health & Medicine ─────────────────────────────────────────────────────
  medicine: "💊", pill: "💊", hospital: "🏥", doctor: "👨‍⚕️",
  nurse: "👩‍⚕️", injection: "💉", bandage: "🩹", thermometer: "🌡",
  blood: "🩸", bone: "🦴", vitamin: "💊", exercise: "🏃",
  diet: "🥗", stress: "😤", pain: "🤕", fever: "🤒", cough: "😷",

  // ── Education ─────────────────────────────────────────────────────────────
  school: "🏫", university: "🎓", class: "📚", lesson: "📖",
  exam: "📝", test: "📝", homework: "📚", grade: "🎓", diploma: "📜",
  science: "🔬", math: "🔢", history: "📜", geography: "🌍",
  language: "🗣", english: "🇬🇧", vietnamese: "🇻🇳", culture: "🎭",
  pencil: "✏", pen: "🖊", paper: "📄", notebook: "📓", ruler: "📏",

  // ── Misc ──────────────────────────────────────────────────────────────────
  gift: "🎁", party: "🎉", balloon: "🎈", candle: "🕯", firework: "🎆",
  flag: "🚩", map: "🗺", compass: "🧭", sign: "🪧", news: "📰",
  letter: "✉️", stamp: "📮", box: "📦", package: "📦", trash: "🗑",
  recycle: "♻️", earth: "🌍", world: "🌎", globe: "🌐",
  peace: "☮️", war: "⚔️", weapon: "⚔️", sword: "⚔️", gun: "🔫",
  police: "👮", law: "⚖️", justice: "⚖️", vote: "🗳", election: "🗳",
  religion: "🙏", god: "🙏", prayer: "🙏", spirit: "👻",
  magic: "✨", mystery: "🔮", puzzle: "🧩", treasure: "💎",
};

/**
 * Convert an emoji character to an OpenMoji CDN URL (SVG via jsDelivr).
 * Handles single codepoint and ZWJ sequences; strips U+FE0F variation selector.
 */
export function emojiToOpenMojiUrl(emoji) {
  const hex = [...emoji]
    .map((c) => c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0"))
    .filter((cp) => cp !== "FE0F") // strip variation selector-16
    .join("-");
  return `https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/${hex}.svg`;
}

/**
 * Find an emoji character for a given English phrase.
 * Tries full phrase → first word → null.
 */
export function findEmoji(english) {
  const cleaned = english
    .split(/[,;(]/)[0]
    .replace(/^(to|the|a|an)\s+/i, "")
    .trim()
    .toLowerCase();

  // Try the full cleaned phrase first (handles "ice cream" etc.)
  if (WORD_TO_EMOJI[cleaned]) return WORD_TO_EMOJI[cleaned];

  // Fall back to the first word
  const first = cleaned.split(/\s+/)[0];
  return WORD_TO_EMOJI[first] ?? null;
}
