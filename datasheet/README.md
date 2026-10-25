# Component and reference documentation

Third-party datasheets and web pages are not stored in this repository.
Use the manufacturer links below.

## RPi ISM v1 (rev 0V3) key components

| Ref | Part | Manufacturer | Documentation |
|---|---|---|---|
| U1 | Si4463-B1B-FMR (C2A in next revision) | Silicon Labs | [Si4460/61/63/64 datasheet](https://www.silabs.com/documents/public/data-sheets/Si4464-63-61-60.pdf) |
| — | Si446x API reference (AN625) | Silicon Labs | Available from the Si4463 product page at silabs.com |
| — | B39871B3725U410 SAW filter, 869 MHz | TDK / EPCOS | [Datasheet](http://www.mouser.com/ds/2/400/B3725-525464.pdf) |
| — | UPG2214TB-A RF switch | CEL / Renesas | [Datasheet](http://www.cel.com/pdf/datasheets/upg2214tb.pdf) |
| — | KT2520F26000ACW18TAN TCXO, 26 MHz | Kyocera | [Datasheet](http://www.mouser.com/ds/2/40/kt2520_gps_e_2012-838160.pdf) |
| CON2 | CLH-115-F-D-DV, 2×15 receptacle, 2.54 mm | Samtec | [CLH series](https://www.samtec.com/products/clh) |
| BUZZ1 | SMT-0540-S-R magnetic buzzer | PUI Audio | [Product search](https://octopart.com/search?q=SMT-0540-S-R) |
| — | KDMG10008C-03 micro speaker (evaluated alternative) | Kingstate | [Product search](https://octopart.com/search?q=KDMG10008C-03) |
| SMA1 | SMA, vertical (population option) | — | — |

## Raspberry Pi interfacing

- [Raspberry Pi documentation — GPIO header and SPI](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html)
- [SparkFun — Raspberry Pi SPI and I2C tutorial](https://learn.sparkfun.com/tutorials/raspberry-pi-spi-and-i2c-tutorial)
- Pin mapping between the Raspberry Pi J8 header and the radio: [`../RPism_buzzer_crossreference_file.xlsx`](../RPism_buzzer_crossreference_file.xlsx)
