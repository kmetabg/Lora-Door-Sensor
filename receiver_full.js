let BOOL_HANDLE = Virtual.getHandle("boolean:200");
let SENDER_ID = 1;  // ID of the sender device

function sendPulseCommandToSender() {
  let encoded = btoa("\xA0");
  Shelly.call("Lora.SendBytes", { id: SENDER_ID, data: encoded });
}

// Handle incoming LoRa data
Shelly.addEventHandler(function(event) {
  if (
    typeof event !== "object" ||
    event.name !== "lora" ||
    !event.info || !event.info.data
  ) return;

  try {
    let byte = atob(event.info.data).charCodeAt(0);

    if (byte === 0x00 || byte === 0x01) {
      let value = (byte === 0x01);
      BOOL_HANDLE.setValue(value);
      print("Door status updated:", value);
    } else {
      print("Unknown LoRa byte:", byte);
    }
  } catch (e) {
    print("LoRa decode error:", e);
  }
});

// When receiver's switch:0 is turned ON → send pulse request to sender
Shelly.addStatusHandler(function(e) {
  if (e.component === "switch:0" && typeof e.delta === "object" && e.delta.output === true) {
    print("Switch ON → sending pulse command to sender");
    sendPulseCommandToSender();
  }
});
