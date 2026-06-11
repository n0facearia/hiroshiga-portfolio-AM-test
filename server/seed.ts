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
  description: string
  is_featured: number
}

// ═════════════════════════════════════════════════════════════════════
// FEATURED (is_featured = 1) — 10 artworks for the homepage hero
// ═════════════════════════════════════════════════════════════════════

const featuredArtworks: ArtworkSeed[] = [
  {
    title: 'Sudden Shower over Shin-Ōhashi Bridge and Atake',
    title_jp: '大はしあたけの夕立',
    series: 'One Hundred Famous Views of Edo',
    year: 1857,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/b/b9/Hiroshige%2C_Sudden_Shower_over_Shin-Ohashi_Bridge_and_Atake_%28Ohashi_atake_no_yudachi%29%2C_from_the_series_One_Hundred_Famous_Views_of_Edo_%28Meisho_Edo_hyakkei%29%2C_1857%2C_%281302414%29.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/b/b9/Hiroshige%2C_Sudden_Shower_over_Shin-Ohashi_Bridge_and_Atake_%28Ohashi_atake_no_yudachi%29%2C_from_the_series_One_Hundred_Famous_Views_of_Edo_%28Meisho_Edo_hyakkei%29%2C_1857%2C_%281302414%29.jpg',
    description:
      'One of Hiroshige\'s most iconic prints, capturing a sudden rainstorm sweeping across the Ōhashi bridge with dramatic diagonal lines. The composition deeply influenced Vincent van Gogh, who painted an oil copy of this scene in 1887.',
    is_featured: 1,
  },
  {
    title: 'Plum Park in Kameido',
    title_jp: '亀戸梅屋舗',
    series: 'One Hundred Famous Views of Edo',
    year: 1857,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/d/d4/Hiroshige%2C_Plum_Park_in_Kameido_%28Kameido_Umeyashiki%29%2C_from_the_series_One_Hundred_Famous_Views_of_Edo_%28Meisho_Edo_hyakkei%29%2C_1857.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/d/d4/Hiroshige%2C_Plum_Park_in_Kameido_%28Kameido_Umeyashiki%29%2C_from_the_series_One_Hundred_Famous_Views_of_Edo_%28Meisho_Edo_hyakkei%29%2C_1857.jpg',
    description:
      'A close-up view of a plum tree in full bloom at Kameido Shrine, framed by the branches in an innovative composition that breaks from traditional landscape perspective. Van Gogh painted his own version of this print in 1887.',
    is_featured: 1,
  },
  {
    title: 'Night Snow at Kambara',
    title_jp: '蒲原夜之雪',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hiroshige%2C_Night_Snow_at_Kambara.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hiroshige%2C_Night_Snow_at_Kambara.jpg',
    description:
      'A serene night scene of a village under heavy snowfall, with three travelers hunched against the cold. The quiet, muffled atmosphere is masterfully conveyed through subtle gradations of grey ink on paper. One of the most celebrated prints in the entire series.',
    is_featured: 1,
  },
  {
    title: 'Naruto Whirlpool in Awa Province',
    title_jp: '阿波鳴門の渦潮',
    series: 'Famous Views of the Sixty-odd Provinces',
    year: 1853,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/7/75/Hiroshige%2C_Naruto_Whirlpool_in_Awa_Province.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/7/75/Hiroshige%2C_Naruto_Whirlpool_in_Awa_Province.jpg',
    description:
      'A dramatic depiction of the massive whirlpools in the Naruto Strait between Shikoku and Awaji Island. The swirling waters are rendered with bold, rhythmic lines and a daring aerial perspective that captures the raw power of the ocean.',
    is_featured: 1,
  },
  {
    title: 'Fireworks at Ryōgoku',
    title_jp: '両国花火',
    series: 'One Hundred Famous Views of Edo',
    year: 1858,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/6/64/Hiroshige%2C_Fireworks_at_Ryogoku.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/6/64/Hiroshige%2C_Fireworks_at_Ryogoku.jpg',
    description:
      'A vibrant night scene of fireworks exploding over the Sumida River at Ryōgoku bridge. The dark sky is illuminated by bursts of color, with the bridge and pleasure boats filled with spectators below. A masterpiece of night-time printing technique.',
    is_featured: 1,
  },
  {
    title: 'Kinryūzan Temple at Asakusa',
    title_jp: '浅草金龍山',
    series: 'One Hundred Famous Views of Edo',
    year: 1856,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/2/2a/Hiroshige%2C_Asakusa_Kinryusan.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/2/2a/Hiroshige%2C_Asakusa_Kinryusan.jpg',
    description:
      'The famous Sensō-ji temple at Asakusa, depicted with a dramatic snow-covered roof, the iconic Kaminarimon gate, and five-story pagoda. The composition emphasizes the temple\'s grandeur against the winter sky, with tiny visitors below for scale.',
    is_featured: 1,
  },
  {
    title: 'Spiral Hall at Five Hundred Rakan Temple',
    title_jp: '五百羅漢の螺旋堂',
    series: 'One Hundred Famous Views of Edo',
    year: 1857,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/1/11/Hiroshige%2C_Spiral_Hall_at_Five_Hundred_Rakan_Temple.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/1/11/Hiroshige%2C_Spiral_Hall_at_Five_Hundred_Rakan_Temple.jpg',
    description:
      'An architectural view of the unusual spiral hall at the Five Hundred Arhats temple (Gohyaku Rakan-ji), with its distinctive octagonal roof and devoted visitors in the courtyard below. The perspective draws the eye upward in a spiraling motion that mirrors the building itself.',
    is_featured: 1,
  },
  {
    title: 'Tsukudajima in Musashi Province',
    title_jp: '武蔵佃島',
    series: 'One Hundred Famous Views of Edo',
    year: 1857,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/5/50/Hiroshige%2C_Tsukudajima_in_Musashi_Province.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/5/50/Hiroshige%2C_Tsukudajima_in_Musashi_Province.jpg',
    description:
      'A view of Tsukudajima island from across Edo Bay, with traditional fishing boats silhouetted against the water and a distant coastline. The composition captures the quiet rhythm of coastal life using bold horizontal bands of color.',
    is_featured: 1,
  },
  {
    title: 'Moon Pine at Ueno',
    title_jp: '上野の月の松',
    series: 'One Hundred Famous Views of Edo',
    year: 1857,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/c/c9/Hiroshige%2C_Moon_Pine_at_Ueno.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/c/c9/Hiroshige%2C_Moon_Pine_at_Ueno.jpg',
    description:
      'A moonlight scene featuring the famous "moon pine" tree at Ueno, with a full moon illuminating the landscape. The pine\'s twisted, windswept branches create an elegant silhouette against the night sky.',
    is_featured: 1,
  },
  {
    title: 'Kyu-Togekura Pass in Kiso District',
    title_jp: '木曽路の九十九折',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1855,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/e/e7/Hiroshige%2C_Kyu-Togekura_Pass_in_Kiso_District.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/e/e7/Hiroshige%2C_Kyu-Togekura_Pass_in_Kiso_District.jpg',
    description:
      'A winding mountain pass through dense forest, with travelers making their way along the treacherous path. The vertical composition emphasizes the steep terrain of the Kiso Valley.',
    is_featured: 1,
  },
]

