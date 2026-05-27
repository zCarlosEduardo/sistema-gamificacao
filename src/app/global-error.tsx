"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              Erro crítico
            </h1>

            <p className="mt-2 text-gray-500">
              Algo deu muito errado
            </p>

            <button
              onClick={() => reset()}
              className="mt-4 rounded bg-black px-4 py-2 text-white"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}