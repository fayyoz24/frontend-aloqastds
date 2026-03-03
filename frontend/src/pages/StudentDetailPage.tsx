import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

interface StudentDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [student, setStudent] = useState<StudentDetail | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    API.get(`/${id}/detail/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setStudent(res.data))
      .catch(() => navigate("/"));
  }, []);

  if (!student) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>
        {student.first_name} {student.last_name}
      </h2>
      <p>Email: {student.email}</p>
      <p>Phone: {student.phone_number}</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Chiqish
      </button>
    </div>
  );
}