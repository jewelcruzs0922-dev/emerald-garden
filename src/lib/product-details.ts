/**
 * Editorial and horticultural detail for each tree.
 *
 * Kept apart from `catalog.ts` on purpose: that file owns the commercial facts
 * (price, stock, imagery) and is what a shop back-end would replace, while this
 * is the copy a grower writes about each specimen.
 */
export interface ProductCare {
  light: string;
  water: string;
  feed: string;
  repot: string;
}

export interface ProductDetails {
  scientificName: string;
  origin: string;
  heightCm: number;
  pot: string;
  ageYears: number;
  difficulty: "Easy" | "Moderate" | "Advanced";
  story: string;
  care: ProductCare;
}

export const PRODUCT_DETAILS: Record<string, ProductDetails> = {
  "black-pine": {
    scientificName: "Pinus thunbergii",
    origin: "Coastal Japan and South Korea",
    heightCm: 34,
    pot: "Unglazed Shigaraki stoneware",
    ageYears: 12,
    difficulty: "Advanced",
    story:
      "The black pine is the tree most people picture when they hear the word bonsai, and it earns that reputation slowly. Ours has been in training for twelve years — long enough for the bark to crack into plates and for the trunk to keep a lean nobody planned. It is a tree for someone who enjoys the doing more than the having.",
    care: {
      light: "Full sun all year. It will not thicken without it.",
      water: "Freely through the growing season, sparingly in winter when the soil stays cold.",
      feed: "Low-nitrogen feed from early spring to late autumn; nothing in the depths of winter.",
      repot: "Every three to five years, in late winter before the candles extend.",
    },
  },
  "japanese-maple": {
    scientificName: "Acer palmatum",
    origin: "Japan, Korea and eastern China",
    heightCm: 30,
    pot: "Glazed blue-grey ceramic",
    ageYears: 9,
    difficulty: "Moderate",
    story:
      "A maple is worth keeping for three weeks a year and pleasant company for the other forty-nine. This one has fine, well-spaced branching and a trunk that already shows the faint striping that old maples get. In a good autumn it goes the colour of a struck match.",
    care: {
      light: "Morning sun, sheltered from the harshest midday glare in summer.",
      water: "Daily while in leaf. It will scorch at the edges if it dries out even once.",
      feed: "Balanced feed in spring, then low-nitrogen from late summer to harden the wood.",
      repot: "Every two years in early spring, just as the buds begin to swell.",
    },
  },
  "ficus-retusa": {
    scientificName: "Ficus retusa",
    origin: "Southeast Asia",
    heightCm: 26,
    pot: "Glazed cream ceramic",
    ageYears: 6,
    difficulty: "Easy",
    story:
      "The tree we hand to almost everyone who writes to us saying they have never kept a bonsai before. Ficus retusa shrugs off a missed watering, tolerates indoor air, and grows fast enough that you can see your work pay off within a season. It also throws aerial roots readily, which is half the fun.",
    care: {
      light: "Bright, ideally a few hours of direct sun through a window.",
      water: "When the top two centimetres of soil are dry to the touch.",
      feed: "Fortnightly through spring and summer, half strength is plenty.",
      repot: "Every two to three years in spring, trimming about a third of the roots.",
    },
  },
  juniper: {
    scientificName: "Juniperus procumbens nana",
    origin: "Japan",
    heightCm: 24,
    pot: "Unglazed brown stoneware",
    ageYears: 8,
    difficulty: "Easy",
    story:
      "A cascade — the trunk falls below the rim of the pot and keeps going, the way a juniper will when it grows out of a cliff face. It wants sun, weather and a cold winter, so it belongs outdoors. In exchange it will outlive most of us.",
    care: {
      light: "Full sun, all year, with the full range of seasons.",
      water: "When the soil surface dries; more freely in summer, barely at all in winter.",
      feed: "Once a month from spring to early autumn.",
      repot: "Every two to three years in early spring, in a free-draining mix.",
    },
  },
  "trident-forest": {
    scientificName: "Acer buergerianum",
    origin: "China and Japan",
    heightCm: 28,
    pot: "Oval unglazed stoneware",
    ageYears: 15,
    difficulty: "Moderate",
    story:
      "Five tridents planted together to look as though they grew in the same clearing by accident. They did not — a forest planting is arranged trunk by trunk, and it takes years of trimming the outer trees harder than the inner ones to keep the illusion. This one has had fifteen years of it.",
    care: {
      light: "Full sun to light shade; the more light, the tighter the ramification.",
      water: "Daily in leaf. A shallow group pot dries faster than a single tree.",
      feed: "Balanced feed through spring and summer.",
      repot: "Every two years in early spring. Lift the whole group together.",
    },
  },
  "chinese-elm": {
    scientificName: "Ulmus parvifolia",
    origin: "China, Korea and Japan",
    heightCm: 28,
    pot: "Glazed olive ceramic",
    ageYears: 7,
    difficulty: "Easy",
    story:
      "Fine twigging, small leaves, and a habit of pushing new growth from wherever you cut — which makes it the most encouraging tree to learn pruning on. Happy on a bright windowsill or outside in the warm months.",
    care: {
      light: "Bright light with some direct sun; moves outside happily in summer.",
      water: "When the surface begins to dry. It is fairly forgiving either way.",
      feed: "Fortnightly in the growing season.",
      repot: "Every two years in spring, or when roots circle the pot.",
    },
  },
  "flowering-adenium": {
    scientificName: "Adenium obesum",
    origin: "East Africa and the Arabian Peninsula",
    heightCm: 25,
    pot: "Glazed sand ceramic",
    ageYears: 6,
    difficulty: "Easy",
    story:
      "The desert rose grows a fat, water-holding trunk and then, once a year, covers itself in trumpet flowers in a pink that has no business being on a tree. It flowers best when it is kept a little root-bound and a little thirsty — the two mistakes beginners make are the two things it dislikes most.",
    care: {
      light: "As much direct sun as you can give it, indoors or out.",
      water: "Thoroughly, then let it dry almost completely before watering again.",
      feed: "High-potassium feed as buds form to encourage flowering.",
      repot: "Every two to three years, in spring, in a very free-draining mix.",
    },
  },
  "red-pine": {
    scientificName: "Pinus densiflora",
    origin: "Japan, Korea and northeastern China",
    heightCm: 38,
    pot: "Unglazed dark stoneware",
    ageYears: 14,
    difficulty: "Advanced",
    story:
      "Softer-needled and more informal than the black pine, with a trunk that has been allowed to develop real character rather than symmetry. Fourteen years in training, and still the sort of tree that will teach you something every season.",
    care: {
      light: "Full sun, outdoors, year round.",
      water: "Freely in growth; keep it drier in winter.",
      feed: "Low-nitrogen from spring to autumn.",
      repot: "Every three to four years, late winter, in a coarse free-draining mix.",
    },
  },
  "ficus-fig": {
    scientificName: "Ficus carica",
    origin: "The Mediterranean and western Asia",
    heightCm: 22,
    pot: "Glazed terracotta ceramic",
    ageYears: 5,
    difficulty: "Easy",
    story:
      "Broad, lobed leaves that make a small tree look substantial, and one of the few bonsai you can genuinely keep happy in a warm room with a decent window. A young tree still, but it is already building the pale, muscular trunk figs are known for.",
    care: {
      light: "A warm, bright window with several hours of direct sun.",
      water: "When the top layer dries; it drinks heavily while fruiting.",
      feed: "Fortnightly through the growing season.",
      repot: "Every two years in spring, into a slightly larger pot.",
    },
  },
  "bald-cypress": {
    scientificName: "Taxodium distichum",
    origin: "The southeastern United States",
    heightCm: 32,
    pot: "Unglazed grey stoneware",
    ageYears: 10,
    difficulty: "Moderate",
    story:
      "A deciduous conifer, which surprises people — feathery green all summer, rust-orange in autumn, and completely bare in winter. It grows on riverbanks in the wild and will happily stand in a saucer of water through the hottest weeks. Few trees look this good soaking wet.",
    care: {
      light: "Full sun, outdoors.",
      water: "Generous. It is one of the few bonsai that tolerates standing water.",
      feed: "Monthly through the growing season.",
      repot: "Every two years in early spring, before the buds break.",
    },
  },
};

/** The same for every order — stated once. */
export const INCLUDED = [
  "The tree, potted and mossed",
  "A printed care card written for this species",
  "A length of anodised training wire",
  "Rigid double-walled box with damp moss around the roots",
  "Our phone number, and an open invitation to use it",
];
