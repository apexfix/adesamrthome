# Homepage asset provenance

The initial Kaadas/CCTV compositions below are retained but no longer used in the homepage rotation after the user's explicit V5MAX/X9 request. Current assets are documented in the final section.

Created with the built-in image-generation tool after the user authorized AI-generated high-resolution assets where needed. These are product compositions, not customer installation photographs. Original product galleries were not replaced. Device accuracy and source rights are not independently certified by generation.

Two 1536x1024 PNG outputs were converted to WebP using sharp for web delivery, without compositional changes. Total final size: 103,504 bytes.

| Final asset | Bytes | Reference |
| --- | --- | --- |
| `public/img/hero/kaadas-product-composition-v1.webp` | 32,698 | `public/img/products/kaadas-k70-se/product/kaadas-k70-se-product-01.png` |
| `public/img/hero/cctv-equipment-composition-v1.webp` | 70,806 | `public/img/products/dahua-6mp-dual-light-kit/dahua-hdw3667em-official.png` and `public/img/products/dahua-2-camera-kit/dahua-nvr4104hs-p-4ks2-l.webp` |

The installation slide reuses `public/img/installations/auslock-old-door-adelaide/auslock-smart-lock-side-view.jpg` unchanged. It is described as an Auslock installation, not a Kaadas or Lockin model.

## Original outputs

- CCTV: `C:/Users/Linton/.codex/generated_images/01a009d5-e071-70a0-a4f7-66192bb37623/exec-355ba102-546b-4cfa-99d8-442456b68b01.png`
- Kaadas: `C:/Users/Linton/.codex/generated_images/01a009d5-e071-70a0-a4f7-66192bb37623/exec-96b31e98-ec0d-4de9-bd50-a6d0ceac82d5.png`

Both outputs and their references were visually inspected. They show complete products against a restrained dark background, with no added price or warranty claims. Actual page rendering was checked in desktop/mobile screenshots.

## Generation prompts

### CCTV

Use case: compositing. Create ONE high-resolution landscape 3:2 product composition for ADE Smart Home's black-and-gold website hero. Image 1 is the exact Dahua DH-IPC-HDW3667EM-S-IL-ANZ white turret camera product reference. Image 2 contains the exact DHI-NVR4104HS-P-4KS2/L black recorder product reference; extract ONLY the physical recorder, not any poster border, banners, words or feature icons. Show EXACTLY TWO identical cameras from image 1 and ONE recorder from image 2. Preserve their real geometry, the camera's lens and separate dual-light window, screws, markings and the recorder's perforated face. Do not invent screens, additional lenses, antennas or cables. Arrange two complete cameras above/behind the complete recorder, separated and not obscuring each other, centered in the image with ample 10% margins. Neutral near-black charcoal studio background matching #09090b. Crisp, bright, neutral commercial product lighting so all black recorder edges remain inspectable. Very restrained warm rim light only, no gold objects. No decorative cards, platforms, pedestals, blobs, bokeh, scenery, text, prices, badges, logos added outside the actual devices or watermarks. Retain the small original device branding only. This is a product composition, NOT an installation photo. Suitable to show uncropped with object-fit contain on desktop and phone.

### Kaadas

Use case: compositing / background replacement. ONE high-resolution landscape 3:2 bitmap for a black-and-gold smart lock website hero. Use the provided image as the exact product edit target: Kaadas K70 SE front and rear panels. Preserve BOTH physical panels, their complete silhouettes, handles, camera lens, screen, buttons, knobs, proportions, orientation and genuine device branding exactly as in the reference. Do NOT design a new lock, do NOT add controls, mirrors, lights or antennas. Remove only the white background. Present both complete panels together side by side, centered and standing upright against a near-black #09090b studio backdrop, occupying about 88 percent of image height, with clear separation and generous horizontal breathing room. Bright neutral studio key lighting with subtle warm edge illumination so the black glass, handle edges and grey rear panel remain crisply inspectable. Restrained premium product photography, no dramatic darkness hiding details. No podium, pedestal, decoration, text, price, warranty, slogan, badges, border or added brand logo. A clean product composition, not a photo of a real customer installation. Must show the complete top and bottom of both panels, no cropping.

## User-requested V5MAX / X9 revision

Both replacement product compositions were created with the built-in image-generation tool, visually inspected, and converted to WebP (quality 88) without compositional edits. Original product galleries remain unchanged. These are illustrative product compositions, not customer installation photos or exact manufacturing drawings.

| Final asset | Dimensions / bytes | Reference |
| --- | --- | --- |
| `public/img/hero/lockin-v5max-composition-v1.webp` | 1536x1024 / 23,990 | Existing catalogue reference downloaded to `output/hero-product-references/v5max-product.png` |
| `public/img/hero/lockin-x9-composition-v1.webp` | 1536x1024 / 51,734 | `public/img/products/lockin-x9/gallery/x9-gallery-01.jpg` |
| `public/img/hero/installation-only-user-poster-v1.webp` | 1122x1402 / 110,772 | User's `C:/Users/Linton/AppData/Local/Temp/codex-clipboard-aca5e11f-f9ac-4bd1-b06b-5e51c874d134.png`, format conversion only |

V5 reference URL, already in the product catalogue: `https://cdn.shopify.com/s/files/1/0909/6747/4542/files/Black-V5-Max_Righthanded_e6038978-9915-4b86-bb25-000578c3e7b6.png?v=1766733143`.

Original generated PNGs:
- V5MAX: `C:/Users/Linton/.codex/generated_images/01a009d5-e071-70a0-a4f7-66192bb37623/exec-560fa072-c45e-4759-ae96-791f150e5836.png`
- X9: `C:/Users/Linton/.codex/generated_images/01a009d5-e071-70a0-a4f7-66192bb37623/exec-43aa49f1-6311-4f49-8062-cb178b3c0815.png`

### V5MAX prompt

Edit the supplied Lockin V5 MAX product reference into one high-resolution 3:2 landscape website product composition. Preserve exactly the single black device, its complete silhouette, curved push-pull handle, camera, face and palm symbols, NFC marking, bell button and original small deer emblem; do not invent or add controls. Replace the white background with neutral near-black #09090b, with bright neutral studio lighting and a restrained warm rim so the full device is clearly visible. Upright centered product, complete top and bottom visible, about 90% of image height, generous horizontal margins. No added text, price, logos, graphic decorations, bokeh, podium or frame. This is a clean product composition, not an installation photo. Match a restrained black-and-gold smart home website.

### X9 prompt

Edit the supplied Lockin X9 product reference into one high-resolution 3:2 landscape website product composition. Preserve BOTH complete black front and rear panels exactly: right panel keypad, bell, fingerprint lever handle, round bottom detail and LOCKIN wordmark; left panel textured rear cover, left-facing lever and interior thumbturn. No invented camera or face scanner. Keep both products upright and separated, complete handles and top and bottom visible, about 88% of image height. Replace only the white background with near-black #09090b studio backdrop. Bright neutral studio lighting with restrained warm edge light; devices must remain clearly inspectable, not dark silhouettes. No added text, price, logos, decoration, podium or frame. Clean premium product composition for a restrained black-and-gold smart-home website. Do not present as a real installation.
