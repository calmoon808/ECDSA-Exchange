const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const SHA256 = require('crypto-js/sha256');
const secp = require("@noble/secp256k1");

let prvKey1 = secp.utils.randomPrivateKey();
let prvKey2 = secp.utils.randomPrivateKey();
let prvKey3 = secp.utils.randomPrivateKey();

prvKey1 = Buffer.from(prvKey1).toString('hex');
prvKey2 = Buffer.from(prvKey2).toString('hex');
prvKey3 = Buffer.from(prvKey3).toString('hex');
console.log(prvKey1)
let pubKey1 = secp.getPublicKey(prvKey1);
let pubKey2 = secp.getPublicKey(prvKey2);
let pubKey3 = secp.getPublicKey(prvKey3);

pubKey1 = Buffer.from(pubKey1).toString('hex');
pubKey2 = Buffer.from(pubKey2).toString('hex');
pubKey3 = Buffer.from(pubKey3).toString('hex');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {}
balances[pubKey1.slice(-40)] = 100;
balances[pubKey2.slice(-40)] = 50;
balances[pubKey3.slice(-40)] = 25;
console.log(balances);

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, signature, recovery} = req.body;
  const msg = JSON.stringify({
    to: recipient,
    amount: parseInt(amount)
  });
  const msgHash = SHA256(msg).toString();
  const recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, parseInt(recovery));

  // if reconstructed public key matches sender public key
  if (balances[sender] === balances[buf2hex(recoveredPublicKey).slice(-40)]){
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender] });
    console.log(`${sender} has successfully sent ${amount} coins to ${recipient}`)
  } else {
    console.log("Verification failed");
    console.log(balances);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

// convert uint byte array to hex string
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}
