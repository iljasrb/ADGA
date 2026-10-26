+++
title = "Recover phone / EDL Flash"
description = "Recovering phone from unbootable state: (hardbrick, softbrick/bootloop)"
weight = 3
draft = false
updated = 2026-10-26
+++

Recovering the phone from unbootable state differs with the case you have.

- If the phone is **bootlooping (softbrick)** - ThinkPhone logo appears, but you reboot before booting into system.
	- Try entering bootloader with holding down both the <kbd>VOLUME DOWN</kbd> and <kbd>POWER</kbd>.
	- If bootloop was caused after flashing patched `boot.img`, flash the original boot image.
	- If you have no clue:
		- If on custom ROM, reflash the ROM zip in recovery. If dirty flashing fails, clean flash.
		- Flash stock ROM, either manually or with Motorola Rescue / Software Fix tool.
- **Hardbrick** If phone shows no signs of life or the bootloader refuses to boot the system with an error message.
	- You need to EDL flash the phone.

## EDL Flash / Blankflash

> [!WARNING]
> This section needs to be reviewed with a person that has practical experience with EDL flashing
> this phone. Following is based on theoretical info.

> EDL + blankflash repairs the bootloader and partition table only.
> It does not bring back persist, keymaster/tz.

### Prerequisites

- Qualcomm QDLoader 9008 USB driver
- Motorola USB drivers
- Blankflash package for bronco `blankflash_bronco_from_U1TBS34.54-24-1-13_rebuild.zip`, from [mirrors.lolinet.com](https://mirrors.lolinet.com/firmware/lenomola/2023/bronco/blankflash)
- EDL cable (B09DY4PWRT confirmed working) or DIY cable with bridged green D+ to black GND.

### Programmer

> Unverified info

Programmer is inside blankflash package, on Linux you can use [bkerler/edl](https://github.com/bkerler/edl) or [linux-msm/qdl](https://github.com/linux-msm/qdl) to read and write single partitions instead of blankflashing everything.

### Entering EDL mode

1. With EDL cable
	1. Plug the EDL cable into the computer
	2. Hold both volume keys + the cable’s button, plug into the phone, keep holding ~8–10 s, then release.
	3. Windows should show Qualcomm HS-USB QDLoader 9008 (COMx) under Ports.
2. Without a cable (unverified)
	1. Plug generic usb cable into the computer
	2. Hold both volume keys
	3. Plug the phone to the cable.

### Blankflash

1. Verify the phone is in 9008 mode
2. Run package's `.bat` file (Windows). On Linux, write the image with [bkerler/edl](https://github.com/bkerler/edl) or [linux-msm/qdl](https://github.com/linux-msm/qdl) using the programmer from the package.
3. Phone should reboot to bootloader
4. Flash [stock firmware](/bronco/stock-fw) or use Motorola Rescue / Software Fix tools.

### Other information

- Linux needs right udev rules, just run as root.
- Should not necessarily wipe data.
- Does not change bootloader unlock state.

### Reports

| Result | Report |
| --- | --- |
| Bootloader restored, then stock via Software Fix | 2 cases with EDL cable, 1 with no cable |
| Restored 3× and 8–9× over months of ROM flashing | repeated recoveries while flashing ROMs |
| Blankflash ran but phone still dead | after `fastboot oem lock`, and on MDM-locked units |
| Nothing, had to send to Motorola | device written off / sent for repair |
| Dead after flashing recovery, revived by a shorted cable | DIY shorted cable, no 9008 from any key combination |

### Unconfirmed

- Does blankflash work for the bootloader relocking hardbricks
- AVB index behavior with blankflash.

## Sources

1. [Bronco blankflash packages (lolinet mirror)](https://mirrors.lolinet.com/firmware/lenomola/2023/bronco/blankflash/)
2. XDA [Unbrick from EDL](https://xdaforums.com/t/unbrick-from-edl.4767635/), [Who can help me? BlankFlash file](https://xdaforums.com/t/who-can-help-me-blankflash-file.4687947/), [No valid OS found, locked bootloader, EDL flashing](https://xdaforums.com/t/help-no-valid-os-found-locked-bootloader-edl-flashing.4648975/)
3. [How a blankflash is built](https://www.reddit.com/r/MotoG/comments/k73n66/guide_xt20451_i_built_a_blankflash_for_the_moto/)
4. [Motorola unbrick tool](https://xdaforums.com/t/dev-motorola-unbrick-tool.4491309/)
