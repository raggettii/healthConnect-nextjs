import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: Request, res: Response) {
  const {
    password,
    hospitalName,
    emailH,
    phoneNumberH,
    city,
  }: signUpAdminType = await req.json();
  const prisma = new PrismaClient();
  try {
    const response = await prisma.healthConnect_Hospital.create({
      data: {
        fullName: hospitalName,
        email: emailH,
        phoneNumber: phoneNumberH,
        city: city,
        password: password,
      },
    });
    // console.log(`Hospital created successfully ${response}`);
    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error(`Error occured while signup at admin ${error}`);
    return NextResponse.json(
      {
        error,
      },
      { status: 409 }
    );
  }
}
type signUpAdminType = {
  hospitalName: string;
  emailH: string;
  phoneNumberH: string;
  city: string;
  password: string;
};
