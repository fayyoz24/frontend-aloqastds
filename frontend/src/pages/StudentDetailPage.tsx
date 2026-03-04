import { useParams, useNavigate } from "react-router-dom";
import { useStudentDetail, useDocuments } from "../hooks/useData";
import { useAuth } from "../context/AuthContext";
import { downloadDocument } from "../api/students";
import { useState } from "react";

export default function StudentDetailPage() {
  const { pk } = useParams<{ pk: string }>();
  const id = Number(pk);
  const navigate = useNavigate();
  const { logout, isLoggedIn, studentId } = useAuth();

  const { data: student, loading, error } = useStudentDetail(id);
  const { data: docs } = useDocuments(id);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  if (!isLoggedIn || studentId !== id) {
    return (
      <div className="page">
        <div className="status-msg error">
          Bu sahifaga kirish uchun avval login qiling.
          <button onClick={() => navigate("/")} className="btn-link">← Orqaga</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="status-msg">Yuklanmoqda...</div>;
  if (error) return <div className="status-msg error">Xato: {error}</div>;
  if (!student) return null;

  const handleDownload = async (docId: number, fileName: string) => {
    setDownloadingId(docId);
    try {
      await downloadDocument(id, docId, fileName);
    } catch (e) {
      alert("Yuklashda xato yuz berdi");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCertDownload = async (url: string, langName: string) => {
    try {
      const token = localStorage.getItem("access_token");

      const fullUrl = url.startsWith("http")
        ? url
        : `https://aloqabankstudents.pythonanywhere.com${url}`;

      const res = await fetch(fullUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const ext = fullUrl.split(".").pop()?.split("?")[0] || "pdf";

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${langName}_sertifikat.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert("Sertifikatni yuklashda xato");
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={() => navigate("/")} className="btn-back">← Orqaga</button>
        <button onClick={logout} className="btn-logout">Chiqish</button>
      </header>

      {/* Profile */}
      <section className="profile-section">
        {student.prof_pic ? (
        <img
          src={`https://aloqabankstudents.pythonanywhere.com${student.prof_pic}`}
          alt={`${student.first_name} ${student.last_name}`}
          className="avatar large img"
        />
      ) : (
        <div className="avatar large">{student.first_name[0]}{student.last_name[0]}</div>
      )}
        <div>
          <h1>{student.last_name} {student.first_name} {student.middle_name}</h1>
          <p>{student.email} · {student.phone_number}</p>
          <div className="links">
            {student.github_link && <a href={student.github_link} target="_blank" rel="noreferrer">GitHub</a>}
            {student.linkedin_link && <a href={student.linkedin_link} target="_blank" rel="noreferrer">LinkedIn</a>}
          </div>
        </div>
      </section>

      {/* Projects */}
      {student.projects && (
        <section className="detail-section">
          <h2>Loyihalar</h2>
          <p className="projects-text">{student.projects}</p>
        </section>
      )}

      {/* Languages */}
      {student.languages?.length > 0 && (
        <section className="detail-section">
          <h2>Tillar</h2>
          <div className="lang-grid">
            {student.languages.map((lang) => (
              <div key={lang.id} className="lang-card">
                <strong>{lang.name}</strong>
                <span className="badge">{lang.level}</span>
                {lang.certificate && (
                  <button
                    className="btn-cert"
                    onClick={() => handleCertDownload(lang.certificate!, lang.name)}
                  >
                    ⬇ Sertifikat
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Documents */}
      <section className="detail-section">
        <h2>Hujjatlar</h2>
        {docs && docs.length > 0 ? (
          <ul className="doc-list">
            {docs.map((doc) => (
              <li key={doc.id} className="doc-item">
                <div>
                  <span className="doc-name" style={{marginRight: 8, fontWeight: 500}}>{doc.file_name}</span>
                  <span className="doc-type">{doc.doc_type}</span>
                </div>
                <button
                  className="btn-download"
                  disabled={downloadingId === doc.id}
                  onClick={() => handleDownload(doc.id, doc.file_name)}
                >
                  {downloadingId === doc.id ? "⏳" : "⬇ Yuklab olish"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Hujjat mavjud emas</p>
        )}
      </section>
    </div>
  );
}
