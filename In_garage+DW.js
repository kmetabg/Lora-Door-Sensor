let CONFIG = {
  DEVICE_ID: 202,  // BTHome sensor ID
  LORA_DST: 2      // LoRa Receiver ID
};

// Monitor both the door sensor and the switch output
Shelly.addStatusHandler(function(status) {
  // Door sensor sync (1 byte)
  if (status.id === CONFIG.DEVICE_ID && typeof status.delta.value !== "undefined") {
    let isOpen = status.delta.value;
    let byte = isOpen ? "\x01" : "\x00";
    let encoded = btoa(byte);

    Shelly.call("Lora.SendBytes", {
      id: CONFIG.LORA_DST,
      data: encoded
    });
  }

  // Output state sync
  if (status.component === "switch" && status.id === 0 && typeof status.delta.output !== "undefined") {
    let byte = status.delta.output ? "\x10" : "\x11";  // ON = 0x10, OFF = 0x11
    let encoded = btoa(byte);

    Shelly.call("Lora.SendBytes", {
      id: CONFIG.LORA_DST,
      data: encoded
    });

    print("Sent output state over LoRa:", status.delta.output ? "ON" : "OFF");
  }
});
