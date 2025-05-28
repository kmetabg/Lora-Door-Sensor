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