// ═════════════════════════════════════════════════════════════════════
// FIFTY-THREE STATIONS OF THE TŌKAIDŌ (non-featured, 12 works)
// ═════════════════════════════════════════════════════════════════════

const tokaidoArtworks: ArtworkSeed[] = [
  {
    title: 'Nihonbashi: Morning View',
    title_jp: '日本橋朝之景',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Hiroshige%2C_Nihonbashi_Morning_view.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/6/62/Hiroshige%2C_Nihonbashi_Morning_view.jpg',
    description:
      'The starting point of the Tōkaidō road — Nihonbashi bridge in Edo at dawn. Fishermen and merchants begin their day as Mount Fuji appears faintly on the horizon. The bridge\'s arched wooden structure anchors the composition.',
    is_featured: 0,
  },
  {
    title: 'Hodogaya: View of the Distant Mountain',
    title_jp: '程ヶ谷之図',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/a/a7/Hiroshige%2C_Hodogaya.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/a/a7/Hiroshige%2C_Hodogaya.jpg',
    description:
      'Travellers passing through Hodogaya with a distant view of Mount Fuji. The station was known for its tea houses and scenic location along the coast.',
    is_featured: 0,
  },
  {
    title: 'Fujisawa: Yugyō-ji Temple',
    title_jp: '藤沢遊行寺',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/9/96/Hiroshige%2C_Fujisawa.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Hiroshige%2C_Fujisawa.jpg',
    description:
      'A view of the large Yugyō-ji temple at Fujisawa, with travellers resting beneath pine trees in the foreground. The temple\'s sweeping roof dominates the middle ground.',
    is_featured: 0,
  },
  {
    title: 'Odawara: The Sakawa River',
    title_jp: '小田原酒匂川',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/d/dd/Hiroshige%2C_Odawara.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/d/dd/Hiroshige%2C_Odawara.jpg',
    description:
      'Crossing the Sakawa River at Odawara, with the castle town visible in the distance. Porters carry travellers across the shallow river on a palanquin, a common sight on the Tōkaidō road.',
    is_featured: 0,
  },
  {
    title: 'Hara: Mount Fuji at Dawn',
    title_jp: '原之朝富士',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/e/eb/Hiroshige%2C_Hara.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/e/eb/Hiroshige%2C_Hara.jpg',
    description:
      'A breathtaking dawn view of Mount Fuji from Hara station, with travellers on the road below and pine trees framing the composition. The clear morning light reveals the mountain in all its majesty.',
    is_featured: 0,
  },
  {
    title: 'Yoshida: The Bridge over the Toyokawa River',
    title_jp: '吉田豊川橋',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Hiroshige%2C_Yoshida.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/6/62/Hiroshige%2C_Yoshida.jpg',
    description:
      'A long wooden bridge crossing the Toyokawa River at Yoshida, with travellers and porters making their way across. The castle of Yoshida is visible on the far bank.',
    is_featured: 0,
  },
  {
    title: 'Mariko: A Famous Tea House',
    title_jp: '鞠子名物茶屋',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/f/f6/Hiroshige%2C_Mariko.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/f/f6/Hiroshige%2C_Mariko.jpg',
    description:
      'Mariko was famous for its tororo-jiru (grated yam soup), a specialty served at roadside tea houses. In this print, a woman prepares the dish while travellers rest and enjoy the meal.',
    is_featured: 0,
  },
  {
    title: 'Kanaya: The Ōi River',
    title_jp: '金谷大井川',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/6/6f/Hiroshige%2C_Kanaya.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/Hiroshige%2C_Kanaya.jpg',
    description:
      'The Ōi River at Kanaya was one of the most dangerous crossings on the Tōkaidō. Porters carry travellers and palanquins across the wide, shallow river since bridges were prohibited to maintain defensive barriers.',
    is_featured: 0,
  },
  {
    title: 'Akasaka: The Night Lodging',
    title_jp: '赤坂夜泊',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/6/6f/Hiroshige%2C_Akasaka.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/Hiroshige%2C_Akasaka.jpg',
    description:
      'A night scene at an inn in Akasaka, with travellers relaxing after a long day on the road. The warm glow of lanterns contrasts with the cool night air, creating an intimate atmosphere.',
    is_featured: 0,
  },
  {
    title: 'Yokkaichi: The Harbor',
    title_jp: '四日市港',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/1/10/Hiroshige%2C_Yokkaichi.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/1/10/Hiroshige%2C_Yokkaichi.jpg',
    description:
      'A view of the busy harbor at Yokkaichi, with cargo ships and fishing boats moored along the waterfront. The composition emphasizes the commercial importance of this port town on the Tōkaidō.',
    is_featured: 0,
  },
  {
    title: 'Minakuchi: The Post Town',
    title_jp: '水口宿',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/c/c3/Hiroshige%2C_Minakuchi.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/c/c3/Hiroshige%2C_Minakuchi.jpg',
    description:
      'A peaceful view of the post town at Minakuchi, with travellers arriving at the station. The orderly rows of houses and the distant mountains create a sense of calm order after a journey.',
    is_featured: 0,
  },
  {
    title: 'Kyōto: The Great Bridge',
    title_jp: '京大橋',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/e/e5/Hiroshige%2C_Kyoto.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/e/e5/Hiroshige%2C_Kyoto.jpg',
    description:
      'The final station of the Tōkaidō — arriving in Kyoto at the Sanjō Ōhashi bridge. The bustling city streets mark the end of the long journey from Edo, with Mount Hiei visible in the distance.',
    is_featured: 0,
  },
  {
    title: 'Mishima: Morning Mist',
    title_jp: '三島朝霧',
    series: 'Fifty-Three Stations of the Tōkaidō',
    year: 1833,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/6/66/Hiroshige%2C_Mishima.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/6/66/Hiroshige%2C_Mishima.jpg',
    description:
      'A misty morning at Mishima station, with travellers passing the famous Mishima shrine gate. The atmospheric fog softens the landscape, creating a dreamlike quality that characterizes Hiroshige\'s best work.',
    is_featured: 0,
  },
]

