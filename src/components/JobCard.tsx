import React from "react";

import { FilterContext } from "../context/FilterContext";
import type { Job } from "../Types";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}
 
// Displays individual job listing details, selectable metadata tags,

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const { addFilter } = React.useContext(FilterContext);
  const tags = [job.role, job.level, ...job.languages];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={job.logo}
            alt={job.company}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-900">{job.company}</span>
              {job.new && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                  New
                </span>
              )}
              {job.featured && (
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Featured
                </span>
              )}
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-800">
              {job.position}
            </h3>
            <p className="text-sm text-gray-500">
              {job.postedAt} • {job.contract} • {job.location}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addFilter(tag)}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-800 hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(job)}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(job.id)}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
