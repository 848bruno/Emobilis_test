import React, { useContext, useEffect, useState } from "react";
import { FilterProvider, FilterContext } from "./context/FilterContext";
import JobCard from "./components/JobCard";
import FilterBar from "./components/FilterBar";
import jobsData from "./data/jobs.json";
import type { Job } from "./Types";
import Footer from "./components/Footer";
import Header from "./components/Header";

// localStorage key used for persistent browser storage of job items
const STORAGE_KEY = "job-board-data";

// helper function to generate a default/empty job object for the form state.
   //omits the 'id' field since IDs are generated upon final submission.

const createEmptyJob = (): Omit<Job, "id"> => ({
  company: "",
  logo: "images/photosnap.svg",
  new: false,
  featured: false,
  position: "",
  postedAt: "Just now",
  contract: "Full Time",
  location: "",
  role: "Frontend",
  level: "Junior",
  languages: [],
});


 //retrieves the initial list of jobs.
 // attempts to load saved data from LocalStorage; falls back to the static JSON file if LocalStorage is empty or contains malformed JSON data.

const getInitialJobs = (): Job[] => {
  const savedJobs = localStorage.getItem(STORAGE_KEY);

  if (savedJobs) {
    try {
      return JSON.parse(savedJobs) as Job[];
    } catch {
       // fallback if parsing saved data fails
      return jobsData as Job[];
    }
  }
      // default fallback if no data exists in localStorage
  return jobsData as Job[];
};

// component responsible for rendering the filtered list of job cards.

// subscribes to FilterContext to match jobs against active user filters.

const JobList: React.FC<{
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}> = ({ jobs, onEdit, onDelete }) => {

  // extract active filter tags from global Context
  const { filters } = useContext(FilterContext);

  //determines if a job matches all currently selected filters and  Consolidates role, level, and languages into a single tags array.

  const filterJob = (job: Job) => {
    const tags = [job.role, job.level, ...job.languages];

    // ensures every active filter tag is present in the job's tags
    return filters.every((filter) => tags.includes(filter));
  };

  return (
    <div className="mt-6 space-y-4">

      {/* filters the jobs array first, then maps each remaining job to a JobCard component */}

      {jobs.filter(filterJob).map((job) => (
        <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

// main application component and manages core state including the job list, modal visibility, form data, and localStorage sync.

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(getInitialJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Job, "id">>(createEmptyJob());

  // Automatically synchronize local storage whenever the jobs list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  // resets form state and opens the modal to add a new job.

  const openAddModal = () => {
    setEditingId(null);
    setFormData(createEmptyJob());
    setIsModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingId(job.id);
    setFormData({
      company: job.company,
      logo: job.logo,
      new: job.new,
      featured: job.featured,
      position: job.position,
      postedAt: job.postedAt,
      contract: job.contract,
      location: job.location,
      role: job.role,
      level: job.level,
      languages: [...job.languages],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(createEmptyJob());
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    const fieldValue =
      type === "checkbox" ? (event.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleLanguagesChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const company = formData.company.trim();
    const position = formData.position.trim();
    const location = formData.location.trim();

    if (!company || !position || !location) {
      return;
    }

    const cleanedJob: Omit<Job, "id"> = {
      ...formData,
      company,
      position,
      location,
      logo: formData.logo || "images/photosnap.svg",
      languages: formData.languages.length
        ? formData.languages
        : ["JavaScript"],
    };

    if (editingId !== null) {
      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === editingId ? { ...job, ...cleanedJob, id: editingId } : job,
        ),
      );
    } else {
      setJobs((currentJobs) => [
        {
          ...cleanedJob,
          id: Date.now(),
        },
        ...currentJobs,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    setJobs((currentJobs) => currentJobs.filter((job) => job.id !== id));
  };

  return (
    <FilterProvider>
      <Header />

      <div className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                Jobs
              </p>
              <h1 className="text-2xl font-bold text-gray-900">Job board</h1>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-700"
            >
              + Add Job
            </button>
          </div>

          <FilterBar />
          <JobList jobs={jobs} onEdit={openEditModal} onDelete={handleDelete} />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId !== null ? "Edit Job" : "Add New Job"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Company
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
                    placeholder="Example Inc"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Position
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
                    placeholder="Frontend Developer"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Location
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
                    placeholder="Remote"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Contract
                  <select
                    name="contract"
                    value={formData.contract}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Role
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Level
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Midweight">Midweight</option>
                    <option value="Senior">Senior</option>
                  </select>
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Languages
                <input
                  type="text"
                  value={formData.languages.join(", ")}
                  onChange={(event) =>
                    handleLanguagesChange(event.target.value)
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
                  placeholder="React, TypeScript, Node"
                />
              </label>

              <div className="flex items-center gap-6 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="new"
                    checked={formData.new}
                    onChange={handleChange}
                  />
                  New
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  Featured
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  {editingId !== null ? "Save Changes" : "Add Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-gray-500 text-sm mt-10">
        <Footer />
      </div>
    </FilterProvider>
  );
};

export default App;
