/**
 * Scene layer SVG data and configuration.
 *
 * Each SVG is stored as a constant string so it can be inlined directly
 * into the SceneLayer component (no <img> loading — enables CSS variable
 * access for dark mode). Colors use rgba(var(--X-rgb), X) patterns so
 * they automatically respond to theme changes.
 *
 * The markup is copied from the source SVG files in assets/scene-layers/.
 * If you modify the SVGs, update the strings here.
 */

// ─── Layer 0: Distant Mountains ──────────────────────────────────────

export const MOUNTAINS_SVG = `<svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="250" width="1440" height="150" fill="rgba(var(--mist-rgb), 0.04)" />
  <path d="M0 350 Q60 320 120 340 Q180 310 240 330 Q300 290 360 320 Q420 300 480 320 L480 500 L0 500Z" fill="rgba(var(--mist-rgb), 0.06)" stroke="rgba(var(--sumi-rgb), 0.10)" stroke-width="1" />
  <g>
    <path d="M540 220 L620 380 L700 380Z" fill="rgba(var(--mist-rgb), 0.08)" stroke="rgba(var(--sumi-rgb), 0.18)" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M565 280 L580 325 L595 320 L610 340 L620 380 L595 350 L585 355Z" fill="rgba(var(--washi-rgb), 0.5)" stroke="rgba(var(--sumi-rgb), 0.12)" stroke-width="0.75" stroke-linejoin="round" />
    <path d="M540 380 Q620 370 700 380" fill="none" stroke="rgba(var(--sumi-rgb), 0.10)" stroke-width="1" />
  </g>
  <path d="M0 400 Q80 365 160 385 Q240 355 320 375 Q400 350 480 380 Q560 370 640 390 Q720 375 800 395 Q880 380 960 400 Q1040 390 1120 410 Q1200 395 1320 415 Q1400 405 1440 420 L1440 550 L0 550Z" fill="rgba(var(--sumi-rgb), 0.04)" stroke="rgba(var(--sumi-rgb), 0.10)" stroke-width="1" />
  <path d="M0 430 Q100 400 200 420 Q300 395 400 415 Q500 405 600 425 Q700 410 800 430 Q900 420 1000 440 Q1100 430 1200 450 Q1320 440 1440 455 L1440 550 L0 550Z" fill="rgba(var(--sumi-rgb), 0.03)" stroke="rgba(var(--sumi-rgb), 0.08)" stroke-width="0.75" />
  <g fill="rgba(var(--sumi-rgb), 0.15)">
    <circle cx="140" cy="382" r="3" /><circle cx="152" cy="386" r="2.5" /><circle cx="165" cy="384" r="2" />
    <circle cx="760" cy="390" r="3" /><circle cx="775" cy="395" r="2.5" /><circle cx="790" cy="392" r="2" />
    <circle cx="1050" cy="405" r="3.5" /><circle cx="1065" cy="410" r="2.5" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.12)" stroke-width="1" fill="none" stroke-linecap="round">
    <path d="M280 180 Q285 176 290 180" /><path d="M300 165 Q305 161 310 165" />
    <path d="M265 192 Q270 188 275 192" /><path d="M350 170 Q355 166 360 170" />
    <path d="M370 185 Q375 181 380 185" />
  </g>
  <line x1="0" y1="440" x2="1440" y2="440" stroke="rgba(var(--sumi-rgb), 0.04)" stroke-width="1" />
</svg>`

// ─── Layer 1: Mid-ground Clouds ──────────────────────────────────────

