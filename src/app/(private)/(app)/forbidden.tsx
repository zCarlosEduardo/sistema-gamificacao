export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">403</h1>

        <p className="mt-2 text-gray-500">
          Você não possui permissão
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 rounded bg-black px-4 py-2 text-white"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}