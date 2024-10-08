"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useDebounce from "@/app/functions/debounce";
import { signupSchema } from "@/app/zod";
import React, { ChangeEvent, useState, useCallback } from "react";
import Heading from "../Heading";
import SubHeading from "../SubHeading";
import InputBox from "../InputBox";
import validateField from "@/app/functions/validateField";
import axios from "axios";
import { NextResponse } from "next/server";

export default function SignUpForm({
  name,
  namePlaceholder,
  emailPlaceholder,
}: {
  name: string;
  namePlaceholder: string;
  emailPlaceholder: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const actualPathname = pathName.split("/");
  let signupurl =
    actualPathname[1] === "patient-signup"
      ? "/api/patient-signup"
      : "api/admin-signup";
  const afterSignupUrl = "/api/auth/signin";

  const errorMap: Map<string, string> = new Map([
    ["hospitalName", ""],
    ["emailH", ""],
    ["phoneNumberH", ""],
    ["city", ""],
  ]);

  const [hospitalName, setHospitalName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailH, setEmailH] = useState<string>("");
  const [phoneNumberH, setPhoneNumberH] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [errors, setErrors] = useState<Map<string, string>>(errorMap);

  const validate = useCallback((field: string, value: string) => {
    const errorMessage: string = validateField(signupSchema, field, value);
    setErrors((prevErrors) => new Map(prevErrors).set(field, errorMessage));
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = signupSchema.safeParse({
      hospitalName,
      hospitalEmail: emailH,
      phoneNumberH,
      city,
      password,
    });

    if (!result.success) {
      const fieldErrors = new Map<string, string>();
      result.error.errors.forEach((error) => {
        if (typeof error.path[0] === "string") {
          fieldErrors.set(error.path[0], error.message);
        }
      });
      setIsSubmitting(false);
      setErrors(fieldErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await axios.post(`${signupurl}`, {
        hospitalName,
        emailH,
        phoneNumberH,
        city: city.toLowerCase(),
        password,
      });
      if (response.status === 200) {
        toast.success("Form submitted successfully");
        router.push(afterSignupUrl);
      }
    } catch (error) {
      alert("Error Occurred While Signing up");
      console.error(`Error Occurred While Signing up ${error}`);
      return NextResponse.json(
        { error: "Error Occurred While Signing up" },
        { status: 500 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeHandler =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (setter.toString() === "setCity") {
        setter(value.toLowerCase());
      } else setter(value);
      validate(field, value);
    };

  return (
    <>
      <section className="flex justify-center h-screen">
        <div className="flex flex-col justify-center">
          <div className="flex flex-col gap-2 p-5 border-2 border-gray-400 rounded-lg shadow-lg">
            <Heading text={"Hii there..."} />
            <SubHeading text={"Get started with Appointments"} />
            <form action="">
              <InputBox
                type="text"
                required={true}
                label={name}
                placeholder={namePlaceholder}
                imageSource={"/icons/hospital_icon.svg"}
                value={hospitalName}
                onChange={onChangeHandler(setHospitalName, "hospitalName")}
                error={errors.get("hospitalName")}
              />
              <InputBox
                type="email"
                required={true}
                label={"Email"}
                placeholder={emailPlaceholder}
                imageSource={"/icons/email.svg"}
                value={emailH}
                onChange={onChangeHandler(setEmailH, "hospitalEmail")}
                error={errors.get("hospitalEmail")}
              />
              <InputBox
                type="tel"
                required={true}
                label={"Phone Number"}
                placeholder={"+91 0000000000"}
                imageSource={"/icons/phone.svg"}
                value={phoneNumberH}
                onChange={onChangeHandler(setPhoneNumberH, "phoneNumberH")}
                error={errors.get("phoneNumberH")}
              />
              <InputBox
                type="password"
                required={true}
                label={"Password"}
                placeholder={"Enter your Password"}
                imageSource={"/icons/key.svg"}
                value={password}
                onChange={onChangeHandler(setPassword, "password")}
                error={errors.get("password")}
              />
              <InputBox
                type="text"
                required={true}
                label={"City"}
                placeholder={"Delhi"}
                imageSource={"/icons/city.svg"}
                value={city}
                onChange={onChangeHandler(setCity, "city")}
                error={errors.get("city")}
              />
              <button
                disabled={isSubmitting}
                type="submit"
                className="disabled:bg-gray-500 disabled:text-white text-center font-bold text-lg hover:text-green-800 p-2  mt-3 mb-3 text-white bg-green-400 w-[200px] ml-5 rounded-lg"
                onClick={onSubmit}
              >
                Submit
              </button>
            </form>
            {actualPathname[1] === "patient-signup" ? (
              <Link
                href={"/admin-signup"}
                className="pl-24 text-[12px] text-white font-bold hover:text-green-800"
              >
                Admin ?
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
