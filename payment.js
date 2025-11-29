function setValue(value) {
  document.querySelector("#amount").value = value;
}
const donationForm = document.querySelector("#donationForm");
donationForm.addEventListener("submit", async (e) => {
  e.preventDefault();


  const amount = document.querySelector("#amount").value;
  const name = document.querySelector("#name").value;
  const message = document.querySelector("#message").value

  const payload = {
    "identifier": "AO001",
    "currency": "kz",
    "amount": Number(amount),
    "gateway_methods": [
      "MulticaixaExpress"
    ],
    "details": "Pilha",
    "ipn_url": "https://seusite.com/callback.php",
    "cancel_url": "https://seusite.com/pedido-cancelado.php",
    "success_url": "https://seusite.com/pagamento-bem-sucedido.php",
    "public_key": "pro_ps6e2ys5ge8djfmc6jwjlq0nnbd4xl9pkclkfxa8bjqaalijhq12",
    "site_name": "Minha loja",
    "site_logo": "https://seusite.com/logo.png",
    "checkout_theme": "light",

    "customer": {
      "first_name": name,
      "last_name": "Singui",
      "email": "email@gmail.com",
      "mobile": "926240472"
    },

    "shipping_info": {
      "address_one": "",
      "address_two": "",
      "area": "",
      "city": "",
      "sub_city": "",
      "state": "",
      "postcode": "",
      "country": "",
      "others": ""
    },

    "billing_info": {
      "address_one": "",
      "address_two": "",
      "area": "",
      "city": "",
      "sub_city": "",
      "state": "",
      "postcode": "",
      "country": "",
      "others": ""
    }
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    alert("Erro ao processar o pagamento")
    return;
  }

  const data = await response.json();
  const { redirect_url } = data;
  location.href = redirect_url;
})
