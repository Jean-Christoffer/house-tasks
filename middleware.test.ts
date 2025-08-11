// middleware.test.ts
import { describe, it, beforeEach, expect, vi, type Mock } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import * as MW from "./middleware";

vi.mock("./app/lib/utils/jwt", () => ({
  parseAuthCookie: vi.fn(),
  verifyJwt: vi.fn(),
}));
const { parseAuthCookie, verifyJwt } = await import("./app/lib/utils/jwt");
const mockedParse = parseAuthCookie as unknown as Mock;
const mockedVerify = verifyJwt as unknown as Mock;

const makeReq = (path: string, cookie = "") => {
  const url = new URL(`http://localhost:3000${path}`);
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);

  return new NextRequest(url, { headers });
};

const mkFetchOk = (cookies: string[]) =>
  vi.fn(async () => ({
    ok: true,
    headers: { getSetCookie: () => cookies },
    json: async () => ({}),
  })) as unknown as typeof fetch;

const mkFetchFail = () =>
  vi.fn(async () => ({
    ok: false,
    headers: { getSetCookie: () => [] },
    json: async () => ({ error: "fail" }),
  })) as unknown as typeof fetch;

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when no tokens on protected route", async () => {
    mockedParse.mockReturnValue(undefined);

    const res = await MW.middleware(makeReq("/"));

    expect(res).toBeInstanceOf(NextResponse);

    expect(new URL(res!.headers.get("location")!).pathname).toBe("/login");
  });

  it("allows /login when no tokens", async () => {
    mockedParse.mockReturnValue(undefined);

    const res = await MW.middleware(makeReq("/login"));

    expect(res).toBeUndefined();
  });

  it("with valid accessToken: /login -> redirect to /", async () => {
    mockedParse.mockReturnValue({ accessToken: "A" });
    mockedVerify.mockResolvedValue({ sub: "user" });

    const res = await MW.middleware(makeReq("/login"));
    expect(res).toBeInstanceOf(NextResponse);

    expect(new URL(res!.headers.get("location")!).pathname).toBe("/");
  });

  it("with valid accessToken on protected route: NextResponse.next()", async () => {
    mockedParse.mockReturnValue({ accessToken: "A" });
    mockedVerify.mockResolvedValue({ sub: "user" });

    const res = await MW.middleware(makeReq("/"));
    // next() also returns a NextResponse instance
    expect(res).toBeInstanceOf(NextResponse);
    // no redirect header
    expect(res?.headers.get("location")).toBeNull();
  });

  it("with refreshToken but invalid/expired -> redirect to /login", async () => {
    mockedParse.mockReturnValue({ refreshToken: "R" });
    mockedVerify.mockResolvedValueOnce(null);
    global.fetch = mkFetchFail();

    const res = await MW.middleware(makeReq("/"));
    expect(res).toBeInstanceOf(NextResponse);
    expect(new URL(res!.headers.get("location")!).pathname).toBe("/login");
  });

  it("with refreshToken valid and refresh ok -> proceeds (NextResponse.next())", async () => {
    mockedParse.mockReturnValue({ refreshToken: "R" });
    mockedVerify.mockResolvedValueOnce({ sub: "user" });
    global.fetch = mkFetchOk([
      "accessToken=NEW; Path=/; HttpOnly",
      "refreshToken=NEW2; Path=/; HttpOnly",
    ]);

    const res = await MW.middleware(makeReq("/"));
    expect(res).toBeInstanceOf(NextResponse);
    expect(res?.headers.get("location")).toBeNull();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("with refreshToken valid but refresh fails -> redirect to /login", async () => {
    mockedParse.mockReturnValue({ refreshToken: "R" });
    mockedVerify.mockResolvedValueOnce({ sub: "user" });
    global.fetch = mkFetchFail();

    const res = await MW.middleware(makeReq("/"));
    expect(res).toBeInstanceOf(NextResponse);
    expect(new URL(res!.headers.get("location")!).pathname).toBe("/login");
  });

  it("with refreshToken valid, refresh ok but no Set-Cookie -> returns 401 JSON", async () => {
    mockedParse.mockReturnValue({ refreshToken: "R" });
    mockedVerify.mockResolvedValueOnce({ sub: "user" });
    global.fetch = mkFetchOk([]);

    const res = await MW.middleware(makeReq("/"));

    expect(res).toBeInstanceOf(NextResponse);
    expect(res?.status).toBe(401);
  });
});
