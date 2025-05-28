let COMPONENT_HANDLE = Virtual.getHandle("boolean:200");  // Adjust ID if needed

Shelly.addEventHandler(function (event) {
  if (
    typeof event !== "object" ||
    event.name !== "lora" ||
    !event.info ||
    !event.info.data
  ) {
    return;
  }

  try {
    let decoded = atob(event.info.data);
    let byte = decoded.charCodeAt(0);

    if (byte === 0 || byte === 1) {
      let value = (byte === 1);
      COMPONENT_HANDLE.setValue(value);
      print("Updated virtual boolean to:", value);
    } else {
      print("Unexpected LoRa byte:", byte);
    }
  } catch (e) {
    print("Error decoding LoRa payload:", e);
  }
});
