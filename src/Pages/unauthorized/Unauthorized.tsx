
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <div className="max-w-md bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700">
          You do not have permission to access this dashboard. Please contact your administrator if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
