import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

const setCardType = (type) => {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "#D22DC2"],
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.src = `/cc-${type}.svg`;
};

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};

const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.getElementById("expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 8).slice(2),
    },
  },
};
const expirationDateMask = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find((item) => {
      return number.match(item.regex);
    });
    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector("form button");

addButton.addEventListener('click', () => alert('Cartão adicionado com sucesso!'))

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", (e) => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText =
    cardHolder.value.length > 0 ? cardHolder.value : "FULANO DA SILVA";
});

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.textContent = code.length === 0 ? "123" : code;
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateMask.on("accept", () => {
  updateExpirationDate(expirationDateMask.value)
});

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value");
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}

