const secp = require("@noble/secp256k1");
const SHA256 = require('crypto-js/sha256');
(async () => {
  // copy-paste a private key generated when running server/index.js
  const privateKey = "145fce743448ca9e3a4dc09e7328fefe8d9c0a160b4891fe5b8643dea03c629c";

  // copy-paste a separate account from your server db in to
  // send an amount less than your current balance!
  const message = JSON.stringify({
    to: "9d79e971674ceb0608b945fbc1192a6581d65edc",
    amount: 10
  });

  // hash your message
  const messageHash = SHA256(message).toString();

  // use secp.sign() to produce signature and recovery bit (response is an array of two elements)
  const signatureArray = await secp.sign(messageHash, privateKey, {
    recovered: true
  });
  // separate out returned array into the string signature and the number recoveryBit
  const signature = signatureArray[0];
  const recoveryBit = signatureArray[1];

  // convert uint byte array to hex string
  function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }
  
  // use these values in your client!
  // console.log(signatureArray.toString('hex'))
  console.log("Signature: " + buf2hex(signature));
  console.log("Recovery bit: " + recoveryBit);
})();