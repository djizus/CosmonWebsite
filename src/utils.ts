export const hasKeplr = () => {
  return window.getOfflineSigner && window.keplr
}

export const connectWallet = async () => {
  if (hasKeplr()) {
    if (window.keplr.experimentalSuggestChain) {
      try {
        // await window.keplr.experimentalSuggestChain(chainConfig)
        // await window.keplr.enable(config.CHAIN_ID)
        // const offlineSigner = window.getOfflineSigner(config.CHAIN_ID)
        // const accounts = await offlineSigner.getAccounts()
        // localStorage.setItem('connect', 'TRUE')
        // const balance = await getBalance(accounts[0].address)
        // return {
        //   address: accounts[0].address,
        //   balance: balance,
        // }
      } catch {
        alert('Failed to suggest the chain')
      }
    }
  } else {
    alert('You need to have a keplr wallet installed')
  }
}
