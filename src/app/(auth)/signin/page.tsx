"use client"
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { BiQrScan, BiPlayCircle } from "react-icons/bi";
import Input from "@/components/Inputs/Input";
import { Formik, Form, FormikState } from "formik";
import * as Yup from "yup";
import { CiUnlock, CiLock } from "react-icons/ci";
import { IoReloadSharp } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { connect, jwtAuthenticator, StringCodec } from 'nats.ws';
import axios from "axios";

const SignIn: React.FC = () => {

  const [os, setOS] = useState("Android");
  const [isLoading, setIsLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter();
  const [proofRequestURL, setProofRequestURL] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deepLinkUrl, setDeepLinkUrl] = useState('');

  const handleLogin = async (
    values: { username: string; password: string },
    resetForm: { (nextState?: Partial<FormikState<{ username: string; password: string }>> | undefined): void }
  ) => {
    setIsLoading(true);

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
          autoClose: 2500,
        });

        document.cookie = `token=${data.jwt}; path=/; max-age=${60 * 60 * 24 * 1}; secure; samesite=strict;`;
        localStorage.setItem("user", JSON.stringify(data.user));

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
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }

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

  const natsListener = useCallback(async (threadId : string, token : string) => {
  
    const sendToServer = async (params : any) => {

    };

    try {

      const conn = await connect({
        servers: ["https://natsdemoclient.bhutanndi.com"],
        authenticator: jwtAuthenticator(token, new TextEncoder().encode('SUAPXY7TJFUFE3IX3OEMSLE3JFZJ3FZZRSRSOGSG2ANDIFN77O2MIBHWUM'))
      });
      const sc = StringCodec();
      const s1 = conn.subscribe(threadId);
      console.log(s1.getSubject(), "Subscription subject");

      for await (const m of s1) {
        const data = JSON.parse(sc.decode(m.data));
        console.log("INSIDE FOR")
        if (data?.data?.verification_result === 'ProofValidated') {
          const { "EID": empID, "ID Number": cid } = data.data.requested_presentation.revealed_attrs;
          await sendToServer({ username: cid[0].value });
          // conn.close();
          setTimeout(() => {
            console.error("Timeout: No messages received");
            conn.close();
          }, 10000);

        } else {
          setErrorMessage('Your authorization request has been denied.')
        }
      }

    } catch (error) {
      console.error(error);
    }
  }, []);


  const handleLoginWithNdi = useCallback(() => {
    setIsLoading(true);
    setErrorMessage('');
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "*/*"
    };

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ndi/authentication`, { headers })
      .then((response : any) => {
        const { proofRequestURL, proofRequestThreadId, deepLinkURL } = response.data.data;
        const { access_token } = response.data;
        setProofRequestURL(proofRequestURL);
        setDeepLinkUrl(deepLinkURL);
        // console.log(deepLinkURL, "DEEPLINK")
        natsListener(proofRequestThreadId, access_token);
      })
      .catch((error : any) => {
        setErrorMessage('Communication failed with server.')
      })
      .finally(() => setIsLoading(false));
  }, [natsListener]);


  useEffect(()=>{

    handleLoginWithNdi()

    const token = Cookies.get("token");

    if (token) {
      router.push("/dashboard");
    }
    
  },[handleLoginWithNdi, os])

  return (
    <div className="flex flex-col items-center justify-center px-8 py-8 mx-auto md:h-screen lg:py-0">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <ToastContainer />
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5">
              
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
                    <button type="submit" disabled={isLoading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                      {isLoading ? <IoReloadSharp size={18} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white mr-2" />
                        : (authenticated ? <CiUnlock size={18} className="-ml-1 mr-3 h-5 w-5 text-white mr-2" />
                          : <CiLock size={18} className="-ml-1 mr-3 h-5 w-5 text-white mr-2" />)}
                      Login
                    </button>

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
            <div className="w-full p-4 sm:p-7 xl:p-10">
              <div className="flex flex-col justify-center items-center bg-[#f8f8f8] rounded-lg p-6 space-y-4">

                <div className="form-group text-center">
                  <span className="font-bold text-gray-400">
                    Scan with <span className="text-green-500">Bhutan NDI</span> Wallet
                  </span>
                </div>

                <div className="flex border-2 border-green-500 p-2.5 rounded-2xl">
                  <QRCodeCanvas
                    value={proofRequestURL}
                    size={200}
                    imageSettings={{
                      src: "/images/logo/NDIlogobg.png",
                      excavate: true,
                      height: 50,
                      width: 50,
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

                {os !== "Other" && (
                  <>
                    
                    <div className="form-group text-center mt-7.5">
                      <span className="text-[#A1A0A0]">
                        Open <span className="text-[#5AC994]">Bhutan NDI</span> Wallet{" "}
                        <a href={proofRequestURL} className="text-[#5AC994] underline">
                          here
                        </a>
                      </span>
                    </div>
                  </>
                )}
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
                    <img
                      src="/images/logo/googleplay.png"
                      className="w-[99px] h-[30px]"
                      alt="Google Play Store"
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/in/app/bhutan-ndi/id1645493166"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3"
                  >
                    <img
                      src="/images/logo/appstore.png"
                      className="w-[99px] h-[30px]"
                      alt="Apple App Store"
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
};

export default SignIn;
