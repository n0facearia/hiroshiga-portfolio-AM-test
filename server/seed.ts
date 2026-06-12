import db from './db'
import { createTables } from './schema'

interface ArtworkSeed {
  title: string
  title_jp: string
  series: string
  year: number
  era: string
  wikimedia_url: string
  thumbnail_url: string
  source_url: string
  attribution: string
  description: string
  is_featured: number
}

const ATTRIBUTION = 'Image courtesy of The Metropolitan Museum of Art, Open Access'

const artworks: ArtworkSeed[] = [
  {
    title: "Kinryūsan Temple at Asakusa, from the series \"One Hundred Famous Views of Edo\"",
    title_jp: '',
    series: "One Hundred Famous Views of Edo",
    year: 1856,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/kinry-san-temple-at-asakusa-from-the-series-one-hundred-famous-views-of-edo.jpg",
    thumbnail_url: "/images/artworks/thumb/kinry-san-temple-at-asakusa-from-the-series-one-hundred-famous-views-of-edo.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/56689",
    attribution: ATTRIBUTION,
    description: "Hiroshige depicts a sacred site with architectural precision and atmospheric depth, capturing both the spiritual significance and the daily life surrounding the temple grounds.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "“Azuma Bridge from Komagatadō Temple,” from the series One Hundred Famous Views of Edo (Meisho Edo hyakkei, Komagatadō Azumabashi)",
    title_jp: '',
    series: "One Hundred Famous Views of Edo",
    year: 1857,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/azuma-bridge-from-komagatado-temple-from-the-series-one-hundred-famous-views-of-edo-meisho-edo-hyakkei-komagatado-azumabashi.jpg",
    thumbnail_url: "/images/artworks/thumb/azuma-bridge-from-komagatado-temple-from-the-series-one-hundred-famous-views-of-edo-meisho-edo-hyakkei-komagatado-azumabashi.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/37282",
    attribution: ATTRIBUTION,
    description: "A bustling bridge scene from the Tōkaidō road, with travelers crossing over a wide river while the distant landscape unfolds in Hiroshige's signature atmospheric perspective.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "Sudden Shower over Shin-Ōhashi Bridge and Atake (Ōhashi Atake no yūdachi), from the series One Hundred Famous Views of Edo (Meisho Edo hyakkei)",
    title_jp: '',
    series: "One Hundred Famous Views of Edo",
    year: 1857,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/sudden-shower-over-shin-ohashi-bridge-and-atake-ohashi-atake-no-y-dachi-from-the-series-one-hundred-famous-views-of-edo-meisho-edo-hyakkei.jpg",
    thumbnail_url: "/images/artworks/thumb/sudden-shower-over-shin-ohashi-bridge-and-atake-ohashi-atake-no-y-dachi-from-the-series-one-hundred-famous-views-of-edo-meisho-edo-hyakkei.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/55433",
    attribution: ATTRIBUTION,
    description: "Hiroshige captures a sudden rain shower with bold diagonal lines and masterful use of negative space, transforming a transient weather moment into an enduring work of art.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "Revelers Returned from the Tori no Machi Festival at Asakusa, from the series One Hundred Famous Views of Edo",
    title_jp: '',
    series: "One Hundred Famous Views of Edo",
    year: 1857,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/revelers-returned-from-the-tori-no-machi-festival-at-asakusa-from-the-series-one-hundred-famous-views-of-edo.jpg",
    thumbnail_url: "/images/artworks/thumb/revelers-returned-from-the-tori-no-machi-festival-at-asakusa-from-the-series-one-hundred-famous-views-of-edo.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36539",
    attribution: ATTRIBUTION,
    description: "The famous Sensō-ji temple at Asakusa, rendered in Hiroshige's distinctive style with meticulous architectural detail and a lively street scene in the foreground.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "The Tanabata Festival, from the series One Hundred Famous Views of Edo",
    title_jp: '',
    series: "One Hundred Famous Views of Edo",
    year: 1857,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/the-tanabata-festival-from-the-series-one-hundred-famous-views-of-edo.jpg",
    thumbnail_url: "/images/artworks/thumb/the-tanabata-festival-from-the-series-one-hundred-famous-views-of-edo.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36541",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "“Minowa, Kanasugi at Mikawashima,” from the series One Hundred Famous Views of Edo (Meisho Edo hyakkei, Minowa Kanasugi, Mikawashima)",
    title_jp: '',
    series: "One Hundred Famous Views of Edo",
    year: 1857,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/minowa-kanasugi-at-mikawashima-from-the-series-one-hundred-famous-views-of-edo-meisho-edo-hyakkei-minowa-kanasugi-mikawashima.jpg",
    thumbnail_url: "/images/artworks/thumb/minowa-kanasugi-at-mikawashima-from-the-series-one-hundred-famous-views-of-edo-meisho-edo-hyakkei-minowa-kanasugi-mikawashima.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36542",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "Toto, Ryogoku, from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei)",
    title_jp: '',
    series: "Thirty-six Views of Mount Fuji",
    year: 1858,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/toto-ryogoku-from-the-series-thirty-six-views-of-mount-fuji-fugaku-sanj-rokkei.jpg",
    thumbnail_url: "/images/artworks/thumb/toto-ryogoku-from-the-series-thirty-six-views-of-mount-fuji-fugaku-sanj-rokkei.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36536",
    attribution: ATTRIBUTION,
    description: "Mount Fuji rises majestically in the distance as travelers make their way along the Tōkaidō road, in one of Hiroshige's most celebrated landscape compositions.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "View of Mount Fuji from Koshigaya, Province of Musashi (Musashi, Koshigaya Zai), from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei)",
    title_jp: '',
    series: "Thirty-six Views of Mount Fuji",
    year: 1858,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/view-of-mount-fuji-from-koshigaya-province-of-musashi-musashi-koshigaya-zai-from-the-series-thirty-six-views-of-mount-fuji-fugaku-sanj-rokkei.jpg",
    thumbnail_url: "/images/artworks/thumb/view-of-mount-fuji-from-koshigaya-province-of-musashi-musashi-koshigaya-zai-from-the-series-thirty-six-views-of-mount-fuji-fugaku-sanj-rokkei.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36537",
    attribution: ATTRIBUTION,
    description: "Mount Fuji rises majestically in the distance as travelers make their way along the Tōkaidō road, in one of Hiroshige's most celebrated landscape compositions.",
    is_featured: 0,
  },
  {
    title: "View of Mount Fuji from Seven-ri Beach, Province of Sagami (Sōshū: Shichi-ri ga hama), from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei)",
    title_jp: '',
    series: "Thirty-six Views of Mount Fuji",
    year: 1858,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/view-of-mount-fuji-from-seven-ri-beach-province-of-sagami-sosh-shichi-ri-ga-hama-from-the-series-thirty-six-views-of-mount-fuji-fugaku-sanj-rokkei.jpg",
    thumbnail_url: "/images/artworks/thumb/view-of-mount-fuji-from-seven-ri-beach-province-of-sagami-sosh-shichi-ri-ga-hama-from-the-series-thirty-six-views-of-mount-fuji-fugaku-sanj-rokkei.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36538",
    attribution: ATTRIBUTION,
    description: "Mount Fuji rises majestically in the distance as travelers make their way along the Tōkaidō road, in one of Hiroshige's most celebrated landscape compositions.",
    is_featured: 0,
  },
  {
    title: "The Kiso Mountains in Snow",
    title_jp: '',
    series: "The Sixty-nine Stations of the Kisokaidō",
    year: 1857,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/the-kiso-mountains-in-snow.jpg",
    thumbnail_url: "/images/artworks/thumb/the-kiso-mountains-in-snow.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36545",
    attribution: ATTRIBUTION,
    description: "A serene winter scene captured in Hiroshige's masterful composition, with falling snow creating a quiet, atmospheric landscape that exemplifies the beauty of ukiyo-e printmaking.",
    is_featured: 0,
  },
  {
    title: "The Autumn Moon at Ishiyama on Lake Biwa",
    title_jp: '',
    series: "Eight Views of Ōmi",
    year: 1835,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/the-autumn-moon-at-ishiyama-on-lake-biwa.jpg",
    thumbnail_url: "/images/artworks/thumb/the-autumn-moon-at-ishiyama-on-lake-biwa.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36527",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Seta no Sekisho. Sunset, Seta. Lake Biwa",
    title_jp: '',
    series: "Eight Views of Ōmi",
    year: 1835,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/seta-no-sekisho-sunset-seta-lake-biwa.jpg",
    thumbnail_url: "/images/artworks/thumb/seta-no-sekisho-sunset-seta-lake-biwa.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36528",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Clearing Weather at Awazu, Lake Biwa",
    title_jp: '',
    series: "Eight Views of Ōmi",
    year: 1835,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/clearing-weather-at-awazu-lake-biwa.jpg",
    thumbnail_url: "/images/artworks/thumb/clearing-weather-at-awazu-lake-biwa.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36529",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Geese Alighting at Katada, Lake Biwa",
    title_jp: '',
    series: "Eight Views of Ōmi",
    year: 1835,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/geese-alighting-at-katada-lake-biwa.jpg",
    thumbnail_url: "/images/artworks/thumb/geese-alighting-at-katada-lake-biwa.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36530",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Night Rain at Karasaki, from the series Eight Views of Ōmi (Ōmi hakkei no uchi)",
    title_jp: '',
    series: "Eight Views of Ōmi",
    year: 1835,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/night-rain-at-karasaki-from-the-series-eight-views-of-omi-omi-hakkei-no-uchi.jpg",
    thumbnail_url: "/images/artworks/thumb/night-rain-at-karasaki-from-the-series-eight-views-of-omi-omi-hakkei-no-uchi.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36531",
    attribution: ATTRIBUTION,
    description: "Hiroshige captures a sudden rain shower with bold diagonal lines and masterful use of negative space, transforming a transient weather moment into an enduring work of art.",
    is_featured: 0,
  },
  {
    title: "Station Thirty-Eight: Fujikawa, Scene at the Border, from the Fifty-Three Stations of the Tokaido",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1833,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/station-thirty-eight-fujikawa-scene-at-the-border-from-the-fifty-three-stations-of-the-tokaido.jpg",
    thumbnail_url: "/images/artworks/thumb/station-thirty-eight-fujikawa-scene-at-the-border-from-the-fifty-three-stations-of-the-tokaido.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/56906",
    attribution: ATTRIBUTION,
    description: "Mount Fuji rises majestically in the distance as travelers make their way along the Tōkaidō road, in one of Hiroshige's most celebrated landscape compositions.",
    is_featured: 0,
  },
  {
    title: "A Snowy Evening at Kanbara Station",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1833,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/a-snowy-evening-at-kanbara-station.jpg",
    thumbnail_url: "/images/artworks/thumb/a-snowy-evening-at-kanbara-station.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36937",
    attribution: ATTRIBUTION,
    description: "A serene winter scene captured in Hiroshige's masterful composition, with falling snow creating a quiet, atmospheric landscape that exemplifies the beauty of ukiyo-e printmaking.",
    is_featured: 0,
  },
  {
    title: "Evening Snow at Kanbara, from the series \"Fifty-three Stations of the Tōkaidō\"",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1833,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/evening-snow-at-kanbara-from-the-series-fifty-three-stations-of-the-tokaido.jpg",
    thumbnail_url: "/images/artworks/thumb/evening-snow-at-kanbara-from-the-series-fifty-three-stations-of-the-tokaido.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/56915",
    attribution: ATTRIBUTION,
    description: "A serene winter scene captured in Hiroshige's masterful composition, with falling snow creating a quiet, atmospheric landscape that exemplifies the beauty of ukiyo-e printmaking.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "Morning Mist at Mishima",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1833,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/morning-mist-at-mishima.jpg",
    thumbnail_url: "/images/artworks/thumb/morning-mist-at-mishima.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36520",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Spring Rain at Tsuchiyama, from the series Fifty-three Stations of the Tōkaidō",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1834,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/spring-rain-at-tsuchiyama-from-the-series-fifty-three-stations-of-the-tokaido.jpg",
    thumbnail_url: "/images/artworks/thumb/spring-rain-at-tsuchiyama-from-the-series-fifty-three-stations-of-the-tokaido.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36971",
    attribution: ATTRIBUTION,
    description: "Hiroshige captures a sudden rain shower with bold diagonal lines and masterful use of negative space, transforming a transient weather moment into an enduring work of art.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "Sudden Shower at Shōno, from the series Fifty-three Stations of the Tōkaidō",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1834,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/sudden-shower-at-shono-from-the-series-fifty-three-stations-of-the-tokaido.jpg",
    thumbnail_url: "/images/artworks/thumb/sudden-shower-at-shono-from-the-series-fifty-three-stations-of-the-tokaido.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36521",
    attribution: ATTRIBUTION,
    description: "Hiroshige captures a sudden rain shower with bold diagonal lines and masterful use of negative space, transforming a transient weather moment into an enduring work of art.",
    is_featured: 1,
  }, // FEATURED
  {
    title: "Shinagawa Station",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/shinagawa-station.jpg",
    thumbnail_url: "/images/artworks/thumb/shinagawa-station.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36546",
    attribution: ATTRIBUTION,
    description: "A view of a post station along the Tōkaidō road, where travelers rest and resupply. The composition captures the rhythm of travel and the character of the station town.",
    is_featured: 0,
  },
  {
    title: "Kawasaki",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/kawasaki.jpg",
    thumbnail_url: "/images/artworks/thumb/kawasaki.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36547",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Kanagawa",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/kanagawa.jpg",
    thumbnail_url: "/images/artworks/thumb/kanagawa.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36548",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Hodogaya",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/hodogaya.jpg",
    thumbnail_url: "/images/artworks/thumb/hodogaya.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36549",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Totsuka",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/totsuka.jpg",
    thumbnail_url: "/images/artworks/thumb/totsuka.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36550",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Fujisawa",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/fujisawa.jpg",
    thumbnail_url: "/images/artworks/thumb/fujisawa.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36551",
    attribution: ATTRIBUTION,
    description: "Mount Fuji rises majestically in the distance as travelers make their way along the Tōkaidō road, in one of Hiroshige's most celebrated landscape compositions.",
    is_featured: 0,
  },
  {
    title: "Hiratsuka",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/hiratsuka.jpg",
    thumbnail_url: "/images/artworks/thumb/hiratsuka.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36552",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Ōiso",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/oiso.jpg",
    thumbnail_url: "/images/artworks/thumb/oiso.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36553",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Odawara",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/odawara.jpg",
    thumbnail_url: "/images/artworks/thumb/odawara.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36554",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Hakone",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/hakone.jpg",
    thumbnail_url: "/images/artworks/thumb/hakone.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36555",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Mishima, from the series Fifty-three Stations of the Tōkaidō Road (Tōkaidō gojūsan tsugi, Mishima), also known as the Kyōka (Witty Verse) Tōkaidō",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/mishima-from-the-series-fifty-three-stations-of-the-tokaido-road-tokaido-goj-san-tsugi-mishima-also-known-as-the-kyoka-witty-verse-tokaido.jpg",
    thumbnail_url: "/images/artworks/thumb/mishima-from-the-series-fifty-three-stations-of-the-tokaido-road-tokaido-goj-san-tsugi-mishima-also-known-as-the-kyoka-witty-verse-tokaido.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36556",
    attribution: ATTRIBUTION,
    description: "A view of a post station along the Tōkaidō road, where travelers rest and resupply. The composition captures the rhythm of travel and the character of the station town.",
    is_featured: 0,
  },
  {
    title: "Numazu",
    title_jp: '',
    series: "Fifty-Three Stations of the Tōkaidō",
    year: 1838,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/numazu.jpg",
    thumbnail_url: "/images/artworks/thumb/numazu.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36557",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Cherry Blossoms at Arashiyama, from the series Famous Places of Kyōto",
    title_jp: '',
    series: "Famous Places of Kyōto",
    year: 1834,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/cherry-blossoms-at-arashiyama-from-the-series-famous-places-of-kyoto.jpg",
    thumbnail_url: "/images/artworks/thumb/cherry-blossoms-at-arashiyama-from-the-series-famous-places-of-kyoto.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36515",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Yase no Sato",
    title_jp: '',
    series: "Famous Places of Kyōto",
    year: 1834,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/yase-no-sato.jpg",
    thumbnail_url: "/images/artworks/thumb/yase-no-sato.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36516",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
  {
    title: "Yodogawa",
    title_jp: '',
    series: "Famous Places of Kyōto",
    year: 1834,
    era: 'Edo period',
    wikimedia_url: "/images/artworks/full/yodogawa.jpg",
    thumbnail_url: "/images/artworks/thumb/yodogawa.jpg",
    source_url: "https://www.metmuseum.org/art/collection/search/36517",
    attribution: ATTRIBUTION,
    description: "A station along the Tōkaidō road, rendered in Hiroshige's distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.",
    is_featured: 0,
  },
]

