import {
  verifySuperAdmin,
  approveAdminRequest,
  rejectAdminRequest,
} from "@/actions/super-admin-actions"
import { auth } from "@/lib/auth/server"
import { db } from "@/lib/db"

jest.mock("@/lib/auth/server", () => ({
  auth: jest.fn(),
}))

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    supplier: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockDb = db as unknown as {
  user: {
    findUnique: jest.Mock
    update: jest.Mock
  }
  supplier: {
    findUnique: jest.Mock
    update: jest.Mock
  }
  $transaction: jest.Mock
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("verifySuperAdmin", () => {
  it("throws when no session present", async () => {
    mockAuth.mockResolvedValueOnce(null as never)
    await expect(verifySuperAdmin()).rejects.toThrow("No autenticado")
  })

  it("throws when session has no email", async () => {
    mockAuth.mockResolvedValueOnce({ user: {} } as never)
    await expect(verifySuperAdmin()).rejects.toThrow("No autenticado")
  })

  it("throws when user role is not superadmin", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { email: "admin@ketzal.app" },
    } as never)
    mockDb.user.findUnique.mockResolvedValueOnce({ role: "admin" })

    await expect(verifySuperAdmin()).rejects.toThrow(
      "Acceso denegado - Se requiere rol de super-admin"
    )
  })

  it("throws when user record not found", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { email: "ghost@ketzal.app" },
    } as never)
    mockDb.user.findUnique.mockResolvedValueOnce(null)

    await expect(verifySuperAdmin()).rejects.toThrow(
      "Acceso denegado - Se requiere rol de super-admin"
    )
  })

  it("returns true for superadmin", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { email: "walfre.am@gmail.com" },
    } as never)
    mockDb.user.findUnique.mockResolvedValueOnce({ role: "superadmin" })

    await expect(verifySuperAdmin()).resolves.toBe(true)
    expect(mockDb.user.findUnique).toHaveBeenCalledWith({
      where: { email: "walfre.am@gmail.com" },
      select: { role: true },
    })
  })
})

describe("approveAdminRequest", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({
      user: { email: "walfre.am@gmail.com" },
    } as never)
    mockDb.user.findUnique.mockResolvedValue({ role: "superadmin" })
  })

  it("returns failure when supplier not found", async () => {
    mockDb.$transaction.mockImplementationOnce(async (cb: (tx: typeof mockDb) => Promise<unknown>) => {
      mockDb.supplier.findUnique.mockResolvedValueOnce(null)
      return cb(mockDb)
    })

    const result = await approveAdminRequest(999)
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Supplier no encontrado/)
  })

  it("returns failure when supplier has no associated user", async () => {
    mockDb.$transaction.mockImplementationOnce(async (cb: (tx: typeof mockDb) => Promise<unknown>) => {
      mockDb.supplier.findUnique.mockResolvedValueOnce({
        id: 1,
        extras: {},
        UserSuppliers: [],
      })
      return cb(mockDb)
    })

    const result = await approveAdminRequest(1)
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Usuario asociado no encontrado/)
  })

  it("approves: marks supplier approved + promotes user to admin", async () => {
    const supplier = {
      id: 7,
      extras: { isPending: true, isApproved: false },
      UserSuppliers: [{ id: "user-7", name: "Acme", role: "user" }],
    }
    mockDb.$transaction.mockImplementationOnce(async (cb: (tx: typeof mockDb) => Promise<unknown>) => {
      mockDb.supplier.findUnique.mockResolvedValueOnce(supplier)
      mockDb.supplier.update.mockResolvedValueOnce({})
      mockDb.user.update.mockResolvedValueOnce({})
      return cb(mockDb)
    })

    const result = await approveAdminRequest(7)

    expect(result.success).toBe(true)
    expect(mockDb.supplier.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: expect.objectContaining({
        extras: expect.objectContaining({
          isApproved: true,
          isPending: false,
          approvedBy: "superadmin",
        }),
      }),
    })
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: "user-7" },
      data: { role: "admin" },
    })
  })
})

describe("rejectAdminRequest", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({
      user: { email: "walfre.am@gmail.com" },
    } as never)
    mockDb.user.findUnique.mockResolvedValue({ role: "superadmin" })
  })

  it("rejects with default reason when none provided", async () => {
    const supplier = { id: 3, extras: {}, UserSuppliers: [] }
    mockDb.$transaction.mockImplementationOnce(async (cb: (tx: typeof mockDb) => Promise<unknown>) => {
      mockDb.supplier.findUnique.mockResolvedValueOnce(supplier)
      mockDb.supplier.update.mockResolvedValueOnce({})
      return cb(mockDb)
    })

    const result = await rejectAdminRequest(3)

    expect(result.success).toBe(true)
    expect(mockDb.supplier.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: expect.objectContaining({
        extras: expect.objectContaining({
          isApproved: false,
          isPending: false,
          rejectionReason: "No especificada",
        }),
      }),
    })
  })

  it("persists provided rejection reason", async () => {
    const supplier = { id: 4, extras: { foo: "bar" }, UserSuppliers: [] }
    mockDb.$transaction.mockImplementationOnce(async (cb: (tx: typeof mockDb) => Promise<unknown>) => {
      mockDb.supplier.findUnique.mockResolvedValueOnce(supplier)
      mockDb.supplier.update.mockResolvedValueOnce({})
      return cb(mockDb)
    })

    const result = await rejectAdminRequest(4, "Documentación incompleta")

    expect(result.success).toBe(true)
    expect(mockDb.supplier.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: expect.objectContaining({
        extras: expect.objectContaining({
          foo: "bar",
          rejectionReason: "Documentación incompleta",
        }),
      }),
    })
  })
})
