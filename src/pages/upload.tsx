import { useState } from "react";
import { api } from "../api/api";

export default function Upload() {

  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Uploaded successfully");
  };

  return (
    <div className="container">
      <h2>Upload Image</h2>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button onClick={upload}>Upload</button>
    </div>
  );
}