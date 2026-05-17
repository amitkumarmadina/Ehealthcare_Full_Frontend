import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorCard from "../components/DoctorCard";
import { API_BASE_URL } from "../config/api";

const Doctors = () => {

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/doctors`)
      .then((res) => {
        setDoctors(res.data.doctors || res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Our Doctors</h2>

      <div className="row">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>

    </div>
  );
};

export default Doctors;
