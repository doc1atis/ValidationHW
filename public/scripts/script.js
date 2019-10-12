console.log("java connected");
async function makeRequest() {
  const response = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "oliga nomala",
      password: "somaTolgy34",
      email: "jeangillescool@yahoo.com"
    })
  });
  console.log(await response.json());
}
makeRequest();
