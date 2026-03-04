import { useState } from "react";
import { useStudents } from "../hooks/useData";
import LoginModal from "../components/LoginModal";
import type { Student } from "../types";
import { useAuth } from "../context/AuthContext";

export default function StudentListPage() {
  const { data: students, loading, error } = useStudents();
  const { isLoggedIn, studentId } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleCardClick = (student: Student) => {
    if (isLoggedIn && studentId === student.id) {
      window.location.href = `/students/${student.id}`;
    } else {
      setSelectedStudent(student);
    }
  };

  if (loading) return <div className="status-msg">Yuklanmoqda...</div>;
  if (error) return <div className="status-msg error">Xato: {error}</div>;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Talabalar</h1>
        <span className="count">{students?.length ?? 0} ta</span>
      </header>

      <div className="student-grid">
        {students?.map((s) => (
          <div
            key={s.id}
            className={`student-card ${isLoggedIn && studentId === s.id ? "active" : ""}`}
            onClick={() => handleCardClick(s)}
          >
            <div className="avatar">{s.first_name[0]}{s.last_name[0]}</div>
            <div className="info">
              <h3>{s.last_name} {s.first_name} {s.middle_name}</h3>
              <p>{s.email}</p>
              <p>{s.phone_number}</p>
            </div>
            <div className="arrow">→</div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <LoginModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
