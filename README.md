**# Nandi Jewellers — AR Jewellery Virtual Try-On**

A mobile-first React + MUI + MediaPipe + FastAPI + PostgreSQL proof of concept for browser-based jewellery virtual try-on.

**## What is real in this MVP?**

\- Front-camera video runs locally in the browser.

\- MediaPipe Face Landmarker (468 landmarks) runs locally — no data is sent to any server.

\- Earring overlays are positioned from ear-lobe and tragus landmarks, with head-roll rotation.

\- Nose ring overlays are positioned from nostril-wing landmarks, with per-item sizing.

\- Necklace overlays use face-mesh chin + cheek landmarks for collarbone anchoring (primary), with optional pose-landmark fallback.

\- Camera frames are **\*\*not\*\*** sent to FastAPI for real-time tracking.

\- Capture composites the current video frame and AR canvas into a downloadable image.

\- Jewellery catalog data comes from FastAPI/PostgreSQL when the backend is running, with a local DEMO fallback.

\- All jewellery assets are real transparent PNG images with no background.

\- The AR canvas correctly accounts for \`objectFit: cover\` video rendering — jewellery tracks the face accurately on both desktop and mobile portrait/landscape modes.

The AR engine is intentionally modular so the demo can later be upgraded to stronger 3D/WebGL/occlusion techniques.

**## Stack**

Frontend:

\- React 18

\- Vite

\- JavaScript

\- MUI (Material UI)

\- Axios

\- React Router

\- MediaPipe Tasks Vision (Face Landmarker + Pose Landmarker)

Backend:

\- Python 3.10+

\- FastAPI

\- Pydantic

\- SQLAlchemy

\- PostgreSQL 14+

\- Uvicorn

**## Folder structure**

\`\`\`text

nandi-jewellers-ar-try-on/

├── frontend/

│   ├── public/assets/

│   │   ├── jewellery/earrings/        ← earring-1.png, earring2.png, earring3.png, earring4.png

│   │   ├── jewellery/necklaces/       ← necklace1.png, necklace2.png, necklace4.png

│   │   └── jewellery/nose-rings/     ← nosering1.png, nosering2.png

│   ├── src/

│   │   ├── components/

│   │   │   ├── ar/                   ← ARCanvas.jsx, LandmarkDebug.jsx

│   │   │   ├── camera/               ← CameraView\.jsx, CameraPermission.jsx, CameraError.jsx

│   │   │   └── capture/              ← CaptureButton.jsx, CapturePreview\.jsx

│   │   ├── hooks/                    ← useCamera.js, useFaceLandmarker.js, usePoseLandmarker.js

│   │   ├── pages/                    ← Home.jsx, TryOn.jsx, ProductDetails.jsx

│   │   ├── services/                 ← api.js

│   │   ├── theme/

│   │   ├── utils/                    ← arEngine.js, coordinates.js, demoData.js, smoothing.js

│   │   ├── App.jsx

│   │   └── main.jsx

│   ├── .env

│   ├── index.html

│   ├── package.json

│   └── vite.config.js

├── backend/

│   ├── app/

│   │   ├── models/

│   │   ├── routers/

│   │   ├── schemas/

│   │   ├── services/

│   │   ├── config.py

│   │   ├── database.py

│   │   └── main.py

│   ├── seed.py

│   ├── requirements.txt

│   └── .env

└── README.md

\`\`\`

**## 1. Prerequisites**

\- Node.js 18+

\- Python 3.10+

\- PostgreSQL 14+

\- A modern browser (Chrome, Edge, or Safari 16+)

\- Camera permission

\> **\*\*Mobile testing\*\***: Camera access requires HTTPS unless served from \`localhost\`. A LAN IP like \`http\://192.168.x.x:5173\` is not treated as secure by most browsers. For on-device mobile testing, use a tunnelling tool (e.g. \`ngrok\`) or deploy to HTTPS.

**## 2. Start PostgreSQL**

The easiest option is :

\`\`\`bash


\`\`\`

Default database:

\- database: \`nandi\_ar\`

\- user: \`nandi\`

\- password: \`nandi\`

\- port: \`5432\`

**## 3. Backend**

Windows:

\`\`\`bash

cd backend

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

copy .env.example .env

python seed.py

uvicorn app.main\:app --reload --host 0.0.0.0 --port 8000

\`\`\`

macOS/Linux:

\`\`\`bash

cd backend

python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python seed.py

uvicorn app.main\:app --reload --host 0.0.0.0 --port 8000

\`\`\`

API:

\- http\://localhost:8000/api/health

\- http\://localhost:8000/docs

**## 4. Frontend**

\`\`\`bash

cd frontend

npm install

copy .env.example .env   # Windows

\# cp .env.example .env   # macOS/Linux

npm run dev

\`\`\`

Open:

\`\`\`text

http\://localhost:5173

\`\`\`

**## 5. Demo mode without PostgreSQL**

The frontend has a local fallback catalog (\`src/utils/demoData.js\`). If FastAPI is unavailable or the database is not running, the UI automatically falls back to local demo products and can still demonstrate the full AR experience.

**## 6. User flow**

1\. Open the app at \`http\://localhost:5173\`.

2\. Browse the jewellery catalog — earrings, necklaces, nose rings.

3\. Click **\*\*Try On\*\*** on any product card.

4\. Allow camera permission (front camera opens automatically).

5\. Position your face within the frame.

6\. The jewellery overlays your face/neck in real time.

7\. Press the camera button to capture a photo.

8\. Click the **\*\*ⓘ\*\*** icon on any card to view full product details.

The front camera is mirrored for the user. Landmark-to-canvas coordinate conversion accounts for both the mirroring and \`objectFit: cover\` viewport cropping.

**## 7. AR architecture**

\`\`\`text

Camera

  ↓

HTMLVideoElement (objectFit: cover — portrait/landscape safe)

  ↓

MediaPipe Face Landmarker (468 face landmarks)

  + MediaPipe Pose Landmarker (necklace fallback only)

  ↓

Normalized landmarks [0..1]

  ↓

objectFit\:cover correction (getCoverMapping)

  ↓

Jewellery-specific anchor calculation (arEngine.js)

  ├── Earrings  → ear-lobe + tragus landmarks, head-roll rotation

  ├── Nose ring → nostril-wing landmarks, per-item sizing

  └── Necklace  → chin (lm 152) + cheek landmarks, collarbone offset

  ↓

Exponential smoothing

  ↓

Canvas drawImage + 2D transforms

  ↓

AR overlay rendered on transparent canvas above video

\`\`\`

High-frequency frame data stays in refs. React state is used for UI controls only.

**## 8. Current AR limitations**

This is a serious browser AR MVP, not a commercial-grade 3D jewellery engine.

\- All overlays use 2D transparent PNG assets.

\- There is no true depth-aware occlusion (jewellery can appear "through" hair or shoulders).

\- There is no physically based lighting or reflection simulation.

\- 2D assets will drift slightly under extreme head rotations (>45°).

\- Necklace tracking works best in a front-facing selfie view where the chin is visible; it degrades when the face is very tilted or partially off-screen.

\- Nose ring placement is optimised for the left nostril (the traditional Indian nath placement side).

Do not claim this MVP has 3D occlusion or production-grade photorealistic AR.

**## 9. Jewellery catalogue**

Current items seeded in \`backend/seed.py\`:

\| Name | Category | Asset |

\|---|---|---|

\| Ruby Floral Jhumka | earrings | earring-1.png |

\| Diamond Halo Earring | earrings | earring2.png |

\| Pearl Drop Earring | earrings | earring3.png |

\| Star Chain Earring | earrings | earring4.png |

\| Diamond Temple Necklace | necklaces | necklace1.png |

\| Heart Pendant Necklace | necklaces | necklace2.png |

\| Pearl Necklace | necklaces | necklace4.png |

\| Traditional Nose Ring | nose-rings | nosering1.png |

\| Ruby Beaded Nose Ring | nose-rings | nosering2.png |

To re-seed after changes:

\`\`\`bash

cd backend

python seed.py

\`\`\`

**## 10. Adding a jewellery item**

Add a row to \`ITEMS\` in \`backend/seed.py\` and also to \`DEMO\_JEWELLERY\` in \`frontend/src/utils/demoData.js\`. The item needs:

\| Field | Description |

\|---|---|

\| \`name\` | Display name |

\| \`category\` | \`earrings\`, \`necklaces\`, or \`nose-rings\` |

\| \`description\` | Short product description |

\| \`price\` | Price in INR (paise not required) |

\| \`material\` | e.g. \`Gold\`, \`Diamond\`, \`Pearl\`, \`Ruby\` |

\| \`purity\` | e.g. \`22K\`, \`18K\` |

\| \`weight\` | Weight in grams |

\| \`image\_url\` | Path to product display image |

\| \`ar\_asset\_url\` | Path to transparent AR overlay PNG |

\| \`anchor\_type\` | \`ear\`, \`neck\`, or \`nose\` |

\| \`scale\` | Float multiplier for overlay size |

\| \`offset\_x\` | Horizontal offset in canvas pixels |

\| \`offset\_y\` | Vertical offset in canvas pixels |

\| \`rotation\_enabled\` | \`true\` to follow head tilt |

Example:

\`\`\`json

{

  "name": "Ruby Floral Jhumka",

  "category": "earrings",

  "ar\_asset\_url": "/assets/jewellery/earrings/earring-1.png",

  "anchor\_type": "ear",

  "scale": 1.0,

  "offset\_x": 0,

  "offset\_y": 5,

  "rotation\_enabled": true

}

\`\`\`

**## 11. Adding a new category**

1\. Add a \`Category\` row to \`seed.py\`.

2\. Add jewellery rows with a new \`anchor\_type\`.

3\. Add a transform function in \`frontend/src/utils/arEngine.js\`.

4\. Register the new category in \`calculateJewelleryTransforms\`.

5\. Add drawing logic in \`ARCanvas.jsx\`.

6\. Add the UI tab/label to \`Home.jsx\` and \`TryOn.jsx\`.

**## 12. Replacing / adding assets**

Use only assets owned by or licensed to Nandi Jewellers.

For AR overlays:

\- Transparent background (PNG or WebP)

\- Jewellery fully isolated, no model or shadow

\- Minimum 400 × 400 px; 600–800 px recommended

\- No white background, no watermark

\- Correct orientation (earrings hang downward, necklace opens at top)

Keep product display images separate from AR overlay assets if they differ.

**## 13. Analytics**

Tracked events (sent to \`POST /api/analytics/event\`):

\- \`try\_on\_opened\`

\- \`camera\_started\`

\- \`category\_selected\`

\- \`jewellery\_selected\`

\- \`photo\_captured\`

\- \`product\_viewed\`

\- \`enquiry\_clicked\`

A random browser session ID is generated per page load. No biometric identity, no camera frames, and no facial data are sent to the server.

**## 14. Production checklist**

Before going to production:

\- [ ] Serve over HTTPS (required for camera on mobile)

\- [ ] Secure PostgreSQL credentials (change defaults)

\- [ ] Strict CORS (\`allow\_origins\` limited to production domain)

\- [ ] Test on real Android and iOS devices over HTTPS

\- [ ] Serve assets from a CDN

\- [ ] Compress images (WebP, \~80% quality)

\- [ ] Rate-limit analytics endpoint

\- [ ] Database migrations with Alembic (not raw \`create\_all\`)

\- [ ] Structured logging (JSON)

\- [ ] Error monitoring (Sentry or similar)

\- [ ] CSP / security headers

\- [ ] Privacy and legal copy reviewed by Nandi Jewellers

\- [ ] Replace demo PNG assets with official product assets

\- [ ] Device matrix testing (iPhone Safari, Android Chrome, tablets)

\- [ ] Consider WebGL renderer for photorealistic AR

**## 15. Future V2/V3**

V2:

\- WebGL/Three.js renderer

\- 3D jewellery models

\- Depth-aware occlusion

\- Physically based lighting / reflections

\- Hand, wrist, and finger tracking for rings and bangles

V3:

\- AI face-shape analysis for jewellery recommendations

\- Occasion-based styling suggestions

\- AI virtual stylist chatbot

\- Visual similarity search

\- Personalised recommendation engine

**## Important privacy statement**

All camera processing is performed locally in the browser using MediaPipe WebAssembly. Camera frames are **\*\*never\*\*** sent to the FastAPI backend or any third-party server. No biometric data is stored.

**## Stack**

Frontend:

\- React 18

\- Vite

\- JavaScript

\- MUI

\- Axios

\- React Router

\- MediaPipe Tasks Vision

Backend:

\- Python

\- FastAPI

\- Pydantic

\- SQLAlchemy

\- PostgreSQL

\- Uvicorn

**## Folder structure**

\`\`\`text

nandi-jewellers-ar-try-on/

├── frontend/

│   ├── public/assets/

│   │   ├── jewellery/earrings/

│   │   ├── jewellery/necklaces/

│   │   ├── jewellery/nose-rings/

│   │   └── products/

│   ├── src/

│   │   ├── components/

│   │   ├── hooks/

│   │   ├── pages/

│   │   ├── services/

│   │   ├── theme/

│   │   ├── utils/

│   │   ├── App.jsx

│   │   └── main.jsx

│   ├── .env.example

│   ├── index.html

│   ├── package.json

│   └── vite.config.js

├── backend/

│   ├── app/

│   │   ├── models/

│   │   ├── routers/

│   │   ├── schemas/

│   │   ├── services/

│   │   ├── config.py

│   │   ├── database.py

│   │   └── main.py

│   ├── seed.py

│   ├── requirements.txt

│   └── .env.example

└── README.md

\`\`\`

**## 1. Prerequisites**

\- Node.js 18+

\- Python 3.10+

\- PostgreSQL 14+

\- A modern browser

\- Camera permission

For mobile testing, camera access normally requires HTTPS unless the page is served from an allowed local-development context. A LAN IP such as \`http\://192.168.x.x:5173\` is not generally treated like localhost by browsers.

**## 2. Start PostgreSQL**

The easiest option is :

\`\`\`bash


\`\`\`

Default database:

\- database: \`nandi\_ar\`

\- user: \`nandi\`

\- password: \`nandi\`

\- port: \`5432\`

**## 3. Backend**

Windows:

\`\`\`bash

cd backend

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

copy .env.example .env

python seed.py

uvicorn app.main\:app --reload --host 0.0.0.0 --port 8000

\`\`\`

macOS/Linux:

\`\`\`bash

cd backend

python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python seed.py

uvicorn app.main\:app --reload --host 0.0.0.0 --port 8000

\`\`\`

API:

\- http\://localhost:8000/api/health

\- http\://localhost:8000/docs

**## 4. Frontend**

\`\`\`bash

cd frontend

npm install

copy .env.example .env

npm run dev

\`\`\`

macOS/Linux:

\`\`\`bash

cp .env.example .env

npm run dev

\`\`\`

Open:

\`\`\`text

http\://localhost:5173

\`\`\`

**## 5. Demo mode without PostgreSQL**

The frontend has a local fallback catalog. If FastAPI is unavailable, the UI can still demonstrate the AR experience with local demo products. This is intentional so the hiring-team demo is not blocked by database setup.

**## 6. Camera**

On \`/try-on\`:

1\. Click Start Virtual Try-On.

2\. Allow camera permission.

3\. Keep one face in frame.

4\. Choose a jewellery category.

5\. Select an item.

6\. Move your head.

7\. Capture a photo.

The front camera is mirrored for the user. Landmark-to-canvas coordinate conversion accounts for the mirrored presentation.

**## 7. AR architecture**

\`\`\`text

Camera

  ↓

HTMLVideoElement

  ↓

MediaPipe Face/Pose Landmarker

  ↓

Normalized landmarks

  ↓

Coordinate conversion

  ↓

Jewellery-specific anchor calculation

  ↓

Smoothing

  ↓

Canvas drawImage + transforms

  ↓

AR overlay

\`\`\`

High-frequency frame data stays in refs. React state is used for UI state rather than per-frame landmark updates.

**## 8. Current AR limitations**

This is a serious browser AR MVP, not a commercial-grade 3D jewellery engine.

\- Earrings use facial landmarks and a 2D transparent asset.

\- Nose rings use nose landmarks and a 2D transparent asset.

\- Necklaces use face/pose landmarks and a 2D transparent asset.

\- There is no true depth-aware occlusion.

\- There is no physically based lighting/reflection.

\- 2D assets will not look perfectly attached under extreme head rotations.

\- Necklace placement depends on the availability/quality of pose landmarks.

Do not claim this MVP has 3D occlusion or production-grade photorealistic AR.

**## 9. Adding a jewellery item**

The backend item needs:

\- name

\- category

\- product image URL

\- AR asset URL

\- anchor type

\- scale

\- offsets

\- rotation flag

Example:

\`\`\`json

{

  "name": "Demo Gold Jhumka 05",

  "category": "earrings",

  "ar\_asset\_url": "/assets/jewellery/earrings/demo-gold-jhumka-05.svg",

  "anchor\_type": "ear",

  "scale": 1.1,

  "offset\_x": 0,

  "offset\_y": 8,

  "rotation\_enabled": true

}

\`\`\`

For a real product, replace the demo asset with an approved transparent PNG/WebP and update the database.

**## 10. Adding a new category**

1\. Add a category row.

2\. Add jewellery rows using a new \`anchor\_type\`.

3\. Add a category configuration in \`frontend/src/utils/arEngine.js\`.

4\. Add the corresponding transform function.

5\. Add the UI label/icon.

6\. Add tests for landmark visibility and fallback behavior.

**## 11. Replacing demo assets**

Use only assets owned by or licensed to Nandi Jewellers.

For AR overlays:

\- transparent background

\- jewellery isolated from the model/product photo

\- sufficient resolution for mobile

\- preferably WebP for production

\- no white background

\- no watermark

Keep product display images separate from AR overlay assets.

**## 12. Analytics**

Tracked events:

\- try\_on\_opened

\- camera\_started

\- category\_selected

\- jewellery\_selected

\- try\_on\_completed

\- photo\_captured

\- product\_viewed

\- enquiry\_clicked

A random browser session ID is generated for the demo. No biometric identity is stored.

**## 13. Production checklist**

Before production:

\- HTTPS

\- secure PostgreSQL credentials

\- strict CORS

\- HTTPS camera testing on real Android/iOS devices

\- asset CDN

\- image compression

\- rate limiting for analytics

\- database migrations with Alembic

\- structured logging

\- error monitoring

\- CSP/security headers

\- privacy/legal copy reviewed by Nandi Jewellers

\- real product assets

\- device matrix testing

\- stronger 3D/WebGL renderer if photorealism is required

**## 14. Future V2/V3**

V2:

\- WebGL/Three.js

\- 3D jewellery

\- depth/occlusion

\- better lighting

\- hand/wrist tracking

\- ring/bangle tracking

V3:

\- AI face-shape recommendations

\- occasion-based recommendations

\- AI stylist

\- similarity search

\- personalized recommendations

**## Important privacy statement**

Camera processing is performed locally in the browser. Camera frames are not sent to FastAPI for real-time processing.
