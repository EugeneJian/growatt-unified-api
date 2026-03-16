import {
  requireGrowattCodesBasicAuth,
  type GrowattCodesBasicAuthEnv,
  type PagesFunction,
} from "../../_lib/basic-auth";

export const onRequest: PagesFunction<GrowattCodesBasicAuthEnv> = (context) =>
  requireGrowattCodesBasicAuth(context);
