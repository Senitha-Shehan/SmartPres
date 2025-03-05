import React from 'react'

const ExaminerDashboard = () => {
  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Examiner Dashboard</h1>
      <div className="flex flex-col gap-6 w-full max-w-6xl items-center">
        {/* Modules Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Upcoming Presentaion</h2>
            <p>Upcoming Presentaion</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button className="btn btn-primary btn-soft">Upcoming Presentaion</button>
          </div>
        </div>

        {/* Examiner Card */}
        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Evaluate Presentaion</h2>
            <p>Evaluate Presentaion</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button className="btn btn-secondary btn-soft">Evaluate Presentaion</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExaminerDashboard
