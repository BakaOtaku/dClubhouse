function NeoLineN3Init() {
  // Use an async pattern as the global NEOLineN3 is not available while
  // the NEOLine.NEO.EVENT.READY event is still firing:
  return new Promise((resolve) => setTimeout(() => {
    resolve(new window.NEOLineN3.Init());
  }, 10));
}

export { NeoLineN3Init };