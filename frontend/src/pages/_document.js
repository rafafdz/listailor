import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, minimum-scale=1.0" />
        <title>✨🛒 ListAIlor | Descarboniza tus compras</title>
      </Head>
      <body className="bg-white lg:bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="lg:w-[375px] lg:h-[812px] lg:bg-white lg:rounded-[20px] lg:shadow-xl lg:overflow-hidden lg:relative">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  );
}
