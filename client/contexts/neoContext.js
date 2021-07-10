import { createContext, useEffect, useRef, useState } from "react";
import { NeoLineN3Init } from "@utils/neoline";

export const neoContext = createContext();

export default function Neo({ children }) {
  const [neoLine, setNeoLine] = useState(null);
  const [address, setAddress] = useState('');

  // const updateContractsState = async () => {
  //   const neoLineObj = await NeoLineN3Init();
  //   setNeoLine(neoLineObj);
  // };
  const initNeoLine = async () => {
    console.info('initializing neoline...');
    const neoLineObj = await NeoLineN3Init();
    setNeoLine(neoLineObj);

    const addr = await neoLineObj.getPublicKey();
    setAddress(addr.address);
    console.info(addr);
    // window.addEventListener('NEOLine.NEO.EVENT.BLOCK_HEIGHT_CHANGED', updateContractsState, true);
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
    <neoContext.Provider value={{ neoLine, address }}>
      {children}
    </neoContext.Provider>
  );
}
