(function(w, d, n){
  const BASEW = 700;
  const CW = 480;
  function updateMetaViewport() {
    const viewport = d.querySelector("meta[name='viewport']");
		const ua = n.userAgent.toLowerCase();
		const iOS = ua.includes("iphone") || ua.includes("ipod") || ua.includes("ipad");
    const w = iOS ? d.documentElement.clientWidth : window.outerWidth;
    const vpc = w < BASEW
      ? "width=" + CW + ",initial-scale=" + w/CW
      : "width=device-width,initial-scale=1.0";
    console.log("adjustViewport " + w + " => " + vpc);
    viewport.setAttribute("content", vpc + ",user-scalable=yes,shrink-to-fit=no");
  }
  updateMetaViewport();
  w.addEventListener("resize", updateMetaViewport);
  w.addEventListener("orientationchange", updateMetaViewport);
})(window, document, navigator);
