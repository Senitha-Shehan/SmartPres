import React from 'react'

const StudentDashboard = () => {
  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="flex flex-col gap-6 w-full max-w-6xl items-center">


        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Upcmoing Presentation</h2>
            <p>Upcmoing Presentation</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button className="btn btn-primary w-full btn-soft">Upcmoing Presentation</button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Group Registration</h2>
            <p>Group Registration</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button className="btn btn-secondary w-full btn-soft">Group Registration</button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl w-full max-w-md h-64 flex flex-col justify-between">
          <div className="card-body">
            <h2 className="card-title">Evalution Results</h2>
            <p>Evalution Results</p>
          </div>
          <div className="card-actions justify-end p-4">
            <button className="btn btn-primary w-full btn-soft">Evalution Results</button>
          </div>
        </div>




      </div>
    </div>
  )
}

export default StudentDashboard
