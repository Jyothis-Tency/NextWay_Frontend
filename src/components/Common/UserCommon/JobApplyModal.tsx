import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  jobId: string;
  onSubmit: (formData: FormData) => void;
}

const ApplicationForm: React.FC<Props> = ({ jobId, onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  // const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!resume) return; // Commented out resume check

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("location", location);
    formData.append("phone", phone);
    // formData.append("resume", resume); // Commented out resume
    formData.append("coverLetter", coverLetter);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="firstName" className="text-right">
          First Name
        </label>
        <Input
          id="firstName"
          type="text"
          className="col-span-3"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="lastName" className="text-right">
          Last Name
        </label>
        <Input
          id="lastName"
          type="text"
          className="col-span-3"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="email" className="text-right">
          Email
        </label>
        <Input
          id="email"
          type="email"
          className="col-span-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="location" className="text-right">
          Location
        </label>
        <Input
          id="location"
          type="text"
          className="col-span-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="phone" className="text-right">
          Phone
        </label>
        <Input
          id="phone"
          type="tel"
          className="col-span-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      {/* Resume input field
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="resume" className="text-right">
          Resume
        </label>
        <Input
          id="resume"
          type="file"
          className="col-span-3"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
          required
        />
      </div>
      */}
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="coverLetter" className="text-right">
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          className="col-span-3 h-32 p-2 border rounded"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Write your cover letter here..."
        />
      </div>
      <button type="submit" className="btn-primary mt-4">
        Submit
      </button>
    </form>
  );
};

export default ApplicationForm;
