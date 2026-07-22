const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold">
            Total Users
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-4">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold">
            Total Tasks
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-4">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold">
            Completed Tasks
          </h2>

          <p className="text-4xl font-bold text-purple-600 mt-4">
            0
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;