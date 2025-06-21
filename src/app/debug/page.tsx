import { auth } from "@/auth";

export default async function DebugPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Session Data:</h2>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
