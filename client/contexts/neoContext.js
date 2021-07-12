import { createContext, useEffect, useRef, useState } from "react";
import { NeoLineN3Init } from "@utils/neoline";

export const neoContext = createContext();

export default function Neo({ children }) {
  const [neoLine, setNeoLine] = useState(null);
  const [address, setAddress] = useState({});
  const [userNft, setUserNft] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const initNeoLine = async () => {
    console.info('initializing neoline...');
    const neoLineObj = await NeoLineN3Init();
    setNeoLine(neoLineObj);

    const addr = await neoLineObj.getPublicKey();
    const { scriptHash: publicKey } = await neoLineObj.AddressToScriptHash({ address: addr.address });
    setAddress({
      key: addr.address,
      publicKey
    });
    console.info("Address found", address);

    const { stack } = await neoLineObj.invokeRead({
      scriptHash: "0xbe8c210d1104070b998d8aaf35e4f9e085b5c2dc",
      operation: "getOwnerNftDetails",
      args: [
        {
          type: "Address",
          value: addr.address
        }
      ],
      signers: []
    });
    if (stack[0].value) {
      const bal = atob(stack[0].value);
      console.info("ownerNFT", bal);
      setIsAuth(true);
      setUserNft(bal);
    } else {
      setIsAuth(false);
    }
  };

  useEffect(() => {
    if (window.NEOLineN3) {
      console.info('NEOLineN3 is already initialized...');
      initNeoLine();
    } else {
      console.info('NEOLineN3 is not yet initialized...');
      window.addEventListener('NEOLine.NEO.EVENT.READY', initNeoLine, true);
    }
    return function cleanUp() {
      // window.removeEventListener('NEOLine.NEO.EVENT.BLOCK_HEIGHT_CHANGED', updateContractsState, true);
      window.removeEventListener('NEOLine.NEO.EVENT.READY', initNeoLine, true);
    };
  }, []);

  return (
    <neoContext.Provider value={{ neoLine, address, isAuth, userNft }}>
      {children}
    </neoContext.Provider>
  );
}
