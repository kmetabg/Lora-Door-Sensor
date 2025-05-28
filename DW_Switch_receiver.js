let BOOL_HANDLE = Virtual.getHandle("boolean:200");

Shelly.addEventHandler(function (event) {
  if (
    typeof event !== "object" ||
    event.name !== "lora" ||
    !event.info ||
    !event.info.data
  ) return;

  try {
    let decoded = atob(event.info.data);
    let byte = decoded.charCodeAt(0);

    if (byte === 0 || byte === 1) {
      let value = (byte === 1);
      BOOL_HANDLE.setValue(value);
      print("Virtual boolean updated to:", value);
    } else if (byte === 0x10) {
      Shelly.call("Switch.Set", { id: 0, on: true });
      print("Output turned ON via LoRa");
    } else if (byte === 0x11) {
      Shelly.call("Switch.Set", { id: 0, on: false });
      print("Output turned OFF via LoRa");
    } else {
      print("Unknown LoRa command byte:", byte);
    }
  } catch (e) {
    print("LoRa decode error:", e);
  }
});

// 🔁 Local switch trigger = pulse output
Shelly.addStatusHandler(function(e) {
  if (e.component === "switch:0" && typeof e.delta === "object" && e.delta.output === true) {
    print("Local switch:0 triggered → pulse output");

    Shelly.call("Switch.Set", { id: 0, on: true });

    Timer.set(500, false, function() {
      Shelly.call("Switch.Set", { id: 0, on: false });
    });
  }
});
