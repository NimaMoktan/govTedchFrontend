"use client"
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { connect, jwtAuthenticator, StringCodec } from 'nats.ws';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, FormikState } from "formik";
import * as Yup from "yup";
import { BiQrScan, BiPlayCircle } from "react-icons/bi";
import Input from "@/components/Inputs/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import applestore from "/public/images/logo/appstore.png";
import googleplay from "/public/images/logo/googleplay.png";
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Login() {
  const [proofRequestURL, setProofRequestURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false)
  const [os, setOs] = useState('');

  const router = useRouter();

  const handleLogin = async (
    values: { username: string; password: string },
    resetForm: { (nextState?: Partial<FormikState<{ username: string; password: string }>> | undefined): void }
  ) => {
    setIsLoading(true);
    console.log("This is the username & password: ", values.username, values.password);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: values.username,
          password: values.password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setAuthenticated(true);
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1500,
        });
  
        const token = data.jwt;  // ✅ Store token from API response
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 1}; samesite=Lax;`;
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", token);
  
        // ✅ Use the token directly in the next API call
        try {
          const userDetailsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/core/user/${values.username}/userDtls`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // ✅ Use freshly received token
                "Content-Type": "application/json",
              },
            }
          );
  
          const userDetails = await userDetailsResponse.json();
          // console.log("User Details:", userDetails);
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
          const user: User = userDetails.data;
          
          // Extract role codes
          const roleCodes: string[] = user.userRole.map((ur) => ur.roles.code);
          console.log("Role Codes:", roleCodes);
          localStorage.setItem("roles", JSON.stringify(roleCodes));
          localStorage.setItem("userDetails", JSON.stringify(userDetails.data));

        } catch (userDetailsError) {
          console.error("Error fetching user details:", userDetailsError);
        }
  
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error(data.message || "An error occurred during login.", {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(errorMessage, { position: "top-right", autoClose: 2000 });
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

  const natsListener = useCallback(async (threadId : any) => {

    const sendToServer = async (params : {
      username: any; name: any; params : any
}) => {
      try {

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2500,
        });

        document.cookie = `token=${params.username}; path=/; max-age=${60 * 60 * 24 * 1}; secure; samesite=strict;`;
        // console.log("I HERE")
        localStorage.setItem("user", JSON.stringify(params.username));
        localStorage.setItem("roles", JSON.stringify(["THT"]))
        localStorage.setItem("userDetails", JSON.stringify({
          "active": "Y",
          "cidNumber": params.username,
          "created_by": null,
          "created_date": "2025-02-04 08:21:24",
          "email": null,
          "fullName": params.name,
          "id": 999,
          "last_updated_by": null,
          "last_updated_date": "2025-02-04 08:21:24",
          "mobileNumber": null,
          "userName": params.username,
          "userRole": [
            {
              "created_by": null,
              "created_date": "2025-02-04 08:21:24",
              "id": 6,
              "last_updated_by": null,
              "last_updated_date": "2025-02-04 08:21:24",
              "roles": {
                "active": "Y",
                "code": "TNT",
                "created_by": null,
                "created_date": null,
                "id": 2,
                "last_updated_by": null,
                "last_updated_date": null,
                "privileges": [],
                "role_name": "Client"
              },
              "userRoleId": 17
            }
          ]
        }
        ));
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
        authenticator: jwtAuthenticator('', new TextEncoder().encode('SUAPXY7TJFUFE3IX3OEMSLE3JFZJ3FZZRSRSOGSG2ANDIFN77O2MIBHWUM')),
      });

      const sc = StringCodec();
      const sub = conn.subscribe(threadId);

      for await (const m of sub) {
        const data = JSON.parse(sc.decode(m.data));
        if (data?.data?.verification_result === 'ProofValidated') {
          const { "Full Name": fullName, "ID Number": cid } = data.data.requested_presentation.revealed_attrs;
          await sendToServer({
            username: cid[0].value,
            name: fullName[0].value,
            params: undefined
          });
          conn.close();
        } else {
          setErrorMessage('Your authorization request has been denied.');
        }
      }
    } catch (error) {
      console.error("NATS connection error:", error);
    }
  }, [router]);

  const handleLoginWithNdi = useCallback(() => {
    setIsLoading(true);
    setErrorMessage('');

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ndi/authentication`, { headers: { Accept: "*/*" } })
      .then(response => {
        const { proofRequestURL, proofRequestThreadId } = response.data.data;
        setProofRequestURL(proofRequestURL);
        console.log(proofRequestURL)
        natsListener(proofRequestThreadId);
      })
      .catch(() => setErrorMessage('Communication failed with server.'))
      .finally(() => setIsLoading(false));
  }, [natsListener]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOs(detectDeviceType());
      handleLoginWithNdi();
    }
  }, [handleLoginWithNdi]);

  return (
    <div className="flex flex-col items-center justify-center px-8 py-8 mx-auto md:h-screen lg:py-0">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <ToastContainer />
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-13 py-10">
              
              <Formik
                initialValues={{
                  username: '',
                  password: ''
                }}
                validationSchema={Yup.object({
                  username: Yup.string().required("Username is required"),
                  password: Yup.string().required("Paasword is required"),
                })}
                onSubmit={(values, { resetForm }) => handleLogin(values, resetForm)}
              >

                <Form>
                  <div className="w-full">
                    <Input name="username" label={`Username`} placeholder="Enter under name" />
                  </div>
                  <div className="w-full mt-6">
                    <Input type="password" name="password" label={`Password`} placeholder="Enter Password" />
                  </div>
                  <div className="w-full mt-6">
                  <Button disabled={isLoading} className="w-full">
                    {isLoading && 
                    <Loader2 className="animate-spin" />
                    }
                    {
                      isLoading ? "Please wait" : "Login"
                    }
                  </Button>
                  </div>
                </Form>
              </Formik>

              <div className="form-group text-center mt-4">
                <span className="text-[#A1A0A0]">
                  Don&apos;t have an account?{" "} <br></br>
                  <Link href="/signup" className="text-[#5AC994] underline">
                    Sign Up
                  </Link>
                  {" "} With Bhutan NDI Wallet
                </span>
              </div>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-7 xl:p-5">
              <div className="flex flex-col justify-center items-center bg-[#f8f8f8] rounded-lg p-6 space-y-4">
                <div className="form-group text-center">
                  <span className="font-bold text-gray-400">
                    Scan with <span className="text-green-500">Bhutan NDI</span> Wallet
                  </span>
                </div>

                <div className="flex border-2 border-green-500 p-2.5 rounded-2xl">
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
                            <ol className="list-decimal text-gray-400 text-sm font-medium">
                              <li>Open Bhutan NDI Wallet on your phone.</li>
                              <li>Tap the Scan button located on the menu bar <br /> and capture code.</li>
                            </ol>
                          </td>
                          <td>
                            <span className="text-center bg-green-500 h-6 w-6 rounded-full inline-block">
                              <BiQrScan className="text-white p-0.5 pb-1.5" size={25} />
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-center mt-7.5">
                  <a
                    href="https://www.youtube.com/@BhutanNDI"
                    target="_blank"
                    rel="noreferrer"
                    className="btn rounded-full bg-[#5ac994] text-white flex items-center space-x-2 px-4 py-2"
                  >
                    <span>Watch video guide</span>
                    <BiPlayCircle size={24} />
                  </a>

                </div>
                <div className="flex justify-center mt-7.5">
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
                <div className="flex justify-center mt-2.5 mb-4">
                  <a
                    href="https://play.google.com/store/search?q=bhutan%20ndi&amp;c=apps&amp;hl=en_IN&amp;gl=US"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={googleplay}
                      className="w-[99px] h-[30px]"
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
                      className="w-[99px] h-[30px]"
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
    </div>
  );
}
