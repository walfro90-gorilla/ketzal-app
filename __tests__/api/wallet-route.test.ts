import { GET } from "@/app/api/wallet/route"
import { db } from "@/lib/db"

jest.mock("@/lib/db", () => ({
  db: {
    wallet: {
      findFirst: jest.fn(),
    },
  },
}))

const mockDb = db as unknown as {
  wallet: { findFirst: jest.Mock }
}

function makeReq(url: string): Parameters<typeof GET>[0] {
  const req = new Request(url) as unknown as Parameters<typeof GET>[0]
  ;(req as unknown as { nextUrl: URL }).nextUrl = new URL(url)
  return req
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("GET /api/wallet", () => {
  it("returns 400 when userId is missing", async () => {
    const res = await GET(makeReq("http://localhost/api/wallet"))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toEqual({ success: false, message: "userId is required" })
  })

  it("returns 404 when wallet not found", async () => {
    mockDb.wallet.findFirst.mockResolvedValueOnce(null)
    const res = await GET(makeReq("http://localhost/api/wallet?userId=abc"))
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.message).toMatch(/No wallet found/)
  })

  it("returns 200 + wallet payload (dual currency MXN + AXO)", async () => {
    const wallet = {
      id: "w1",
      userId: "abc",
      balanceMXN: 1500.5,
      balanceAxo: 50,
    }
    mockDb.wallet.findFirst.mockResolvedValueOnce(wallet)

    const res = await GET(makeReq("http://localhost/api/wallet?userId=abc"))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ success: true, wallet })
    expect(mockDb.wallet.findFirst).toHaveBeenCalledWith({
      where: { userId: "abc" },
    })
  })

  it("returns 500 when Prisma throws", async () => {
    mockDb.wallet.findFirst.mockRejectedValueOnce(new Error("connection lost"))
    const res = await GET(makeReq("http://localhost/api/wallet?userId=abc"))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.message).toMatch(/Error fetching wallet/)
  })
})