function seed(): void {
  createTables()

  const count = db.prepare('SELECT COUNT(*) AS count FROM artworks').get() as {
    count: number
  }

  if (count.count > 0) {
    console.log(`\n  ✓ Database already seeded (${count.count} artworks), skipping.\n`)
    process.exit(0)
  }

  console.log('\n  🌸 Seeding Hiroshige portfolio database...\n')

  const insert = db.prepare(`
    INSERT INTO artworks (title, title_jp, series, year, era, wikimedia_url, thumbnail_url, source_url, attribution, description, is_featured)
    VALUES (@title, @title_jp, @series, @year, @era, @wikimedia_url, @thumbnail_url, @source_url, @attribution, @description, @is_featured)
  `)

  const featured = artworks.filter(a => a.is_featured === 1)
  const nonFeatured = artworks.filter(a => a.is_featured === 0)

  const insertAll = db.transaction(() => {
    console.log(`  ── Featured (homepage heroes) (${featured.length} artworks)`)
    for (const artwork of featured) {
      insert.run(artwork)
    }
    console.log(`     ✓ ${featured.length} inserted\n`)

    console.log(`  ── Gallery (${nonFeatured.length} artworks)`)
    for (const artwork of nonFeatured) {
      insert.run(artwork)
    }
    console.log(`     ✓ ${nonFeatured.length} inserted\n`)
  })

  insertAll()

  const totalResult = db.prepare('SELECT COUNT(*) AS count FROM artworks').get() as {
    count: number
  }
  const featuredResult = db.prepare(
    'SELECT COUNT(*) AS count FROM artworks WHERE is_featured = 1'
  ).get() as { count: number }
  const missingUrlResult = db.prepare(
    "SELECT COUNT(*) AS count FROM artworks WHERE wikimedia_url IS NULL OR wikimedia_url = ''"
  ).get() as { count: number }
  const seriesResult = db.prepare(
    'SELECT series, COUNT(*) AS count FROM artworks GROUP BY series ORDER BY count DESC'
  ).all() as { series: string; count: number }[]

  const total = totalResult.count
  const featuredCount = featuredResult.count
  const missingUrl = missingUrlResult.count

  console.log('  ┌─────────────────────────────────────────────┐')
  console.log('  │           Seed Summary                      │')
  console.log('  ├─────────────────────────────────────────────┤')
  console.log(`  │  Total artworks:        ${String(total).padStart(3)}                │`)
  console.log(`  │  Featured (homepage):   ${String(featuredCount).padStart(3)}                │`)
  console.log(`  │  Missing URL:           ${String(missingUrl).padStart(3)}                │`)
  console.log('  ├─────────────────────────────────────────────┤')
  console.log('  │  Series breakdown:                         │')

  for (const s of seriesResult) {
    const name = s.series.padEnd(42)
    console.log(`  │    ${name} ${String(s.count).padStart(2)}          │`)
  }

  console.log('  └─────────────────────────────────────────────┘')

  const errors: string[] = []

  if (total < 30) {
    errors.push(`Expected ≥ 30 artworks, got ${total}`)
  }

  if (featuredCount !== 10) {
    errors.push(`Expected exactly 10 featured artworks, got ${featuredCount}`)
  }

  if (missingUrl !== 0) {
    errors.push('Expected 0 artworks missing URLs, got ${missingUrl}')
  }

  if (errors.length > 0) {
    console.error('\n  ✗ Validation errors:')
    for (const err of errors) {
      console.error(`    • ${err}`)
    }
    process.exit(1)
  }

  console.log('\n  ✓ All validations passed. Database seeded successfully.\n')
}

seed()
