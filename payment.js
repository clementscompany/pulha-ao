function setValue(value) {
  document.querySelector("#amount").value = value;
}
const donationForm = document.querySelector("#donationForm");
const submitBtn = document.querySelector("#submitBtn");
const errorCard = document.querySelector("#errorCard");
const errorBody = errorCard ? errorCard.querySelector(".error-card__body") : null;

function setLoading(state) {
  if (!submitBtn) return;
  submitBtn.disabled = !!state;
  submitBtn.classList.toggle("loading", !!state);
}

function showFieldError(field, message) {
  const el = document.querySelector(`#error-${field}`);
  if (el) el.textContent = message || "";
}

function clearErrors() {
  showFieldError("name", "");
  showFieldError("amount", "");
}

function validateForm() {
  let ok = true;
  const name = document.querySelector("#name").value.trim();
  const amountStr = document.querySelector("#amount").value.trim();
  const amountNum = Number(amountStr);
  if (!name) { showFieldError("name", "Informe o seu nome"); ok = false; }
  else if (name.length < 2) { showFieldError("name", "Nome muito curto"); ok = false; }
  if (!amountStr) { showFieldError("amount", "Informe o valor"); ok = false; }
  else if (Number.isNaN(amountNum)) { showFieldError("amount", "Valor inválido"); ok = false; }
  else if (amountNum < 100) { showFieldError("amount", "Valor mínimo é 100 KZ"); ok = false; }
  return ok;
}

function showErrorCard(message) {
  if (!errorCard || !errorBody) return;
  errorBody.textContent = message || "Erro ao processar o pagamento";
  errorCard.hidden = false;
}

function hideErrorCard() {
  if (!errorCard) return;
  errorCard.hidden = true;
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList && e.target.classList.contains("error-card__close")) hideErrorCard();
});

donationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();
  if (!validateForm()) return;
  const amount = document.querySelector("#amount").value.trim();
  const name = document.querySelector("#name").value.trim();
  const payload = {
    identifier: "AO001",
    currency: "kz",
    amount: Number(amount),
    gateway_methods: ["MulticaixaExpress"],
    details: "Pilha",
    ipn_url: "https://seusite.com/callback.php",
    cancel_url: "https://seusite.com/pedido-cancelado.php",
    success_url: "https://seusite.com/pagamento-bem-sucedido.php",
    public_key: "pro_ps6e2ys5ge8djfmc6jwjlq0nnbd4xl9pkclkfxa8bjqaalijhq12",
    site_name: "Minha loja",
    site_logo: "https://seusite.com/logo.png",
    checkout_theme: "light",
    customer: {
      first_name: name,
      last_name: "Singui",
      email: "email@gmail.com",
      mobile: "926240472"
    },
    shipping_info: {},
    billing_info: {}
  };
  try {
    setLoading(true);
    const response = await fetch("https://pilha-ao-server.onrender.com/api/pagar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      const msg = typeof data === "string" ? data : (data && (data.message || data.error)) || "Erro ao processar o pagamento";
      showErrorCard(msg);
      return;
    }
    const { redirect_url } = data;
    location.href = redirect_url;
  } catch (err) {
    showErrorCard("Falha de conexão. Tente novamente.");
  } finally {
    setLoading(false);
  }
});
