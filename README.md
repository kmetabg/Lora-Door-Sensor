# 📡 Shelly LoRa Door Sensor Integration (BLU → LoRa → Boolean)

This guide explains how to send the state of a **Shelly BLU Door/Window sensor** over **LoRa** from one Shelly device (Sender) to another (Receiver), where it is reflected in a **virtual boolean component**.

This solution is designed to be **efficient and low-bandwidth**, sending only **1 byte** of data per update.

## 🔧 Requirements

- 2x Shelly Gen2/Gen3 devices with **Shelly LoRa Add-on** installed
- 1x **Shelly BLU Door/Window Sensor**
- Shelly firmware 1.2.0 or newer recommended

## 📤 Sender Device Setup

### 1. ✅ Pair the BLU sensor as a BTHome device
- Web UI → **Components → Add Component**
- Bluetooth → scan → choose your **Door/Window sensor**
- Add as **BTHome sensor**

### 2. 🔍 Identify the sensor in the component list
- Go to **Components**
- Click the sensor (e.g., DoorState)
- Find ID in the URL or component details  
  Example: `/components/202` means ID = `202`

### 3. ✏️ Update and paste the sender script
- Replace `DEVICE_ID` with your actual component ID

## 📥 Receiver Device Setup

### 1. ✅ Create a virtual boolean component
- Web UI → **Components → Add Component**
- Choose **Virtual → Boolean**, name it, and save
- Note the component ID (e.g., `200`)

### 2. ✏️ Update and paste the receiver script
- Replace `"boolean:200"` with your actual type and ID

## ⚠️ LoRa Settings
Make sure **both devices** have the same:
- **LoRa Channel**
- **Frequency Band (EU868/US915/etc.)**
- **Device ID**

Web UI → **Addons → Shelly LoRa Add-on** → Check settings

## ✅ Use Case
- Sensor on garage door → LoRa → indoor Shelly device
- Updates boolean → Home Assistant, automation, UI
