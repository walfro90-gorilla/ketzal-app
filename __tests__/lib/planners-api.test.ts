import {
  fetchPlanners,
  createPlannerAPI,
  updatePlannerAPI,
  deletePlannerAPI,
} from "@/lib/api/planners.api"

const originalFetch = global.fetch

afterAll(() => {
  global.fetch = originalFetch
})

beforeEach(() => {
  global.fetch = jest.fn() as unknown as typeof fetch
})

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: async () => body,
  })
}

describe("fetchPlanners", () => {
  it("returns the data array on 200", async () => {
    const planners = [{ id: "p1", name: "Oaxaca trip" }]
    mockFetchResponse({ data: planners })

    const result = await fetchPlanners("tok123")

    expect(result).toEqual(planners)
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0]
    expect(url).toMatch(/\/api\/planners$/)
    expect(init.headers.Authorization).toBe("Bearer tok123")
    expect(init.cache).toBe("no-store")
  })

  it("throws when response is not ok", async () => {
    mockFetchResponse({}, false, 500)
    await expect(fetchPlanners("tok")).rejects.toThrow(
      "Error al obtener planners"
    )
  })
})

describe("createPlannerAPI", () => {
  it("converts startDate/endDate to ISO strings", async () => {
    mockFetchResponse({ data: { id: "p1" } })

    await createPlannerAPI("tok", {
      name: "Cancún",
      destination: "Cancún",
      startDate: new Date("2026-06-01T00:00:00.000Z"),
      endDate: new Date("2026-06-10T00:00:00.000Z"),
    } as never)

    const [, init] = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(init.body)
    expect(body.startDate).toBe("2026-06-01T00:00:00.000Z")
    expect(body.endDate).toBe("2026-06-10T00:00:00.000Z")
    expect(body.name).toBe("Cancún")
  })

  it("leaves dates undefined when not provided", async () => {
    mockFetchResponse({ data: { id: "p1" } })

    await createPlannerAPI("tok", { name: "No-date trip" } as never)

    const [, init] = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(init.body)
    expect(body.startDate).toBeUndefined()
    expect(body.endDate).toBeUndefined()
  })

  it("throws when response not ok", async () => {
    mockFetchResponse({}, false, 400)
    await expect(
      createPlannerAPI("tok", { name: "x" } as never)
    ).rejects.toThrow("Error al crear planner")
  })
})

describe("updatePlannerAPI", () => {
  it("PUTs to the planner-specific URL", async () => {
    mockFetchResponse({ data: { id: "p1", name: "renamed" } })

    const result = await updatePlannerAPI("tok", "p1", {
      name: "renamed",
    } as never)

    expect(result).toEqual({ id: "p1", name: "renamed" })
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0]
    expect(url).toMatch(/\/api\/planners\/p1$/)
    expect(init.method).toBe("PUT")
  })

  it("throws when response not ok", async () => {
    mockFetchResponse({}, false, 404)
    await expect(
      updatePlannerAPI("tok", "p1", {} as never)
    ).rejects.toThrow("Error al actualizar planner")
  })
})

describe("deletePlannerAPI", () => {
  it("sends DELETE and resolves on ok", async () => {
    mockFetchResponse({})

    await expect(deletePlannerAPI("tok", "p1")).resolves.toBeUndefined()
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0]
    expect(url).toMatch(/\/api\/planners\/p1$/)
    expect(init.method).toBe("DELETE")
  })

  it("throws when response not ok", async () => {
    mockFetchResponse({}, false, 403)
    await expect(deletePlannerAPI("tok", "p1")).rejects.toThrow(
      "Error al eliminar planner"
    )
  })
})
