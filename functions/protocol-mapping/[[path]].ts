import {
  requireProtocolMappingCloudflareAccess,
  type PagesFunction,
  type ProtocolMappingCloudflareAccessEnv,
} from "../_lib/cloudflare-access";

export const onRequest: PagesFunction<ProtocolMappingCloudflareAccessEnv> = (context) =>
  requireProtocolMappingCloudflareAccess(context);
