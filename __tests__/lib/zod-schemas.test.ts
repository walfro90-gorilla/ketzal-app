import {
  signInSchema,
  signUpSchema,
  signUpAdminSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/zod"

describe("signInSchema", () => {
  it("accepts a valid email + 8+ char password", () => {
    const result = signInSchema.safeParse({
      email: "user@ketzal.app",
      password: "secret12",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email format", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "secret12",
    })
    expect(result.success).toBe(false)
  })

  it("rejects password shorter than 8 chars", () => {
    const result = signInSchema.safeParse({
      email: "user@ketzal.app",
      password: "short",
    })
    expect(result.success).toBe(false)
  })

  it("rejects password longer than 32 chars", () => {
    const result = signInSchema.safeParse({
      email: "user@ketzal.app",
      password: "a".repeat(33),
    })
    expect(result.success).toBe(false)
  })
})

describe("signUpSchema", () => {
  const valid = {
    email: "new@ketzal.app",
    password: "secret12",
    confirmPassword: "secret12",
    name: "Walfre",
  }

  it("accepts matching passwords + valid fields", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects when password and confirmPassword differ", () => {
    const result = signUpSchema.safeParse({
      ...valid,
      confirmPassword: "different12",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const mismatch = result.error.issues.find((i) =>
        i.path.includes("confirmPassword")
      )
      expect(mismatch).toBeDefined()
    }
  })

  it("rejects missing name", () => {
    const { name: _name, ...withoutName } = valid
    void _name
    expect(signUpSchema.safeParse(withoutName).success).toBe(false)
  })
})

describe("signUpAdminSchema (supplier registration)", () => {
  const validAdmin = {
    email: "supplier@ketzal.app",
    password: "secret12",
    confirmPassword: "secret12",
    name: "Acme Tours",
    company: "Acme Tours SA de CV",
    serviceType: "Tour",
    city: "Oaxaca",
    phone: "+52 951 123 4567",
  }

  it("accepts a full supplier signup payload", () => {
    expect(signUpAdminSchema.safeParse(validAdmin).success).toBe(true)
  })

  it("accepts phone with digits only (10+ chars)", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      phone: "5212345678",
    })
    expect(result.success).toBe(true)
  })

  it("rejects phone with letters", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      phone: "abc1234567",
    })
    expect(result.success).toBe(false)
  })

  it("rejects phone shorter than 10 digits", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      phone: "123456",
    })
    expect(result.success).toBe(false)
  })

  it("normalizes formatted phones to digits-only (E.164 storage)", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      phone: "+52 (951) 123-4567",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phone).toBe("529511234567")
    }
  })

  it("after normalization, rejects when digit count < 10", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      phone: "(951) 12-34",
    })
    expect(result.success).toBe(false)
  })

  it("after normalization, rejects when digit count > 15", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      phone: "+52 951 123 4567 8901",
    })
    expect(result.success).toBe(false)
  })

  it("accepts empty optional URL fields (website, facebook, youtube)", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      website: "",
      facebook: "",
      youtube: "",
    })
    expect(result.success).toBe(true)
  })

  it("rejects malformed website URL", () => {
    const result = signUpAdminSchema.safeParse({
      ...validAdmin,
      website: "not a url",
    })
    expect(result.success).toBe(false)
  })

  it("requires company, serviceType, city — refuses empty strings", () => {
    expect(
      signUpAdminSchema.safeParse({ ...validAdmin, company: "" }).success
    ).toBe(false)
    expect(
      signUpAdminSchema.safeParse({ ...validAdmin, serviceType: "" }).success
    ).toBe(false)
    expect(
      signUpAdminSchema.safeParse({ ...validAdmin, city: "" }).success
    ).toBe(false)
  })
})

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "u@ketzal.app" }).success
    ).toBe(true)
  })

  it("rejects empty email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "" }).success).toBe(false)
  })
})

describe("resetPasswordSchema", () => {
  const valid = {
    token: "abc123",
    password: "newpass12",
    confirmPassword: "newpass12",
  }

  it("accepts matching passwords + token", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      ...valid,
      confirmPassword: "different12",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const mismatch = result.error.issues.find((i) =>
        i.path.includes("confirmPassword")
      )
      expect(mismatch?.message).toMatch(/no coinciden/i)
    }
  })

  it("rejects empty token", () => {
    expect(
      resetPasswordSchema.safeParse({ ...valid, token: "" }).success
    ).toBe(false)
  })
})
