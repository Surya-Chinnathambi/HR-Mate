/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as aiChat from "../aiChat.js";
import type * as attendance from "../attendance.js";
import type * as auth from "../auth.js";
import type * as employeeSetup from "../employeeSetup.js";
import type * as employees from "../employees.js";
import type * as http from "../http.js";
import type * as jwtAuth from "../jwtAuth.js";
import type * as leaves from "../leaves.js";
import type * as payroll from "../payroll.js";
import type * as policies from "../policies.js";
import type * as realtime from "../realtime.js";
import type * as router from "../router.js";
import type * as sampleData from "../sampleData.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  aiChat: typeof aiChat;
  attendance: typeof attendance;
  auth: typeof auth;
  employeeSetup: typeof employeeSetup;
  employees: typeof employees;
  http: typeof http;
  jwtAuth: typeof jwtAuth;
  leaves: typeof leaves;
  payroll: typeof payroll;
  policies: typeof policies;
  realtime: typeof realtime;
  router: typeof router;
  sampleData: typeof sampleData;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
