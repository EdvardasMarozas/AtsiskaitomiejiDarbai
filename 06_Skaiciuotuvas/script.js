let $toggler = document.getElementById("toggler"),
  $calculator = document.querySelector(".calculator");

if ($calculator.classList.contains("dark")) {
  $toggler.querySelector("#light").style.display = "block";
  $toggler.querySelector("#dark").style.display = "none";
} else {
  $toggler.querySelector("#light").style.display = "none";
  $toggler.querySelector("#dark").style.display = "block";
}

$toggler.addEventListener("click", function () {
  $calculator.classList.toggle("dark");

  if ($calculator.classList.contains("dark")) {
    $toggler.querySelector("#light").style.display = "block";
    $toggler.querySelector("#dark").style.display = "none";
  } else {
    $toggler.querySelector("#light").style.display = "none";
    $toggler.querySelector("#dark").style.display = "block";
  }
});

const mygtukai = document.getElementsByClassName("skaicius");
const operacijuMygtukai = document.querySelectorAll("[data-operacija]");
const operacijosRezultatas = document.querySelector(
  ".calculator-operation-result"
);
const operacijosSkaiciavimai = document.querySelector(".calculator-operation");
const clearMygtukas = document.querySelector(".clear-mygtukas");
const taskas = document.querySelector("[data-taskas]");
const nulis = document.querySelector(".nulis");
const deleteMygtukas = document.querySelector(".delete-mygtukas");
const lyguMygtukas = document.querySelector(".lygu");
const procentai = document.querySelector(".procentai");
let a;
let d = 0;
let pirmSkc;
let pirmasSkaicius;
let procentuSimbol;
for (let i = 0; i < mygtukai.length; i++) {
  mygtukai[i].addEventListener("click", (mygtukas) => {
    if (
      (operacijosRezultatas.innerText.length < 9) |
      operacijosSkaiciavimai.innerText.includes("=")
    ) {
      operacijosRezultatas.style.fontSize = "42px";
    }
    if (
      (operacijosRezultatas.innerText.length >= 16) &
      !operacijosSkaiciavimai.innerHTML.includes("=")
    ) {
      return;
    }
    if (
      (operacijosRezultatas.innerText == 0) &
      (operacijosRezultatas.innerText.length == 1)
    )
      operacijosRezultatas.innerText = "";
    if (operacijosSkaiciavimai.innerText.includes("=")) {
      operacijosRezultatas.innerText = "";
      operacijosSkaiciavimai.innerHTML = "&nbsp;";
      pirmasSkaicius = 0;
    }
    if (procentuSimbol != undefined) {
      if (operacijosSkaiciavimai.innerText != 0) {
        operacijosSkaiciavimai.innerText = pirmasSkaicius + procentuSimbol;
      }
      operacijosRezultatas.innerText = "";
      procentuSimbol = undefined;
    }
    operacijosRezultatas.innerText += mygtukas.currentTarget.innerText;
    skaiciuFontoKeitimas();
    d = 0;
  });
}
for (let i = 0; i < operacijuMygtukai.length; i++) {
  operacijuMygtukai[i].addEventListener("click", (mygtukas) => {
    if (operacijosSkaiciavimai.innerText.includes("="))
      operacijosSkaiciavimai.innerText = operacijosRezultatas.innerText;
    if (
      (operacijosSkaiciavimai.innerText.includes("+") |
        operacijosSkaiciavimai.innerText.includes("-") |
        operacijosSkaiciavimai.innerText.includes("x") |
        operacijosSkaiciavimai.innerText.includes("÷")) &
      (operacijosRezultatas.innerText == 0)
    ) {
      operacijosSkaiciavimai.innerText =
        a + mygtukas.currentTarget.dataset.operacija;
    } else if (
      operacijosSkaiciavimai.innerText.includes("+") |
      operacijosSkaiciavimai.innerText.includes("-") |
      operacijosSkaiciavimai.innerText.includes("x") |
      operacijosSkaiciavimai.innerText.includes("÷")
    ) {
      if (!operacijosRezultatas.innerText.includes("-"))
        operacijosSkaiciavimai.innerText = apskaiciavimas();
      a = parseFloat(operacijosSkaiciavimai.innerText);
      operacijosSkaiciavimai.innerText +=
        mygtukas.currentTarget.dataset.operacija;
    } else {
      operacijosSkaiciavimai.innerText =
        operacijosRezultatas.innerText +
        mygtukas.currentTarget.dataset.operacija;
      a = operacijosRezultatas.innerText;
    }
    operacijosRezultatas.innerText = 0;
    d = 0;
    procentuSimbol = undefined;
    operacijosSkaiciavimai.style.fontSize = "18px";
  });
}
clearMygtukas.addEventListener("click", myClear);
taskas.addEventListener("click", myTaskas);
nulis.addEventListener("click", myNulis);
deleteMygtukas.addEventListener("click", myDelete);
lyguMygtukas.addEventListener("click", myLygu);
procentai.addEventListener("click", myProcentai);
function apskaiciavimas(num1, num2) {
  num1 = parseFloat(operacijosSkaiciavimai.innerText);
  num2 = parseFloat(operacijosRezultatas.innerText);
  if (operacijosSkaiciavimai.innerText.includes("x")) {
    result = num1 * num2;
  } else if (
    operacijosSkaiciavimai.innerText.includes("÷") |
    operacijosSkaiciavimai.innerText.includes("/")
  ) {
    result = num1 / num2;
  } else if (operacijosSkaiciavimai.innerText.includes("+")) {
    result = num1 + num2;
  } else if (operacijosSkaiciavimai.innerText.includes("-")) {
    result = num1 - num2;
  } else {
    return;
  }
  return result;
}
function lyguApskaiciavimas(num1, num2) {
  num1 = parseFloat(operacijosRezultatas.innerText);
  num2 = parseFloat(pirmSkc);
  if (operacijosSkaiciavimai.innerText.includes("x")) {
    result = num1 * num2;
  } else if (
    operacijosSkaiciavimai.innerText.includes("÷") |
    operacijosSkaiciavimai.innerText.includes("/")
  ) {
    result = num1 / num2;
  } else if (operacijosSkaiciavimai.innerText.includes("+")) {
    result = num1 + num2;
  } else if (operacijosSkaiciavimai.innerText.includes("-")) {
    result = num1 - num2;
  } else {
    return;
  }
  return result;
}
document.body.addEventListener("keyup", (event) => {
  if (
    (event.key == 1) |
    (event.key == 2) |
    (event.key == 3) |
    (event.key == 4) |
    (event.key == 5) |
    (event.key == 6) |
    (event.key == 7) |
    (event.key == 8) |
    (event.key == 9) |
    (event.key == 0) |
    (event.key == "+") |
    (event.key == "Backspace") |
    (event.key == "-") |
    (event.key == "c") |
    (event.key == "C") |
    (event.key == "*") |
    (event.key == "/") |
    (event.key == "=") |
    (event.key == "Enter") |
    (event.key == ".") |
    (event.key == "%")
  ) {
    if (
      (event.key == 1) |
      (event.key == 2) |
      (event.key == 3) |
      (event.key == 4) |
      (event.key == 5) |
      (event.key == 6) |
      (event.key == 7) |
      (event.key == 8) |
      (event.key == 9)
    ) {
      if (
        (operacijosRezultatas.innerText.length < 9) |
        operacijosSkaiciavimai.innerText.includes("=")
      ) {
        operacijosRezultatas.style.fontSize = "42px";
      }
      if (
        (operacijosRezultatas.innerText.length >= 16) &
        !operacijosSkaiciavimai.innerHTML.includes("=")
      ) {
        return;
      }
      if (
        (operacijosRezultatas.innerText == 0) &
        (operacijosRezultatas.innerText.length == 1)
      )
        operacijosRezultatas.innerText = "";
      if (operacijosSkaiciavimai.innerText.includes("=")) {
        operacijosRezultatas.innerText = "";
        operacijosSkaiciavimai.innerHTML = "&nbsp;";
        pirmasSkaicius = 0;
      }
      if (procentuSimbol != undefined) {
        if (operacijosSkaiciavimai.innerText != 0) {
          operacijosSkaiciavimai.innerText = pirmasSkaicius + procentuSimbol;
        }
        operacijosRezultatas.innerText = "";
        procentuSimbol = undefined;
      }

      operacijosRezultatas.innerText += event.key;
      skaiciuFontoKeitimas();
      d = 0;
    }
    if (
      (event.key == "+") |
      (event.key == "-") |
      (event.key == "*") |
      (event.key == "/")
    ) {
      let key = event.key == "*" ? "x" : event.key;
      if (operacijosSkaiciavimai.innerText.includes("="))
        operacijosSkaiciavimai.innerText = operacijosRezultatas.innerText;
      if (
        (operacijosSkaiciavimai.innerText.includes("+") |
          operacijosSkaiciavimai.innerText.includes("-") |
          operacijosSkaiciavimai.innerText.includes("x") |
          operacijosSkaiciavimai.innerText.includes("/")) &
        (operacijosRezultatas.innerText == 0)
      ) {
        operacijosSkaiciavimai.innerText = a + key;
      } else if (
        operacijosSkaiciavimai.innerText.includes("+") |
        operacijosSkaiciavimai.innerText.includes("-") |
        operacijosSkaiciavimai.innerText.includes("x") |
        operacijosSkaiciavimai.innerText.includes("/")
      ) {
        if (!operacijosRezultatas.innerText.includes("-"))
          operacijosSkaiciavimai.innerText = apskaiciavimas();
        a = parseFloat(operacijosSkaiciavimai.innerText);
        operacijosSkaiciavimai.innerText += event.key;
      } else {
        operacijosSkaiciavimai.innerText = operacijosRezultatas.innerText + key;
        a = operacijosRezultatas.innerText;
      }
      operacijosRezultatas.innerText = 0;
      d = 0;
      procentuSimbol = undefined;
      operacijosSkaiciavimai.style.fontSize = "18px";
    }
    if ((event.key == "c") | (event.key == "C")) {
      myClear();
    }
    if (event.key == "Backspace") {
      myDelete();
    }
    if (event.key == ".") {
      myTaskas();
    }
    if (event.key == 0) {
      myNulis();
    }
    if ((event.key == "=") | (event.key == "Enter")) {
      myLygu();
    }
    if (event.key == "%") {
      myProcentai();
    }
  }
});
function skaiciuFontoKeitimas() {
  if (operacijosRezultatas.innerText.length == 9) {
    operacijosRezultatas.style.fontSize = "40px";
  } else if (operacijosRezultatas.innerText.length == 10) {
    operacijosRezultatas.style.fontSize = "38px";
  } else if (operacijosRezultatas.innerText.length == 11) {
    operacijosRezultatas.style.fontSize = "36px";
  } else if (operacijosRezultatas.innerText.length == 12) {
    operacijosRezultatas.style.fontSize = "34px";
  } else if (operacijosRezultatas.innerText.length == 13) {
    operacijosRezultatas.style.fontSize = "32px";
  } else if (operacijosRezultatas.innerText.length == 14) {
    operacijosRezultatas.style.fontSize = "30px";
  } else if (operacijosRezultatas.innerText.length == 15) {
    operacijosRezultatas.style.fontSize = "26px";
  }
}
function myClear() {
  procentuSimbol = undefined;
  operacijosRezultatas.style.fontSize = "42px";
  operacijosSkaiciavimai.style.fontSize = "18px";
  operacijosSkaiciavimai.innerHTML = "&nbsp;";
  operacijosRezultatas.innerText = 0;
}
function myTaskas() {
  if (operacijosRezultatas.innerText.includes(".")) return;
  operacijosRezultatas.innerText += ".";
}
function myNulis() {
  if (
    (operacijosRezultatas.innerText == 0) &
    (operacijosRezultatas.innerText.length == 1)
  )
    return;
  if (operacijosSkaiciavimai.innerText.includes("=")) {
    operacijosRezultatas.innerText = "";
    operacijosSkaiciavimai.innerHTML = "&nbsp;";
  }
  operacijosRezultatas.innerText += 0;
}
function myDelete() {
  if (operacijosRezultatas.innerText.length == 1)
    operacijosRezultatas.innerText = 0;
  else
    operacijosRezultatas.innerText = operacijosRezultatas.innerText.slice(
      0,
      -1
    );
}
function myLygu() {
  let simbolis;
  if (d == 0) {
    pirmSkc = operacijosRezultatas.innerText;
  }
  if (procentuSimbol != undefined) {
    operacijosSkaiciavimai.innerText = pirmasSkaicius + procentuSimbol;
    procentuSimbol = undefined;
  }
  if (
    operacijosSkaiciavimai.innerText.includes("=") &
    (apskaiciavimas() != undefined)
  ) {
    simbolis = operacijosSkaiciavimai.innerText.substr(
      -(pirmSkc.length + 2),
      1
    );
    operacijosSkaiciavimai.innerText =
      operacijosRezultatas.innerText + simbolis + pirmSkc + "=";
    operacijosRezultatas.innerText = lyguApskaiciavimas();
  } else {
    if (apskaiciavimas() == undefined) {
      operacijosSkaiciavimai.innerText = operacijosRezultatas.innerText + "=";
    } else {
      operacijosSkaiciavimai.innerText += operacijosRezultatas.innerText + "=";
      operacijosRezultatas.innerText = apskaiciavimas();
    }
  }
  if (operacijosRezultatas.innerText.length >= 17) {
    operacijosRezultatas.innerText = parseFloat(
      operacijosRezultatas.innerText
    ).toFixed(1);
  }
  if (
    (operacijosRezultatas.innerText.length > 16) |
    (operacijosSkaiciavimai.innerText.length > 16)
  ) {
    operacijosRezultatas.style.fontSize = "large";
  }
  if (operacijosSkaiciavimai.innerText.length >= 30) {
    operacijosSkaiciavimai.style.fontSize = "11px";
  } else if (operacijosSkaiciavimai.innerText.length >= 20) {
    operacijosSkaiciavimai.style.fontSize = "small";
  }
  d = 1;
}
function myProcentai() {
  if (procentuSimbol == undefined) {
    procentuSimbol = operacijosSkaiciavimai.innerText.substr(-1, 1);
  }
  pirmasSkaicius = parseFloat(operacijosSkaiciavimai.innerText);
  if (
    operacijosSkaiciavimai.innerText.includes("+") |
    operacijosSkaiciavimai.innerText.includes("-")
  ) {
    if (operacijosRezultatas.innerText.length > 10) {
      operacijosRezultatas.innerText = (
        (operacijosRezultatas.innerText * pirmasSkaicius) /
        100
      ).toFixed(9);
    } else if (
      ((operacijosRezultatas.innerText * pirmasSkaicius) / 100).toString()
        .length > 10
    ) {
      operacijosRezultatas.innerText = (
        (operacijosRezultatas.innerText * pirmasSkaicius) /
        100
      ).toFixed(5);
    } else {
      operacijosRezultatas.innerText =
        (operacijosRezultatas.innerText * pirmasSkaicius) / 100;
    }
    operacijosSkaiciavimai.innerText =
      pirmasSkaicius + procentuSimbol + operacijosRezultatas.innerText;
  }
  if (
    operacijosSkaiciavimai.innerText.includes("÷") |
    operacijosSkaiciavimai.innerText.includes("x")
  ) {
    operacijosRezultatas.innerText = operacijosRezultatas.innerText / 100;
    operacijosSkaiciavimai.innerText =
      pirmasSkaicius + procentuSimbol + operacijosRezultatas.innerText;
  }
  if (operacijosSkaiciavimai.innerHTML == "&nbsp;") {
    operacijosSkaiciavimai.innerText = 0;
    operacijosRezultatas.innerText = 0;
  }
}