// ═════════════════════════════════════════════════════════════════════
// ONE HUNDRED FAMOUS VIEWS OF EDO (non-featured, 8 works)
// ═════════════════════════════════════════════════════════════════════

const edoArtworks: ArtworkSeed[] = [
  {
    title: 'Mannen Bridge at Fukagawa',
    title_jp: '深川万年橋',
    series: 'One Hundred Famous Views of Edo',
    year: 1856,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/b/ba/Hiroshige%2C_Mannen_Bridge_at_Fukagawa.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/b/ba/Hiroshige%2C_Mannen_Bridge_at_Fukagawa.jpg',
    description:
      'A view of the Mannen Bridge at Fukagawa, with Mount Fuji appearing through the bridge\'s arch in the distance. The composition cleverly uses the bridge as a framing device, drawing the eye toward the distant mountain.',
    is_featured: 0,
  },
  {
    title: 'Evening View of Saruwaka Street',
    title_jp: '猿若町夜景',
    series: 'One Hundred Famous Views of Edo',
    year: 1856,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/7/70/Hiroshige%2C_Saruwaka_Street.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/7/70/Hiroshige%2C_Saruwaka_Street.jpg',
    description:
      'The theater district of Edo comes alive at night on Saruwaka Street. Lanterns illuminate the façades of kabuki theaters while patrons arrive for evening performances. The moon rises above the bustling street.',
    is_featured: 0,
  },
  {
    title: 'Suijin Shrine and Massaki on the Sumida River',
    title_jp: '隅田川水神の森真崎',
    series: 'One Hundred Famous Views of Edo',
    year: 1856,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/b/bb/Hiroshige%2C_Suijin_Shrine.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/b/bb/Hiroshige%2C_Suijin_Shrine.jpg',
    description:
      'A serene view of the Suijin shrine grove on the banks of the Sumida River, with Massaki promontory extending into the water. Cherry blossoms bloom along the riverbank while boats drift by.',
    is_featured: 0,
  },
  {
    title: 'Cherry Blossoms at Nakano',
    title_jp: '中野の桜',
    series: 'One Hundred Famous Views of Edo',
    year: 1857,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/f/fb/Hiroshige%2C_Nakano_Cherry_Blossoms.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/f/fb/Hiroshige%2C_Nakano_Cherry_Blossoms.jpg',
    description:
      'A spectacular display of cherry blossoms in full bloom at Nakano, with picnickers enjoying hanami beneath the flowering trees. The cloud-like blossoms fill the upper half of the composition.',
    is_featured: 0,
  },
  {
    title: 'Hiratsuka: Distant View of Mount Fuji',
    title_jp: '平塚遠景富士',
    series: 'One Hundred Famous Views of Edo',
    year: 1857,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/5/5e/Hiroshige%2C_Hiratsuka.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/5/5e/Hiroshige%2C_Hiratsuka.jpg',
    description:
      'A panoramic view from Hiratsuka with Mount Fuji dominating the horizon. Fishermen work along the shore while travellers rest at a seaside tea house, taking in the magnificent view.',
    is_featured: 0,
  },
  {
    title: 'View of the Sumida River from Surugadai',
    title_jp: '駿河台より隅田川を望む',
    series: 'One Hundred Famous Views of Edo',
    year: 1856,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/1/18/Hiroshige%2C_Surugadai.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/1/18/Hiroshige%2C_Surugadai.jpg',
    description:
      'A sweeping panoramic view of the Sumida River from the Surugadai heights. The river snakes through the cityscape with Mount Tsukuba faintly visible on the distant horizon beyond the sprawling rooftops of Edo.',
    is_featured: 0,
  },
  {
    title: 'Asakusa Rice Fields',
    title_jp: '浅草田圃',
    series: 'One Hundred Famous Views of Edo',
    year: 1856,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/2/29/Hiroshige%2C_Asakusa_Rice_Fields.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/2/29/Hiroshige%2C_Asakusa_Rice_Fields.jpg',
    description:
      'A view of the rice fields near Asakusa, with the distinctive pagoda of Sensō-ji temple rising above the rural landscape. Urban development presses against the edges of the agricultural land.',
    is_featured: 0,
  },

]

