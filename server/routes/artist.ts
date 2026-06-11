import { Router } from 'express'

const ARTIST_INFO = {
  name: 'Utagawa Hiroshige',
  bio: 'Utagawa Hiroshige (1797–1858) was one of the last great masters of ukiyo-e, the art of Japanese woodblock printing. He is best known for his landscape series The Fifty-Three Stations of the Tōkaidō (1833–1834) and One Hundred Famous Views of Edo (1856–1858). His work is characterized by subtle use of color, poetic atmosphere, and innovative compositions that captured the transient beauty of nature and everyday life in Edo-period Japan. Hiroshige\'s influence extended far beyond Japan, inspiring European Impressionists such as Van Gogh, Monet, and Whistler.',
  birth_year: 1797,
  death_year: 1858,
  timeline: [
    { year: 1797, event: 'Born as Andō Tokutarō in Edo (modern-day Tokyo)' },
    { year: 1811, event: 'Begins studying ukiyo-e under Utagawa Toyohiro' },
    { year: 1831, event: 'Publishes first major landscape series, Famous Views of the Eastern Capital' },
    { year: 1833, event: 'Begins The Fifty-Three Stations of the Tōkaidō — his most famous series' },
    { year: 1840, event: 'Teaches and produces various series, including illustrations for books' },
    { year: 1856, event: 'Begins One Hundred Famous Views of Edo, his final masterpiece' },
    { year: 1858, event: 'Dies at age 61 during the Edo cholera epidemic' },
  ],
}

const router = Router()

router.get('/', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=3600')
  res.json(ARTIST_INFO)
})

export default router
