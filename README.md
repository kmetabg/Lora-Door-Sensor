# 📡 Shelly LoRa Door Sensor Integration (BLU → LoRa → Boolean)

This guide explains how to send the state of a **Shelly BLU Door/Window sensor** over **LoRa** from one Shelly device (Sender) to another (Receiver), where it is reflected in a **virtual boolean component**.

This solution is designed to be **efficient and low-bandwidth**, sending only **1 byte** of data per update.

## 🔧 Requirements

- 2x Shelly Gen3/Gen4 devices with **Shelly LoRa Add-on** installed
- 1x **Shelly BLU Door/Window Sensor**
- Shelly firmware 1.6.2 or newer recommended

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

---

## 📁 Script Overview & Use Cases

This repository includes two sets of scripts:

---

### 🔹 **1. Door Sensor Only Logic (Basic Setup)**

These scripts handle only door/window state monitoring from a Shelly BLU sensor and sending that state to a receiver.

#### ✅ Files:

- `sender_dw_only.js`  
  📌 Sends `0x00` (closed) / `0x01` (open) to receiver when BTHome sensor changes

- `receiver_dw_only.js`  
  📌 Listens for `0x00` / `0x01` and updates virtual boolean accordingly

#### 🔁 Use case:
- You want to reflect **door state** in another Shelly device (e.g. display on UI or use in automation).
- No output relay or interaction involved.

---

### 🔹 **2. Full Logic (Door + Switch Control)**

These are the **current, recommended scripts** that support two-way interaction:

#### ✅ Files:

- `sender_full.js`  
  📌 Reports door state (`0x00` / `0x01`)  
  📌 Listens for LoRa byte `0xA0` and pulses **its own output** for 1 sec

- `receiver_full.js`  
  📌 Updates boolean on `0x00` / `0x01`  
  📌 Sends `0xA0` to sender when **its switch:0 is turned ON**

#### 🔁 Use case:
- You want to both:
  - See door open/close status on the receiver
  - Trigger the sender’s output (e.g. garage opener) from the receiver

---

## 🔄 Comparison Summary

| Feature                        | `*_dw_only.js`       | `*_full.js`              |
|-------------------------------|-----------------------|--------------------------|
| Door state monitoring         | ✅                    | ✅                       |
| Virtual boolean update        | ✅                    | ✅                       |
| Trigger sender output remotely| ❌                    | ✅ (`0xA0` via switch)   |
| Pulsing logic                 | ❌                    | ✅                       |
| Two-way LoRa communication    | ❌                    | ✅                       |

---

## 🔖 Naming Convention

| Script File         | Purpose                                 |
|---------------------|------------------------------------------|
| `sender_dw_only.js` | Door → Boolean update only               |
| `receiver_dw_only.js` | Boolean update only (from door)         |
| `sender_full.js`    | Door reporting + remote output pulse     |
| `receiver_full.js`  | Boolean update + switch sends pulse cmd  |