export const CLOUDS_SVG = `<svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path d="M950 220 Q930 218 920 210 Q910 200 920 194 Q930 188 950 194 L1100 205 Q1120 208 1130 216 Q1140 226 1130 232 Q1120 238 1100 232 L970 226 Q960 228 950 220Z" fill="rgba(var(--washi-rgb), 0.85)" stroke="rgba(var(--sumi-rgb), 0.12)" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M1125 215 Q1135 220 1128 228" stroke="rgba(var(--sumi-rgb), 0.08)" stroke-width="1" fill="none" stroke-linecap="round" />
  </g>
  <g>
    <path d="M50 280 Q30 278 20 268 Q10 258 20 252 Q30 246 50 252 L450 260 Q470 262 480 272 Q490 282 480 288 Q470 294 450 288 L70 286 Q60 288 50 280Z" fill="rgba(var(--washi-rgb), 0.90)" stroke="rgba(var(--sumi-rgb), 0.15)" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M475 270 Q485 275 478 284" stroke="rgba(var(--sumi-rgb), 0.10)" stroke-width="1" fill="none" stroke-linecap="round" />
    <path d="M25 268 Q15 262 22 254" stroke="rgba(var(--sumi-rgb), 0.08)" stroke-width="1" fill="none" stroke-linecap="round" />
  </g>
  <g>
    <path d="M300 400 Q280 396 270 386 Q260 376 270 370 Q280 364 300 370 L900 385 Q920 388 930 398 Q940 408 930 414 Q920 420 900 414 L320 406 Q310 408 300 400Z" fill="rgba(var(--washi-rgb), 0.88)" stroke="rgba(var(--sumi-rgb), 0.14)" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M300 406 Q600 420 900 414" fill="none" stroke="rgba(var(--sumi-rgb), 0.06)" stroke-width="2" />
    <path d="M925 396 Q935 402 928 412" stroke="rgba(var(--sumi-rgb), 0.09)" stroke-width="1" fill="none" stroke-linecap="round" />
  </g>
  <g>
    <path d="M600 320 Q590 318 585 312 Q580 306 585 302 Q590 298 600 302 L680 310 Q690 312 695 318 Q690 324 680 320 L610 318 Q600 320 600 320Z" fill="rgba(var(--washi-rgb), 0.75)" stroke="rgba(var(--sumi-rgb), 0.10)" stroke-width="1" stroke-linejoin="round" />
  </g>
  <g>
    <path d="M100 500 Q80 498 70 490 Q60 482 70 477 Q80 472 100 477 L400 490 Q420 493 430 502 Q440 512 430 518 Q420 524 400 518 L120 506 Q110 508 100 500Z" fill="rgba(var(--washi-rgb), 0.82)" stroke="rgba(var(--sumi-rgb), 0.10)" stroke-width="1.5" stroke-linejoin="round" />
  </g>
  <g stroke="rgba(var(--mist-rgb), 0.06)" stroke-width="1" stroke-linecap="round">
    <line x1="800" y1="290" x2="950" y2="290" /><line x1="200" y1="350" x2="400" y2="350" /><line x1="1000" y1="370" x2="1100" y2="370" />
  </g>
</svg>`

// ─── Layer 2: Waves / Water ──────────────────────────────────────────

