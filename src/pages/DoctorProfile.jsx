import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { API_BASE_URL } from "../config/api"
import { getAuthHeader } from "../utils/auth"

const DoctorProfile = () => {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/doctors/${id}`)
      .then((res) => {
        setDoctor(res.data)
      })
      .catch((err) => {
        console.error("Could not load doctor profile", err)
        setError("Could not load doctor profile.")
      })
  }, [id])

  const bookAppointment = async () => {
    try {
      const appointmentData = {
        doctor: id,
        doctorName: doctor.name,
        speciality: doctor.speciality || doctor.specialization,
        hospital: doctor.hospital,
        city: doctor.city,
        fee: doctor.fee ?? doctor.fees ?? 0,
        date: new Date().toISOString().split("T")[0],
        time: doctor.slots?.[0] || "10:00 AM",
      }

      await axios.post(
        `${API_BASE_URL}/appointments`,
        appointmentData,
        { headers: getAuthHeader() }
      )

      alert("Appointment booked successfully")
    } catch (err) {
      console.error("Could not book appointment", err)
      alert(err.response?.data?.message || "Error booking appointment")
    }
  }

  if (error) return <h2>{error}</h2>
  if (!doctor) return <h2>Loading...</h2>

  const speciality = doctor.speciality || doctor.specialization
  const fee = doctor.fee ?? doctor.fees ?? 0
  const availability = doctor.slots || doctor.availableDays || []

  return (
    <div className="container mt-4">
      <h2>{doctor.name}</h2>

      <p><strong>Specialization:</strong> {speciality}</p>
      <p><strong>Experience:</strong> {doctor.experience} years</p>
      <p><strong>Fees:</strong> Rs. {fee}</p>
      <p><strong>Available Slots:</strong> {availability.join(", ") || "Contact clinic"}</p>

      <button
        className="btn btn-primary"
        onClick={bookAppointment}
      >
        Book Appointment
      </button>
    </div>
  )
}

export default DoctorProfile
