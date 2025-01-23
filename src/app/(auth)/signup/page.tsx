"use client"
import React from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { BiQrScan, BiPlayCircle } from "react-icons/bi";
const proofRequestURL = "your-proof-request-url";

const SignUp: React.FC = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">

        <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
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

              {/* {os !== "Other" && (
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
                )} */}
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

            <div className="form-group text-center mt-4">
              <span className="text-[#A1A0A0]">
                Already have an account?{" "}
                <Link href="/" className="text-[#5AC994] underline">
                  Sign In
                </Link>
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