export const WAVES_SVG = `<svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="430" width="1440" height="470" fill="rgba(var(--info-rgb), 0.06)" />
  <g stroke="rgba(var(--sumi-rgb), 0.12)" stroke-width="1" fill="none" stroke-linecap="round">
    <path d="M0 440 Q20 435 40 440 Q60 445 80 440" /><path d="M100 442 Q120 437 140 442 Q160 447 180 442" />
    <path d="M200 438 Q220 433 240 438 Q260 443 280 438" /><path d="M300 442 Q320 437 340 442 Q360 447 380 442" />
    <path d="M400 440 Q420 435 440 440 Q460 445 480 440" /><path d="M500 438 Q520 433 540 438 Q560 443 580 438" />
    <path d="M600 442 Q620 437 640 442 Q660 447 680 442" /><path d="M700 440 Q720 435 740 440 Q760 445 780 440" />
    <path d="M800 438 Q820 433 840 438 Q860 443 880 438" /><path d="M900 442 Q920 437 940 442 Q960 447 980 442" />
    <path d="M1000 440 Q1020 435 1040 440 Q1060 445 1080 440" /><path d="M1100 438 Q1120 433 1140 438 Q1160 443 1180 438" />
    <path d="M1200 442 Q1220 437 1240 442 Q1260 447 1280 442" /><path d="M1300 440 Q1320 435 1340 440 Q1360 445 1380 440" />
    <path d="M1400 438 Q1420 433 1440 438" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.16)" stroke-width="1.2" fill="none" stroke-linecap="round">
    <path d="M-20 465 Q10 455 40 465 Q70 475 100 465" /><path d="M120 468 Q150 458 180 468 Q210 478 240 468" />
    <path d="M260 463 Q290 453 320 463 Q350 473 380 463" /><path d="M400 468 Q430 458 460 468 Q490 478 520 468" />
    <path d="M540 465 Q570 455 600 465 Q630 475 660 465" /><path d="M680 468 Q710 458 740 468 Q770 478 800 468" />
    <path d="M820 463 Q850 453 880 463 Q910 473 940 463" /><path d="M960 468 Q990 458 1020 468 Q1050 478 1080 468" />
    <path d="M1100 465 Q1130 455 1160 465 Q1190 475 1220 465" /><path d="M1240 468 Q1270 458 1300 468 Q1330 478 1360 468" />
    <path d="M1380 463 Q1410 453 1440 463" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.20)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-30 500 Q20 480 70 500" /><path d="M70 500 Q90 490 100 495 Q110 505 100 510" />
    <path d="M100 505 Q150 485 200 505" /><path d="M200 505 Q220 495 230 500 Q240 510 230 515" />
    <path d="M230 510 Q280 490 330 510" /><path d="M330 510 Q350 500 360 505 Q370 515 360 520" />
    <path d="M360 515 Q410 495 460 515" /><path d="M460 515 Q480 505 490 510 Q500 520 490 525" />
    <path d="M490 520 Q540 500 590 520" /><path d="M590 520 Q610 510 620 515 Q630 525 620 530" />
    <path d="M620 525 Q670 505 720 525" /><path d="M720 525 Q740 515 750 520 Q760 530 750 535" />
    <path d="M750 530 Q800 510 850 530" /><path d="M850 530 Q870 520 880 525 Q890 535 880 540" />
    <path d="M880 535 Q930 515 980 535" /><path d="M980 535 Q1000 525 1010 530 Q1020 540 1010 545" />
    <path d="M1010 540 Q1060 520 1110 540" /><path d="M1110 540 Q1130 530 1140 535 Q1150 545 1140 550" />
    <path d="M1140 545 Q1190 525 1240 545" /><path d="M1240 545 Q1260 535 1270 540 Q1280 550 1270 555" />
    <path d="M1270 550 Q1320 530 1370 550" /><path d="M1370 550 Q1390 540 1400 545 Q1410 555 1400 560" />
  </g>
  <g fill="rgba(var(--washi-rgb), 0.6)">
    <circle cx="70" cy="498" r="2" /><circle cx="80" cy="495" r="1.5" /><circle cx="60" cy="496" r="1" />
    <circle cx="230" cy="503" r="2" /><circle cx="240" cy="500" r="1.5" /><circle cx="220" cy="501" r="1" />
    <circle cx="490" cy="512" r="2.5" /><circle cx="500" cy="508" r="1.5" /><circle cx="480" cy="510" r="1.5" />
    <circle cx="750" cy="522" r="2.5" /><circle cx="760" cy="518" r="1.5" /><circle cx="740" cy="520" r="1.5" />
    <circle cx="1010" cy="532" r="2" /><circle cx="1020" cy="528" r="1.5" /><circle cx="1000" cy="530" r="1" />
    <circle cx="1270" cy="542" r="2.5" /><circle cx="1280" cy="538" r="1.5" /><circle cx="1260" cy="540" r="1.5" />
  </g>
  <g fill="rgba(var(--washi-rgb), 0.35)">
    <circle cx="70" cy="490" r="1" /><circle cx="85" cy="488" r="0.75" />
    <circle cx="490" cy="502" r="1" /><circle cx="505" cy="500" r="0.75" />
    <circle cx="750" cy="512" r="1" /><circle cx="765" cy="510" r="0.75" />
    <circle cx="1010" cy="522" r="1" /><circle cx="1025" cy="520" r="0.75" />
  </g>
</svg>`

