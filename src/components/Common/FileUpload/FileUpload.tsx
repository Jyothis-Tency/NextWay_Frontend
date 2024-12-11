import React, { useState } from "react";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // Get the first selected file
    }
  };

  // Handle form submission and file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Attach the file
    formData.append("upload_preset", "Data"); // Example unsigned preset
    formData.append("cloud_name", "ddh8uelhc"); // Example Cloudinary cloud name

    setUploading(true);
    setError(null); // Reset error state

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/ddh8uelhc/upload",
        {
          method: "POST",
          body: formData, // Send the file in the form data
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setUploadedUrl(data.secure_url); // Get the uploaded file URL
        console.log("File uploaded successfully:", data.secure_url);
      } else {
        setError("Error uploading file");
        console.error("Error uploading file:", data);
      }
    } catch (error) {
      setError("Error uploading file");
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploadedUrl && (
        <div>
          <p>Uploaded File:</p>
          <img src={uploadedUrl} alt="Uploaded file" />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
