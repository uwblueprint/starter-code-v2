-- CreateEnum
CREATE TYPE "enum_entities_enum_field" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "enum_users_role" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" SERIAL NOT NULL,
    "string_field" VARCHAR(255) NOT NULL,
    "int_field" INTEGER NOT NULL,
    "enum_field" "enum_entities_enum_field" NOT NULL,
    "string_array_field" VARCHAR(255)[],
    "bool_field" BOOLEAN NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simple_entities" (
    "id" SERIAL NOT NULL,
    "string_field" VARCHAR(255) NOT NULL,
    "int_field" INTEGER NOT NULL,
    "enum_field" "enum_entities_enum_field" NOT NULL,
    "string_array_field" VARCHAR(255)[],
    "bool_field" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "simple_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "auth_id" VARCHAR(255) NOT NULL,
    "role" "enum_users_role" NOT NULL,
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
