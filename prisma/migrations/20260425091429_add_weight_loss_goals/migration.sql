-- CreateTable
CREATE TABLE "WeightLossGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "currentWeight" REAL NOT NULL,
    "targetWeight" REAL NOT NULL,
    "timeframeWeeks" INTEGER NOT NULL,
    "weightLossPerWeek" REAL NOT NULL,
    "dailyCalorieTarget" INTEGER NOT NULL,
    "calorieDeficit" INTEGER NOT NULL,
    "recommendedMethod" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeightLossGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WeightLossGoal_userId_isActive_idx" ON "WeightLossGoal"("userId", "isActive");