// ─── Layer 3: Foreground Pine ────────────────────────────────────────

export const PINE_SVG = `<svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path d="M1440 380 L1350 395 L1320 410 L1280 430 L1240 460 L1220 480 L1200 510" stroke="rgba(var(--sumi-rgb), 0.35)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M1440 384 L1350 399 L1320 414 L1280 434 L1240 464 L1220 484 L1200 514" stroke="rgba(var(--sumi-rgb), 0.12)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <g>
    <path d="M1320 410 L1280 395 L1240 388 L1180 385" stroke="rgba(var(--sumi-rgb), 0.30)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M1320 414 L1280 399 L1240 392 L1180 389" stroke="rgba(var(--sumi-rgb), 0.10)" stroke-width="1" fill="none" stroke-linecap="round" />
  </g>
  <g>
    <path d="M1280 430 L1245 445 L1210 468 L1185 495" stroke="rgba(var(--sumi-rgb), 0.28)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.30)" stroke-width="1" stroke-linecap="round" fill="none">
    <path d="M1200 510 L1170 505" /><path d="M1200 510 L1165 510" /><path d="M1200 510 L1170 515" />
    <path d="M1200 510 L1175 520" /><path d="M1200 510 L1185 525" /><path d="M1200 510 L1195 528" />
    <path d="M1200 510 L1208 525" /><path d="M1200 510 L1215 520" /><path d="M1200 510 L1220 512" />
    <path d="M1200 510 L1218 505" /><path d="M1200 510 L1210 500" /><path d="M1200 510 L1198 498" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.28)" stroke-width="1" stroke-linecap="round" fill="none">
    <path d="M1180 385 L1155 378" /><path d="M1180 385 L1152 385" /><path d="M1180 385 L1155 392" />
    <path d="M1180 385 L1162 398" /><path d="M1180 385 L1172 402" /><path d="M1180 385 L1185 400" />
    <path d="M1180 385 L1195 395" /><path d="M1180 385 L1200 388" /><path d="M1180 385 L1195 378" />
    <path d="M1180 385 L1185 370" /><path d="M1180 385 L1170 372" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.26)" stroke-width="1" stroke-linecap="round" fill="none">
    <path d="M1185 495 L1160 488" /><path d="M1185 495 L1155 495" /><path d="M1185 495 L1160 502" />
    <path d="M1185 495 L1165 510" /><path d="M1185 495 L1175 515" /><path d="M1185 495 L1190 512" />
    <path d="M1185 495 L1200 505" /><path d="M1185 495 L1210 498" /><path d="M1185 495 L1205 488" />
    <path d="M1185 495 L1195 482" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.20)" stroke-width="0.8" stroke-linecap="round" fill="none">
    <path d="M1260 396 L1245 390" /><path d="M1260 396 L1242 396" /><path d="M1260 396 L1245 402" />
    <path d="M1260 396 L1252 406" /><path d="M1260 396 L1265 404" /><path d="M1260 396 L1272 400" />
    <path d="M1260 396 L1268 390" />
  </g>
  <g stroke="rgba(var(--sumi-rgb), 0.15)" stroke-width="0.8" stroke-linecap="round" fill="none">
    <path d="M1280 400 L1270 395" /><path d="M1240 455 L1228 450" /><path d="M1220 475 L1208 472" />
    <path d="M1300 405 L1292 398" /><path d="M1220 390 L1210 385" />
  </g>
  <g>
    <ellipse cx="1260" cy="425" rx="5" ry="7" fill="rgba(var(--sumi-rgb), 0.20)" stroke="rgba(var(--sumi-rgb), 0.30)" stroke-width="1" />
    <path d="M1257 422 L1263 422" stroke="rgba(var(--sumi-rgb), 0.25)" stroke-width="0.8" />
    <path d="M1256 426 L1264 426" stroke="rgba(var(--sumi-rgb), 0.25)" stroke-width="0.8" />
    <path d="M1257 430 L1263 430" stroke="rgba(var(--sumi-rgb), 0.25)" stroke-width="0.8" />
  </g>
</svg>`