// ═════════════════════════════════════════════════════════════════════
// FAMOUS VIEWS OF THE SIXTY-ODD PROVINCES (non-featured, 4 works)
// ═════════════════════════════════════════════════════════════════════

const provincesArtworks: ArtworkSeed[] = [
  {
    title: 'Sarushima: The Island Temple in Sagami Province',
    title_jp: '相模猿島',
    series: 'Famous Views of the Sixty-odd Provinces',
    year: 1853,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/1/16/Hiroshige%2C_Sagami_Sarushima.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/1/16/Hiroshige%2C_Sagami_Sarushima.jpg',
    description:
      'A view of the small island of Sarushima in Sagami Province, with a temple nestled among the trees. Boats approach the island\'s shore while Mount Fuji rises in the distance.',
    is_featured: 0,
  },
  {
    title: 'Mount Fuji from Ikeda in Izumi Province',
    title_jp: '和泉池田富士',
    series: 'Famous Views of the Sixty-odd Provinces',
    year: 1853,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/2/28/Hiroshige%2C_Izumi_Ikeda.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/2/28/Hiroshige%2C_Izumi_Ikeda.jpg',
    description:
      'A dramatic view of Mount Fuji seen from Ikeda in Izumi Province (modern Osaka prefecture), proving Fuji\'s visibility from surprising distances. Pine trees frame the composition in the foreground.',
    is_featured: 0,
  },
  {
    title: 'Kagoshima: Sakurajima in Satsuma Province',
    title_jp: '薩摩鹿児島桜島',
    series: 'Famous Views of the Sixty-odd Provinces',
    year: 1853,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/e/ef/Hiroshige%2C_Satsuma_Kagoshima.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/e/ef/Hiroshige%2C_Satsuma_Kagoshima.jpg',
    description:
      'A view of the active volcano Sakurajima looming over Kagoshima Bay in southern Kyushu. The volcanic cone emits a plume of smoke, framed by the city\'s rooftops and shoreline.',
    is_featured: 0,
  },
  {
    title: 'Abura Kannon in Nagato Province',
    title_jp: '長門油観音',
    series: 'Famous Views of the Sixty-odd Provinces',
    year: 1853,
    era: 'Edo period',
    wikimedia_url:
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Hiroshige%2C_Nagato_Abura_Kannon.jpg',
    thumbnail_url:
    'https://upload.wikimedia.org/wikipedia/commons/1/15/Hiroshige%2C_Nagato_Abura_Kannon.jpg',
    description:
      'A seaside cave temple at Abura Kannon in Nagato Province, where a Buddhist statue is enshrined in the cliff face. Waves crash against the rocks as pilgrims approach by boat.',
    is_featured: 0,
  },
]

