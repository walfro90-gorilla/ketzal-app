// Script para crear un wallet para el super admin
import { db } from "@/lib/db";

async function createSuperAdminWallet() {
  const email = "walfre.dev@gmail.com";
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    console.error("No se encontró el usuario super admin con email:", email);
    process.exit(1);
  }
  const existingWallet = await db.wallet.findFirst({ where: { userId: user.id } });
  if (existingWallet) {
    console.log("El super admin ya tiene un wallet:", existingWallet);
    return;
  }
  const wallet = await db.wallet.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      balanceAxo: 5000,
      balanceMXN: 5000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("Wallet creado para super admin:", wallet);
}

createSuperAdminWallet().then(() => process.exit(0));
