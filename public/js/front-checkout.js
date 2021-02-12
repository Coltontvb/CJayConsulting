// Create an instance of the Stripe object with your publishable API key
const stripe = Stripe("pk_test_51IJCF4EBTyBaxuv5QgnfjNhWTruxs2xQMaqXgDFYDlTZpPoSjJJub0IjkRcM3UaZsH1J6vtTHTyYefSHrGQ37pWt00JmQREhNj");

const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", function () {
  fetch("payment/create-checkout-session", {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.log(`Error: ${error}`);
    });
});