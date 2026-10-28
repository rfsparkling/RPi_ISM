# High-value industrial use cases

Status: 2026-10-28. This document ranks where the RPi ISM board family is most
useful in industry, and what that means for the software roadmap.

## The boards

| | **ionos-maximus** (EFR32FG23) | **RPi ISM v1** (Si4463) |
|---|---|---|
| Role | **First board to be completed** | Second |
| Repository | [ionos-sdr/ionos-maximus-rpi-sdr](https://github.com/ionos-sdr/ionos-maximus-rpi-sdr) | this repository |
| Radio | Silicon Labs radio board BRD4265B (EFR32FG23, Cortex-M33 SoC) on a Pi adapter | Si4463 transceiver chip-down |
| Band / power | Sub-GHz, 868/915 MHz, +14 dBm (BRD4265B) | 863–870 MHz (SAW), +20 dBm |
| Packet modem | Yes (RAIL, on the FG23) | Yes (Si4463 packet handler) |
| **I/Q streaming** | **Yes.** 1000 ksps at 270 kHz filter BW measured on the FG23 itself; Pi link target ~1 Msps over SPI0 (measurements M1–M5 pending) | No |
| Host link | SPI0 + DRDY IRQ, UART command link, SWD from the Pi | SPI0 + GPIO IRQ |

The key difference: **ionos-maximus is both a packet modem and a narrowband
SDR.** The same hardware can decode a protocol in firmware *and* hand raw I/Q
to Linux (SDR++, SoapySDR, GNU Radio). This creates most of the high-value
industrial use cases below.

The Raspberry Pi side adds what an industrial gateway needs anyway: Gigabit
Ethernet, Linux, Docker, MQTT / OPC UA / Modbus TCP bridges and remote
management.

## Ranked use cases

### 1. Wireless M-Bus / OMS meter data collection

- **Problem:** water, heat and gas meters and heat-cost allocators transmit
  wM-Bus (EN 13757-4, S1/T1/C1 on 868 MHz). The EU Energy Efficiency Directive
  (Art. 9c) requires meters and heat-cost allocators installed after
  25 October 2020 to be remotely readable. Existing devices must be made
  remotely readable or replaced **by 1 January 2027**. Property managers,
  district-heating operators and billing companies need receivers.
- **Board:** both boards. FG23 is a Silicon Labs target for wM-Bus.
- **Why this one:** an open, Linux-native, Ethernet-connected gateway instead
  of a proprietary concentrator. Integrates with
  [wmbusmeters](https://github.com/wmbusmeters/wmbusmeters) (hundreds of meter
  drivers, MQTT, Home Assistant). Customers keep their AES keys and data.
- **Software:** T1/C1 RX on RAIL (own implementation, see Licensing),
  3-of-6 / Manchester decoding, wmbusmeters backend. S1 and TX later.
- **Value: very high. Market pull is time-bound (2027 deadline).**

### 2. Sub-GHz spectrum monitoring and interference hunting

- **Problem:** factories, warehouses and utilities run 868 MHz networks
  (meters, alarms, telemetry, LoRa). Link failures are often interference or
  duty-cycle problems that a packet radio cannot see.
- **Board:** ionos-maximus (I/Q).
- **What it does:** continuous waterfall and occupancy logging; per-channel
  duty-cycle statistics against ETSI EN 300 220 limits; alarm on new or
  out-of-band emitters; remote access over Ethernet (SpyServer / SoapyRemote).
- **Why this one:** a permanently installed, low-cost probe per site. A
  general-purpose SDR plus filter plus PC costs more and is not a fixed
  installation.
- **Software:** libionos ring buffer → SoapySDR module → SDR++; occupancy and
  duty-cycle logger with Prometheus / MQTT export.
- **Value: high.** Unique against the transceiver-only competition.

### 3. End-of-line production test and RF pre-compliance

- **Problem:** manufacturers of sub-GHz products need a scriptable "golden
  radio" for go/no-go tests on the production line: carrier frequency offset,
  power (RSSI), packet error rate, modulation sanity. Lab instruments are
  expensive and slow to integrate.
- **Board:** ionos-maximus (packet modem + I/Q for frequency and deviation
  measurements). The Si4463 board covers packet-level tests and CW / PN9
  stimulus.
- **What it does:** Python API on the Pi drives the DUT test sequence, records
  pass/fail and measured values per serial number. The same setup gives
  EN 300 220 pre-compliance checks (occupied bandwidth, frequency error,
  duty cycle, LBT) in the development lab.
- **Value: high.** Directly sellable as a test-station building block;
  per-unit price is not critical.

### 4. Brownfield 868 MHz bridge to IT/OT networks

- **Problem:** installed proprietary FSK sensor networks, KNX-RF and legacy
  alarm or telemetry systems have no IP interface.
- **Board:** both boards.
- **What it does:** receives (and where allowed, transmits) the existing
  protocol and publishes to MQTT, OPC UA or Modbus TCP. FG23 I/Q helps reverse
  engineer undocumented legacy links on the integrator's own installation.
- **Value: medium–high.** Project business; each protocol is a plugin.

### 5. Protocol analysis for integrators

- **Problem:** installers of LoRaWAN, wM-Bus and FSK networks have no cheap
  tool to see what is actually on air at a site.
- **Board:** ionos-maximus.
- **What it does:** I/Q capture plus decoders in GNU Radio, for example
  [gr-lora_sdr](https://github.com/tapparelj/gr-lora_sdr) for LoRa at
  125/250 kHz bandwidth (inside the 270 kHz FG23 filter), and wM-Bus / FSK
  decoders. Intended for the operator's own networks.
- **Value: medium.** Depends on M2 (ENOB) and M3 (usable bandwidth).

### 6. Long-range point-to-point telemetry

- **Problem:** remote pumps, tanks, agricultural sites and outbuildings out of
  reach of Wi-Fi and 2.4 GHz meshes.
- **Board:** RPi ISM v1 (+20 dBm, 869.40–869.65 MHz sub-band: 500 mW ERP,
  10 % duty cycle). FG23 at +14 dBm for shorter links.
- **Value: medium.** Strong technically, but crowded market (LoRa modules).

### Not targeted

- **Zigbee / Thread / Matter gateway replacement.** These are 2.4 GHz
  802.15.4 O-QPSK protocols; neither board can do them, and USB coordinator
  sticks are already cheap. A future family member could add a 2.4 GHz RCP.
- **Generic hobby sensor nodes.** The node side competes with very cheap
  CC1101 / RFM69 modules.

## Priority matrix

| # | Use case | Value | Unique vs. market | SW effort | Board |
|---|---|---|---|---|---|
| 1 | wM-Bus / OMS collection | Very high | High (open, Linux, Ethernet) | Medium | FG23, Si4463 |
| 2 | Spectrum / interference monitoring | High | High (I/Q) | Low–medium | FG23 |
| 3 | EOL production test, pre-compliance | High | High | Medium | FG23 (+ Si4463) |
| 4 | Brownfield 868 MHz bridge | Medium–high | Medium | Per protocol | Both |
| 5 | Protocol analysis | Medium | Medium | Low (reuse GNU Radio) | FG23 |
| 6 | P2P long-range telemetry | Medium | Low | Low | Si4463 |

## Consequences for the software roadmap

ionos-maximus is the first board, so the roadmap starts with the parts that
the FG23 already supports:

1. **I/Q path first (use cases 2, 3, 5).** FG23 firmware already captures I/Q
   at 1 Msps. Work: EUSART secondary + LDMA + DRDY framing on the FG23, the
   `libionos` ring buffer on the Pi (spidev, DMA, sequence/overflow checks),
   a SoapySDR module and an SDR++ source. Measurements M1–M5 run on this path.
2. **Packet mode on RAIL (use cases 1, 4).** wM-Bus T1/C1 receiver on the
   FG23, delivered to the Pi over the same link as frames; wmbusmeters
   backend.
3. **Test-station API (use case 3).** Python package on the Pi: frequency
   offset and power from I/Q, PER from the packet mode, CW / PN9 stimulus.
4. **Si4463 driver** (`libsi446x`) reuses the Pi-side framework for the
   RPi ISM v1 board.

Gating measurements (from the ionos-maximus measurement plan): M1 maximum FG23
SPI secondary clock, M2 ENOB, M3 usable bandwidth beyond 270 kHz, M4 sustained
1 h rate into the Pi, M5 Pi CPU load.

## Licensing notes

- The Silicon Labs RAIL library binaries (`platform/radio/rail_lib/autogen/librail_release`)
  are distributed under the **Zlib** license, so FG23 firmware built on RAIL can
  be published as open source.
- The rest of the Gecko / Simplicity SDK is under the Silicon Labs MSLA by
  default. Silicon Labs wM-Bus sample code is not reused; the wM-Bus layer is
  written from EN 13757-4 / OMS.

## Sources

- EU Energy Efficiency Directive, [Article 9c](https://www.legislation.gov.uk/eudr/2012/27/article/9c/data.htm?view=plain) (remote readability, 2020 / 2027 dates)
- FG23 target protocols (Amazon Sidewalk, mioty, Wireless M-Bus, Z-Wave, proprietary): [eeNews Europe](https://www.eenewseurope.com/en/secure-sub-1-ghz-socs-combine-long-range-rf-energy-efficiency)
- RAIL library license: [Gecko SDK License.txt](https://github.com/SiliconLabs/sdk_support/blob/main/License.txt)
- FG23 I/Q capture figures, link modes and measurement plan: [ionos-maximus-rpi-sdr README](https://github.com/ionos-sdr/ionos-maximus-rpi-sdr)
- LoRa SDR decoder: [gr-lora_sdr](https://github.com/tapparelj/gr-lora_sdr)
