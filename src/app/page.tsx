"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { connect, jwtAuthenticator, StringCodec } from "nats.ws";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, FormikState } from "formik";
import * as Yup from "yup";
import { BiQrScan, BiPlayCircle } from "react-icons/bi";
import Input from "@/components/Inputs/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import applestore from "/public/images/logo/appstore.png";
import logo from "/public/images/logo/logo.png";
import googleplay from "/public/images/logo/googleplay.png";
import { Button } from "@/components/ui/button";
import { User, Lock, Loader2 } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

type Role = {
  id: number;
  code: string;
  role_name: string;
  created_date: string | null;
  created_by: string | null;
  last_updated_date: string;
  last_updated_by: string | null;
  active: string;
  privileges: any[];
};

type UserRole = {
  id: number;
  userRoleId: number;
  roles: Role;
  created_date: string;
  created_by: string | null;
  last_updated_date: string;
  last_updated_by: string | null;
};

type User = {
  id: number;
  cidNumber: number;
  fullName: string;
  userName: string;
  email: string;
  mobileNumber: string;
  created_date: string | null;
  created_by: string | null;
  last_updated_date: string;
  last_updated_by: string;
  active: string;
  userRole: UserRole[];
};

export default function Login() {
  const [proofRequestURL, setProofRequestURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [, setAuthenticated] = useState(false);
  const [, setOs] = useState("");

  const router = useRouter();

  const handleLogin = async (
    values: { username: string; password: string },
    resetForm: {
      (
        nextState?:
          | Partial<FormikState<{ username: string; password: string }>>
          | undefined,
      ): void;
    },
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.username,
            password: values.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 1500,
        });

        const token = data.data.access; // ✅ Store token from API response
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 1}; samesite=Lax;`;
        localStorage.setItem("token", token);
        localStorage.setItem("userDetails", JSON.stringify(data.data.user));
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error(data.message || "An error occurred during login.", {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // toast.error(errorMessage, { position: "top-right", autoClose: 2000 });
    } finally {
      setIsLoading(false);
      resetForm({
        values: {
          ...values,
          password: "",
        },
      });
    }
  };

  const detectDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iPhone/iOS";
    return "Other";
  };

  const natsListener = useCallback(
    async (threadId: any) => {
      const sendToServer = async (params: {
        username: any;
        name: any;
        params: any;
      }) => {
        try {
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 2500,
          });

          document.cookie = `token=${params.username}; path=/; max-age=${60 * 60 * 24 * 1}; secure; samesite=strict;`;
          // console.log("I HERE")
          localStorage.setItem("user", JSON.stringify(params.username));
          localStorage.setItem("roles", JSON.stringify(["THT"]));

          setTimeout(() => {
            router.push("/user-dashboard");
          }, 1500);
        } catch (error) {
          setErrorMessage("Error submitting data");
        }
      };

      try {
        const conn = await connect({
          servers: ["https://natsdemoclient.bhutanndi.com"],
          authenticator: jwtAuthenticator(
            "",
            new TextEncoder().encode(
              "SUAPXY7TJFUFE3IX3OEMSLE3JFZJ3FZZRSRSOGSG2ANDIFN77O2MIBHWUM",
            ),
          ),
        });

        const sc = StringCodec();
        const sub = conn.subscribe(threadId);

        for await (const m of sub) {
          const data = JSON.parse(sc.decode(m.data));
          if (data?.data?.verification_result === "ProofValidated") {
            const { "Full Name": fullName, "ID Number": cid } =
              data.data.requested_presentation.revealed_attrs;
            await sendToServer({
              username: cid[0].value,
              name: fullName[0].value,
              params: undefined,
            });
            conn.close();
          } else {
            setErrorMessage("Your authorization request has been denied.");
          }
        }
      } catch (error) {
        console.error("NATS connection error:", error);
      }
    },
    [router],
  );

  const handleLoginWithNdi = useCallback(() => {
    setIsLoading(true);
    setErrorMessage("");

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/ndi/authentication`, {
        headers: { Accept: "*/*" },
      })
      .then((response) => {
        const { proofRequestURL, proofRequestThreadId } = response.data.data;
        setProofRequestURL(proofRequestURL);
        natsListener(proofRequestThreadId);
      })
      .catch(() => setErrorMessage("Communication failed with server."))
      .finally(() => setIsLoading(false));
  }, [natsListener]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOs(detectDeviceType());
      handleLoginWithNdi();
    }
  }, [handleLoginWithNdi]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-300 p-4">
      <div className="relative w-full max-w-5xl">
        <div className="flex flex-col items-center md:flex-row">
          {/* Left Column - overlaps right by 5% on md+ screens */}
          <div className="relative z-10 w-full  md:w-[45%] lg:w-[43%]">
            <div className="w-full rounded-lg bg-white p-6 shadow-xl  md:pr-[5%]">
              <div className="flex flex-col  justify-center">
                <div className="mb-4 flex  items-center gap-2 py-3">
                  <Image
                    width={32}
                    height={32}
                    src={"/images/logo/logo.png"}
                    alt="Logo"
                  />
                </div>

                <ToastContainer />
                <Formik
                  initialValues={{
                    username: "",
                    password: "",
                  }}
                  validationSchema={Yup.object({
                    username: Yup.string().required("Username is required"),
                    password: Yup.string().required("Paasword is required"),
                  })}
                  onSubmit={(values, { resetForm }) =>
                    handleLogin(values, resetForm)
                  }
                >
                  <Form>
                    <div className="w-full">
                      <div className="relative w-full">
                        <Input
                          label={`Email`}
                          type="text"
                          name="username"
                          placeholder="Enter Username"
                          autoComplete="off"
                          className="h-10 w-full rounded-md border border-gray-300 px-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4 w-full">
                      <div className="relative w-full">
                        <Input
                          label={`Password`}
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          autoComplete="off"
                          className="h-10 w-full rounded-md border border-gray-300 px-10 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                      </div>
                    </div>

                    <div className="mt-6 w-full">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-700"
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isLoading ? "Please wait" : "Login"}
                      </Button>
                    </div>
                  </Form>
                </Formik>
                <div className="form-group mt-6 text-right">
                  <span className="text-[#A1A0A0]">
                    <Link
                      href="/forgot-password"
                      className="text-black underline"
                    >
                      Forgot Password?
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - overlaps left by 5% on md+ screens */}
          <div className="relative w-full md:left-[-5%] md:w-[60%] lg:w-[57%]">
            <div className="w-full rounded-lg bg-red-100 p-6  md:pl-[15%] ">
              <div className="form-group text-center">
                <span className="font-bold text-gray-400">
                  Scan with <span className="text-green-500">Bhutan NDI</span>{" "}
                  Wallet
                </span>
              </div>

              <div className="flex justify-center rounded-2xl border-2 border-green-500 p-2.5">
                <QRCodeSVG
                  value={proofRequestURL}
                  size={200}
                  imageSettings={{
                    src: "/images/logo/NDIlogobg.png",
                    excavate: true,
                    height: 30,
                    width: 30,
                  }}
                />
              </div>
              <div className="form-group mt-8">
                <div className="flex justify-center">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <ol className="list-decimal text-sm font-medium text-gray-400">
                            <li>Open Bhutan NDI Wallet on your phone.</li>
                            <li>
                              Tap the Scan button located on the menu bar <br />{" "}
                              and capture code.
                            </li>
                          </ol>
                        </td>
                        <td>
                          <span className="inline-block h-6 w-6 rounded-full bg-green-500 text-center">
                            <BiQrScan
                              className="p-0.5 pb-1.5 text-white"
                              size={25}
                            />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-7.5 flex justify-center">
                <a
                  href="https://www.youtube.com/@BhutanNDI"
                  target="_blank"
                  rel="noreferrer"
                  className="btn flex items-center space-x-2 rounded-full bg-[#5ac994] px-4 py-2 text-white"
                >
                  <span>Watch video guide</span>
                  <BiPlayCircle size={24} />
                </a>
              </div>
              <div className="mt-7.5 flex justify-center">
                <span>
                  <a
                    href="https://kiwhp.app.link/?t="
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A1A0A0] no-underline"
                  >
                    Download Now!
                  </a>
                </span>
              </div>
              <div className="mb-4 mt-2.5 flex justify-center">
                <a
                  href="https://play.google.com/store/search?q=bhutan%20ndi&amp;c=apps&amp;hl=en_IN&amp;gl=US"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={googleplay}
                    className="h-[30px] w-[99px]"
                    alt="Google Play Store"
                    width={100}
                    height={100}
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/bhutan-ndi/id1645493166"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3"
                >
                  <Image
                    src={applestore}
                    className="h-[30px] w-[99px]"
                    alt="Apple App Store"
                    width={100}
                    height={100}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
