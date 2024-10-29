import "module-alias/register";
import path from "path";

import { addAliases } from "module-alias";

addAliases({
  "@": path.join(__dirname, "/")
});
