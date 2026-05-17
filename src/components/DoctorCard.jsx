import React from "react"
import { Link } from "react-router-dom"

const DoctorCard = ({ doctor }) => {
  const name = doctor.name || "Doctor"
  const speciality = doctor.speciality || doctor.specialization || "Specialist"
  const fee = doctor.fee ?? doctor.fees ?? 0

  return (
    <div className="col-md-4 mb-4">
      <div className="card p-3 text-center">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={name}
            className="card-img-top"
          />
        ) : (
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold"
            style={{ width: 96, height: 96, fontSize: 32 }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <h5 className="mt-3">{name}</h5>
        <p>{speciality}</p>
        <p>Experience: {doctor.experience} years</p>
        <p>Fees: Rs. {fee}</p>

        <Link to={`/doctor/${doctor._id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
    </div>
  )
}

export default DoctorCard
