+++
title = "Stock firmware"
description = "Official stock factory firmware for ThinkPhone"
weight = 4
draft = false
updated = 2026-10-26
+++

## Stock firmware sources

1. **Lolinet mirror** - [mirrors.lolinet.com/firmware/lenomola/2023/bronco/official](https://mirrors.lolinet.com/firmware/lenomola/2023/bronco/official/)
   Per-channel folders.
   Each zip is a full fastboot package with `flashfile.xml` (checksums) and the
   bootloader included.
2. **Software Fix** - Windows-only, <https://en-us.support.motorola.com/app/softwarefix>.
   Reads the phone/IMEI/serial, picks a build for that unit and downloads it before
   flashing. The downloaded package is kept on disk: `C:\ProgramData\RSA\Download\RomFiles`.
3. **Community tools** - they can obtain ROM zip packages by account login or IMEI
   - [JoshRob297/moto-firmware-downloader](https://github.com/JoshRob297/moto-firmware-downloader)
   - [rastr1sr/motoloader](https://github.com/rastr1sr/motoloader)
   - [enigma550/LenovoMotoFirmwareDownloader](https://github.com/enigma550/LenovoMotoFirmwareDownloader)

## Flashing back to stock

### Motorola Software Fix

- Plug in, pick the device, click rescue.
- It does **not** relock the bootloader.
- It does **not** restore `persist`, `keymaster`, `tz` or `keystore`: those are
  device-unique and have to be backed up by hand.
- Enterprise/MDM units and engineering prototypes (`dvt1a`) are rejected by both the
  tool and the web portal.

### Manual fastboot from the lolinet/software fix package

`flashfile.xml` is a Motorola flashing script.

- [dlenski/motoflash2sh](https://github.com/dlenski/motoflash2sh) converts
  `flashfile.xml` into a shell script.
- Or run the commands by hand from the XML. Order matters: bootloader first, then
  the rest, and super images come as `super` chunks.

## Risks and rules

- **Flash the same firmware, or newer, than what was on the phone.**
- **Check the bootloader build before downgrading.** Read [Locking bootloader](/bronco/bootloader) section.
- Manual flashing needs an unlocked bootloader.
- Wipes userdata.

## Sources

1. [Bronco stock firmware (lolinet mirror)](https://mirrors.lolinet.com/firmware/lenomola/2023/bronco/official/)
2. XDA [root guide](https://xdaforums.com/t/how-to-root-the-motorola-thinkphone-xt2309-2-and-xt2309-3.4646332/), [Android 16 firmware thread](https://xdaforums.com/t/i-need-android-16-stock-android-update-file-for-my-motorola-think-phone-2023.4795106/), [XT2309-2 vs XT2309-3](https://xdaforums.com/t/motorola-thinkphone-xt2309-2-vs-xt2309-3.4758083/)
3. [Motorola Software Fix (Rescue and Smart Assistant)](https://en-us.support.motorola.com/app/softwarefix), [download page](https://en-us.support.motorola.com/app/answers/detail/a_id/158726/~/download-software-fix-%28pc-only%29)
4. [dlenski/motoflash2sh](https://github.com/dlenski/motoflash2sh)

