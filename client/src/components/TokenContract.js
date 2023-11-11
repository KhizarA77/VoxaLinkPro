export default function TokenContract() {
  // Add your contract details here
  const contractDetails = {
    address: "0xB6B3B930AF6Fa095D71876d268a89Def5f3e9894",
    decimal: "18",
    network: "ETH-Chain",
    tokenSymbol: "$VXLP",
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Token Contract</h2>
      <p className="text-sm mb-6">
        Use the contract information below to add the{" "}
        {contractDetails.tokenSymbol} token to your wallet.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h3 className="font-semibold">Address</h3>
          <p className="break-all">{contractDetails.address}</p>
        </div>
        <div>
          <h3 className="font-semibold">Decimal</h3>
          <p>{contractDetails.decimal}</p>
        </div>
        <div>
          <h3 className="font-semibold">Network</h3>
          <p>{contractDetails.network}</p>
        </div>
        <div>
          <h3 className="font-semibold">Token Symbol</h3>
          <p>{contractDetails.tokenSymbol}</p>
        </div>
      </div>
      <p className="text-xs text-red-500 mt-4">
        Please note that you should not send any tokens to this address, as
        doing so may result in the permanent loss of the tokens.
      </p>
    </div>
  );
}
