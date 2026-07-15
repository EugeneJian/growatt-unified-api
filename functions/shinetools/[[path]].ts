import {
  requireShineToolsCloudflareAccess,
  type ShineToolsCloudflareAccessEnv,
} from "../_lib/shinetools-access";
import type { PagesFunction } from "../_lib/cloudflare-access";

export const onRequest: PagesFunction<ShineToolsCloudflareAccessEnv> = (context) =>
  requireShineToolsCloudflareAccess(context);
