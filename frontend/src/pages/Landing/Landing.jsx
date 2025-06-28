import '../../App.css'

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to Interview Kit</h1>
      <p className="text-gray-700 text-lg max-w-2xl mb-8">
        A one-stop platform for candidates and recruiters to manage courses and assessments seamlessly.
        Join us to level up your hiring and preparation process!
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Login
        </a>
        <a
          href="/register"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default Landing;
