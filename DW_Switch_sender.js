let CONFIG = {
  DEVICE_ID: 202,  // BTHome sensor component ID
  LORA_DST: 2      // LoRa Receiver Device ID
};

// 🔁 LoRa send function
function sendLoraByte(byte) {
  let encoded = btoa(String.fromCharCode(byte));

  Shelly.call("Lora.SendBytes", {
    id: CONFIG.LORA_DST,
    data: encoded
  }, function (_, err_code, err_msg) {
    if (err_code !== 0) {
      print("LoRa send error:", err_code, err_msg);
    } else {
      print("LoRa sent byte:", byte);
    }
  });
}

// 🧠 Status handler for door sensor and output
Shelly.addStatusHandler(function(e) {
  // ✅ Door sensor status (no component for direct bthomesensor.GetStatus)
  if (e.id === CONFIG.DEVICE_ID && typeof e.delta === "object" && typeof e.delta.value !== "undefined") {
    let isOpen = e.delta.value;
    sendLoraByte(isOpen ? 0x01 : 0x00);
    print("Door state changed:", isOpen ? "open" : "closed");
  }

  // ✅ Output state from switch:0
  if (e.component === "switch:0" && typeof e.delta === "object" && typeof e.delta.output !== "undefined") {
    let isOn = e.delta.output;
    sendLoraByte(isOn ? 0x10 : 0x11);
    print("Output changed:", isOn ? "ON" : "OFF");
  }
});
