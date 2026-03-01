/*
  Warnings:

  - Added the required column `arrival_time` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure_time` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('walking', 'transit', 'taxi');

-- AlterTable
ALTER TABLE "route_stops" ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "place_id" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "arrival_time" TEXT NOT NULL DEFAULT '18:00',
ADD COLUMN     "departure_time" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN     "transport_mode" "TransportMode" NOT NULL DEFAULT 'walking';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transport_mode" "TransportMode" NOT NULL DEFAULT 'walking';
