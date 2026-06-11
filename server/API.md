# Hiroshige Portfolio — API Reference

> Express server at `http://localhost:3001/api`
> Frontend connects directly (not proxied through Next.js). CORS is configured for `http://localhost:3000`.

---

## Endpoints

### `GET /api/artworks`

Returns the full collection of artworks. Supports two optional query parameters for filtering.

**Query Parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `featured` | `"true"` | — | When `?featured=true`, returns only the 10 homepage featured artworks |
| `series` | `"Edo"` \| `"Tōkaidō"` \| `"Other"` | — | Filter by series short code |

**Response Shape**

```typescript
interface Artwork {
  id: number
  title: string
  title_jp?: string
  series: 'Edo' | 'Tōkaidō' | 'Other'
  series_number: number   // always 0 in current data
  year: number
  description: string
  wikimedia_url: string   // full-resolution URL
  wikimedia_thumb?: string  // 400px thumbnail URL
  tags: string             // always '' in current data
  is_featured: boolean
  display_order: number
}

// Response body
{ artworks: Artwork[] }
```

**Examples**

```bash
# All artworks
curl http://localhost:3001/api/artworks

# Featured only
curl http://localhost:3001/api/artworks?featured=true

# Filter by series
curl http://localhost:3001/api/artworks?series=T%C5%8Dkaid%C5%8D
curl http://localhost:3001/api/artworks?series=Edo
```

**Error Response**

```json
{ "error": "Failed to fetch artworks" }
// Status: 500 — only occurs on database errors
```

**Cache-Control:** `public, max-age=3600`

> **Note on series filtering:** The database stores full series names (`"One Hundred Famous Views of Edo"`, `"Fifty-Three Stations of the Tōkaidō"`, `"Famous Views of the Sixty-odd Provinces"`). The API maps these to short codes (`"Edo"`, `"Tōkaidō"`, `"Other"`) for the frontend. The `?series=` filter accepts the short codes (case-insensitive, supports ASCII "tokaidō" without diacritics).

---

### `GET /api/artworks/:id`

Returns a single artwork by its database ID.

**Path Parameters**

| Param | Type | Description |
|---|---|---|
| `id` | `number` | The artwork's primary key (integer, autoincrement) |

**Response Shape**

Returns a single `Artwork` object (same shape as above, without the wrapping `{ artworks: [] }` envelope).

**Examples**

```bash
# Valid artwork
curl http://localhost:3001/api/artworks/1

# Response
{
  "id": 1,
  "title": "Sudden Shower over Shin-Ōhashi Bridge and Atake",
  "title_jp": "大はしあたけの夕立",
  "series": "Edo",
  "series_number": 0,
  "year": 1857,
  "description": "One of Hiroshige's most iconic prints...",
  "wikimedia_url": "https://upload.wikimedia.org/wikipedia/commons/b/b9/...",
  "wikimedia_thumb": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/...",
  "tags": "",
  "is_featured": true,
  "display_order": 1
}
```

**Error Responses**

```json
// 400 — Non-integer ID
{ "error": "Invalid artwork ID" }

// 404 — Artwork not found
{ "error": "Artwork not found" }

// 500 — Database error
{ "error": "Failed to fetch artwork" }
```

**Cache-Control:** `public, max-age=3600`

---

### `GET /api/artist`

Returns static biographical information about Utagawa Hiroshige. No database queries — data is a hardcoded object in `server/routes/artist.ts`.

**Response Shape**

```typescript
interface ArtistInfo {
  name: string
  bio: string
  birth_year: number
  death_year: number
  timeline: Array<{
    year: number
    event: string
  }>
}
```

**Example**

```bash
curl http://localhost:3001/api/artist
```

```json
{
  "name": "Utagawa Hiroshige",
  "bio": "Utagawa Hiroshige (1797–1858) was one of the last great masters of ukiyo-e...",
  "birth_year": 1797,
  "death_year": 1858,
  "timeline": [
    { "year": 1797, "event": "Born as Andō Tokutarō in Edo (modern-day Tokyo)" },
    { "year": 1811, "event": "Begins studying ukiyo-e under Utagawa Toyohiro" },
    { "year": 1831, "event": "Publishes first major landscape series..." },
    { "year": 1833, "event": "Begins The Fifty-Three Stations of the Tōkaidō..." },
    { "year": 1856, "event": "Begins One Hundred Famous Views of Edo..." },
    { "year": 1858, "event": "Dies at age 61 during the Edo cholera epidemic" }
  ]
}
```

**Error Response:** This endpoint has no error path — it always returns 200.

**Cache-Control:** `public, max-age=3600`

---

### `POST /api/contact`

Submits a contact form message. Validates all three fields server-side before inserting into the database.

**Request Body**

```typescript
interface ContactPayload {
  name: string
  email: string
  message: string
}
```

All three fields are required. The email must pass a basic regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Empty or whitespace-only strings are rejected.

**Success Response**

```json
// Status: 200
{ "success": true }
```

**Error Responses**

```json
// 400 — Validation failure (one or more fields invalid)
{
  "success": false,
  "error": "Name is required; A valid email address is required; Message is required"
}

// 500 — Database write failure
{
  "success": false,
  "error": "Failed to save message"
}
```

**Examples**

```bash
# Valid submission
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Art Lover","email":"fan@example.com","message":"Beautiful collection!"}'

# Missing name
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"fan@example.com","message":"Hello"}'
# → 400: "Name is required"

# Invalid email
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"not-an-email","message":"Hello"}'
# → 400: "A valid email address is required"
```

**No rate limiting:** Currently not implemented — the endpoint accepts unlimited requests. Add `express-rate-limit` if deploying publicly.

---

## Error Response Format

All error responses in the API follow this convention:

```json
{ "error": "Human-readable error message" }
```

The contact endpoint uses a different envelope for validation errors:

```json
{ "success": false, "error": "Semicolon-separated error list" }
```

**Never** do error responses include stack traces or internal error details.

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request — invalid parameters (non-integer ID, missing fields, invalid email) |
| 404 | Resource not found |
| 500 | Internal server error — database failure |

## Data Type Mappings

The API layer transforms database rows before sending responses:

| Database Column | API Field | Transformation |
|---|---|---|
| `series` (full name) | `series` (short code) | `"One Hundred Famous Views of Edo"` → `"Edo"`, `"Fifty-Three Stations of the Tōkaidō"` → `"Tōkaidō"`, all others → `"Other"` |
| `is_featured` (INTEGER 0/1) | `is_featured` (boolean) | `1` → `true`, `0` → `false` |
| `thumbnail_url` | `wikimedia_thumb` | Renamed field (same value) |
| `title_jp` (nullable) | `title_jp` (optional) | `null` → `undefined` |
| `year` (nullable INTEGER) | `year` (number) | `null` → `0` |
| `description` (nullable TEXT) | `description` (string) | `null` → `''` |
| `id` | `display_order` | `is_featured === 1` → same as `id`, else `99` |
| `tags` | `tags` | Always `''` (not stored in DB) |
| `series_number` | `series_number` | Always `0` (not stored in DB) |

## Caching

All GET endpoints include `Cache-Control: public, max-age=3600` (1 hour). The POST endpoint has no cache header.

SQLite runs with WAL (Write-Ahead Logging) mode enabled for concurrent read performance during gallery browsing.
