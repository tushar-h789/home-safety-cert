// pages/404.js
import Head from 'next/head';
import DotLottiePlayer from './_components/dotLottie-player'; // Adjust the path if needed

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-100">
      <Head>
        <title>Page Not Found</title>
        <meta name="description" content="404 - Page Not Found" />
      </Head>
      
      <h1 className="text-5xl font-bold text-gray-800">Oops!</h1>
      <p className="text-xl text-gray-600 mt-4">We can’t seem to find the page you’re looking for.</p>
      
      {/* DotLottie Animation */}
      <div className="my-8 flex justify-center">
        <DotLottiePlayer />
      </div>

      {/* Navigation Links */}
      <div className="mt-8">
        <a href="/" className="text-lg text-blue-500 hover:underline">Go to Home Page</a>
        <br />
        <a href="/contact" className="text-lg text-blue-500 hover:underline">Contact Us</a>
      </div>

    </div>
  );
}
