let CONFIG = {
  DEVICE_ID: 202,   // Replace with your BTHome component ID
  LORA_DST: 2       // Receiver's LoRa ID
};

Shelly.addStatusHandler(function(status) {
  if (status.id === CONFIG.DEVICE_ID && typeof status.delta.value !== "undefined") {
    let isOpen = status.delta.value;
    let rawByte = isOpen ? "\x01" : "\x00";
    let encoded = btoa(rawByte);

    Shelly.call("Lora.SendBytes", {
      id: CONFIG.LORA_DST,
      data: encoded
    }, function (_, err_code, err_msg) {
      if (err_code !== 0) {
        print("LoRa send error:", err_code, err_msg);
      } else {
        print("LoRa sent:", isOpen ? "open" : "closed");
      }
    });
  }
});
