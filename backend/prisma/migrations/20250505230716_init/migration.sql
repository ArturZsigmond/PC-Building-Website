-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" SERIAL NOT NULL,
    "cpu" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "gpu" TEXT NOT NULL,
    "case" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitoredUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "MonitoredUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MonitoredUser_userId_key" ON "MonitoredUser"("userId");

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitoredUser" ADD CONSTRAINT "MonitoredUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
