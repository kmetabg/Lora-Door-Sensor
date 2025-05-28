let CONFIG = {
  DEVICE_ID: 202,  // Door sensor component ID
  LORA_DST: 2      // Receiver LoRa ID
};

function sendLoraByte(byte) {
  let encoded = btoa(String.fromCharCode(byte));
  Shelly.call("Lora.SendBytes", { id: CONFIG.LORA_DST, data: encoded });
}

// Door sensor reporting
Shelly.addStatusHandler(function(e) {
  if (e.id === CONFIG.DEVICE_ID && typeof e.delta === "object" && typeof e.delta.value !== "undefined") {
    let isOpen = e.delta.value;
    sendLoraByte(isOpen ? 0x01 : 0x00);
    print("Door status sent:", isOpen ? "open" : "closed");
  }
});

// LoRa receive for output pulse trigger
Shelly.addEventHandler(function(event) {
//  print (event.name);
  if (
    typeof event === "object" &&
    event.name === "lora" &&
    event.info && event.info.data
  ) {
    try {
      let byte = atob(event.info.data).charCodeAt(0);
      if (byte === 0xA0) {
        print("Received pulse command → pulsing output");
        Shelly.call("Switch.Set", { id: 0, on: true });
        Timer.set(500, false, function() {
          Shelly.call("Switch.Set", { id: 0, on: false });
        });
      }
    } catch (e) {
      print("LoRa decode error:", e);
    }
  }
});
