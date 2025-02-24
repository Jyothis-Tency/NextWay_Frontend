import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "./Header";

interface IJobPost {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  employmentType:
    | "Full-Time"
    | "Part-Time"
    | "Contract"
    | "Internship"
    | "Freelance";
  experienceLevel: "Entry" | "Mid" | "Senior" | "Director";
  educationRequired?: string;
  jobFunction?: string;
  keywords: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  location: string;
  remote: boolean;
  benefits: string[];
  applicationDeadline?: Date;
  jobStatus: "open" | "closed" | "draft";
  postedBy: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  applications: number;
}

const jobListings: IJobPost[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description: "We are seeking an experienced Frontend Developer...",
    skillsRequired: ["React", "TypeScript", "CSS"],
    employmentType: "Full-Time",
    experienceLevel: "Senior",
    salaryRange: { min: 80000, max: 120000 },
    location: "Remote",
    remote: true,
    benefits: ["Health Insurance", "401k"],
    jobStatus: "open",
    postedBy: "John Doe",
    company: "TechCorp",
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-07-01"),
    active: true,
    applications: 45,
    keywords: ["frontend", "react", "typescript"],
  },
  {
    id: "2",
    title: "Senior Frontend Developer",
    description: "We are seeking an experienced Frontend Developer...",
    skillsRequired: ["React", "TypeScript", "CSS"],
    employmentType: "Full-Time",
    experienceLevel: "Senior",
    salaryRange: { min: 80000, max: 120000 },
    location: "Remote",
    remote: true,
    benefits: ["Health Insurance", "401k"],
    jobStatus: "open",
    postedBy: "John Doe",
    company: "TechCorp",
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-07-01"),
    active: true,
    applications: 45,
    keywords: ["frontend", "react", "typescript"],
  },
  {
    id: "3",
    title: "Senior Frontend Developer",
    description: "We are seeking an experienced Frontend Developer...",
    skillsRequired: ["React", "TypeScript", "CSS"],
    employmentType: "Full-Time",
    experienceLevel: "Senior",
    salaryRange: { min: 80000, max: 120000 },
    location: "Remote",
    remote: true,
    benefits: ["Health Insurance", "401k"],
    jobStatus: "open",
    postedBy: "John Doe",
    company: "TechCorp",
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-07-01"),
    active: true,
    applications: 45,
    keywords: ["frontend", "react", "typescript"],
  },
  {
    id: "4",
    title: "Senior Frontend Developer",
    description: "We are seeking an experienced Frontend Developer...",
    skillsRequired: ["React", "TypeScript", "CSS"],
    employmentType: "Full-Time",
    experienceLevel: "Senior",
    salaryRange: { min: 80000, max: 120000 },
    location: "Remote",
    remote: true,
    benefits: ["Health Insurance", "401k"],
    jobStatus: "open",
    postedBy: "John Doe",
    company: "TechCorp",
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-07-01"),
    active: true,
    applications: 45,
    keywords: ["frontend", "react", "typescript"],
  },
  // Add more job listings as needed
];

export default function JobSection() {
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobListings);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = jobListings.filter(
      (job) =>
        job.title.toLowerCase().includes(term.toLowerCase()) ||
        job.company.toLowerCase().includes(term.toLowerCase()) ||
        job.keywords.some((keyword) =>
          keyword.toLowerCase().includes(term.toLowerCase())
        )
    );
    setFilteredJobs(filtered);
  };

  const handleStatusChange = (
    jobId: string,
    newStatus: "open" | "closed" | "draft"
  ) => {
    // In a real application, you would update the job status in your backend here
    console.log(`Changing job ${jobId} status to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <div className="space-y-6 p-6 ml-64">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Job Listings</h1>
            <Dialog
              open={isNewJobDialogOpen}
              onOpenChange={setIsNewJobDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0f1117] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Job Listing</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new job posting.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input
                        id="job-title"
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="e.g. TechCorp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employment-type">Employment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-Time">Full-Time</SelectItem>
                          <SelectItem value="Part-Time">Part-Time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience-level">Experience Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entry">Entry</SelectItem>
                          <SelectItem value="Mid">Mid</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Director">Director</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="e.g. New York, NY" />
                    </div>
                    <div className="space-y-2 flex items-center">
                      <Checkbox id="remote" />
                      <Label htmlFor="remote" className="ml-2">
                        Remote
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary-min">Minimum Salary</Label>
                      <Input
                        id="salary-min"
                        type="number"
                        placeholder="e.g. 50000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary-max">Maximum Salary</Label>
                      <Input
                        id="salary-max"
                        type="number"
                        placeholder="e.g. 100000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter job description..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">
                      Required Skills (comma-separated)
                    </Label>
                    <Input
                      id="skills"
                      placeholder="e.g. React, TypeScript, CSS"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                    <Input
                      id="benefits"
                      placeholder="e.g. Health Insurance, 401k"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      placeholder="e.g. frontend, react, typescript"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="application-deadline">
                      Application Deadline
                    </Label>
                    <Input id="application-deadline" type="date" />
                  </div>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white w-full"
                  >
                    Create Job Listing
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-end mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-[#1f2937] text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="rounded-md border border-red-500 overflow-hidden">
            <div className="overflow-auto h-[calc(100vh-200px)]">
              <Table>
                <TableHeader className="bg-gradient-to-r from-red-900 to-red-700 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-white font-bold py-3 px-4">
                      Job Title
                    </TableHead>
                    <TableHead className="text-white font-bold py-3 px-4">
                      Company
                    </TableHead>
                    <TableHead className="text-white font-bold py-3 px-4">
                      Location
                    </TableHead>
                    <TableHead className="text-white font-bold py-3 px-4">
                      Posted Date
                    </TableHead>
                    <TableHead className="text-white font-bold py-3 px-4">
                      Applicants
                    </TableHead>
                    <TableHead className="text-white font-bold py-3 px-4">
                      Status
                    </TableHead>
                    <TableHead className="text-white font-bold py-3 px-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow
                      key={job.id}
                      className="border-b border-red-500/20"
                    >
                      <TableCell className="font-medium text-white py-4 px-4">
                        {job.title}
                      </TableCell>
                      <TableCell className="text-gray-400 py-4 px-4">
                        {job.company}
                      </TableCell>
                      <TableCell className="text-gray-400 py-4 px-4">
                        {job.location}
                      </TableCell>
                      <TableCell className="text-gray-400 py-4 px-4">
                        {job.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-400 py-4 px-4">
                        {job.applications}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <Select
                          onValueChange={(value) =>
                            handleStatusChange(
                              job.id,
                              value as "open" | "closed" | "draft"
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder={job.jobStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="space-x-2 py-4 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-500/20"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