// ═════════════════════════════════════════════════════════════════════
// Seed function
// ═════════════════════════════════════════════════════════════════════

function seed(): void {
  // Ensure tables exist before inserting
  createTables()

  // Idempotent guard — skip if data already exists
  const count = db.prepare('SELECT COUNT(*) AS count FROM artworks').get() as {
    count: number
  }

  if (count.count > 0) {
    console.log(`\n  ✓ Database already seeded (${count.count} artworks), skipping.\n`)
    process.exit(0)
  }

  console.log('\n  🌸 Seeding Hiroshige portfolio database...\n')

  const insert = db.prepare(`
    INSERT INTO artworks (title, title_jp, series, year, era, wikimedia_url, thumbnail_url, description, is_featured)
    VALUES (@title, @title_jp, @series, @year, @era, @wikimedia_url, @thumbnail_url, @description, @is_featured)
  `)

  // Group artworks by series for per-group insertion logging
  const seriesGroups: { name: string; artworks: ArtworkSeed[] }[] = [
    {
      name: 'Featured (homepage heroes)',
      artworks: featuredArtworks,
    },
    {
      name: 'Fifty-Three Stations of the Tōkaidō',
      artworks: tokaidoArtworks,
    },
    {
      name: 'One Hundred Famous Views of Edo',
      artworks: edoArtworks,
    },
    {
      name: 'Famous Views of the Sixty-odd Provinces',
      artworks: provincesArtworks,
    },
  ]

  // Insert each series group in a transaction, logging progress
  const insertAll = db.transaction(() => {
    for (const group of seriesGroups) {
      console.log(`  ── ${group.name} (${group.artworks.length} artworks)`)

      for (const artwork of group.artworks) {
        insert.run(artwork)
      }

      console.log(`     ✓ ${group.artworks.length} inserted`)
      console.log('')
    }
  })

  insertAll()

  // ─── Validation ──────────────────────────────────────────────────

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
  const featured = featuredResult.count
  const missingUrl = missingUrlResult.count

  console.log('  ┌─────────────────────────────────────────────┐')
  console.log('  │           Seed Summary                      │')
  console.log('  ├─────────────────────────────────────────────┤')
  console.log(`  │  Total artworks:        ${String(total).padStart(3)}                │`)
  console.log(`  │  Featured (homepage):   ${String(featured).padStart(3)}                │`)
  console.log(`  │  Missing URL:           ${String(missingUrl).padStart(3)}                │`)
  console.log('  ├─────────────────────────────────────────────┤')
  console.log('  │  Series breakdown:                         │')

  for (const s of seriesResult) {
    const name = s.series.padEnd(42)
    console.log(`  │    ${name} ${String(s.count).padStart(2)}          │`)
  }

  console.log('  └─────────────────────────────────────────────┘')

  // Assertions
  const errors: string[] = []

  if (total < 30) {
    errors.push(`Expected ≥ 30 artworks, got ${total}`)
  }

  if (featured !== 10) {
    errors.push(`Expected exactly 10 featured artworks, got ${featured}`)
  }

  if (missingUrl !== 0) {
    errors.push(`Expected 0 artworks missing URLs, got ${missingUrl}`)
  }

  if (!seriesResult.find((s) => s.series === 'Fifty-Three Stations of the Tōkaidō')) {
    errors.push('Missing series: Fifty-Three Stations of the Tōkaidō')
  }

  if (!seriesResult.find((s) => s.series === 'One Hundred Famous Views of Edo')) {
    errors.push('Missing series: One Hundred Famous Views of Edo')
  }

  if (!seriesResult.find((s) => s.series === 'Famous Views of the Sixty-odd Provinces')) {
    errors.push('Missing series: Famous Views of the Sixty-odd Provinces')
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
