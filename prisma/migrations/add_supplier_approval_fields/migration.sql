-- Agregar campos de aprobación a la tabla Supplier
ALTER TABLE "Supplier" ADD COLUMN "userId" TEXT;
ALTER TABLE "Supplier" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Supplier" ADD COLUMN "isPending" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Supplier" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "Supplier" ADD COLUMN "approvedBy" TEXT;
ALTER TABLE "Supplier" ADD COLUMN "rejectedAt" TIMESTAMP(3);
ALTER TABLE "Supplier" ADD COLUMN "rejectionReason" TEXT;

-- Agregar foreign key constraint para userId
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Agregar foreign key constraint para approvedBy  
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
