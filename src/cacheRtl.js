import createCache from "@emotion/cache";
import stylisRTLPlugin from "stylis-plugin-rtl";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [stylisRTLPlugin],
});

export default cacheRtl;