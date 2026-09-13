# Homepage asset provenance

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
