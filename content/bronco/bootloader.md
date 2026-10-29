+++
title = "Bootloader unlock"
description = "Unlocking/relocking bootloader for ThinkPhone"
weight = 3
draft = false
updated = 2026-10-26
+++

> [!NOTE]
> This guide is based on [this](https://xdaforums.com/t/how-to-unlock-the-bootloader-on-the-motorola-thinkphone-xt2309-2-and-xt2309-3.4645702/) XDA Thread and general Motorola bootloader unlock procedure.

> [!WARNING]
> Before unlocking or relocking bootloader, you should know the purpose and consequences of doing so.

Bootloader unlocking allows device owner to freely flash supported firmware on the phone including [Custom ROMs](/bronco/custom-roms).
It will also cause losing the device integrity levels: DEVICE and STRONG. And some applications will refuse to work
if customized firmware or unlocked bootloader is detected.

Unlocking bootloader will:
- Allow to flash different firmware
- **Wipe your data**
- Give the full access to fastboot commands
- **Void your warranty**
- Break Play integrity

Devices can be ineligible: patched IMEI, enterprise/MDM units, region mismatch.

## Bootloader unlock

> [!WARNING]
> In case of failure or brick, refer to ["Recover Phone"](/bronco/recover) page.

**Prerequisites**
- Computer (Linux/Windows/MacOS)
- USB cable
- Motorola account
- ADB and Fastboot utilities
	- Windows
		- Use WinGet: `winget install -e --id Google.PlatformTools`
		- Download portable: [developer.android.com/tools/releases/platform-tools](https://developer.android.com/tools/releases/platform-tools)
	- Linux
		- Use distribution package manager (ex. Arch Linux): `pacman -S android-tools`
		- Download portable: [developer.android.com/tools/releases/platform-tools](https://developer.android.com/tools/releases/platform-tools)
	- MacOS
	    - Use Homebrew: `brew install --cask android-platform-tools`
		- Download portable: [developer.android.com/tools/releases/platform-tools](https://developer.android.com/tools/releases/platform-tools)
- Possibly
	- Motorola drivers: [en-us.support.motorola.com/app/usb-drivers](https://en-us.support.motorola.com/app/usb-drivers)

### Enable OEM unlocking

1. Enable developer options on phone.
	- Settings -> About Phone -> Build Number (tap on this 7 times)​
2. Toggle **OEM Unlocking** option on.

> For some devices a 7-day wait can appear. Bypass methods include: factory reset device and don't connect to internet.

### Unlocking bootloader with fastboot

1. Plug device to usb with usb cable.
2. Enter fastboot mode by powering phone off, then hold down both the <kbd>VOLUME DOWN</kbd> and <kbd>POWER</kbd> key at the same time.​
3. Check device connection with: `fastboot devices`, a device with state fastboot should appear.
4. Get unlock string with `fastboot oem get_unlock_data`
5. You should see multiple lines (5) with code for the bootloader unlock. Copy the strings and make a single string from them all (single line, no spaces).
6. Go to [Bootloader unlock page](https://en-us.support.motorola.com/app/standalone/bootloader/unlock-your-device-b)
7. Sign in with motorola account, proceed with the unlock procedure. **This will void your warranty!** The unlock code will be e-mailed.
8. After receiving the code **save the code in a very safe place like a notepad, cloud or password manager**.
9. Unlock bootloader with `fastboot oem unlock YOURCODEHERE`. This will wipe your data!
10. Confirm bootloader unlock on device.

## Locking bootloader

> [!IMPORTANT]
> This section needs clarification and verification, follow only if really sure about it.

> [!CAUTION]
> Locking bootloader with any derivation from the stock firmware (like magisk boot image) will cause a hardbrick!
> Flashing stock firmware with an older bootloader is unrecoverable — the bootloader will refuse to boot while locked, not even with a stock ROM. Read [this.](https://xdaforums.com/t/thinkphone-avb_custom_key-support.4753245/post-90254840)

1. Flash [stock firmware](/bronco/stock-fw) with at least same or newer bootloader version string as your current firmware.
	- Check your current bootloader version with: `fastboot getvar version-bootloader`. With output like `MBM-3.0-bronco-<hash>-<yymmdd>-<build>-<hash>`, check the "yymmdd" timestamp; if the firmware you're flashing has an older one, be cautious.
	- If the `WARNING: … downgrade, N vs M` appears, DO NOT LOCK! Flash newer firmware.
2. Both slots (A and B) need to have unmodified stock firmware.
3. Lock the bootloader with `fastboot oem lock` - This will wipe data!

## AVB Keys

This section will be populated with info later. For now refer to threads [1](https://xdaforums.com/t/thinkphone-avb_custom_key-support.4753245/#post-90254840), [2](https://github.com/chenxiaolong/avbroot/issues/494#issuecomment-3221394416)

## Sources

1. [How to Unlock the Bootloader on the Motorola ThinkPhone (XT2309-2 and XT2309-3)](https://xdaforums.com/t/how-to-unlock-the-bootloader-on-the-motorola-thinkphone-xt2309-2-and-xt2309-3.4645702/)
2. [Thinkphone avb_custom_key support](https://xdaforums.com/t/thinkphone-avb_custom_key-support.4753245/post-90254840)
3. [How to Relock the Bootloader on the Motorola ThinkPhone (XT2309-2 and XT2309-3)](https://xdaforums.com/t/how-to-relock-the-bootloader-on-the-motorola-thinkphone-xt2309-2-and-xt2309-3.4761131/)
4. [OEM unlocking is greyed out](https://xdaforums.com/t/oem-unlocking-is-greyed-out.4644021/)
5. [Motorola ThinkPhone XT2309-2 VS XT2309-3](https://xdaforums.com/t/motorola-thinkphone-xt2309-2-vs-xt2309-3.4758083/)
6. [This may be a more generic question (e-fuse status) but…](https://xdaforums.com/t/this-may-be-a-more-generic-question-e-fuse-status-but.4800081/)
7. [How to Root the Motorola ThinkPhone (XT2309-2 and XT2309-3)](https://xdaforums.com/t/how-to-root-the-motorola-thinkphone-xt2309-2-and-xt2309-3.4646332/)
8. [avbroot issue #494](https://github.com/chenxiaolong/avbroot/issues/494#issuecomment-3221394416)
9. [chenxiaolong/avbroot](https://github.com/chenxiaolong/avbroot)
10. [Motorola bootloader unlock page](https://en-us.support.motorola.com/app/standalone/bootloader/unlock-your-device-b)
