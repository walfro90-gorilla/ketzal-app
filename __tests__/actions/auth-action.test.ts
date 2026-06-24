import { registerAction, registerAdminActionV2 } from "@/actions/auth-action"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { sendEmailVerification } from "@/lib/mail"
import { createNotification } from "@/app/api/notifications/notifications.api"

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}))

jest.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    constructor(message?: string, public cause?: unknown) {
      super(message)
      this.name = "AuthError"
    }
  },
}))

jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    supplier: {
      findUnique: jest.fn(),
    },
    verificationToken: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}))

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "fixed-token-xyz"),
}))

jest.mock("@/lib/mail", () => ({
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}))

jest.mock("@/app/api/notifications/notifications.api", () => ({
  createNotification: jest.fn(),
  NotificationType: {
    USER_REGISTRATION: "USER_REGISTRATION",
    SUPPLIER_APPROVAL: "SUPPLIER_APPROVAL",
    WELCOME_BONUS: "WELCOME_BONUS",
    WELCOME_MESSAGE: "WELCOME_MESSAGE",
  },
  NotificationPriority: {
    LOW: "LOW",
    NORMAL: "NORMAL",
    HIGH: "HIGH",
    URGENT: "URGENT",
  },
}))

const mockDb = db as unknown as {
  user: { findUnique: jest.Mock; create: jest.Mock; findFirst: jest.Mock }
  supplier: { findUnique: jest.Mock }
  verificationToken: { create: jest.Mock }
  $transaction: jest.Mock
}

const mockBcrypt = bcrypt as unknown as { hash: jest.Mock }
const mockMail = sendEmailVerification as jest.Mock
const mockNotify = createNotification as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  mockBcrypt.hash.mockResolvedValue("hashed-pw")
})

describe("registerAction (regular user signup)", () => {
  const validValues = {
    email: "new@ketzal.app",
    password: "secret12",
    confirmPassword: "secret12",
    name: "Walfre",
  }

  it("rejects invalid input via Zod (no DB call)", async () => {
    const result = await registerAction({
      ...validValues,
      email: "not-an-email",
    } as never)

    expect(result).toEqual({ error: "Los datos proporcionados no son válidos" })
    expect(mockDb.user.findUnique).not.toHaveBeenCalled()
  })

  it("rejects duplicate email", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce({ id: "existing" })

    const result = await registerAction(validValues)

    expect(result.error).toMatch(/Ya existe una cuenta/)
    expect(mockDb.user.create).not.toHaveBeenCalled()
  })

  it("creates user with role 'user' when adminRequest is not set", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce(null) // no existing user
    mockDb.user.create.mockResolvedValueOnce({ id: "u-1", email: validValues.email })
    mockDb.verificationToken.create.mockResolvedValueOnce({})
    mockDb.user.findFirst.mockResolvedValueOnce(null) // no super admin
    mockMail.mockResolvedValueOnce(undefined)

    const result = await registerAction(validValues)

    expect(result.success).toBe(true)
    expect(result.isAdminRequest).toBe(false)
    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: validValues.email,
        name: validValues.name,
        password: "hashed-pw",
        role: "user",
      }),
    })
    expect(mockMail).toHaveBeenCalledWith(validValues.email, "fixed-token-xyz")
  })

  it("creates user with role 'admin' when adminRequest is true", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce(null)
    mockDb.user.create.mockResolvedValueOnce({ id: "u-2", email: validValues.email })
    mockDb.verificationToken.create.mockResolvedValueOnce({})
    mockDb.user.findFirst.mockResolvedValueOnce(null)

    const result = await registerAction({
      ...validValues,
      adminRequest: true,
    } as never)

    expect(result.success).toBe(true)
    expect(result.isAdminRequest).toBe(true)
    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ role: "admin" }),
    })
  })

  it("notifies super-admin when one exists", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce(null)
    mockDb.user.create.mockResolvedValueOnce({ id: "u-3", email: validValues.email })
    mockDb.verificationToken.create.mockResolvedValueOnce({})
    mockDb.user.findFirst.mockResolvedValueOnce({
      id: "super-1",
      email: "walfre.am@gmail.com",
    })
    mockNotify.mockResolvedValueOnce({})

    await registerAction(validValues)

    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "super-1",
        type: "USER_REGISTRATION",
        priority: "NORMAL",
      })
    )
  })

  it("succeeds even if notification fails (notification is non-fatal)", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce(null)
    mockDb.user.create.mockResolvedValueOnce({ id: "u-4" })
    mockDb.verificationToken.create.mockResolvedValueOnce({})
    mockDb.user.findFirst.mockResolvedValueOnce({ id: "super-1" })
    mockNotify.mockRejectedValueOnce(new Error("notification service down"))

    const result = await registerAction(validValues)

    expect(result.success).toBe(true)
  })
})

describe("registerAdminActionV2 (supplier signup with separate Supplier record)", () => {
  const validAdmin = {
    email: "supplier@ketzal.app",
    password: "secret12",
    confirmPassword: "secret12",
    name: "Acme",
    company: "Acme SA",
    serviceType: "Tour",
    city: "Oaxaca",
    phone: "+52 951 123 4567",
  }

  it("rejects duplicate user email before touching supplier", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce({ id: "exists" })

    const result = await registerAdminActionV2(validAdmin)

    expect(result.error).toMatch(/Ya existe una cuenta/)
    expect(mockDb.supplier.findUnique).not.toHaveBeenCalled()
  })

  it("rejects when supplier email is already registered", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce(null)
    mockDb.supplier.findUnique.mockResolvedValueOnce({ id: 7 })

    const result = await registerAdminActionV2(validAdmin)

    expect(result.error).toMatch(/Ya existe un proveedor/)
    expect(mockDb.$transaction).not.toHaveBeenCalled()
  })

  it("creates user (role=user) + Supplier (isPending=true) in a transaction", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce(null)
    mockDb.supplier.findUnique.mockResolvedValueOnce(null)

    const tx = {
      user: {
        create: jest.fn().mockResolvedValueOnce({ id: "u-9", name: "Acme" }),
        update: jest.fn().mockResolvedValueOnce({}),
      },
      supplier: {
        create: jest
          .fn()
          .mockResolvedValueOnce({ id: 42, name: "Acme SA" }),
      },
    }
    mockDb.$transaction.mockImplementationOnce(
      async (cb: (t: typeof tx) => Promise<unknown>) => cb(tx)
    )
    mockDb.verificationToken.create.mockResolvedValueOnce({})
    mockDb.user.findFirst.mockResolvedValueOnce(null)

    const result = await registerAdminActionV2(validAdmin)

    expect(result.success).toBe(true)
    expect(tx.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: validAdmin.email,
        role: "user", // promoted to 'admin' AFTER super-admin approval
      }),
    })
    expect(tx.supplier.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: validAdmin.company,
        contactEmail: validAdmin.email,
        extras: expect.objectContaining({
          isApproved: false,
          isPending: true,
        }),
      }),
    })
  })
})
