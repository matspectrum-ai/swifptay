-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MERCHANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "kycStatus" DROP DEFAULT,
ALTER COLUMN "kycStatus" TYPE "KycStatus" USING "kycStatus"::"KycStatus",
ALTER COLUMN "kycStatus" SET DEFAULT 'PENDING',
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "role" TYPE "Role" USING "role"::"Role",
ALTER COLUMN "role" SET DEFAULT 'MERCHANT';

-- AlterTable
ALTER TABLE "Charge" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "ChargeStatus" USING "status"::"ChargeStatus",
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "TransactionStatus" USING "status"::"TransactionStatus",
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Withdrawal" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "WithdrawalStatus" USING "status"::"WithdrawalStatus",
ALTER COLUMN "status" SET DEFAULT 'PROCESSING';

-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "ProviderStatus" USING "status"::"ProviderStatus",
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "WebhookDelivery" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "WebhookStatus" USING "status"::"WebhookStatus",
ALTER COLUMN "status" SET DEFAULT 'PENDING';