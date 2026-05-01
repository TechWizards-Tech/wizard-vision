-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" SERIAL NOT NULL,
    "athleteId" BIGINT NOT NULL,
    "name" TEXT,
    "position" TEXT,
    "group" TEXT,
    "profile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "weekStartDate" TIMESTAMP(3),
    "monthStartDate" TIMESTAMP(3),
    "segmentName" TEXT NOT NULL,
    "durationMins" DOUBLE PRECISION,
    "sessionLoad" DOUBLE PRECISION,
    "workload" DOUBLE PRECISION,
    "workloadVolume" DOUBLE PRECISION,
    "workloadIntensity" DOUBLE PRECISION,
    "distanceM" DOUBLE PRECISION,
    "metresPerMinute" DOUBLE PRECISION,
    "highIntensityRunM" DOUBLE PRECISION,
    "noHighIntensityEv" INTEGER,
    "sprintDistanceM" DOUBLE PRECISION,
    "rawTopSpeedKph" DOUBLE PRECISION,
    "noOfSprints" INTEGER,
    "topSpeedKph" DOUBLE PRECISION,
    "avgSpeedKph" DOUBLE PRECISION,
    "accelerations" INTEGER,
    "decelerations" INTEGER,
    "pctMaxSpeed" DOUBLE PRECISION,
    "pctRawMaxSpeed" DOUBLE PRECISION,
    "ninetyPctMaxSpeedEv" INTEGER,
    "ninetyPctMaxSpeedDistM" DOUBLE PRECISION,
    "ninetyPctMaxSpeedDurSec" DOUBLE PRECISION,
    "ninetyPctRawMaxEv" INTEGER,
    "ninetyPctRawMaxDistM" DOUBLE PRECISION,
    "ninetyPctRawMaxDurSec" DOUBLE PRECISION,
    "isAnomaly" BOOLEAN NOT NULL DEFAULT false,
    "anomalyScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_athleteId_key" ON "athletes"("athleteId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
