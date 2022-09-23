async function handleSubmit() {
  const secret = document.getElementById("exampleInputSecret").value;
  const amount = document.getElementById("exampleInputAmount").value;
  await paymentWithXRPL(secret, amount);
}

async function paymentWithXRPL(secret, amount) {
  try {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    const wallet = xrpl.Wallet.fromSeed(secret);
    await client.connect();

    const prepared = await client.autofill({
      TransactionType: "Payment",
      Account: wallet.address,
      Amount: xrpl.xrpToDrops(amount),
      Destination: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    });
    const max_ledger = prepared.LastLedgerSequence;

    // Sign prepared instructions ------------------------------------------------
    const signed = wallet.sign(prepared);

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(signed.tx_blob);
    // Wait for validation -------------------------------------------------------
    // submitAndWait() handles this automatically, but it can take 4-7s.
    location.href = "/confirm.html";
    // End of main()
    client.disconnect();
  } catch (error) {
    console.log(error);
  }
}
