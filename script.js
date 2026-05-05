const complaints = {
  "Sakit Kepala": [
    "Nyeri berdenyut",
    "Pusing/Berat",
    "Sensitif cahaya",
    "Pandangan kabur",
  ],
  Mual: ["Ingin muntah", "Perut tak nyaman", "Mulut pahit", "Keringat dingin"],
  Diare: ["BAB > 3x sehari", "Kram perut", "Lemas", "Dehidrasi"],
  "Batuk & Pilek": [
    "Batuk kering",
    "Hidung tersumbat",
    "Sakit tenggorokan",
    "Demam ringan",
  ],
  "Luka Ringan": ["Luka gores", "Memar", "Bengkak", "Perdarahan"],
};

let appData = { nama: "", umur: 0, poli: "", nomor: "" };

// Fungsi Animasi Pindah Halaman
function goToStep(current, next) {
  const currentCard = document.getElementById(current);
  const nextCard = document.getElementById(next);

  currentCard.classList.add("out"); // Efek keluar (naik ke atas)
  setTimeout(() => {
    currentCard.classList.remove("active", "out");
    currentCard.classList.add("hidden");

    nextCard.classList.remove("hidden");
    setTimeout(() => nextCard.classList.add("active"), 50); // Efek masuk
  }, 450);

  if (next === "step-symptoms") initSymptoms();
}

function checkInput() {
  const n = document.getElementById("nama").value;
  const u = parseInt(document.getElementById("umur").value);
  const err = document.getElementById("error-box");

  if (n.length < 4 || isNaN(u) || u < 1 || u > 100) {
    err.innerText = "⚠️ Nama min. 4 huruf & Umur 1-100!";
    err.classList.remove("hidden");
    return;
  }
  appData.nama = n;
  appData.umur = u;
  goToStep("step-input", "step-emergency");
}

function initSymptoms() {
  const container = document.getElementById("list-gejala");
  container.innerHTML = "";
  for (let cat in complaints) {
    let html = `<span class="cat-title">${cat}</span>`;
    complaints[cat].forEach((s) => {
      html += `<label class="check-item"><input type="checkbox" class="cb-gejala"> ${s}</label>`;
    });
    container.innerHTML += html;
  }
}

function finalProcess(type) {
  if (type === "emergency") {
    appData.poli = "IGD (DARURAT)";
    appData.nomor = "EMR-" + Math.floor(Math.random() * 100);
  } else {
    const count = document.querySelectorAll(".cb-gejala:checked").length;
    // Logika flowchart: Jika gejala >= 5 maka ke IGD
    if (count >= 5) {
      appData.poli = "IGD (GEJALA BERAT)";
      appData.nomor = "EMR-" + Math.floor(Math.random() * 100);
    } else {
      let info =
        appData.umur <= 18
          ? { n: "Anak", c: "A" }
          : appData.umur >= 50
            ? { n: "Lansia", c: "L" }
            : { n: "Umum", c: "U" };
      appData.poli = "Poli " + info.n;
      appData.nomor = info.c + "-" + (Math.floor(Math.random() * 50) + 1);
    }
  }
  showReceipt();
}

function showReceipt() {
  document.getElementById("res-nama").innerText = appData.nama;
  document.getElementById("res-poli").innerText = appData.poli;
  document.getElementById("res-nomor").innerText = appData.nomor;
  document.getElementById("res-date").innerText = new Date().toLocaleString(
    "id-ID",
  );

  // Generate QR Code
  document.getElementById("qr-code-box").innerHTML = "";
  new QRCode(document.getElementById("qr-code-box"), {
    text: appData.nomor + " | " + appData.nama,
    width: 120,
    height: 120,
  });

  const currentStep = document.querySelector(".card.active").id;
  goToStep(currentStep, "step-result");
}

function saveAsPDF() {
  const el = document.getElementById("printable-area");
  const opt = {
    margin: 10,
    filename: `Antrian_${appData.nama}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(el).save();
}