// ─── Layer 4: Falling Petals (defs only — animated at runtime) ──────

export const PETALS_SVG = `<svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <g id="sakura-petal">
      <path d="M0 0 C-2 -2 -4 -1 -5 0 C-6 2 -5 5 -3 6 C-1 7 0 8 0 10 C0 8 1 7 3 6 C5 5 6 2 5 0 C4 -1 2 -2 0 0Z" fill="rgba(var(--vermillion-rgb), 0.2)" stroke="rgba(var(--sumi-rgb), 0.08)" stroke-width="0.5" />
    </g>
    <g id="snow-particle">
      <circle cx="0" cy="0" r="2.5" fill="rgba(var(--washi-rgb), 0.5)" />
      <path d="M0 -4 L0 4 M-4 0 L4 0" stroke="rgba(var(--washi-rgb), 0.3)" stroke-width="0.5" />
    </g>
  </defs>
</svg>`

// ─── Layer 5: Vermillion Seal ────────────────────────────────────────

export const SEAL_SVG = `<svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(1060, 520)">
    <path d="M0 0 L2 -2 L8 -1 L15 -3 L25 -1 L35 -2 L45 -1 L55 -3 L65 -1 L75 -2 L85 -1 L95 -3 L105 -1 L112 -2 L118 -1 L120 0 L122 2 L121 8 L123 15 L121 25 L123 35 L121 45 L123 55 L121 65 L123 75 L121 85 L123 95 L121 105 L122 112 L120 120 L118 122 L112 121 L105 123 L95 121 L85 123 L75 121 L65 123 L55 121 L45 123 L35 121 L25 123 L15 121 L8 122 L2 120 L0 118 L-2 112 L-1 105 L-3 95 L-1 85 L-3 75 L-1 65 L-3 55 L-1 45 L-3 35 L-1 25 L-3 15 L-2 8 L0 2Z" fill="rgba(var(--vermillion-rgb), 0.08)" stroke="rgba(var(--vermillion-rgb), 0.15)" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M8 8 L112 8 L112 112 L8 112Z" fill="none" stroke="rgba(var(--vermillion-rgb), 0.10)" stroke-width="1" />
    <g stroke="rgba(var(--vermillion-rgb), 0.12)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M18 28 L50 28" /><path d="M22 28 L22 95" />
      <path d="M35 45 L30 65 L40 65" /><path d="M35 45 L40 65" />
      <path d="M22 88 L50 88" /><path d="M50 50 L50 95" /><path d="M35 66 L50 66" />
    </g>
    <g stroke="rgba(var(--vermillion-rgb), 0.12)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M60 28 L100 28" /><path d="M65 28 L65 55 L60 65" /><path d="M95 28 L95 55 L100 65" />
      <path d="M60 48 L100 48" /><path d="M65 55 L65 80 L60 90" /><path d="M95 55 L95 80 L100 90" />
      <path d="M60 80 L100 80" /><path d="M72 28 L72 95" /><path d="M80 48 L80 95" /><path d="M88 28 L88 95" />
    </g>
  </g>
  <g transform="translate(200, 650)" opacity="0.5">
    <circle cx="20" cy="20" r="22" fill="none" stroke="rgba(var(--vermillion-rgb), 0.10)" stroke-width="1.5" />
    <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(var(--vermillion-rgb), 0.08)" stroke-width="1" />
    <g stroke="rgba(var(--vermillion-rgb), 0.10)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M12 12 L28 12" /><path d="M12 12 L12 28" /><path d="M28 12 L28 28" />
      <path d="M12 20 L28 20" /><path d="M20 12 L20 28" />
    </g>
  </g>
</svg>`

// ─── Layer Index ─────────────────────────────────────────────────────

export const LAYER_SVGS = [
  MOUNTAINS_SVG, // 0
  CLOUDS_SVG,    // 1
  WAVES_SVG,     // 2
  PINE_SVG,      // 3
  PETALS_SVG,    // 4
  SEAL_SVG,      // 5
] as const

export type LayerIndex = 0 | 1 | 2 | 3 | 4 | 5
