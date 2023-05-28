import pwafire from "https://unpkg.com/pwafire/esm/index.js";
const pwa = pwafire.pwa;
const getContactsButton = document.getElementById("contact-picker");
const props = ["name", "email", "tel"];
const options = { multiple: true };

getContactsButton.addEventListener("click", async () => {
  // Do something with the promise value...
  pwa.Contacts(props, options).then(res => {
    // Do something with contacts...
    const contacts =
      res.type === "success" ? res.contacts : alert(res.error.message);
  });
});