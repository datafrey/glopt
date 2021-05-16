import IMask from "imask";

function phoneMask(selector) {
  const phoneInput = document.querySelector(selector);
  const maskOptions = {
    mask: '+0 (000) 000-00-00'
  };

  IMask(phoneInput, maskOptions);
}

export default phoneMask;
